import { Link, NavLink } from 'react-router-dom';
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
            {/* Section links (/#about) point into the home page, so they must not get aria-current="page". */}
            {to.includes('#') ? (
              <Link to={to} onClick={onNavigate}>
                {text}
              </Link>
            ) : (
              <NavLink to={to} end onClick={onNavigate}>
                {text}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
