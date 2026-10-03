import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

/** Placeholder for pages outside the scope of this project (online ordering, login). */
function ComingSoon({ title }) {
  useDocumentTitle(title);
  return (
    <section className="container placeholder-page" aria-labelledby="placeholder-heading">
      <h1 id="placeholder-heading" className="section-title">{title}</h1>
      <p>This page is coming soon. In the meantime, you can reserve a table online.</p>
      <Link to="/booking" className="btn btn--primary">
        Reserve a Table
      </Link>
    </section>
  );
}

export default ComingSoon;
