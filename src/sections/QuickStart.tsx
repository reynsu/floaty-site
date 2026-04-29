import { CodeBlock } from '../components/CodeBlock';

export function QuickStart() {
  return (
    <section id="install">
      <div className="container">
        <span className="eyebrow">Quick start</span>
        <h2 className="section-title">Drop in. Show. Done.</h2>
        <p className="section-lead">
          Wrap your app in a Provider once. Call <code>show(actions)</code> anywhere
          a hook can reach.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <CodeBlock>
{`# Install
$ npm i floaty`}
          </CodeBlock>

          <CodeBlock>
{`import { FloaterActionsProvider, useFloaterActions } from 'floaty';
import 'floaty/styles.css';

function App() {
  return (
    <FloaterActionsProvider maxVisible={3}>
      <Page />
    </FloaterActionsProvider>
  );
}

function Page() {
  const { show } = useFloaterActions();
  return (
    <button onClick={() => show([
      { id: 'copy',   label: 'Copy',   onSelect: () => {} },
      { id: 'share',  label: 'Share',  onSelect: () => {} },
      { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
    ])}>
      Open actions
    </button>
  );
}`}
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}
