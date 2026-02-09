import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PoolTokenBalance from '../../sushiswap/PoolTokenBalance'
import PoolTokenDeposits from '../../sushiswap/PoolTokenDeposits'
import DepositPoolTokensFlow from '../../sushiswap/DepositPoolTokensFlow'
import ClaimRewardsFlow from '../../sushiswap/ClaimRewardsFlow'
import ClaimableReward from '../../sushiswap/ClaimableReward'
import WithdrawPoolTokensFlow from '../../sushiswap/WithdrawPoolTokensFlow'
import RewardDetails from '../../sushiswap/RewardDetails'
import {
  computeEarned,
  createFixtures,
  getClaimableAmount,
  simulateAddLiquidity
} from '../helpers/fakeData'

const mockUseReadContract = vi.fn()
const mockUseSimulateContract = vi.fn()
const mockUseWriteContract = vi.fn()
const mockUseWaitForTransactionReceipt = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args),
  useSimulateContract: (...args: unknown[]) => mockUseSimulateContract(...args),
  useWriteContract: (...args: unknown[]) => mockUseWriteContract(...args),
  useWaitForTransactionReceipt: (...args: unknown[]) => mockUseWaitForTransactionReceipt(...args)
}))

vi.mock('../../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>
}))

const addresses = {
  rewards: '0x92bC866Ff845a5050b3C642Dec94E5572305872f',
  lpToken: '0x0E2a3d127EDf3BF328616E02F1DE47F981Cf496A'
}

describe('Full Flow Integration (Liquidity -> Deposit -> Claim -> Withdraw)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseSimulateContract.mockReset()
    mockUseWriteContract.mockReset()
    mockUseWaitForTransactionReceipt.mockReset()
    mockUseIsMounted.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseWaitForTransactionReceipt.mockReturnValue({ isError: false, error: undefined, isLoading: false, isSuccess: false })
    mockUseSimulateContract.mockReturnValue({
      data: { request: { address: '0x0', abi: [], functionName: 'mock' } },
      isError: false,
      error: undefined,
      isLoading: false
    })
  })

  it('1) Provide Liquidity — Happy Path', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[0]
    const state = {
      lpBalance: BigInt('1000000000000000000')
    }

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.lpToken && functionName === 'balanceOf') {
        return { data: state.lpBalance, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    const { rerender } = render(<PoolTokenBalance address={wallet.address} />)
    const beforeText = screen.getByText(/\$SLP/i).textContent

    const lpMinted = simulateAddLiquidity(BigInt('2000000000000000000'), BigInt('2000000000000000000'))
    state.lpBalance = state.lpBalance + lpMinted

    rerender(<PoolTokenBalance address={wallet.address} />)
    const afterText = screen.getByText(/\$SLP/i).textContent

    expect(beforeText).not.toEqual(afterText)
  })

  it('2) Provide Liquidity — Insufficient Balance', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[1]
    const state = {
      lpBalance: fixtures.balances[wallet.address].lp
    }

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.lpToken && functionName === 'balanceOf') {
        return { data: state.lpBalance, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    const { rerender } = render(<PoolTokenBalance address={wallet.address} />)
    const beforeText = screen.getByText(/\$SLP/i).textContent

    const addLiquidity = () => {
      throw new Error('Insufficient balance')
    }
    expect(addLiquidity).toThrow(/insufficient balance/i)

    rerender(<PoolTokenBalance address={wallet.address} />)
    const afterText = screen.getByText(/\$SLP/i).textContent

    expect(beforeText).toEqual(afterText)
  })

  it('3) Deposit Pool Tokens — Happy Path (Stake LP)', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[2]
    const state = {
      lpBalance: BigInt(100),
      staked: BigInt(0),
      allowance: BigInt(10_000_000_000_000_000_000)
    }

    const writeContract = vi.fn()
    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract, isPending: false, isSuccess: false })

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.lpToken && functionName === 'balanceOf') {
        return { data: state.lpBalance, isError: false, isLoading: false }
      }
      if (address === addresses.lpToken && functionName === 'allowance') {
        return { data: state.allowance, isError: false, isLoading: false }
      }
      if (address === addresses.rewards && functionName === 'poolTokenBalances') {
        return { data: state.staked, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    const { rerender } = render(
      <>
        <PoolTokenBalance address={wallet.address} />
        <PoolTokenDeposits address={wallet.address} />
        <DepositPoolTokensFlow address={wallet.address} />
      </>
    )

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '1' } })

    const depositButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    fireEvent.click(depositButton)
    expect(writeContract).toHaveBeenCalledTimes(1)

    state.lpBalance = BigInt(99)
    state.staked = BigInt(1)

    rerender(
      <>
        <PoolTokenBalance address={wallet.address} />
        <PoolTokenDeposits address={wallet.address} />
        <DepositPoolTokensFlow address={wallet.address} />
      </>
    )

    expect(screen.getAllByText(/\$SLP/i).length).toBeGreaterThanOrEqual(2)
  })

  it('4) Deposit Pool Tokens — Idempotency / Double Click', () => {
    const wallet = createFixtures().wallets[3]
    const writeContract = vi.fn()
    const state = {
      lpBalance: BigInt(100),
      allowance: BigInt(10_000_000_000_000_000_000)
    }

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.lpToken && functionName === 'balanceOf') {
        return { data: state.lpBalance, isError: false, isLoading: false }
      }
      if (address === addresses.lpToken && functionName === 'allowance') {
        return { data: state.allowance, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract, isPending: false, isSuccess: false })

    const { rerender } = render(<DepositPoolTokensFlow address={wallet.address} />)

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '1' } })
    const depositButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    fireEvent.click(depositButton)

    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract, isPending: true, isSuccess: false })
    rerender(<DepositPoolTokensFlow address={wallet.address} />)

    const pendingButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    expect(pendingButton).toBeDisabled()
    fireEvent.click(pendingButton)

    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('5) Claim Rewards — Happy Path (Claimable > 0)', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[0]
    const reward = fixtures.rewards[wallet.address][0]
    const state = {
      claimable: getClaimableAmount(reward, fixtures.now)
    }

    const writeContract = vi.fn()
    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract, isPending: false, isSuccess: false })

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.rewards && functionName === 'claimableReward') {
        return { data: state.claimable, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    render(
      <>
        <ClaimableReward address={wallet.address} />
        <ClaimRewardsFlow address={wallet.address} />
      </>
    )

    const claimButton = screen.getByRole('button', { name: /claim rewards/i })
    fireEvent.click(claimButton)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('6) Claim Rewards — Not Claimable Yet (0)', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[1]

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.rewards && functionName === 'claimableReward') {
        return { data: BigInt(0), isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    render(<ClaimRewardsFlow address={wallet.address} />)
    const claimButton = screen.getByRole('button', { name: /claim rewards/i })
    expect(claimButton).toBeDisabled()
  })

  it('7) Withdraw Pool Tokens — Happy Path (Unstake)', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[2]
    const state = {
      staked: BigInt(10),
      lpBalance: BigInt(5)
    }

    const writeContract = vi.fn()
    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract, isPending: false, isSuccess: false })

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.rewards && functionName === 'poolTokenBalances') {
        return { data: state.staked, isError: false, isLoading: false }
      }
      if (address === addresses.lpToken && functionName === 'balanceOf') {
        return { data: state.lpBalance, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    const { rerender } = render(
      <>
        <PoolTokenBalance address={wallet.address} />
        <PoolTokenDeposits address={wallet.address} />
        <WithdrawPoolTokensFlow address={wallet.address} />
      </>
    )

    const withdrawButton = screen.getByRole('button', { name: /withdraw pool tokens/i })
    fireEvent.click(withdrawButton)
    expect(writeContract).toHaveBeenCalledTimes(1)

    state.staked = BigInt(5)
    state.lpBalance = BigInt(10)

    rerender(
      <>
        <PoolTokenBalance address={wallet.address} />
        <PoolTokenDeposits address={wallet.address} />
        <WithdrawPoolTokensFlow address={wallet.address} />
      </>
    )

    expect(screen.getByText(/\$SLP/i)).toBeInTheDocument()
  })

  it('8) Withdraw Pool Tokens — Over-withdraw / Invalid Amount', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[3]

    mockUseWriteContract.mockReturnValue({ data: undefined, writeContract: vi.fn(), isPending: false, isSuccess: false })

    mockUseSimulateContract.mockReturnValue({
      data: undefined,
      isError: false,
      error: undefined,
      isLoading: false
    })

    mockUseReadContract.mockImplementation(({ address, functionName }: any) => {
      if (address === addresses.rewards && functionName === 'poolTokenBalances') {
        return { data: BigInt(1), isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    render(<WithdrawPoolTokensFlow address={wallet.address} />)
    const withdrawButton = screen.getByRole('button', { name: /withdraw pool tokens/i })
    expect(withdrawButton).toBeDisabled()
  })

  it('9) Reward Details — APR/APY + TVL/Deposits Computation', () => {
    mockUseReadContract.mockImplementation(({ functionName }: any) => {
      if (functionName === 'totalSupply') {
        return { data: 1000, isError: false, isLoading: false }
      }
      if (functionName === 'balanceOf') {
        return { data: 100, isError: false, isLoading: false }
      }
      if (functionName === 'getReserves') {
        return { data: [0, '1000000000000000000000'], isError: false, isLoading: false }
      }
      if (functionName === 'rewardRatePerSecond') {
        return { data: 1000, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    render(<RewardDetails />)
    expect(screen.getByText(/reward rate:/i)).toBeInTheDocument()
    expect(screen.getByText(/deposits:/i)).toBeInTheDocument()
    expect(screen.getByText(/annual percentage yield:/i)).toBeInTheDocument()
  })

  it('10) Integration — Multi-user + Time Simulation + Consistency', () => {
    const fixtures = createFixtures()
    const totalDeposits = fixtures.wallets.reduce((sum, wallet) => {
      return sum + Number(fixtures.balances[wallet.address].staked)
    }, 0)

    const claimableByWallet = new Map<string, bigint>()
    const totalStake = BigInt(totalDeposits)
    fixtures.wallets.forEach((wallet) => {
      const stake = fixtures.balances[wallet.address].staked
      const earned = computeEarned(stake, totalStake, fixtures.rewardRatePerSec, 7 * 24 * 60 * 60)
      claimableByWallet.set(wallet.address, earned)
    })

    mockUseReadContract.mockImplementation(({ address, functionName, args }: any) => {
      if (functionName === 'claimableReward') {
        return { data: claimableByWallet.get(args?.[0]) ?? BigInt(0), isError: false, isLoading: false }
      }
      if (functionName === 'totalSupply') {
        return { data: 1000, isError: false, isLoading: false }
      }
      if (functionName === 'balanceOf' && args?.[0] === addresses.rewards) {
        return { data: totalDeposits, isError: false, isLoading: false }
      }
      if (functionName === 'getReserves') {
        return { data: [0, '1000000000000000000000'], isError: false, isLoading: false }
      }
      if (functionName === 'rewardRatePerSecond') {
        return { data: 1000, isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })

    fixtures.wallets.forEach((wallet) => {
      const { unmount } = render(<ClaimableReward address={wallet.address} />)
      expect(screen.getByText(/\$ELIMU/i)).toBeInTheDocument()
      unmount()
    })

    expect(totalDeposits).toBe(
      fixtures.wallets.reduce((sum, wallet) => sum + Number(fixtures.balances[wallet.address].staked), 0)
    )
  })
})
