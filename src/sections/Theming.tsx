import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

const themeActions: FloaterAction[] = [
  { id: 'a', label: 'Reply', onSelect: () => {} },
  { id: 'b', label: 'Forward', onSelect: () => {} },
  { id: 'c', label: 'Archive', onSelect: () => {} },
  { id: 'd', label: 'Delete', variant: 'danger', onSelect: () => {} },
];

function ThemeBtn({ klass, label }: { klass: string; label: string }) {
  const { show } = useFloaterActions();
  return (
    <button
      type="button"
      className={`theme-btn ${klass}`}
      onClick={() => show(themeActions)}
    >
      {label}
    </button>
  );
}

export function Theming() {
  return (
    <section id="theming">
      <div className="container">
        <span className="eyebrow">Theming</span>
        <h2 className="section-title">One component. Four skins. Zero JS.</h2>
        <p className="section-lead">
          Theming is just CSS custom properties. Swap a class on the Provider and the
          bar adapts — no theme provider, no context juggling, no extra runtime.
        </p>

        <div className="themes">
          <FloaterActionsProvider maxVisible={3}>
            <ThemeBtn klass="t-default" label="Default" />
          </FloaterActionsProvider>
          <FloaterActionsProvider maxVisible={3} className="theme-dark">
            <ThemeBtn klass="t-dark" label="Dark" />
          </FloaterActionsProvider>
          <FloaterActionsProvider maxVisible={3} className="theme-glass">
            <ThemeBtn klass="t-glass" label="Glass" />
          </FloaterActionsProvider>
          <FloaterActionsProvider maxVisible={3} className="theme-pill">
            <ThemeBtn klass="t-pill" label="Pill / dock" />
          </FloaterActionsProvider>
        </div>
      </div>
    </section>
  );
}
