import About from '../components/About';
import Hero from '../components/Hero';
import Specials from '../components/Specials';
import Testimonials from '../components/Testimonials';
import useDocumentTitle from '../hooks/useDocumentTitle';

function HomePage() {
  useDocumentTitle('');
  return (
    <>
      <Hero />
      <Specials />
      <Testimonials />
      <About />
    </>
  );
}

export default HomePage;
