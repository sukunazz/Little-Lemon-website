import { describe, expect, it } from 'vitest';
import { addDays, formatLongDate, parseISODate, toISODate } from '../utils/date';

describe('date utils', () => {
  it('formats a date as local YYYY-MM-DD', () => {
    expect(toISODate(new Date(2030, 0, 5))).toBe('2030-01-05');
  });

  it('parses YYYY-MM-DD as a local date', () => {
    const date = parseISODate('2030-01-05');
    expect(date.getFullYear()).toBe(2030);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(5);
  });

  it('rejects malformed and impossible dates', () => {
    expect(parseISODate('')).toBeNull();
    expect(parseISODate('05/01/2030')).toBeNull();
    expect(parseISODate('2030-02-30')).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
  });

  it('adds days across month boundaries without mutating the input', () => {
    const start = new Date(2030, 0, 30);
    expect(toISODate(addDays(start, 3))).toBe('2030-02-02');
    expect(toISODate(start)).toBe('2030-01-30');
  });

  it('formats a readable long date', () => {
    // Punctuation varies between ICU versions, so only check the parts.
    expect(formatLongDate('2030-01-05')).toMatch(/^Saturday,? 5 January 2030$/);
    expect(formatLongDate('bad')).toBe('bad');
  });
});
