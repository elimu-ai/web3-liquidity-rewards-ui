import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ElimuBalance from '../ElimuBalance'

const mockUseReadContract = vi.fn()
const mockUseIsMounted = vi.fn()

vi.mock('wagmi', () => ({
  useReadContract: (...args: unknown[]) => mockUseReadContract(...args)
}))

vi.mock('../../hooks/useIsMounted', () => ({
  useIsMounted: () => mockUseIsMounted()
}))

describe('ElimuBalance', () => {
  beforeEach(() => {
    mockUseReadContract.mockReset()
    mockUseIsMounted.mockReset()
    mockUseIsMounted.mockReturnValue(true)
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: false })
  })

  it('renders a spinner when not mounted', () => {
    mockUseIsMounted.mockReturnValue(false)
    const { container } = render(<ElimuBalance address="0xabc" />)
    expect(container.querySelector('span.animate-spin')).toBeTruthy()
  })

  it('renders a spinner while loading', () => {
    mockUseReadContract.mockReturnValue({ data: BigInt(0), isError: false, isLoading: true })
    const { container } = render(<ElimuBalance address="0xabc" />)
    expect(container.querySelector('span.animate-spin')).toBeTruthy()
  })

  it('renders the formatted balance when loaded', () => {
    mockUseReadContract.mockReturnValue({
      data: BigInt('1000000000000000000'),
      isError: false,
      isLoading: false
    })
    render(<ElimuBalance address="0xabc" />)
    expect(screen.getByText('1 $ELIMU')).toBeInTheDocument()
  })
})
