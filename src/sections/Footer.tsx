export function Footer() {
  return (
    <footer>
      <div className="container">
        <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 16 }}>
          floaty
        </div>
        <div className="row">
          <a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/floaty" target="_blank" rel="noreferrer">npm</a>
          <a href="#install">Install</a>
          <a href="#api">API</a>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
          MIT © reynsu · Built with floaty itself
        </div>
      </div>
    </footer>
  );
}
