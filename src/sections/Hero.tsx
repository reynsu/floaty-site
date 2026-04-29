import { useState } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'floaty';

function HeroBarTrigger() {
  const { show } = useFloaterActions();
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() =>
        show([
          { id: 'copy', label: 'Copy', onSelect: () => {} },
          { id: 'share', label: 'Share', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
          { id: 'archive', label: 'Archive', onSelect: () => {} },
          { id: 'pin', label: 'Pin', onSelect: () => {} },
        ])
      }
    >
      Tap to preview the bar →
    </button>
  );
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText('npm i floaty').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <header id="top" className="hero">
      <div className="container-narrow">
        <span className="eyebrow">v0.1.0 · React 18+</span>
        <h1>Floating actions, done right.</h1>
        <p className="hero-tagline">
          A 8 KB React toolbar that lifts on demand, dismisses gracefully, and themes
          itself out of your way. Mobile-first, zero runtime deps.
        </p>
        <div className="hero-actions">
          <a href="#install" className="btn btn-primary">Get started</a>
          <a
            href="https://github.com/reynsu/floaty"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            View on GitHub
          </a>
        </div>
        <div className="hero-install">
          <span style={{ color: 'var(--fg-faint)' }}>$</span>
          <code style={{ color: 'var(--fg)' }}>npm i floaty</code>
          <button className="copy" onClick={copy} type="button">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="hero-showcase container">
        <div className="hero-showcase-card">
          <span className="label">Live demo</span>
          <FloaterActionsProvider maxVisible={3}>
            <div className="hero-showcase-trigger">
              <HeroBarTrigger />
              <span style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
                Click outside or press <span className="kbd">Esc</span> to dismiss
              </span>
            </div>
          </FloaterActionsProvider>
        </div>
      </div>
    </header>
  );
}
