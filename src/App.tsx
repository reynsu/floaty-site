import { Topbar } from './components/Topbar';
import { Hero } from './sections/Hero';
import { Examples } from './sections/Examples';
import { Customization } from './sections/Customization';
import { API } from './sections/API';
import { Footer } from './sections/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';

export function App() {
  useScrollReveal();
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <Examples />
        <Customization />
        <API />
        <Footer />
      </main>
    </>
  );
}
