import { describe, expect, it } from 'vitest';
import { fetchAPI } from '../api';
import { initializeTimes, UPDATE_TIMES, updateTimes } from '../utils/bookingTimes';

describe('initializeTimes', () => {
  it("returns today's available times from the API", () => {
    const today = new Date(2030, 0, 15);
    const times = initializeTimes(today);
    expect(Array.isArray(times)).toBe(true);
    expect(times).toEqual(fetchAPI(today));
  });

  it('defaults to the current date', () => {
    expect(initializeTimes()).toEqual(fetchAPI(new Date()));
  });
});

describe('updateTimes', () => {
  it('returns the available times for the selected date', () => {
    const state = ['17:00'];
    const result = updateTimes(state, { type: UPDATE_TIMES, date: '2030-01-20' });
    expect(result).toEqual(fetchAPI(new Date(2030, 0, 20)));
  });

  it('returns an empty list when the date is cleared or invalid', () => {
    expect(updateTimes(['17:00'], { type: UPDATE_TIMES, date: '' })).toEqual([]);
    expect(updateTimes(['17:00'], { type: UPDATE_TIMES, date: '2030-02-31' })).toEqual([]);
  });

  it('returns the same state for unknown actions', () => {
    const state = ['17:00', '18:00'];
    expect(updateTimes(state, { type: 'UNKNOWN' })).toBe(state);
  });
});
