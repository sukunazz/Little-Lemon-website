/** Pads a number to two digits, e.g. 5 -> "05". */
const pad = (n) => String(n).padStart(2, '0');

/** Formats a Date as a local "YYYY-MM-DD" string (the format used by <input type="date">). */
export const toISODate = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Parses a "YYYY-MM-DD" string as a *local* date.
 * `new Date("2024-05-01")` would be parsed as UTC midnight, which shows up as
 * the previous day in time zones west of UTC, so we build the date by hand.
 * Returns null for anything that is not a real calendar date.
 */
export const parseISODate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Reject overflowed dates such as 2024-02-31 (which JS rolls into March).
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

/** Adds whole days to a date without mutating it. */
export const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

/** Human friendly date, e.g. "Saturday, 3 October 2026". */
export const formatLongDate = (value) => {
  const date = parseISODate(value);
  if (!date) return value;
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
