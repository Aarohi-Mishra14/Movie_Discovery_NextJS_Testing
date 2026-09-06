import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieCard from '../MovieCard'
import ToastProvider from '../ToastProvider'

const movie = {
  id: 101,
  title: 'Wireless Headphones Heist',
  posterPath: '/poster.jpg',
  releaseYear: '2024',
  rating: 8.456,
}

function renderMovieCard(movieProp = movie) {
  return render(
    <ToastProvider>
      <MovieCard movie={movieProp} />
    </ToastProvider>
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('MovieCard', () => {
  it('renders without crashing', () => {
    renderMovieCard()
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('renders the movie title passed through props', () => {
    renderMovieCard()
    expect(screen.getAllByText('Wireless Headphones Heist').length).toBeGreaterThan(0)
  })

  it('renders the release year and rounded rating', () => {
    renderMovieCard()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
  })

  it('shows a fallback message when there is no poster', () => {
    renderMovieCard({ ...movie, posterPath: null })
    expect(screen.getByLabelText('No poster available for Wireless Headphones Heist')).toBeInTheDocument()
  })

  it('marks the movie as favorite after the favorite button is clicked', async () => {
    const user = userEvent.setup()
    renderMovieCard()

    const favoriteButton = screen.getByRole('button', {
      name: 'Add Wireless Headphones Heist to favorites',
    })
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(favoriteButton)

    const updatedButton = screen.getByRole('button', {
      name: 'Remove Wireless Headphones Heist from favorites',
    })
    expect(updatedButton).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByText('Added to favorites')).toBeInTheDocument()
  })

  it('removes the movie from favorites on a second click', async () => {
    const user = userEvent.setup()
    renderMovieCard()

    const favoriteButton = screen.getByRole('button', {
      name: 'Add Wireless Headphones Heist to favorites',
    })
    await user.click(favoriteButton)
    await user.click(
      screen.getByRole('button', { name: 'Remove Wireless Headphones Heist from favorites' })
    )

    expect(
      screen.getByRole('button', { name: 'Add Wireless Headphones Heist to favorites' })
    ).toHaveAttribute('aria-pressed', 'false')
    expect(await screen.findByText('Removed from favorites')).toBeInTheDocument()
  })

  it('persists favorites to localStorage', async () => {
    const user = userEvent.setup()
    renderMovieCard()

    await user.click(
      screen.getByRole('button', { name: 'Add Wireless Headphones Heist to favorites' })
    )

    await waitFor(() => {
      const stored = JSON.parse(window.localStorage.getItem('movieFavorites'))
      expect(stored).toHaveLength(1)
      expect(stored[0].id).toBe(101)
    })
  })
})
