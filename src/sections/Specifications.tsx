const providerProps = [
  ['maxVisible', 'Visible buttons before overflow. Default ', '3'],
  ['portalContainer', 'Portal target. Defaults to ', 'document.body'],
  ['className', 'Class applied to the bar. Theming hook.', null],
  ['closeOnOutsideClick', 'Pointerdown outside dismisses. Default ', 'true'],
  ['closeOnEscape', 'Escape dismisses. Default ', 'true'],
] as const;

const hookApi = [
  ['show(actions, opts?)', 'Open the bar with the given action list.', null],
  ['hide()', 'Close (animation runs to completion).', null],
  ['toggle(actions?)', 'Toggle. Reuses last actions if omitted.', null],
  ['open', 'Boolean — current open state.', null],
  ['actions', 'FloaterAction[] — currently shown.', null],
] as const;

export function Specifications() {
  return (
    <section className="section page" id="specs">
      <div className="section-head">
        <span className="section-no">§ 04</span>
        <div>
          <h2 className="section-title">Specifications.</h2>
          <p className="section-blurb">
            One Provider, one hook, one action shape. The full surface fits on
            a page.
          </p>
        </div>
      </div>

      <div className="spec-grid">
        <div>
          <h3 className="spec-block-title">
            <span>FloaterActionsProvider</span>
            <span className="smallcaps">component · 5 props</span>
          </h3>
          <div className="spec-table">
            {providerProps.map(([k, v, c]) => (
              <div className="row" key={k}>
                <div className="key">{k}</div>
                <div className="val">
                  {v}
                  {c && <code>{c}</code>}
                  {c ? '.' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="spec-block-title">
            <span><em>useFloaterActions()</em></span>
            <span className="smallcaps">hook · 5 members</span>
          </h3>
          <div className="spec-table">
            {hookApi.map(([k, v]) => (
              <div className="row" key={k}>
                <div className="key">{k}</div>
                <div className="val">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
