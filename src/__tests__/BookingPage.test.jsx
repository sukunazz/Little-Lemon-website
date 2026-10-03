import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as api from '../api';
import App from '../App';
import { loadBookings } from '../utils/storage';

const renderAt = (path) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
  return userEvent.setup();
};

// Pick a date in the coming week that has times available, so the test does not depend on today's date.
const findBookableDate = () => {
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const times = api.fetchAPI(date);
    if (times.length) {
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return { iso, time: times[0] };
    }
  }
  throw new Error('No bookable date found');
};

const completeBooking = async (user) => {
  const { iso, time } = findBookableDate();
  await user.type(screen.getByLabelText(/full name/i), 'Ana Lopez');
  await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
  const date = screen.getByLabelText(/choose date/i);
  await user.clear(date);
  await user.type(date, iso);
  await user.selectOptions(screen.getByLabelText(/choose time/i), time);
  await user.click(screen.getByRole('button', { name: /make your reservation/i }));
  return { iso, time };
};

afterEach(() => vi.restoreAllMocks());

describe('Booking flow', () => {
  it('updates the time options when a new date is chosen', async () => {
    const user = renderAt('/booking');
    const { iso } = findBookableDate();
    const [y, m, d] = iso.split('-').map(Number);
    const expected = api.fetchAPI(new Date(y, m - 1, d));

    const date = screen.getByLabelText(/choose date/i);
    await user.clear(date);
    await user.type(date, iso);

    const options = screen.getAllByRole('option').map((o) => o.value).filter(Boolean);
    expect(options.filter((o) => o.includes(':'))).toEqual(expected);
  });

  it('confirms the booking, shows the details and saves it', async () => {
    const user = renderAt('/booking');
    const { time } = await completeBooking(user);

    expect(await screen.findByRole('heading', { name: /your table is booked/i })).toHaveFocus();
    expect(screen.getByText(time)).toBeInTheDocument();
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(loadBookings()).toHaveLength(1);
    expect(loadBookings()[0]).toMatchObject({ name: 'Ana Lopez', guests: 2, time });
  });

  it('shows an error and stays on the form when the API rejects the booking', async () => {
    vi.spyOn(api, 'submitAPI').mockReturnValue(false);
    const user = renderAt('/booking');
    await completeBooking(user);

    expect(screen.getByRole('alert')).toHaveTextContent(/could not complete your reservation/i);
    expect(screen.getByRole('heading', { name: /reserve a table/i, level: 1 })).toBeInTheDocument();
    expect(loadBookings()).toHaveLength(0);
  });
});
