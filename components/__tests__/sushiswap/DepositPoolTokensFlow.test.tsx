import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DepositPoolTokensFlow from '../../sushiswap/DepositPoolTokensFlow'
import { createFixtures } from '../helpers/fakeData'

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

const baseSimulate = {
  data: { request: { address: '0x0', abi: [], functionName: 'depositPoolTokens' } },
  isError: false,
  error: undefined,
  isLoading: false
}

const baseWrite = {
  data: undefined,
  writeContract: vi.fn(),
  isPending: false,
  isSuccess: false
}

const baseWait = {
  isError: false,
  error: undefined,
  isLoading: false,
  isSuccess: false
}

describe('DepositPoolTokensFlow (SushiSwap)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseSimulateContract.mockReset()
    mockUseWriteContract.mockReset()
    mockUseWaitForTransactionReceipt.mockReset()
    mockUseIsMounted.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseWaitForTransactionReceipt.mockReturnValue(baseWait)
  })

  it('disables deposit when balance is zero (insufficient balance)', () => {
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })

    render(<DepositPoolTokensFlow address="0xabc" />)

    const depositButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    expect(depositButton).toBeDisabled()
  })

  it('renders approve flow when allowance is below requested amount', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[2]

    mockUseReadContract.mockImplementation(({ functionName }: any) => {
      if (functionName === 'balanceOf') {
        return { data: BigInt(100), isError: false, isLoading: false }
      }
      if (functionName === 'allowance') {
        return { data: BigInt(0), isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })
    mockUseSimulateContract.mockReturnValue(baseSimulate)
    mockUseWriteContract.mockReturnValue(baseWrite)

    render(<DepositPoolTokensFlow address={wallet.address} />)

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '2' } })

    const approveButton = screen.getByRole('button', { name: /approve \$slp allowance/i })
    expect(approveButton).toBeEnabled()
  })

  it('submits a deposit when allowance already covers the amount', () => {
    const writeContract = vi.fn()
    mockUseReadContract.mockImplementation(({ functionName }: any) => {
      if (functionName === 'balanceOf') {
        return { data: BigInt(100), isError: false, isLoading: false }
      }
      if (functionName === 'allowance') {
        return { data: BigInt(10_000_000_000_000_000_000), isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })
    mockUseSimulateContract.mockReturnValue(baseSimulate)
    mockUseWriteContract.mockReturnValue({ ...baseWrite, writeContract })

    render(<DepositPoolTokensFlow address="0xabc" />)

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '1' } })

    const depositButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    fireEvent.click(depositButton)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })

  it('prevents double submission once pending', () => {
    const writeContract = vi.fn()
    mockUseReadContract.mockImplementation(({ functionName }: any) => {
      if (functionName === 'balanceOf') {
        return { data: BigInt(100), isError: false, isLoading: false }
      }
      if (functionName === 'allowance') {
        return { data: BigInt(10_000_000_000_000_000_000), isError: false, isLoading: false }
      }
      return { data: undefined, isError: false, isLoading: false }
    })
    mockUseSimulateContract.mockReturnValue(baseSimulate)
    mockUseWriteContract.mockReturnValue({ ...baseWrite, writeContract })

    const { rerender } = render(<DepositPoolTokensFlow address="0xabc" />)

    const input = screen.getByPlaceholderText(/amount/i)
    fireEvent.change(input, { target: { value: '1' } })
    const depositButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    fireEvent.click(depositButton)
    expect(writeContract).toHaveBeenCalledTimes(1)

    mockUseWriteContract.mockReturnValue({ ...baseWrite, writeContract, isPending: true })
    rerender(<DepositPoolTokensFlow address="0xabc" />)

    const pendingButton = screen.getByRole('button', { name: /deposit \$slp pool tokens/i })
    expect(pendingButton).toBeDisabled()
    fireEvent.click(pendingButton)
    expect(writeContract).toHaveBeenCalledTimes(1)
  })
})
