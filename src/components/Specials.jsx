import { Link } from 'react-router-dom';
import { SPECIALS } from '../data';
import SpecialCard from './SpecialCard';

function Specials() {
  return (
    <section id="menu" className="specials container" aria-labelledby="specials-heading">
      <div className="specials__header">
        <h2 id="specials-heading" className="section-title">This week's specials!</h2>
        <Link to="/order-online" className="btn btn--primary">
          Online Menu
        </Link>
      </div>
      <div className="specials__grid">
        {SPECIALS.map((special) => (
          <SpecialCard key={special.id} {...special} />
        ))}
      </div>
    </section>
  );
}

export default Specials;
