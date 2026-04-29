import { useEffect, useState } from 'react';
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

const demoActions = [
  { id: 'copy', label: 'Copy', onSelect: () => {} },
  { id: 'share', label: 'Share', onSelect: () => {} },
  { id: 'archive', label: 'Archive', onSelect: () => {} },
  { id: 'pin', label: 'Pin', onSelect: () => {} },
  { id: 'delete', label: 'Delete', variant: 'danger' as const, onSelect: () => {} },
];

function HeroDemoStage() {
  const { show, open } = useFloaterActions();

  useEffect(() => {
    const t = window.setTimeout(() => show(demoActions), 1200);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <div className="hero-demo-stage">
      <div className="hero-demo-target" data-open={open}>
        <div className="hero-demo-target-label">↓ floaty</div>
        <div className="hero-demo-target-line" />
      </div>
      <button
        type="button"
        className="demo-trigger"
        onClick={() => show(demoActions)}
      >
        <span>{open ? 'Click again to re-summon' : 'Tap to summon the bar'}</span>
        <span aria-hidden style={{ opacity: 0.6 }}>↗</span>
      </button>
    </div>
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
        <div className="content">
          <span className="kicker">v0.1.0 · public beta</span>

          <h1>
            Floating actions<span className="slash">.</span>
            <br />
            For React<span className="slash">.</span>
          </h1>

          <p className="hero-prose">
            A <b>React 18</b> component for the toolbar that slides up when something is
            selected. Around <b>8 KB ESM</b> gzipped, with <b>zero runtime dependencies</b>,{' '}
            <b>SSR-safe</b> rendering, and the <b>WAI-ARIA toolbar</b> pattern wired in.
          </p>

          <div className="hero-cta">
            <CopyableInstall />
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
                Live <span className="num">↑</span>
              </button>
              <button
                type="button"
                className="tab"
                aria-selected={tab === 'code'}
                onClick={() => setTab('code')}
              >
                Source
              </button>
            </div>
          </div>
          {tab === 'demo' ? (
            <FloaterActionsProvider maxVisible={3}>
              <HeroDemoStage />
            </FloaterActionsProvider>
          ) : (
            <Code code={heroSnippet} />
          )}
        </div>
      </div>
    </section>
  );
}
