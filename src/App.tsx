import { Cover } from './sections/Cover';
import { Manifesto } from './sections/Manifesto';
import { Specimen } from './sections/Specimen';
import { InUse } from './sections/InUse';
import { Specifications } from './sections/Specifications';
import { FieldGuide } from './sections/FieldGuide';
import { Colophon } from './sections/Colophon';

export function App() {
  return (
    <main>
      <Cover />
      <Manifesto />
      <Specimen />
      <InUse />
      <Specifications />
      <FieldGuide />
      <Colophon />
    </main>
  );
}
