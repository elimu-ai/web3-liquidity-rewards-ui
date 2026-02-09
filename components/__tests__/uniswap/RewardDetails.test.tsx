import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RewardDetails from '../../uniswap/RewardDetails'

const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

describe('RewardDetails (Uniswap)', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReset()
  })

  it('renders computed reward details when data is available', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract
      .mockImplementationOnce(() => ({ data: 1000, isError: false, isLoading: false }))
      .mockImplementationOnce(() => ({ data: 100, isError: false, isLoading: false }))
      .mockImplementationOnce(() => ({ data: [0, '1000000000000000000000'], isError: false, isLoading: false }))
      .mockImplementationOnce(() => ({ data: 1000, isError: false, isLoading: false }))

    render(<RewardDetails />)

    expect(
      screen.getByText((content, node) => node?.tagName.toLowerCase() === 'p' && content.includes('Reward rate: 0'))
    ).toBeInTheDocument()
    expect(screen.getByText(/deposits:/i)).toBeInTheDocument()
    expect(screen.getByText(/\(10\.00%\)/i)).toBeInTheDocument()
    expect(screen.getByText(/annual percentage yield:/i)).toBeInTheDocument()
    expect(
      screen.getByText((content, node) => node?.tagName.toLowerCase() === 'b' && content === '0.00%')
    ).toBeInTheDocument()
  })

  it('renders an error when total supply is missing', () => {
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: undefined, isError: true, isLoading: false })

    render(<RewardDetails />)
    expect(screen.getByText(/error loading total supply of pool tokens/i)).toBeInTheDocument()
  })
})
