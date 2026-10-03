import { addDays, parseISODate, toISODate } from './date';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;
export const MAX_BOOKING_DAYS_AHEAD = 90;
export const MAX_REQUEST_LENGTH = 200;
export const OCCASIONS = ['None', 'Birthday', 'Anniversary', 'Engagement', 'Business'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[\p{L}][\p{L}' .-]*$/u;

/**
 * Validates the booking form.
 * Returns an object that maps each invalid field name to a human readable
 * error message. An empty object means the form is valid.
 *
 * @param {object} values - current form values
 * @param {string[]} availableTimes - times offered for the selected date
 * @param {Date} [now] - injectable "today" so tests are deterministic
 */
export const validateBooking = (values, availableTimes = [], now = new Date()) => {
  const errors = {};
  const name = (values.name ?? '').trim();
  const email = (values.email ?? '').trim();

  // Name
  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'Name can only contain letters, spaces, apostrophes and hyphens.';
  }

  // Email
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address, e.g. name@example.com.';
  }

  // Date: must be a real date, not in the past, within the booking window.
  const date = parseISODate(values.date);
  const today = parseISODate(toISODate(now));
  const lastBookableDay = addDays(today, MAX_BOOKING_DAYS_AHEAD);
  if (!values.date) {
    errors.date = 'Please choose a date.';
  } else if (!date) {
    errors.date = 'Please enter a valid date.';
  } else if (date < today) {
    errors.date = 'The date cannot be in the past.';
  } else if (date > lastBookableDay) {
    errors.date = `Bookings open ${MAX_BOOKING_DAYS_AHEAD} days in advance. Please choose an earlier date.`;
  }

  // Time: must be one of the slots offered for the chosen date.
  if (!errors.date) {
    if (availableTimes.length === 0) {
      errors.time = 'Sorry, there are no tables left on this date. Please choose another date.';
    } else if (!values.time) {
      errors.time = 'Please choose a time.';
    } else if (!availableTimes.includes(values.time)) {
      errors.time = 'That time is no longer available. Please choose another time.';
    }
  }

  // Guests: whole number between MIN and MAX.
  const guests = Number(values.guests);
  if (values.guests === '' || values.guests === undefined || values.guests === null) {
    errors.guests = 'Please enter the number of guests.';
  } else if (!Number.isInteger(guests)) {
    errors.guests = 'Number of guests must be a whole number.';
  } else if (guests < MIN_GUESTS) {
    errors.guests = `Bookings must be for at least ${MIN_GUESTS} guest.`;
  } else if (guests > MAX_GUESTS) {
    errors.guests = `We can seat up to ${MAX_GUESTS} guests online. For larger groups, please call us.`;
  }

  // Occasion
  if (!OCCASIONS.includes(values.occasion)) {
    errors.occasion = 'Please choose an occasion.';
  }

  // Special requests (optional)
  if ((values.requests ?? '').length > MAX_REQUEST_LENGTH) {
    errors.requests = `Special requests must be ${MAX_REQUEST_LENGTH} characters or fewer.`;
  }

  return errors;
};
