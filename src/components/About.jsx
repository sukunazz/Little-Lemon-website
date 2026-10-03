function About() {
  return (
    <section id="about" className="about container" aria-labelledby="about-heading">
      <div className="about__text">
        <h2 id="about-heading" className="display-title display-title--dark">Little Lemon</h2>
        <p className="subtitle subtitle--dark">Chicago</p>
        <p>
          Little Lemon is owned by two Italian brothers, Mario and Adrian, who moved to the United States to pursue
          their shared dream of owning a restaurant.
        </p>
        <p>
          To craft the menu, Mario relies on family recipes and his experience as a chef in Italy. Adrian does all the
          marketing for the restaurant and led the effort to expand the menu beyond classic Italian to incorporate
          additional cuisines from the Mediterranean region.
        </p>
      </div>
      <div className="about__images">
        <img src="/images/chef.jpg" alt="A Little Lemon chef plating a dish in the kitchen" loading="lazy" width="534" height="800" />
        <img src="/images/restaurant.jpg" alt="The Little Lemon dining room" loading="lazy" width="800" height="533" />
      </div>
    </section>
  );
}

export default About;
