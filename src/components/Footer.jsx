import Logo from './Logo';
import Nav from './Nav';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Logo variant="light" />
          <p className="site-footer__tagline">Traditional Mediterranean recipes served with a modern twist.</p>
        </div>

        <section aria-labelledby="footer-nav-heading">
          <h2 id="footer-nav-heading" className="site-footer__heading">Navigation</h2>
          <Nav label="Footer" className="footer-nav" />
        </section>

        <section aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading" className="site-footer__heading">Contact</h2>
          <address>
            123 Lemon Street
            <br />
            Chicago, IL 60601
            <br />
            <a href="tel:+13125550123">(312) 555-0123</a>
            <br />
            <a href="mailto:hello@littlelemon.example">hello@littlelemon.example</a>
          </address>
        </section>

        <section aria-labelledby="footer-hours-heading">
          <h2 id="footer-hours-heading" className="site-footer__heading">Opening hours</h2>
          <p>
            Mon – Sun
            <br />
            5:00 pm – 11:30 pm
          </p>
        </section>
      </div>
      <p className="site-footer__copy">© {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
