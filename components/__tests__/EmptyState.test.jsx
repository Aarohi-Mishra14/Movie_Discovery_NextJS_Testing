import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders without crashing', () => {
    render(<EmptyState title="Nothing here" />)
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument()
  })

  it('renders the title and message passed through props', () => {
    render(
      <EmptyState
        title="Your watchlist is waiting"
        message="Movies you favorite will show up here."
      />
    )

    expect(screen.getByText('Your watchlist is waiting')).toBeInTheDocument()
    expect(screen.getByText('Movies you favorite will show up here.')).toBeInTheDocument()
  })

  it('does not render a message paragraph when none is provided', () => {
    render(<EmptyState title="No results" />)

    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.queryByText(/favorite/i)).not.toBeInTheDocument()
  })

  it('renders the icon when one is passed', () => {
    render(<EmptyState title="Search" icon={<span data-testid="empty-icon" />} />)

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument()
  })
})
