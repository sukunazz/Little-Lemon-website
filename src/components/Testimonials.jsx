import { TESTIMONIALS } from '../data';

function Stars({ rating }) {
  return (
    <p className="stars" aria-label={`Rated ${rating} out of 5`}>
      <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
    </p>
  );
}

function Testimonials() {
  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="section-title section-title--center">Testimonials</h2>
        <ul className="testimonials__grid">
          {TESTIMONIALS.map(({ id, name, rating, review }) => (
            <li key={id} className="testimonial">
              <figure>
                <Stars rating={rating} />
                <blockquote>
                  <p>“{review}”</p>
                </blockquote>
                <figcaption className="testimonial__name">{name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Testimonials;
