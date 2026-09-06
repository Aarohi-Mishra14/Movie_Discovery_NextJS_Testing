# Movie_Discovery_NextJS_Testing

Same as Movie Discovery NextJS - no new features, no UI changes. This one's a follow-up where I  added a proper test suite with Jest and React Testing Library, since the last two versions had zero tests behind them.

Did this specifically to implement component testing - rendering components in isolation, simulating real clicks and typing instead of calling functions directly, mocking network calls so tests don't need internet and getting a coverage report that actually means something instead of just chasing a number.

## What's different from the original

Had the app working fine, but "works on my machine" isn't really proof of anything. Every real project has tests behind it - so this was about closing that gap properly instead of skipping it. Picked real components, nothing invented just to pad a requirement and tested what a user would actually experience - does it render right, does clicking things work, does the data show up after a fetch.

## What's tested

Six components, all real ones already in the app:

- MovieCard - renders the right title, year and rating for whatever movie it's given and the favourite (heart) button actually works - click it, it favourites, click again, it un-favourites. Also checks it's saving properly to localStorage.
- SearchBar - typing into it updates the input and after the debounce delay it navigates to the right search URL. Clear button tested too.
- InfiniteMovieGrid - the trickiest one. It fetches more movies when you scroll near the bottom. Mocked `fetch` completely so it never hits TMDB or needs internet and had to manually control when the mock "resolves" so I could actually catch the loading state before it flashed past too fast to test.
- EmptyState, ErrorMessage, SkeletonGrid - the smaller pieces that show up when there's no data, something failed, or content's still loading.

## Test coverage

Statements 94.4% · Branches 87% · Functions 97.6% · Lines 96%

31 tests, all passing. Coverage threshold is set at 70% in the Jest config, mainly so if I add more components later without writing tests for them, the coverage command actually fails instead of quietly letting it slide.

## Tech stack

- Next.js 15 (App Router) - same as the main app, untouched
- Jest - test runner
- React Testing Library - renders components and checks the DOM the way a user would actually see it, by role/label/text, not by digging into internal state or class names
- @testing-library/user-event - simulates real typing and clicking instead of firing raw synthetic events

## Running it locally

You'll need a TMDB API key if you want to run the actual app (not just the tests).

1. Clone the repo and install everything:

```
git clone https://github.com/your-username/movie-discovery-nextjs-testing.git
cd movie-discovery-nextjs-testing
npm install
```

2. If you want to run the app itself, create `.env.local` in the project root:

```
TMDB_API_KEY=your_key_here
GEMINI_API_KEY=your_gemini_key_here
```

3. Run the app:

```
npm run dev
```

Open `http://localhost:3000`.

Running the tests

This is really the point of this repo:

```
npm test
```

Or with the coverage report:

```
npm test -- --coverage
```

No API key or internet connection needed for this part - everything network-related is mocked.

## Notes

- Kept the tests deliberately simple - no custom test helpers, no mock server library, just Jest's built-in `jest.fn()` / `jest.mock()` and a manually-controlled Promise for the one spot where I needed to catch a loading state precisely. Didn't want to over engineer a test suite for a project this size.
- MovieCard needs to be wrapped in ToastProvider in the tests since it reads from that context for the "Added to favourites" toast - took me a bit to figure out why it kept throwing until I wrapped it properly.
- If you add your own components later and want the coverage command to actually check them, add the file path to `collectCoverageFrom` in `jest.config.js` - it's not automatic, it only tracks whatever's listed there.
