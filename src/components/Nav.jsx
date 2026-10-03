import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../data';

/**
 * Site navigation. Used in the header (collapsible on mobile) and the footer.
 * `onNavigate` lets the header close the mobile menu after a link is chosen.
 */
function Nav({ id, label = 'Main', className = '', onNavigate }) {
  return (
    <nav id={id} aria-label={label} className={className}>
      <ul>
        {NAV_LINKS.map(({ to, label: text }) => (
          <li key={to}>
            {/* Only the plain routes should get the "active" state; hash links point into the home page. */}
            <NavLink to={to} end onClick={onNavigate} className={({ isActive }) => (isActive && !to.includes('#') ? 'active' : undefined)}>
              {text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
