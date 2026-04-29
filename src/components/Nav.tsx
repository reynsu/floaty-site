export function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#top" className="nav-logo">
          <Logo />
          floaty
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#mobile">Mobile</a>
          <a href="#desktop">Desktop</a>
          <a href="#install">Install</a>
          <a
            href="https://github.com/reynsu/floaty"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            <GitHubIcon /> GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="3" y="20" width="26" height="9" rx="4.5" fill="url(#lg)" />
      <rect x="6" y="22.5" width="6" height="4" rx="2" fill="white" opacity="0.9" />
      <rect x="13" y="22.5" width="6" height="4" rx="2" fill="white" opacity="0.7" />
      <rect x="20" y="22.5" width="6" height="4" rx="2" fill="white" opacity="0.5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}
