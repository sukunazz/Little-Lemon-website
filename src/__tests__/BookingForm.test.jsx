import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BookingForm from '../components/BookingForm';
import { UPDATE_TIMES } from '../utils/bookingTimes';

const NOW = new Date(2030, 0, 15);
const TIMES = ['17:00', '18:30', '20:00'];

const renderForm = (props = {}) => {
  const dispatch = vi.fn();
  const submitForm = vi.fn();
  render(<BookingForm availableTimes={TIMES} dispatch={dispatch} submitForm={submitForm} now={NOW} {...props} />);
  return { dispatch, submitForm, user: userEvent.setup() };
};

const fillValidForm = async (user) => {
  await user.type(screen.getByLabelText(/full name/i), 'Ana Lopez');
  await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
  await user.selectOptions(screen.getByLabelText(/choose time/i), '18:30');
  await user.clear(screen.getByLabelText(/number of guests/i));
  await user.type(screen.getByLabelText(/number of guests/i), '4');
  await user.selectOptions(screen.getByLabelText(/occasion/i), 'Anniversary');
};

describe('BookingForm', () => {
  it('renders every field with an accessible label', () => {
    renderForm();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeInTheDocument();
  });

  it('applies HTML5 validation attributes', () => {
    renderForm();
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('minLength', '2');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/email/i)).toBeRequired();

    const date = screen.getByLabelText(/choose date/i);
    expect(date).toHaveAttribute('type', 'date');
    expect(date).toHaveAttribute('min', '2030-01-15');
    expect(date).toHaveAttribute('max', '2030-04-15');
    expect(date).toBeRequired();

    const guests = screen.getByLabelText(/number of guests/i);
    expect(guests).toHaveAttribute('type', 'number');
    expect(guests).toHaveAttribute('min', '1');
    expect(guests).toHaveAttribute('max', '10');
    expect(guests).toBeRequired();

    expect(screen.getByLabelText(/choose time/i)).toBeRequired();
    expect(screen.getByLabelText(/special requests/i)).toHaveAttribute('maxLength', '200');
  });

  it('defaults the date to today and lists the available times', () => {
    renderForm();
    expect(screen.getByLabelText(/choose date/i)).toHaveValue('2030-01-15');
    TIMES.forEach((time) => expect(screen.getByRole('option', { name: time })).toBeInTheDocument());
  });

  it('dispatches UPDATE_TIMES when the date changes', async () => {
    const { dispatch, user } = renderForm();
    const date = screen.getByLabelText(/choose date/i);
    await user.clear(date);
    await user.type(date, '2030-01-20');
    expect(dispatch).toHaveBeenLastCalledWith({ type: UPDATE_TIMES, date: '2030-01-20' });
  });

  it('disables the submit button until the form is valid', async () => {
    const { user } = renderForm();
    const submit = screen.getByRole('button', { name: /make your reservation/i });
    expect(submit).toBeDisabled();
    await fillValidForm(user);
    expect(submit).toBeEnabled();
  });

  it('submits the trimmed booking data', async () => {
    const { submitForm, user } = renderForm();
    await fillValidForm(user);
    await user.type(screen.getByLabelText(/special requests/i), '  Window seat  ');
    await user.click(screen.getByRole('button', { name: /make your reservation/i }));

    expect(submitForm).toHaveBeenCalledTimes(1);
    expect(submitForm).toHaveBeenCalledWith({
      name: 'Ana Lopez',
      email: 'ana@example.com',
      date: '2030-01-15',
      time: '18:30',
      guests: 4,
      occasion: 'Anniversary',
      requests: 'Window seat',
    });
  });

  it('does not show errors before the user interacts with a field', () => {
    renderForm();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error and marks the field invalid after leaving it empty', async () => {
    const { user } = renderForm();
    const name = screen.getByLabelText(/full name/i);
    await user.click(name);
    await user.tab();

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription('Please enter your name.');
  });

  it('shows meaningful messages for out of range values', async () => {
    const { user } = renderForm();
    const guests = screen.getByLabelText(/number of guests/i);
    await user.clear(guests);
    await user.type(guests, '12');
    expect(screen.getByText(/we can seat up to 10 guests online/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.tab();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('rejects a date in the past', async () => {
    const { user } = renderForm();
    const date = screen.getByLabelText(/choose date/i);
    await user.clear(date);
    await user.type(date, '2030-01-01');
    expect(screen.getByText('The date cannot be in the past.')).toBeInTheDocument();
  });

  it('tells the user when no times are available', () => {
    renderForm({ availableTimes: [] });
    expect(screen.getByLabelText(/choose time/i)).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/no tables left on this date/i);
  });

  it('shows a submission error passed from the page', () => {
    renderForm({ submitError: 'Something went wrong' });
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });
});
