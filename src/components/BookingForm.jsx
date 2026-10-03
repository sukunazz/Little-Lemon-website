import { useEffect, useState } from 'react';
import { UPDATE_TIMES } from '../utils/bookingTimes';
import { addDays, toISODate } from '../utils/date';
import {
  MAX_BOOKING_DAYS_AHEAD,
  MAX_GUESTS,
  MAX_REQUEST_LENGTH,
  MIN_GUESTS,
  OCCASIONS,
  validateBooking,
} from '../utils/validation';

const getInitialValues = (now) => ({
  name: '',
  email: '',
  date: toISODate(now),
  time: '',
  guests: '2',
  occasion: 'None',
  requests: '',
});

/**
 * Table reservation form.
 *
 * Validation runs on every render; an error is only shown once the user has
 * left (blurred) or changed a field, so people are not greeted by a wall of red.
 * The submit button stays disabled until every field is valid.
 *
 * @param {string[]} availableTimes - times for the selected date (from the reducer)
 * @param {Function} dispatch - availableTimes reducer dispatch
 * @param {Function} submitForm - called with the booking data when the form is valid
 * @param {string} [submitError] - message to show if the API rejects the booking
 * @param {Date} [now] - injectable "today", used by tests
 */
function BookingForm({ availableTimes, dispatch, submitForm, submitError = '', now = new Date() }) {
  const [values, setValues] = useState(() => getInitialValues(now));
  const [touched, setTouched] = useState({});

  const errors = validateBooking(values, availableTimes, now);
  const isValid = Object.keys(errors).length === 0;
  const today = toISODate(now);
  const lastBookableDay = toISODate(addDays(now, MAX_BOOKING_DAYS_AHEAD));

  // If the chosen time disappears after the date changes, clear it.
  useEffect(() => {
    if (values.time && !availableTimes.includes(values.time)) {
      setValues((v) => ({ ...v, time: '' }));
    }
  }, [availableTimes, values.time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
    if (name === 'date') {
      dispatch({ type: UPDATE_TIMES, date: value });
    }
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      // Reveal every error, e.g. if the form was submitted with the Enter key.
      setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));
      return;
    }
    submitForm({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      guests: Number(values.guests),
      requests: values.requests.trim(),
    });
  };

  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  /** Shared props that wire a control to its label, value and error message. */
  const fieldProps = (name, hintId) => {
    const error = errorFor(name);
    const describedBy = [hintId, error && `${name}-error`].filter(Boolean).join(' ');
    return {
      id: `res-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': error ? 'true' : 'false',
      'aria-describedby': describedBy || undefined,
    };
  };

  const renderError = (name) =>
    errorFor(name) ? (
      <p id={`${name}-error`} className="field__error" role="alert">
        {errorFor(name)}
      </p>
    ) : null;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate aria-label="Table reservation form">
      <p className="booking-form__note">
        Fields marked with <span aria-hidden="true">*</span>
        <span className="visually-hidden">an asterisk</span> are required.
      </p>

      <fieldset>
        <legend>Your details</legend>

        <div className="field">
          <label htmlFor="res-name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input type="text" autoComplete="name" required minLength={2} {...fieldProps('name')} />
          {renderError('name')}
        </div>

        <div className="field">
          <label htmlFor="res-email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input type="email" autoComplete="email" required {...fieldProps('email', 'email-hint')} />
          <p id="email-hint" className="field__hint">We'll send your confirmation here.</p>
          {renderError('email')}
        </div>
      </fieldset>

      <fieldset>
        <legend>Your reservation</legend>

        <div className="field-row">
          <div className="field">
            <label htmlFor="res-date">
              Choose date <span aria-hidden="true">*</span>
            </label>
            <input type="date" required min={today} max={lastBookableDay} {...fieldProps('date')} />
            {renderError('date')}
          </div>

          <div className="field">
            <label htmlFor="res-time">
              Choose time <span aria-hidden="true">*</span>
            </label>
            <select required disabled={availableTimes.length === 0} {...fieldProps('time')}>
              <option value="" disabled>
                {availableTimes.length ? 'Select a time' : 'No times available'}
              </option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {renderError('time')}
            {/* The time error is only shown after interaction, but "fully booked" should always be visible. */}
            {!touched.time && availableTimes.length === 0 && !errors.date && (
              <p className="field__error" role="status">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="res-guests">
              Number of guests <span aria-hidden="true">*</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              required
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              step="1"
              {...fieldProps('guests', 'guests-hint')}
            />
            <p id="guests-hint" className="field__hint">
              {MIN_GUESTS}–{MAX_GUESTS} guests
            </p>
            {renderError('guests')}
          </div>

          <div className="field">
            <label htmlFor="res-occasion">Occasion</label>
            <select {...fieldProps('occasion')}>
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
            {renderError('occasion')}
          </div>
        </div>

        <div className="field">
          <label htmlFor="res-requests">Special requests (optional)</label>
          <textarea rows="3" maxLength={MAX_REQUEST_LENGTH} {...fieldProps('requests', 'requests-hint')} />
          <p id="requests-hint" className="field__hint">
            {values.requests.length}/{MAX_REQUEST_LENGTH} characters, e.g. allergies or high chair
          </p>
          {renderError('requests')}
        </div>
      </fieldset>

      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--block"
        disabled={!isValid}
        aria-describedby={!isValid ? 'submit-hint' : undefined}
      >
        Make Your Reservation
      </button>
      {!isValid && (
        <p id="submit-hint" className="field__hint field__hint--center">
          Complete all required fields to make your reservation.
        </p>
      )}
    </form>
  );
}

export default BookingForm;
