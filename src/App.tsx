import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Mobile } from './sections/Mobile';
import { Desktop } from './sections/Desktop';
import { Theming } from './sections/Theming';
import { QuickStart } from './sections/QuickStart';
import { API } from './sections/API';
import { Footer } from './sections/Footer';

export function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Mobile />
      <Desktop />
      <Theming />
      <QuickStart />
      <API />
      <Footer />
    </>
  );
}
