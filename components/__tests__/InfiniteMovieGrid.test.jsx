import { act, render, screen, waitFor } from '@testing-library/react'
import InfiniteMovieGrid from '../InfiniteMovieGrid'
import ToastProvider from '../ToastProvider'

const initialMovies = [
  { id: 1, title: 'The First Movie', posterPath: null, releaseYear: '2020', rating: 7.1 },
  { id: 2, title: 'The Second Movie', posterPath: null, releaseYear: '2021', rating: 6.4 },
]

const nextPageMovies = [
  { id: 3, title: 'The Third Movie', posterPath: null, releaseYear: '2022', rating: 8.0 },
  { id: 4, title: 'The Fourth Movie', posterPath: null, releaseYear: '2023', rating: 7.8 },
]

let observedCallback
let observedElements

class MockIntersectionObserver {
  constructor(callback) {
    observedCallback = callback
  }

  observe(element) {
    observedElements.push(element)
  }

  disconnect() {}
}

beforeEach(() => {
  observedElements = []
  global.IntersectionObserver = MockIntersectionObserver
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

function triggerIntersection() {
  act(() => {
    observedCallback([{ isIntersecting: true }])
  })
}

function renderGrid(props) {
  return render(
    <ToastProvider>
      <InfiniteMovieGrid {...props} />
    </ToastProvider>
  )
}

describe('InfiniteMovieGrid', () => {
  it('renders without crashing and shows the initial movies', () => {
    renderGrid({
      initialMovies,
      initialPage: 1,
      totalPages: 2,
      mode: 'popular',
    })

    expect(screen.getAllByText('The First Movie').length).toBeGreaterThan(0)
    expect(screen.getAllByText('The Second Movie').length).toBeGreaterThan(0)
  })

  it('fetches and appends more movies without hitting a real network', async () => {
    let resolveFetch
    global.fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        })
    )

    renderGrid({
      initialMovies,
      initialPage: 1,
      totalPages: 2,
      mode: 'popular',
    })

    triggerIntersection()

    expect(await screen.findByText('Loading more movies…')).toBeInTheDocument()

    resolveFetch({
      ok: true,
      json: async () => ({ movies: nextPageMovies, page: 2 }),
    })

    await waitFor(() => {
      expect(screen.getAllByText('The Third Movie').length).toBeGreaterThan(0)
    })

    expect(screen.getAllByText('The First Movie').length).toBeGreaterThan(0)
    expect(screen.getAllByText('The Fourth Movie').length).toBeGreaterThan(0)
    expect(screen.queryByText('Loading more movies…')).not.toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith('/api/popular?page=2')
  })

  it('requests the search endpoint when in search mode', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ movies: nextPageMovies, page: 2 }),
    })

    renderGrid({
      initialMovies,
      initialPage: 1,
      totalPages: 2,
      mode: 'search',
      query: 'batman',
    })

    triggerIntersection()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/search?query=batman&page=2')
    })
  })

  it('shows an end-of-list message once there are no more pages', () => {
    renderGrid({
      initialMovies,
      initialPage: 2,
      totalPages: 2,
      mode: 'popular',
    })

    expect(screen.getByText('No more movies to explore.')).toBeInTheDocument()
  })

  it('stops the loading state and logs a warning when the fetch fails', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Could not load more movies.' }),
    })

    renderGrid({
      initialMovies,
      initialPage: 1,
      totalPages: 2,
      mode: 'popular',
    })

    triggerIntersection()

    await waitFor(() => {
      expect(screen.queryByText('Loading more movies…')).not.toBeInTheDocument()
    })

    expect(warnSpy).toHaveBeenCalled()
    expect(screen.getAllByText('The First Movie').length).toBeGreaterThan(0)

    warnSpy.mockRestore()
  })
})
