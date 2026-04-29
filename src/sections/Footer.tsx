export function Footer() {
  return (
    <footer className="page foot">
      <div className="foot-l">
        <span style={{ color: 'var(--fg)', fontWeight: 600, fontFamily: 'var(--sans)' }}>
          floaty<span style={{ color: 'var(--acc)' }}>/</span>
        </span>
        <span>v0.1.0</span>
        <span>MIT</span>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer">github</a>
        <a href="https://www.npmjs.com/package/floaty" target="_blank" rel="noreferrer">npm</a>
        <a href="https://github.com/reynsu/floaty/issues" target="_blank" rel="noreferrer">issues</a>
        <a href="#top">top ↑</a>
      </div>
    </footer>
  );
}
