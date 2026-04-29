import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';
import { Code } from '../components/Code';

// ──────────────────────────────────────────────────────────
//  ExampleCard — wrapper with Demo/Code tabs
// ──────────────────────────────────────────────────────────
type ExampleCardProps = {
  no: string;
  name: string;
  desc: string;
  demo: ReactNode;
  code: string;
  hint?: string;
};

function ExampleCard({ no, name, desc, demo, code, hint }: ExampleCardProps) {
  const [tab, setTab] = useState<'demo' | 'code'>('demo');
  return (
    <article className="example">
      <header className="example-head">
        <span className="example-no">{no}</span>
        <div>
          <div className="example-name">{name}</div>
          <div className="example-desc">{desc}</div>
        </div>
        <div className="tabs">
          <button
            type="button"
            className="tab"
            aria-selected={tab === 'demo'}
            onClick={() => setTab('demo')}
          >
            Demo
          </button>
          <button
            type="button"
            className="tab"
            aria-selected={tab === 'code'}
            onClick={() => setTab('code')}
          >
            Code
          </button>
        </div>
      </header>
      <div className="example-body" data-tab={tab}>
        {tab === 'demo' ? (
          <div className="example-stage">
            {demo}
            {hint && <div className="demo-hint demo-hint-bottom">{hint}</div>}
          </div>
        ) : (
          <Code code={code} />
        )}
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────
//  01 — Basic
// ──────────────────────────────────────────────────────────
function BasicDemo() {
  const { show } = useFloaterActions();
  return (
    <div className="demo-center demo-center-tall">
      <button
        type="button"
        className="demo-trigger"
        onClick={() =>
          show([
            { id: 'copy', label: 'Copy', onSelect: () => {} },
            { id: 'share', label: 'Share', onSelect: () => {} },
            { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
          ])
        }
      >
        Show 3 actions
      </button>
    </div>
  );
}

const basicCode = `function BasicExample() {
  const { show } = useFloaterActions();

  return (
    <button onClick={() => show([
      { id: 'copy',   label: 'Copy',   onSelect: () => copy()   },
      { id: 'share',  label: 'Share',  onSelect: () => share()  },
      { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => del() },
    ])}>
      Show 3 actions
    </button>
  );
}`;

// ──────────────────────────────────────────────────────────
//  02 — Selection toolbar (gallery)
// ──────────────────────────────────────────────────────────
function GalleryDemo() {
  const photos = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({ id: `g${i}`, hue: (i * 27 + 12) % 360 })),
    [],
  );
  const [sel, setSel] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (sel.size === 0) {
      if (open) hide();
      return;
    }
    const n = sel.size;
    show(
      [
        { id: 'share', label: `Share (${n})`, onSelect: () => {} },
        { id: 'album', label: 'Album', onSelect: () => {} },
        {
          id: 'delete',
          label: 'Delete',
          variant: 'danger',
          onSelect: () => setSel(new Set()),
        },
        { id: 'tag', label: 'Tag', onSelect: () => {} },
        { id: 'info', label: 'Info', onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const toggle = (id: string) => {
    setSel((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="demo-center">
      <div className="demo-gallery">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tile ${sel.has(p.id) ? 'selected' : ''}`}
            style={{
              background: `linear-gradient(135deg, oklch(72% 0.14 ${p.hue}), oklch(56% 0.16 ${(p.hue + 30) % 360}))`,
            }}
            onClick={() => toggle(p.id)}
            aria-pressed={sel.has(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

const galleryCode = `function Gallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  // Re-show whenever count changes — labels stay in sync.
  useEffect(() => {
    if (selected.size === 0) { if (open) hide(); return; }
    const n = selected.size;
    show([
      { id: 'share', label: \`Share (\${n})\`, onSelect: shareMany },
      { id: 'album', label: 'Album',         onSelect: addToAlbum },
      { id: 'delete', label: 'Delete', variant: 'danger',
        onSelect: () => deleteMany(selected) },
    ], { dismissOnSelect: false });   // bar stays open across actions
  }, [selected]);

  return (
    <div className="grid">
      {photos.map((p) => (
        <Tile key={p.id} photo={p}
          selected={selected.has(p.id)}
          onClick={() => toggleSelection(p.id)} />
      ))}
    </div>
  );
}`;

// ──────────────────────────────────────────────────────────
//  03 — Command palette
// ──────────────────────────────────────────────────────────
function PaletteDemo() {
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
    <div className="demo-center">
      <div className="demo-editor">
        <div className="ln"><span className="num">1</span><span><span className="kw">function</span> <span className="fn">greet</span>(name) {`{`}</span></div>
        <div className="ln"><span className="num">2</span><span>{'  '}<span className="kw">return</span> <span className="str">{'`Hello, ${name}`'}</span>;</span></div>
        <div className="ln"><span className="num">3</span><span>{`}`}</span></div>
        <div className="ln"><span className="num">4</span><span>&nbsp;</span></div>
        <div className="ln"><span className="num">5</span><span><span className="kw">const</span> msg = <span className="fn">greet</span>(<span className="str">'world'</span>);</span></div>
        <div className="ln"><span className="num">6</span><span><span className="com">// → "Hello, world"</span></span></div>
      </div>
      <div className="demo-hint demo-hint-palette">
        Press <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span> <span className="kbd">K</span> to summon · or{' '}
        <button type="button" className="editor-link" onClick={() => toggle(actions)}>
          click here
        </button>
      </div>
    </div>
  );
}

const paletteCode = `function CommandPalette() {
  const { toggle } = useFloaterActions();

  const actions: FloaterAction[] = useMemo(() => [
    { id: 'new',  label: 'New file',     onSelect: newFile },
    { id: 'open', label: 'Open',         onSelect: openFile },
    { id: 'find', label: 'Find',         onSelect: openSearch },
    { id: 'cmd',  label: 'Run command',  onSelect: runCmd },
  ], []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle(actions);     // open if closed, close if open
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, actions]);

  return null;   // pure behavior — the bar is mounted by the Provider
}`;

// ──────────────────────────────────────────────────────────
//  04 — Bulk actions (inbox)
// ──────────────────────────────────────────────────────────
type Email = { id: string; from: string; subject: string; time: string; unread: boolean };
const initialEmails: Email[] = [
  { id: 'e1', from: 'GitHub', subject: 'Your PR was merged', time: '09:42', unread: true },
  { id: 'e2', from: 'Stripe', subject: 'Payout completed',   time: '08:15', unread: true },
  { id: 'e3', from: 'M.',     subject: 'Sunday dinner?',     time: '07:30', unread: true },
  { id: 'e4', from: 'Linear', subject: 'New issue assigned', time: 'Tue',   unread: false },
];

function InboxDemo() {
  const [emails, setEmails] = useState(initialEmails);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const { show, hide, open } = useFloaterActions();

  useEffect(() => {
    if (sel.size === 0) {
      if (open) hide();
      return;
    }
    const n = sel.size;
    const someUnread = emails.some((e) => sel.has(e.id) && e.unread);
    show(
      [
        {
          id: 'archive',
          label: `Archive (${n})`,
          onSelect: () => {
            setEmails((prev) => prev.filter((e) => !sel.has(e.id)));
            setSel(new Set());
          },
        },
        {
          id: 'read',
          label: someUnread ? 'Mark read' : 'Mark unread',
          onSelect: () => {
            setEmails((prev) =>
              prev.map((e) => (sel.has(e.id) ? { ...e, unread: !someUnread } : e)),
            );
            setSel(new Set());
          },
        },
        { id: 'delete', label: 'Delete', variant: 'danger', onSelect: () => {} },
        { id: 'snooze', label: 'Snooze', onSelect: () => {} },
        { id: 'label',  label: 'Label',  onSelect: () => {} },
      ],
      { dismissOnSelect: false },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, emails]);

  const toggleSel = (id: string) => {
    setSel((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="demo-center">
      <div className="demo-inbox">
        {emails.length === 0 ? (
          <div className="demo-empty">inbox zero</div>
        ) : (
          emails.map((e) => (
            <div
              key={e.id}
              className={`row ${e.unread ? 'unread' : 'read'} ${sel.has(e.id) ? 'checked' : ''}`}
              onClick={() => toggleSel(e.id)}
            >
              <div className="check">{sel.has(e.id) ? '✓' : ''}</div>
              <div className="from">{e.from}</div>
              <div className="subj">{e.subject}</div>
              <div className="time">{e.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inboxCode = `function Inbox({ emails }: { emails: Email[] }) {
  const [items, setItems] = useState(emails);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { show, hide } = useFloaterActions();

  useEffect(() => {
    if (selected.size === 0) { hide(); return; }
    show([
      {
        id: 'archive',
        label: \`Archive (\${selected.size})\`,
        onSelect: () => {
          setItems((prev) => prev.filter((e) => !selected.has(e.id)));
          setSelected(new Set());
        },
      },
      { id: 'read',   label: 'Mark read', onSelect: markRead },
      { id: 'delete', label: 'Delete', variant: 'danger', onSelect: deleteMany },
      { id: 'snooze', label: 'Snooze', onSelect: snooze },
      { id: 'label',  label: 'Label',  onSelect: openLabelPicker },
    ], { dismissOnSelect: false });
  }, [selected]);

  return /* render rows */;
}`;

// ──────────────────────────────────────────────────────────
//  05 — Icons (with and without label)
// ──────────────────────────────────────────────────────────
const Stroke = ({ d }: { d: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  heart:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  share:    'M16 6l-4-4-4 4 M12 2v13 M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  copy:     'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  trash:    'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
  pin:      'M12 17v5 M9 10.76V6 a2 2 0 0 1 2-2h2 a2 2 0 0 1 2 2v4.76 a3 3 0 0 0 1 2.24 H8 a3 3 0 0 0 1-2.24z',
} as const;

function IconsLabelDemo() {
  const { show } = useFloaterActions();
  return (
    <div className="demo-center demo-center-tall">
      <button
        type="button"
        className="demo-trigger"
        onClick={() =>
          show([
            { id: 'copy',     label: 'Copy',     icon: <Stroke d={ICONS.copy} />,     onSelect: () => {} },
            { id: 'share',    label: 'Share',    icon: <Stroke d={ICONS.share} />,    onSelect: () => {} },
            { id: 'bookmark', label: 'Save',     icon: <Stroke d={ICONS.bookmark} />, onSelect: () => {} },
            { id: 'trash',    label: 'Delete',   icon: <Stroke d={ICONS.trash} />,    variant: 'danger' as const, onSelect: () => {} },
          ])
        }
      >
        Show icons + labels
      </button>
    </div>
  );
}

function IconsOnlyDemo() {
  const { show } = useFloaterActions();
  return (
    <div className="demo-center demo-center-tall">
      <button
        type="button"
        className="demo-trigger"
        onClick={() =>
          show([
            { id: 'heart',    icon: <Stroke d={ICONS.heart} />,    ariaLabel: 'Like',     onSelect: () => {} },
            { id: 'bookmark', icon: <Stroke d={ICONS.bookmark} />, ariaLabel: 'Bookmark', onSelect: () => {} },
            { id: 'pin',      icon: <Stroke d={ICONS.pin} />,      ariaLabel: 'Pin',      onSelect: () => {} },
            { id: 'share',    icon: <Stroke d={ICONS.share} />,    ariaLabel: 'Share',    onSelect: () => {} },
            { id: 'copy',     icon: <Stroke d={ICONS.copy} />,     ariaLabel: 'Copy',     onSelect: () => {} },
          ])
        }
      >
        Show icon-only bar
      </button>
    </div>
  );
}

const iconsCode = `// Pass icon next to label — both render side by side.
show([
  { id: 'copy',   label: 'Copy',   icon: <CopyIcon />,   onSelect: copy   },
  { id: 'share',  label: 'Share',  icon: <ShareIcon />,  onSelect: share  },
  { id: 'delete', label: 'Delete', icon: <TrashIcon />,
    variant: 'danger', onSelect: del },
]);

// Omit label for icon-only — the button auto-squares
// (data-icon-only is set on the element). ariaLabel is required
// for screen reader accessibility.
show([
  { id: 'heart',    icon: <HeartIcon />,    ariaLabel: 'Like',     onSelect: like },
  { id: 'bookmark', icon: <BookmarkIcon />, ariaLabel: 'Bookmark', onSelect: bookmark },
  { id: 'pin',      icon: <PinIcon />,      ariaLabel: 'Pin',      onSelect: pin },
]);`;

// ──────────────────────────────────────────────────────────
//  Layout
// ──────────────────────────────────────────────────────────
export function Examples() {
  return (
    <section id="examples">
      <div className="page">
        <div className="section-h">
          <div>
            <span className="kicker">Examples</span>
            <h2>Six real use cases.</h2>
          </div>
          <span className="section-h-meta">All examples run live on this page.</span>
        </div>

        <div className="examples">
          <FloaterActionsProvider maxVisible={3}>
            <ExampleCard
              no="01 / Basic"
              name="Three actions, one show()"
              desc="The smallest possible integration. No state, no overflow."
              demo={<BasicDemo />}
              code={basicCode}
            />
          </FloaterActionsProvider>

          <FloaterActionsProvider maxVisible={3}>
            <ExampleCard
              no="02 / Selection"
              name="Multi-select with live count"
              desc="Reactive labels. dismissOnSelect: false keeps the bar open."
              demo={<GalleryDemo />}
              code={galleryCode}
              hint="Tap tiles to select."
            />
          </FloaterActionsProvider>

          <FloaterActionsProvider maxVisible={3} className="theme-pill">
            <ExampleCard
              no="03 / Command palette"
              name="Keyboard-driven toggle()"
              desc="Bind ⌘K. Three lines of code for a full palette."
              demo={<PaletteDemo />}
              code={paletteCode}
            />
          </FloaterActionsProvider>

          <FloaterActionsProvider maxVisible={3}>
            <ExampleCard
              no="04 / Bulk actions"
              name="Mutate the underlying list"
              desc="Each callback owns the consumer's state. Floaty stays neutral."
              demo={<InboxDemo />}
              code={inboxCode}
              hint="Tap rows to select."
            />
          </FloaterActionsProvider>

          <FloaterActionsProvider maxVisible={4}>
            <ExampleCard
              no="05 / Icons + labels"
              name="Each action gets an SVG icon next to its label"
              desc="Pass icon prop alongside label. Renders side by side, gap controlled by --fa-action-gap."
              demo={<IconsLabelDemo />}
              code={iconsCode}
            />
          </FloaterActionsProvider>

          <FloaterActionsProvider maxVisible={5} className="theme-circle">
            <ExampleCard
              no="06 / Icon-only"
              name="Omit label, supply icon + ariaLabel"
              desc="Button auto-squares to --fa-action-h. Pair with theme-circle for a perfect-circle row."
              demo={<IconsOnlyDemo />}
              code={iconsCode}
            />
          </FloaterActionsProvider>
        </div>
      </div>
    </section>
  );
}
