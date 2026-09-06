import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()
const mockGet = jest.fn()
const mockRouter = { push: mockPush }

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({ get: mockGet }),
}))

import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockGet.mockReset()
    mockGet.mockReturnValue(null)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders without crashing', () => {
    render(<SearchBar />)
    expect(screen.getByLabelText('Search for a movie')).toBeInTheDocument()
  })

  it('starts empty when there is no query in the url', () => {
    render(<SearchBar />)
    expect(screen.getByLabelText('Search for a movie')).toHaveValue('')
  })

  it('pre-fills the input from the current query param', () => {
    mockGet.mockReturnValue('dune')
    render(<SearchBar />)
    expect(screen.getByLabelText('Search for a movie')).toHaveValue('dune')
  })

  it('updates the input value as the user types', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SearchBar />)

    const input = screen.getByLabelText('Search for a movie')
    await user.type(input, 'batman')

    expect(input).toHaveValue('batman')
  })

  it('navigates to the search page after the debounce delay', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<SearchBar />)

    await user.type(screen.getByLabelText('Search for a movie'), 'batman')
    expect(mockPush).not.toHaveBeenCalled()

    jest.advanceTimersByTime(500)
    expect(mockPush).toHaveBeenCalledWith('/search?query=batman')
  })

  it('clears the input and navigates home when the clear button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    mockGet.mockReturnValue('dune')
    render(<SearchBar />)

    const clearButton = screen.getByRole('button', { name: 'Clear search' })
    await user.click(clearButton)

    expect(screen.getByLabelText('Search for a movie')).toHaveValue('')
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
