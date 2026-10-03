import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

const renderAt = (path = '/') => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
  return userEvent.setup();
};

describe('App', () => {
  it('renders the home page sections with semantic landmarks', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Little Lemon' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /this week's specials/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /testimonials/i })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('gives every image alternative text', () => {
    renderAt('/');
    screen.getAllByRole('img').forEach((img) => {
      expect(img).toHaveAccessibleName();
    });
  });

  it('has a skip link to the main content', () => {
    renderAt('/');
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
  });

  it('navigates to the booking page from the hero button', async () => {
    const user = renderAt('/');
    await user.click(screen.getByRole('link', { name: /reserve a table/i }));
    expect(screen.getByRole('heading', { level: 1, name: /reserve a table/i })).toBeInTheDocument();
    expect(document.title).toBe('Reserve a Table | Little Lemon');
  });

  it('toggles the mobile menu and reports its state to assistive tech', async () => {
    const user = renderAt('/');
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'main-nav');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('Close menu');

    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks only the home link as current on the home page', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const current = within(nav).getAllByRole('link').filter((a) => a.getAttribute('aria-current') === 'page');
    expect(current.map((a) => a.textContent)).toEqual(['Home']);
  });

  it('marks the current page in the main navigation', () => {
    renderAt('/booking');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Reservations' })).toHaveAttribute('aria-current', 'page');
  });

  it('handles a direct visit to the confirmation page', () => {
    renderAt('/confirmed');
    expect(screen.getByRole('heading', { name: /no reservation found/i })).toBeInTheDocument();
  });

  it('shows a not found page for unknown routes', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });
});
