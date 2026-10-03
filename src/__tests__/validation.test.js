import { describe, expect, it } from 'vitest';
import { MAX_GUESTS, MAX_REQUEST_LENGTH, validateBooking } from '../utils/validation';

const NOW = new Date(2030, 0, 15);
const TIMES = ['17:00', '18:30'];
const valid = {
  name: 'Ana Lopez',
  email: 'ana@example.com',
  date: '2030-01-15',
  time: '17:00',
  guests: '2',
  occasion: 'Birthday',
  requests: '',
};
const validate = (overrides, times = TIMES) => validateBooking({ ...valid, ...overrides }, times, NOW);

describe('validateBooking', () => {
  it('returns no errors for a valid booking', () => {
    expect(validate({})).toEqual({});
  });

  it.each([
    ['', 'Please enter your name.'],
    ['   ', 'Please enter your name.'],
    ['A', 'Name must be at least 2 characters.'],
    ['Ana123', 'Name can only contain letters, spaces, apostrophes and hyphens.'],
  ])('rejects the name %j', (name, message) => {
    expect(validate({ name }).name).toBe(message);
  });

  it("accepts names with accents, apostrophes and hyphens", () => {
    expect(validate({ name: "Zoë O'Neil-Smith" }).name).toBeUndefined();
  });

  it.each(['', 'ana', 'ana@', 'ana@example', 'ana @example.com'])('rejects the email %j', (email) => {
    expect(validate({ email }).email).toBeDefined();
  });

  it('rejects a missing, impossible or past date', () => {
    expect(validate({ date: '' }).date).toBe('Please choose a date.');
    expect(validate({ date: '2030-02-31' }).date).toBe('Please enter a valid date.');
    expect(validate({ date: '2030-01-14' }).date).toBe('The date cannot be in the past.');
  });

  it('only allows bookings within the booking window', () => {
    expect(validate({ date: '2030-04-15' }).date).toBeUndefined(); // 90 days ahead
    expect(validate({ date: '2030-04-16' }).date).toMatch(/90 days in advance/);
  });

  it('requires a time that is available on the chosen date', () => {
    expect(validate({ time: '' }).time).toBe('Please choose a time.');
    expect(validate({ time: '22:00' }).time).toMatch(/no longer available/);
  });

  it('explains when a date is fully booked', () => {
    expect(validate({}, []).time).toMatch(/no tables left/);
  });

  it.each([
    ['', 'Please enter the number of guests.'],
    ['0', 'Bookings must be for at least 1 guest.'],
    ['-3', 'Bookings must be for at least 1 guest.'],
    ['2.5', 'Number of guests must be a whole number.'],
    [String(MAX_GUESTS + 1), `We can seat up to ${MAX_GUESTS} guests online. For larger groups, please call us.`],
  ])('rejects %j guests', (guests, message) => {
    expect(validate({ guests }).guests).toBe(message);
  });

  it('accepts the guest limits', () => {
    expect(validate({ guests: '1' }).guests).toBeUndefined();
    expect(validate({ guests: String(MAX_GUESTS) }).guests).toBeUndefined();
  });

  it('rejects an unknown occasion', () => {
    expect(validate({ occasion: 'Wedding' }).occasion).toBe('Please choose an occasion.');
  });

  it('limits the length of special requests', () => {
    expect(validate({ requests: 'a'.repeat(MAX_REQUEST_LENGTH) }).requests).toBeUndefined();
    expect(validate({ requests: 'a'.repeat(MAX_REQUEST_LENGTH + 1) }).requests).toBeDefined();
  });
});
