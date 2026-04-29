export function Footer() {
  return (
    <footer className="page foot">
      <div className="foot-l">
        <span className="foot-brand">
          floaty<span className="foot-slash">/</span>
        </span>
        <span>v0.1.0</span>
        <span>MIT</span>
      </div>
      <nav className="foot-r" aria-label="Footer">
        <a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer">github</a>
        <a href="https://www.npmjs.com/package/floaty" target="_blank" rel="noreferrer">npm</a>
        <a href="https://github.com/reynsu/floaty/issues" target="_blank" rel="noreferrer">issues</a>
        <a href="#top">
          back to top <span aria-hidden="true">↑</span>
        </a>
      </nav>
    </footer>
  );
}
