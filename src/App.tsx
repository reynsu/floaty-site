import { Topbar } from './components/Topbar';
import { Hero } from './sections/Hero';
import { Examples } from './sections/Examples';
import { Customization } from './sections/Customization';
import { API } from './sections/API';
import { Footer } from './sections/Footer';

export function App() {
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
