import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PoolTokenBalance from '../../sushiswap/PoolTokenBalance'
import { createFixtures } from '../helpers/fakeData'

const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

describe('PoolTokenBalance (SushiSwap)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReset()
  })

  it('renders spinner while loading', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: true })

    const { container } = render(<PoolTokenBalance address="0xabc" />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('prompts to connect wallet when no address is provided', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })

    render(<PoolTokenBalance address={undefined} />)
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument()
  })

  it('renders an error when balance data is missing', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: undefined, isError: true, isLoading: false })

    render(<PoolTokenBalance address="0xabc" />)
    expect(screen.getByText(/error loading pool token balance/i)).toBeInTheDocument()
  })

  it('renders an error when the hook reports an error even with data', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(10), isError: true, isLoading: false })

    render(<PoolTokenBalance address="0xabc" />)
    expect(screen.getByText(/error loading pool token balance/i)).toBeInTheDocument()
  })

  it('renders the formatted balance when data is available', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[1]
    const balance = fixtures.balances[wallet.address].lp

    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: balance, isError: false, isLoading: false })

    render(<PoolTokenBalance address={wallet.address} />)
    expect(screen.getByText(/\$SLP/i)).toBeInTheDocument()
  })

  it('truncates displayed balance instead of rounding up', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt('53638000000000000000'), isError: false, isLoading: false })

    render(<PoolTokenBalance address="0xabc" />)
    expect(screen.getByText(/53\.63 \$SLP/i)).toBeInTheDocument()
    expect(screen.queryByText(/53\.64 \$SLP/i)).not.toBeInTheDocument()
  })
})
