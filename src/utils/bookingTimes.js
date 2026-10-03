import { fetchAPI } from '../api';
import { parseISODate } from './date';

export const UPDATE_TIMES = 'UPDATE_TIMES';

/** Initial state for the availableTimes reducer: today's available times. */
export const initializeTimes = (today = new Date()) => fetchAPI(today);

/**
 * Reducer for availableTimes.
 * Dispatch `{ type: UPDATE_TIMES, date: 'YYYY-MM-DD' }` when the selected date changes.
 */
export const updateTimes = (state, action) => {
  switch (action.type) {
    case UPDATE_TIMES: {
      const date = parseISODate(action.date);
      // An invalid or cleared date has no bookable times.
      return date ? fetchAPI(date) : [];
    }
    default:
      return state;
  }
};
