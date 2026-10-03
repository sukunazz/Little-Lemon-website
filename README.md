# Little Lemon – Table Booking Web App

Front-end capstone project for the **Meta Front-End Developer Professional Certificate** (Coursera).

Little Lemon is a family-owned Mediterranean restaurant in Chicago. This React app implements the restaurant's
home page and an accessible, validated **table reservation** flow based on the Little Lemon UX/UI design.

## Features

- **Home page**: hero section, "This week's specials" cards, testimonials and an About section, following the Little Lemon style guide (colors `#495E57` / `#F4CE14`, fonts *Markazi Text* and *Karla*).
- **Booking form** (`/booking`)
  - Fields: name, email, date, time, number of guests, occasion and optional special requests.
  - Available times update when the date changes (`useReducer` with `initializeTimes` / `updateTimes`, backed by the course's `fetchAPI`).
  - Client-side validation with HTML5 attributes **and** JavaScript, showing a clear message for each problem:
    - past dates, impossible dates, and dates more than 90 days ahead
    - fully booked dates (no times available) and times that are no longer available
    - guest count outside 1–10 or not a whole number
    - empty or invalid name and email, and special requests over 200 characters
  - The submit button stays disabled until the form is valid. Errors appear after a field is touched, not on page load.
  - API failures show an error message and keep the form.
- **Confirmation page** (`/confirmed`): booking summary, with focus moved to the heading. It also handles a direct visit when there is no booking to show.
- Bookings are saved to `localStorage`, which fails safely if storage is blocked.
- **Responsive**: mobile-first CSS with a hamburger menu below 900px.
- **Accessibility**
  - semantic landmarks (`header`, `nav`, `main`, `footer`, `section`, `article`) and a skip link
  - labelled form controls, `fieldset`/`legend`, `aria-invalid`, and `aria-describedby` linking hints and errors
  - `role="alert"` on error messages and `aria-expanded`/`aria-controls` on the menu button
  - alt text on all images, a visible focus style, page titles for each route and `prefers-reduced-motion` support
- Placeholder pages for *Order Online* and *Login* (out of scope), plus a 404 page.

## Tech stack

React 19 · React Router 7 · Vite · Vitest · React Testing Library · plain CSS

## Getting started

Requirements: [Node.js](https://nodejs.org/) 20 or later and npm.

```bash
git clone <this-repo-url>
cd little-lemon
npm install
npm run dev        # start the dev server at http://localhost:5173
```

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server             |
| `npm test`        | Run all unit tests once                  |
| `npm run test:watch` | Run tests in watch mode               |
| `npm run build`   | Create a production build in `dist/`     |
| `npm run preview` | Serve the production build locally       |

## Tests

```bash
npm test
```

There are 64 tests across 8 files in `src/__tests__/`:

| File | What it covers |
| ---- | -------------- |
| `bookingTimes.test.js` | `initializeTimes` and the `updateTimes` reducer |
| `BookingForm.test.jsx` | labels, HTML5 attributes, dispatch on date change, disabled/enabled submit, submitted data, error messages and ARIA state |
| `BookingPage.test.jsx` | end-to-end booking flow: times update, confirmation and saving, API rejection |
| `validation.test.js` | every validation rule and edge case |
| `App.test.jsx` | landmarks, alt text, skip link, navigation, mobile menu, 404 and direct `/confirmed` visit |
| `api.test.js`, `date.test.js`, `storage.test.js` | API mock, time-zone-safe date parsing, and `localStorage` failure handling |

## Project structure

```
src/
├── api.js                  # fetchAPI / submitAPI (local copy of the course mock API)
├── App.jsx                 # layout, routes, scroll handling
├── App.css                 # all styles (design tokens at the top)
├── data.js                 # nav links, specials, testimonials
├── components/             # Header, Nav, Footer, Hero, Specials, SpecialCard,
│                           # Testimonials, About, Logo, BookingForm
├── pages/                  # HomePage, BookingPage, ConfirmedBooking, ComingSoon, NotFound
├── hooks/useDocumentTitle.js
├── utils/
│   ├── bookingTimes.js     # initializeTimes / updateTimes reducer
│   ├── validation.js       # validateBooking + limits
│   ├── date.js             # time-zone-safe date helpers
│   └── storage.js          # localStorage helpers
└── __tests__/              # unit and integration tests
```

## Notes

- The course's mock API (`https://raw.githubusercontent.com/courseraap/capstone/main/api.js`) is bundled in `src/api.js` so the app works offline and can be tested.
- Dates from `<input type="date">` are parsed as **local** dates, which avoids the off-by-one-day bug in time zones west of UTC.

## Credits

Food and restaurant photos are from [Unsplash](https://unsplash.com) (Unsplash License). The Little Lemon brand and design come from the Meta Front-End Developer course.
