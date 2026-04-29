import { useEffect, useState } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'react-floaty';
import { Code } from '../components/Code';

const heroSnippet = `import { FloaterActionsProvider, useFloaterActions } from 'react-floaty';
import 'react-floaty/styles.css';

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
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const t = window.setTimeout(() => show(demoActions), 1200);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <div className="hero-demo-stage">
      <div className="hero-demo-target" data-open={open} aria-hidden="true">
        <div className="hero-demo-target-label">↓ react-floaty</div>
        <div className="hero-demo-target-line" />
      </div>
      <button
        type="button"
        className="demo-trigger"
        onClick={() => show(demoActions)}
      >
        <span>{open ? 'Click again to re-summon' : 'Tap to summon the bar'}</span>
        <span aria-hidden="true" className="demo-trigger-arrow">↗</span>
      </button>
    </div>
  );
}

export default function HeroDemo() {
  const [tab, setTab] = useState<'demo' | 'code'>('demo');
  return (
    <>
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
    </>
  );
}
