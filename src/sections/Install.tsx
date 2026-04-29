import { Code } from '../components/Code';

const installCode = `# 1. Install
npm i floaty

# 2. Wrap once at the root
import { FloaterActionsProvider } from 'floaty';
import 'floaty/styles.css';

export function App() {
  return (
    <FloaterActionsProvider maxVisible={3}>
      <Routes />
    </FloaterActionsProvider>
  );
}

# 3. Show the bar from anywhere
const { show } = useFloaterActions();
show([
  { id: 'copy',   label: 'Copy',   onSelect: copy   },
  { id: 'share',  label: 'Share',  onSelect: share  },
  { id: 'delete', label: 'Delete', variant: 'danger', onSelect: del },
]);`;

export function Install() {
  return (
    <section id="install">
      <div className="page">
        <div className="section-h">
          <div>
            <span className="kicker">Install</span>
            <h2 style={{ marginTop: 10 }}>From zero to running in three lines.</h2>
          </div>
          <span className="section-h-meta">React 18+ · ESM + CJS · TypeScript types included</span>
        </div>

        <Code code={installCode} />
      </div>
    </section>
  );
}
