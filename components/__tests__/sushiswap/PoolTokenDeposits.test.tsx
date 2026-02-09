import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PoolTokenDeposits from '../../sushiswap/PoolTokenDeposits'
import { createFixtures } from '../helpers/fakeData'

const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

describe('PoolTokenDeposits (SushiSwap)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReset()
  })

  it('renders a spinner while loading', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: true })

    const { container } = render(<PoolTokenDeposits address="0xabc" />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('prompts to connect wallet when no address is provided', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })

    render(<PoolTokenDeposits address={undefined} />)
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument()
  })

  it('renders an error when deposit data is missing', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: undefined, isError: true, isLoading: false })

    render(<PoolTokenDeposits address="0xabc" />)
    expect(screen.getByText(/error loading pool token deposits/i)).toBeInTheDocument()
  })

  it('renders an error when the hook reports an error even with data', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(10), isError: true, isLoading: false })

    render(<PoolTokenDeposits address="0xabc" />)
    expect(screen.getByText(/error loading pool token deposits/i)).toBeInTheDocument()
  })

  it('renders the formatted deposits when data is available', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[3]
    const deposits = fixtures.balances[wallet.address].staked

    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: deposits, isError: false, isLoading: false })

    render(<PoolTokenDeposits address={wallet.address} />)
    expect(screen.getByText(/\$SLP/i)).toBeInTheDocument()
  })
})
