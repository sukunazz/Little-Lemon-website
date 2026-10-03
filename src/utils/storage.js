const STORAGE_KEY = 'little-lemon-bookings';

/** Reads saved bookings. Returns [] if storage is unavailable or corrupted. */
export const loadBookings = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Appends a booking to localStorage. Returns false (without throwing) if the
 * browser blocks storage, e.g. in some private browsing modes.
 */
export const saveBooking = (booking) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...loadBookings(), booking]));
    return true;
  } catch {
    return false;
  }
};
