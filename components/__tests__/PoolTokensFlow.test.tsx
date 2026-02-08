import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WithdrawSushi from '../sushiswap/WithdrawPoolTokensFlow'
import WithdrawUni from '../uniswap/WithdrawPoolTokensFlow'
import ClaimUni from '../uniswap/ClaimRewardsFlow'
import ClaimSushi from '../sushiswap/ClaimRewardsFlow'
import DepositUni from '../uniswap/DepositPoolTokensFlow'
import DepositSushi from '../sushiswap/DepositPoolTokensFlow'

const mockUseSimulateContract = vi.fn()
const mockUseWriteContract = vi.fn()
const mockUseWaitForTransactionReceipt = vi.fn()
const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useSimulateContract: (...args: unknown[]) => mockUseSimulateContract(...args),
  useWriteContract: (...args: unknown[]) => mockUseWriteContract(...args),
  useWaitForTransactionReceipt: (...args: unknown[]) => mockUseWaitForTransactionReceipt(...args),
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>
}))

const baseSimulateResult = {
  data: { request: { address: '0x0', abi: [], functionName: 'withdrawPoolTokens' } },
  isError: false,
  error: undefined,
  isLoading: false
}

const baseWaitResult = {
  isError: false,
  error: undefined,
  isLoading: false,
  isSuccess: false
}

describe('WithdrawPoolTokensFlow', () => {
  beforeEach(() => {
    mockUseSimulateContract.mockReset()
    mockUseWriteContract.mockReset()
    mockUseWaitForTransactionReceipt.mockReset()
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseWaitForTransactionReceipt.mockReturnValue(baseWaitResult)
    mockUseReadContract.mockReturnValue({ data: BigInt(1), isError: false, isLoading: false })
  })

  it('does not call writeContract when simulateData is missing', () => {
    const writeContract = vi.fn()
    mockUseSimulateContract.mockReturnValue({ ...baseSimulateResult, data: undefined })
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract,
      isPending: false,
      isSuccess: false
    })

    render(<WithdrawUni address="0xabc" />)

    const withdrawButton = screen.getByRole('button', { name: /withdraw pool tokens/i })
    expect(withdrawButton).toBeDisabled()
    fireEvent.click(withdrawButton)
    expect(writeContract).not.toHaveBeenCalled()
  })

  it('calls writeContract when simulateData.request exists', () => {
    const writeContract = vi.fn()
    mockUseSimulateContract.mockReturnValue(baseSimulateResult)
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract,
      isPending: false,
      isSuccess: false
    })

    render(<WithdrawSushi address="0xabc" />)

    const withdrawButton = screen.getByRole('button', { name: /withdraw pool tokens/i })
    fireEvent.click(withdrawButton)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('handles very large pool token balances without throwing', () => {
    mockUseSimulateContract.mockReturnValue(baseSimulateResult)
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract: vi.fn(),
      isPending: false,
      isSuccess: false
    })
    mockUseReadContract.mockReturnValue({
      data: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
      isError: false,
      isLoading: false
    })

    expect(() => render(<WithdrawUni address="0xabc" />)).not.toThrow()
  })
})

describe('ClaimRewardsFlow', () => {
  beforeEach(() => {
    mockUseSimulateContract.mockReset()
    mockUseWriteContract.mockReset()
    mockUseWaitForTransactionReceipt.mockReset()
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseWaitForTransactionReceipt.mockReturnValue(baseWaitResult)
  })

  it('does not call writeContract when simulateData is missing', () => {
    const writeContract = vi.fn()
    mockUseReadContract.mockReturnValue({ data: BigInt(1), isError: false, isLoading: false })
    mockUseSimulateContract.mockReturnValue({ ...baseSimulateResult, data: undefined })
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract,
      isPending: false,
      isSuccess: false
    })

    render(<ClaimUni address="0xabc" />)

    const claimButton = screen.getByRole('button', { name: /confirming/i })
    expect(claimButton).toBeDisabled()
    fireEvent.click(claimButton)
    expect(writeContract).not.toHaveBeenCalled()
  })

  it('calls writeContract when simulateData.request exists', () => {
    const writeContract = vi.fn()
    mockUseReadContract.mockReturnValue({ data: BigInt(1), isError: false, isLoading: false })
    mockUseSimulateContract.mockReturnValue(baseSimulateResult)
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract,
      isPending: false,
      isSuccess: false
    })

    render(<ClaimSushi address="0xabc" />)

    const claimButton = screen.getByRole('button', { name: /claim rewards/i })
    fireEvent.click(claimButton)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })
})

describe('DepositPoolTokensFlow', () => {
  beforeEach(() => {
    mockUseSimulateContract.mockReset()
    mockUseWriteContract.mockReset()
    mockUseWaitForTransactionReceipt.mockReset()
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseWaitForTransactionReceipt.mockReturnValue(baseWaitResult)
  })

  it('renders disabled controls when no address is provided', () => {
    mockUseReadContract.mockReturnValue({ data: BigInt(1), isError: false, isLoading: false })

    render(<DepositUni address={undefined} />)

    const depositButton = screen.getByRole('button', { name: /deposit/i })
    expect(depositButton).toBeDisabled()
  })

  it('does not call writeContract when allowance simulateData is missing', () => {
    const writeContract = vi.fn()
    mockUseReadContract
      .mockImplementationOnce(() => ({ data: BigInt(1), isError: false, isLoading: false }))
      .mockImplementationOnce(() => ({ data: BigInt(0), isError: false, isLoading: false }))
    mockUseSimulateContract.mockReturnValue({ ...baseSimulateResult, data: undefined })
    mockUseWriteContract.mockReturnValue({
      data: undefined,
      writeContract,
      isPending: false,
      isSuccess: false
    })

    render(<DepositSushi address="0xabc" />)

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '2' } })

    const approveButton = screen.getByRole('button', { name: /approve/i })
    expect(approveButton).toBeDisabled()
    fireEvent.click(approveButton)
    expect(writeContract).not.toHaveBeenCalled()
  })
})
