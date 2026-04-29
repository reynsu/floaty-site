import { useState } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'floaty';
import { Code } from '../components/Code';

const heroSnippet = `import { FloaterActionsProvider, useFloaterActions } from 'floaty';
import 'floaty/styles.css';

function Page() {
  const { show } = useFloaterActions();
  return (
    <button onClick={() => show([
      { id: 'copy',   label: 'Copy',   onSelect: copy   },
      { id: 'share',  label: 'Share',  onSelect: share  },
      { id: 'delete', label: 'Delete', variant: 'danger', onSelect: del },
    ])}>
      Open actions
    </button>
  );
}`;

function HeroTrigger() {
  const { show } = useFloaterActions();
  return (
    <button
      type="button"
      className="demo-trigger"
      onClick={() =>
        show([
          { id: 'copy', label: 'Copy', onSelect: () => {} },
          { id: 'share', label: 'Share', onSelect: () => {} },
          { id: 'archive', label: 'Archive', onSelect: () => {} },
          { id: 'pin', label: 'Pin', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
        ])
      }
    >
      <span>Tap to summon the bar</span>
      <span aria-hidden style={{ opacity: 0.6 }}>↗</span>
    </button>
  );
}

function CopyableInstall() {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText('npm i floaty').then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <span className="install-pill">
      <span style={{ opacity: 0.5 }}>$</span> npm i floaty
      <button type="button" className="copy-btn" onClick={onCopy} aria-label="Copy">
        {copied ? '✓' : '⧉'}
      </button>
    </span>
  );
}

export function Hero() {
  const [tab, setTab] = useState<'demo' | 'code'>('demo');

  return (
    <section className="hero" id="top">
      <div className="page">
        <span className="kicker">v0.1.0 — public beta</span>

        <div className="hero-grid" style={{ marginTop: 20 }}>
          <div>
            <h1>
              Floating actions<span className="slash">.</span>
              <br />
              For React<span className="slash">.</span>
            </h1>
            <p className="hero-sub">
              A microscopic toolbar that lifts on demand and dismisses on outside-click.
              Mobile-first, fully themable, ~8 KB ESM, zero runtime deps.
            </p>

            <div className="hero-meta">
              <span><b>~8 KB</b> ESM gzipped</span>
              <span><b>0</b> runtime deps</span>
              <span><b>React</b> 18+</span>
              <span><b>SSR</b> safe</span>
            </div>

            <div className="hero-cta">
              <CopyableInstall />
              <a
                href="https://github.com/reynsu/floaty"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                View on GitHub
                <span aria-hidden style={{ opacity: 0.6 }}>↗</span>
              </a>
            </div>

            <div className="specs-strip">
              <span className="spec-item"><span className="dot" /> <b>useSyncExternalStore</b></span>
              <span className="spec-item"><span className="dot" /> <b>portal</b> to body</span>
              <span className="spec-item"><span className="dot" /> <b>aria-toolbar</b></span>
              <span className="spec-item"><span className="dot" /> <b>esc</b> + <b>outside-click</b></span>
              <span className="spec-item"><span className="dot" /> CSS-only animations</span>
            </div>
          </div>
        </div>

        <div className="hero-demo">
          <div className="hero-demo-tabs">
            <div className="tabs">
              <button
                type="button"
                className="tab"
                aria-selected={tab === 'demo'}
                onClick={() => setTab('demo')}
              >
                Demo <span className="num">↑</span>
              </button>
              <button
                type="button"
                className="tab"
                aria-selected={tab === 'code'}
                onClick={() => setTab('code')}
              >
                Code <span className="num">{`{ }`}</span>
              </button>
            </div>
          </div>
          {tab === 'demo' ? (
            <div className="hero-demo-stage">
              <FloaterActionsProvider maxVisible={3}>
                <HeroTrigger />
              </FloaterActionsProvider>
            </div>
          ) : (
            <Code code={heroSnippet} />
          )}
        </div>
      </div>
    </section>
  );
}
