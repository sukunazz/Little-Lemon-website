import { describe, expect, it } from 'vitest';
import { fetchAPI, submitAPI } from '../api';

describe('fetchAPI', () => {
  it('returns times between 17:00 and 23:30 in HH:MM format', () => {
    const times = fetchAPI(new Date(2030, 0, 15));
    times.forEach((time) => {
      expect(time).toMatch(/^(1[7-9]|2[0-3]):(00|30)$/);
    });
  });

  it('is deterministic for the same day of the month', () => {
    expect(fetchAPI(new Date(2030, 0, 15))).toEqual(fetchAPI(new Date(2031, 5, 15)));
  });

  it('returns an empty list for an invalid date instead of throwing', () => {
    expect(fetchAPI(new Date('not a date'))).toEqual([]);
    expect(fetchAPI(undefined)).toEqual([]);
  });
});

describe('submitAPI', () => {
  it('accepts a booking with data', () => {
    expect(submitAPI({ name: 'Ana' })).toBe(true);
  });

  it('rejects an empty submission', () => {
    expect(submitAPI(null)).toBe(false);
  });
});
