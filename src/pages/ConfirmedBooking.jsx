import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatLongDate } from '../utils/date';

function ConfirmedBooking() {
  useDocumentTitle('Booking Confirmed');
  const headingRef = useRef(null);
  const booking = useLocation().state?.booking;

  // Move focus to the heading so screen readers announce the result straight away.
  useEffect(() => headingRef.current?.focus(), []);

  if (!booking) {
    return (
      <section className="container confirmation" aria-labelledby="confirmation-heading">
        <h1 id="confirmation-heading" ref={headingRef} tabIndex={-1} className="section-title">
          No reservation found
        </h1>
        <p>We couldn't find a reservation to show. You may have refreshed the page or opened this link directly.</p>
        <Link to="/booking" className="btn btn--primary">
          Reserve a Table
        </Link>
      </section>
    );
  }

  return (
    <section className="container confirmation" aria-labelledby="confirmation-heading">
      <p className="confirmation__icon" aria-hidden="true">✓</p>
      <h1 id="confirmation-heading" ref={headingRef} tabIndex={-1} className="section-title">
        Your table is booked!
      </h1>
      <p>
        Thank you, {booking.name}. A confirmation has been sent to <strong>{booking.email}</strong>.
      </p>
      <dl className="confirmation__details">
        <div>
          <dt>Date</dt>
          <dd>{formatLongDate(booking.date)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{booking.time}</dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{booking.guests}</dd>
        </div>
        <div>
          <dt>Occasion</dt>
          <dd>{booking.occasion}</dd>
        </div>
        {booking.requests && (
          <div>
            <dt>Special requests</dt>
            <dd>{booking.requests}</dd>
          </div>
        )}
      </dl>
      <Link to="/" className="btn btn--primary">
        Back to Home
      </Link>
    </section>
  );
}

export default ConfirmedBooking;
