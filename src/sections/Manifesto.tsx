export function Manifesto() {
  return (
    <section className="section page" id="manifesto">
      <div className="section-head">
        <span className="section-no">§ 01</span>
        <div>
          <h2 className="section-title">Editor's note.</h2>
          <p className="section-blurb">
            A short manifesto on why a tiny floating bar deserves a name of its own.
          </p>
        </div>
      </div>

      <div className="manifesto-body">
        <aside className="manifesto-marg">
          <div>R. — April 2026</div>
          <div>Madrid · Lisbon · Web</div>
          <div>~3 min read</div>
        </aside>

        <div className="manifesto-prose">
          <p className="first">
            Thousand-line state-management libraries are not the answer. Neither
            are render-prop kludges that require three Providers and a custom
            hook just to show four buttons that fade in from the bottom of the
            screen.
          </p>
          <p>
            We have been writing the same selection toolbar for years in
            slightly different shapes — sometimes called a <em>FAB</em>, sometimes a
            selection-mode bar, sometimes a command palette, sometimes a
            contextual menu. Every codebase reinvents it. Every reinvention
            arrives buggy: outside-clicks dismiss too eagerly, overflow menus
            get stuck open, animations stutter, accessibility is bolted on
            after launch.
          </p>
          <p>
            <em>Floaty</em> is the smallest possible thing that solves all of these,
            once. One Provider. One hook. One <code>show(actions)</code>. The
            bar slides up from the bottom edge — exactly where the user's
            thumb lands on a phone, exactly where a <kbd>⌘K</kbd> palette
            belongs on a laptop. It dismisses on outside click and on Escape.
            It animates without a 60 KB animation library. It themes through
            a handful of CSS custom properties, not a context provider.
          </p>
          <p>
            That is the entire idea. The rest of this issue is a specimen
            sheet, three dispatches from real interfaces, a spec sheet, and a
            field guide for installing it.
          </p>
          <p className="manifesto-sign">— R.</p>
        </div>
      </div>
    </section>
  );
}
