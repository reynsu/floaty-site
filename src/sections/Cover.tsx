import { FloaterActionsProvider, useFloaterActions } from 'floaty';

function CoverTease() {
  const { show } = useFloaterActions();
  return (
    <a
      href="#specimen"
      className="cover-tease"
      onClick={(e) => {
        e.preventDefault();
        show([
          { id: 'copy', label: 'Copy', onSelect: () => {} },
          { id: 'share', label: 'Share', onSelect: () => {} },
          { id: 'archive', label: 'Archive', onSelect: () => {} },
          { id: 'pin', label: 'Pin', onSelect: () => {} },
          { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
        ]);
      }}
    >
      ↗ Tap to summon
    </a>
  );
}

export function Cover() {
  return (
    <header className="masthead page" id="top">
      <div className="masthead-meta">
        <span className="smallcaps">Issue 01 · v0.1.0</span>
        <div className="masthead-meta-r">
          <span className="smallcaps">April · MMXXVI</span>
          <span className="smallcaps">reynsu / floaty</span>
        </div>
      </div>

      <h1 className="wordmark">
        Floaty<span className="dot">.</span>
      </h1>

      <p className="cover-tagline">
        A microscopic React toolbar for actions
        that <em>come</em> and <em>go</em>.
      </p>

      <div className="cover-foot">
        <code>$ npm i floaty</code>
        <div className="right">
          <FloaterActionsProvider maxVisible={3}>
            <CoverTease />
          </FloaterActionsProvider>
          <a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer">
            github
          </a>
          <a href="#field-guide">install</a>
        </div>
      </div>
    </header>
  );
}
