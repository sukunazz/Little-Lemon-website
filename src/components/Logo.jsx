/** Little Lemon logo: lemon mark + wordmark. Decorative mark is hidden from screen readers. */
function Logo({ variant = 'dark' }) {
  return (
    <span className={`logo logo--${variant}`}>
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <ellipse cx="32" cy="36" rx="22" ry="18" fill="#F4CE14" transform="rotate(-25 32 36)" />
        <path d="M40 14c4-8 12-9 16-8-2 6-8 11-16 8z" fill="#495E57" />
      </svg>
      <span className="logo__text">LITTLE LEMON</span>
    </span>
  );
}

export default Logo;
