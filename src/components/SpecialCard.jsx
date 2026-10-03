import { Link } from 'react-router-dom';

const formatPrice = (price) => `$${price.toFixed(2)}`;

function SpecialCard({ id, title, price, image, description }) {
  const headingId = `special-${id}`;
  return (
    <article className="card" aria-labelledby={headingId}>
      <img className="card__image" src={image} alt={title} loading="lazy" width="800" height="533" />
      <div className="card__body">
        <div className="card__header">
          <h3 id={headingId} className="card__title">{title}</h3>
          <p className="card__price">
            <span className="visually-hidden">Price: </span>
            {formatPrice(price)}
          </p>
        </div>
        <p className="card__description">{description}</p>
        <Link to="/order-online" className="card__link" aria-label={`Order ${title} for delivery`}>
          Order a delivery <span aria-hidden="true">🛵</span>
        </Link>
      </div>
    </article>
  );
}

export default SpecialCard;
