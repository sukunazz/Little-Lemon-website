/**
 * Mock booking API.
 *
 * This is a local copy of the API script provided by the Meta capstone course
 * (https://raw.githubusercontent.com/courseraap/capstone/main/api.js), bundled
 * as an ES module so the app works offline and can be unit tested.
 *
 * Available times are generated from a seeded random number generator, so the
 * same day of the month always returns the same list of times.
 */

const seededRandom = (seed) => {
  const m = 2 ** 35 - 31;
  const a = 185852;
  let s = seed % m;
  return () => (s = (s * a) % m) / m;
};

/**
 * Returns the available booking times (17:00–23:30) for the given date.
 * @param {Date} date
 * @returns {string[]} e.g. ["17:00", "18:30", ...]
 */
export const fetchAPI = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const result = [];
  const random = seededRandom(date.getDate());

  for (let hour = 17; hour <= 23; hour++) {
    if (random() < 0.5) result.push(`${hour}:00`);
    if (random() < 0.5) result.push(`${hour}:30`);
  }
  return result;
};

/**
 * Submits a booking. The mock API accepts any booking that has data.
 * @param {object} formData
 * @returns {boolean} true when the booking was accepted
 */
export const submitAPI = (formData) => Boolean(formData);
