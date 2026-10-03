import { describe, expect, it, vi } from 'vitest';
import { loadBookings, saveBooking } from '../utils/storage';

describe('booking storage', () => {
  it('saves and loads bookings', () => {
    expect(loadBookings()).toEqual([]);
    expect(saveBooking({ name: 'Ana' })).toBe(true);
    expect(saveBooking({ name: 'Ben' })).toBe(true);
    expect(loadBookings()).toEqual([{ name: 'Ana' }, { name: 'Ben' }]);
  });

  it('recovers from corrupted data', () => {
    window.localStorage.setItem('little-lemon-bookings', '{not json');
    expect(loadBookings()).toEqual([]);
  });

  it('does not throw when storage is blocked', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(saveBooking({ name: 'Ana' })).toBe(false);
    spy.mockRestore();
  });
});
