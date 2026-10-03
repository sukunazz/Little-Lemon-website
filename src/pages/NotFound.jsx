import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function NotFound() {
  useDocumentTitle('Page Not Found');
  return (
    <section className="container placeholder-page" aria-labelledby="notfound-heading">
      <h1 id="notfound-heading" className="section-title">Page not found</h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <Link to="/" className="btn btn--primary">
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;
