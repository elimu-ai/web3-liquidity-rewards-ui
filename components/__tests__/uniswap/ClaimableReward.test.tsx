import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ClaimableReward from '../../uniswap/ClaimableReward'
import { createFixtures, getClaimableAmount } from '../helpers/fakeData'

const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

describe('ClaimableReward (Uniswap)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReset()
  })

  it('renders a spinner when not mounted', () => {
    mockUseIsMounted.mockReturnValue(false)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })

    const { container } = render(<ClaimableReward address="0xabc" />)
    expect(container.querySelector('span')).toBeTruthy()
  })

  it('prompts to connect wallet when no address is provided', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })

    render(<ClaimableReward address={undefined} />)
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument()
  })

  it('renders an error when claimable data is missing', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: undefined, isError: true, isLoading: false })

    render(<ClaimableReward address="0xabc" />)
    expect(screen.getByText(/error loading claimable reward/i)).toBeInTheDocument()
  })

  it('renders an error when the hook reports an error even with data', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(10), isError: true, isLoading: false })

    render(<ClaimableReward address="0xabc" />)
    expect(screen.getByText(/error loading claimable reward/i)).toBeInTheDocument()
  })

  it('renders the claimable amount when available', () => {
    const fixtures = createFixtures()
    const wallet = fixtures.wallets[0]
    const reward = fixtures.rewards[wallet.address][0]
    const claimable = getClaimableAmount(reward, fixtures.now)

    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: claimable, isError: false, isLoading: false })

    render(<ClaimableReward address={wallet.address} />)
    expect(screen.getByText(/\$ELIMU/i)).toBeInTheDocument()
  })
})
