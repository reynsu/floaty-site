import { useEffect, useMemo, useState } from 'react';
import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

// ─────────── 1. Command palette (⌘K) ───────────
function CommandPaletteInner() {
  const { toggle } = useFloaterActions();

  const actions = useMemo<FloaterAction[]>(
    () => [
      { id: 'new', label: 'New file', onSelect: () => {} },
      { id: 'open', label: 'Open', onSelect: () => {} },
      { id: 'find', label: 'Find', onSelect: () => {} },
      { id: 'cmd', label: 'Run command', onSelect: () => {} },
      { id: 'theme', label: 'Toggle theme', onSelect: () => {} },
      { id: 'settings', label: 'Settings', onSelect: () => {} },
    ],
    [],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle(actions);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, actions]);

  const isMac =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="desktop">
      <div className="desktop-bar">
        <div className="desktop-dot r" />
        <div className="desktop-dot y" />
        <div className="desktop-dot g" />
      </div>
      <div className="desktop-content">
        <div className="editor-mini">
          <div className="ln"><span className="num">1</span><span><span style={{ color: '#c084fc' }}>function</span> <span style={{ color: '#60a5fa' }}>greet</span>(name) {`{`}</span></div>
          <div className="ln"><span className="num">2</span><span>  <span style={{ color: '#c084fc' }}>return</span> <span style={{ color: '#fcd34d' }}>`Hello, ${`{name}`}`</span>;</span></div>
          <div className="ln"><span className="num">3</span><span>{`}`}</span></div>
          <div className="ln"><span className="num">4</span><span /></div>
          <div className="ln"><span className="num">5</span><span><span style={{ color: '#c084fc' }}>const</span> msg = <span style={{ color: '#60a5fa' }}>greet</span>(<span style={{ color: '#fcd34d' }}>'world'</span>);</span></div>
          <div className="ln"><span className="num">6</span><span><span style={{ color: '#64748b' }}>// → "Hello, world"</span></span></div>
        </div>
        <div className="editor-hint">
          Press <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span> <span className="kbd">K</span> for the command palette
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 11 }}
            onClick={() => toggle(actions)}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── 2. Spreadsheet selection ───────────
function SheetInner() {
  const cells = [
    ['Name', 'Status', 'Priority', 'Owner'],
    ['Refactor auth', 'In review', 'High', 'Reyn'],
    ['Migrate to Vite', 'Done', 'Med', 'Sam'],
    ['Write demo', 'Backlog', 'Low', 'Reyn'],
    ['Publish v1', 'Blocked', 'High', 'Sam'],
  ];
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (selected.size === 0) {
      if (open) hide();
      return;
    }
    show(
      [
        { id: 'edit', label: 'Edit', onSelect: () => {} },
        { id: 'duplicate', label: 'Duplicate', onSelect: () => {} },
        {
          id: 'delete',
          label: `Delete (${selected.size})`,
          variant: 'danger',
          onSelect: () => setSelected(new Set()),
        },
        { id: 'export', label: 'Export', onSelect: () => {} },
        { id: 'archive', label: 'Archive', onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const toggle = (rowIdx: number) => {
    setSelected((p) => {
      const n = new Set(p);
      n.has(rowIdx) ? n.delete(rowIdx) : n.add(rowIdx);
      return n;
    });
  };

  return (
    <div className="desktop">
      <div className="desktop-bar">
        <div className="desktop-dot r" />
        <div className="desktop-dot y" />
        <div className="desktop-dot g" />
      </div>
      <div className="desktop-content">
        <div className="sheet-mini">
          {cells.flatMap((row, rIdx) =>
            row.map((c, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`cell ${rIdx === 0 ? 'head' : ''} ${
                  rIdx > 0 && selected.has(rIdx) ? 'selected' : ''
                }`}
                onClick={rIdx === 0 ? undefined : () => toggle(rIdx)}
              >
                {c}
              </div>
            )),
          )}
        </div>
        <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--fg-faint)', paddingTop: 12 }}>
          {selected.size > 0
            ? `${selected.size} row${selected.size === 1 ? '' : 's'} selected`
            : 'Click a row to select'}
        </div>
      </div>
    </div>
  );
}

// ─────────── Layout ───────────
export function Desktop() {
  return (
    <section id="desktop">
      <div className="container">
        <span className="eyebrow">On desktop</span>
        <h2 className="section-title">Command palettes and contextual rows.</h2>
        <p className="section-lead">
          Floaty isn't just for mobile. Wire it to a keyboard shortcut, anchor it to
          row selection, or use it as the universal "more actions" pattern across your app.
        </p>

        <div className="demo-grid">
          <div className="demo-card">
            <h3>Command palette</h3>
            <p className="demo-desc">
              Bind <code>⌘K</code> / <code>Ctrl+K</code> to <code>toggle()</code>.
              Three lines of code.
            </p>
            <div className="demo-stage">
              <FloaterActionsProvider maxVisible={3} className="theme-pill">
                <CommandPaletteInner />
              </FloaterActionsProvider>
            </div>
          </div>

          <div className="demo-card">
            <h3>Table selection</h3>
            <p className="demo-desc">
              Bulk operations on rows with destructive variants and live counts.
            </p>
            <div className="demo-stage">
              <FloaterActionsProvider maxVisible={3}>
                <SheetInner />
              </FloaterActionsProvider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
