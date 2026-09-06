const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'components/MovieCard.jsx',
    'components/EmptyState.jsx',
    'components/SkeletonGrid.jsx',
    'components/ErrorMessage.jsx',
    'components/SearchBar.jsx',
    'components/InfiniteMovieGrid.jsx',
    'components/ToastProvider.jsx',
    'lib/useFavorites.js',
    'lib/debounce.js',
    'lib/tmdbImage.js',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
