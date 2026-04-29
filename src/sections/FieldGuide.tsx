const installCode = `$ npm i floaty`;

const wrapCode = `import { FloaterActionsProvider } from 'floaty';
import 'floaty/styles.css';

export function App() {
  return (
    <FloaterActionsProvider maxVisible={3}>
      <Routes />
    </FloaterActionsProvider>
  );
}`;

const showCode = `const { show } = useFloaterActions();

show([
  { id: 'copy',   label: 'Copy',   onSelect: copy   },
  { id: 'share',  label: 'Share',  onSelect: share  },
  { id: 'delete', label: 'Delete', variant: 'danger', onSelect: del },
]);`;

export function FieldGuide() {
  return (
    <section className="section page" id="field-guide">
      <div className="section-head">
        <span className="section-no">§ 05</span>
        <div>
          <h2 className="section-title">Field guide.</h2>
          <p className="section-blurb">
            Three steps from <em>npm install</em> to a bar that lifts on demand.
          </p>
        </div>
      </div>

      <div>
        <article className="field-step">
          <span className="field-num">i.</span>
          <div>
            <h3 className="field-title">Install the package.</h3>
            <p className="field-desc">
              No peer dependencies beyond React 18 and ReactDOM 18. The CSS
              file is shipped at a subpath so you can defer loading it if you
              prefer.
            </p>
            <pre className="code">{installCode}</pre>
          </div>
        </article>

        <article className="field-step">
          <span className="field-num">ii.</span>
          <div>
            <h3 className="field-title">Wrap once at the root.</h3>
            <p className="field-desc">
              The Provider mounts the bar exactly once. Place it near the top
              of your tree — typically in <code>App.tsx</code> or your route
              shell. Everything below can call <code>useFloaterActions()</code>.
            </p>
            <pre className="code">{wrapCode}</pre>
          </div>
        </article>

        <article className="field-step">
          <span className="field-num">iii.</span>
          <div>
            <h3 className="field-title">Summon, anywhere a hook can reach.</h3>
            <p className="field-desc">
              Pass an array of actions. Each action gets an{' '}
              <code>id</code>, a <code>label</code>, and an{' '}
              <code>onSelect</code>. Add{' '}
              <code>variant: 'danger'</code> for destructive ones.
            </p>
            <pre className="code">{showCode}</pre>
          </div>
        </article>
      </div>
    </section>
  );
}
