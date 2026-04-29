const providerProps = [
  ['maxVisible', 'Visible buttons before overflow. Default 3.'],
  ['portalContainer', 'Portal target. Defaults to document.body.'],
  ['className', 'Extra class on the bar — use for theming.'],
  ['closeOnOutsideClick', 'Pointerdown outside dismisses. Default true.'],
  ['closeOnEscape', 'Escape dismisses. Default true.'],
];

const hookApi = [
  ['show(actions, opts?)', 'Open the bar with the given action list.'],
  ['hide()', 'Close the bar (animation runs to completion).'],
  ['toggle(actions?)', 'Toggle. Reuses last actions if not provided.'],
  ['open', 'boolean — current open state.'],
  ['actions', 'FloaterAction[] — currently shown.'],
];

export function API() {
  return (
    <section id="api">
      <div className="container">
        <span className="eyebrow">API</span>
        <h2 className="section-title">Tiny surface, full control.</h2>
        <p className="section-lead">
          One provider, one hook, one action shape. That's it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="api-grid">
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--fg-muted)' }}>
              &lt;FloaterActionsProvider /&gt;
            </h3>
            <div className="api-table">
              {providerProps.map(([k, v]) => (
                <div className="row" key={k}>
                  <div className="key">{k}</div>
                  <div className="val">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--fg-muted)' }}>
              useFloaterActions()
            </h3>
            <div className="api-table">
              {hookApi.map(([k, v]) => (
                <div className="row" key={k}>
                  <div className="key">{k}</div>
                  <div className="val">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 880px) {
            #api .api-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
