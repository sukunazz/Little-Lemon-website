import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitAPI } from '../api';
import BookingForm from '../components/BookingForm';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { initializeTimes, updateTimes } from '../utils/bookingTimes';
import { saveBooking } from '../utils/storage';

export const SUBMIT_ERROR_MESSAGE =
  'Sorry, we could not complete your reservation. Please try again or call us on (312) 555-0123.';

function BookingPage() {
  useDocumentTitle('Reserve a Table');
  const navigate = useNavigate();
  const [availableTimes, dispatch] = useReducer(updateTimes, undefined, () => initializeTimes());
  const [submitError, setSubmitError] = useState('');

  const submitForm = (formData) => {
    let accepted = false;
    try {
      accepted = submitAPI(formData);
    } catch {
      accepted = false;
    }

    if (!accepted) {
      setSubmitError(SUBMIT_ERROR_MESSAGE);
      return false;
    }

    setSubmitError('');
    saveBooking(formData);
    navigate('/confirmed', { state: { booking: formData } });
    return true;
  };

  return (
    <section className="booking-page" aria-labelledby="booking-heading">
      <div className="page-banner">
        <div className="container">
          <h1 id="booking-heading" className="display-title">Reserve a Table</h1>
          <p className="subtitle">Little Lemon, Chicago</p>
          <p className="page-banner__lead">Book online in under a minute. We hold tables for 15 minutes.</p>
        </div>
      </div>
      <div className="container booking-page__body">
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} submitError={submitError} />
      </div>
    </section>
  );
}

export default BookingPage;
