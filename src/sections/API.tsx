const provider = [
  { k: 'maxVisible', v: 'Visible buttons before overflow.', code: '3' },
  { k: 'portalContainer', v: 'Portal target.', code: 'document.body' },
  { k: 'className', v: 'Class on the bar — theming hook.', code: undefined },
  { k: 'closeOnOutsideClick', v: 'Pointerdown outside dismisses.', code: 'true' },
  { k: 'closeOnEscape', v: 'Escape dismisses.', code: 'true' },
];

const hook = [
  { k: 'show(actions, opts?)', v: 'Open the bar with the given action list.' },
  { k: 'hide()', v: 'Close (animation runs to completion).' },
  { k: 'toggle(actions?)', v: 'Toggle. Reuses last actions if omitted.' },
  { k: 'open', v: 'Boolean — current open state.' },
  { k: 'actions', v: 'FloaterAction[] currently shown.' },
];

export function API() {
  return (
    <section id="api">
      <div className="page">
        <div className="section-h">
          <div>
            <span className="kicker">API</span>
            <h2>One Provider, one hook.</h2>
          </div>
          <span className="section-h-meta">5 props · 5 members · ~8 KB</span>
        </div>

        <div className="api-grid">
          <div>
            <h3 className="api-block-h">
              <span>{'<FloaterActionsProvider />'}</span>
              <span className="meta">component</span>
            </h3>
            <div className="api-table">
              {provider.map((p) => (
                <div className="row" key={p.k}>
                  <div className="key">{p.k}</div>
                  <div className="val">
                    {p.v}
                    {p.code && (
                      <>
                        {' '}
                        Default <code>{p.code}</code>.
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="api-block-h">
              <span>useFloaterActions()</span>
              <span className="meta">hook</span>
            </h3>
            <div className="api-table">
              {hook.map((h) => (
                <div className="row" key={h.k}>
                  <div className="key">{h.k}</div>
                  <div className="val">{h.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
