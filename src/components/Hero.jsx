import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 id="hero-heading" className="display-title">Little Lemon</h1>
          <p className="subtitle">Chicago</p>
          <p className="hero__lead">
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </p>
          <Link to="/booking" className="btn btn--primary">
            Reserve a Table
          </Link>
        </div>
        <img
          className="hero__image"
          src="/images/hero-food.jpg"
          alt="A plated Mediterranean dish served at a Little Lemon table"
          width="800"
          height="533"
        />
      </div>
    </section>
  );
}

export default Hero;
