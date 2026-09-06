import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  beforeEach(() => {
    mockRefresh.mockClear()
  })

  it('renders without crashing', () => {
    render(<ErrorMessage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders the message passed through props', () => {
    render(<ErrorMessage message="Could not load movies right now." />)
    expect(screen.getByText('Could not load movies right now.')).toBeInTheDocument()
  })

  it('falls back to a default message when none is provided', () => {
    render(<ErrorMessage />)
    expect(screen.getByText('We could not load movies right now. Please try again.')).toBeInTheDocument()
  })

  it('shows a retry button by default and calls router.refresh on click', async () => {
    const user = userEvent.setup()
    render(<ErrorMessage message="Network error" />)

    const retryButton = screen.getByRole('button', { name: 'Try again' })
    await user.click(retryButton)

    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  it('hides the retry button when retryable is false', () => {
    render(<ErrorMessage message="Fatal error" retryable={false} />)
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })
})
