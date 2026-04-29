import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { FloaterActionsProvider, useFloaterActions, type FloaterAction } from 'floaty';

// ─── Inline icons (zero deps) ────────────────────────
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
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  heart:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  share:    'M16 6l-4-4-4 4 M12 2v13 M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  bookmark: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  copy:     'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
} as const;

// ─── Dock app-icons (rendered as <DockIcon name="…" />) ──
type DockIconName =
  | 'calendar'
  | 'mail'
  | 'music'
  | 'browser'
  | 'photos'
  | 'code'
  | 'settings'
  | 'files'
  | 'maps'
  | 'store';

const Envelope = () => (
  <svg
    viewBox="0 0 32 32"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="7" width="24" height="18" rx="2.5" />
    <path d="M4.5 9.5 16 18l11.5-8.5" />
  </svg>
);

const DOCK_GLYPH: Record<DockIconName, ReactNode> = {
  calendar: '31',
  mail:     <Envelope />,
  music:    '♪',
  browser:  '🌐',
  photos:   '✿',
  code:     '>_',
  settings: '✱',
  files:    '▣',
  maps:     '◎',
  store:    '◭',
};

const DockIcon = ({ name }: { name: DockIconName }) => (
  <span className={`dock-app dock-app-${name}`} aria-hidden="true">
    <span className="dock-app-glyph">{DOCK_GLYPH[name]}</span>
  </span>
);

const DOCK_ITEMS: { id: string; label: string; name: DockIconName }[] = [
  { id: 'calendar', label: 'Calendar', name: 'calendar' },
  { id: 'mail',     label: 'Mail',     name: 'mail'     },
  { id: 'music',    label: 'Music',    name: 'music'    },
  { id: 'browser',  label: 'Browser',  name: 'browser'  },
  { id: 'photos',   label: 'Photos',   name: 'photos'   },
  { id: 'code',     label: 'Terminal', name: 'code'     },
  { id: 'settings', label: 'Settings', name: 'settings' },
  { id: 'files',    label: 'Files',    name: 'files'    },
  { id: 'maps',     label: 'Maps',     name: 'maps'     },
  { id: 'store',    label: 'Store',    name: 'store'    },
];

const dockActions: FloaterAction[] = DOCK_ITEMS.map(({ id, label, name }) => ({
  id,
  icon: <DockIcon name={name} />,
  ariaLabel: label,
  onSelect: () => {},
}));

type Band =
  | 'paper'
  | 'paper-deep'
  | 'dark'
  | 'gradient'
  | 'warm'
  | 'discord'
  | 'terminal'
  | 'lime'
  | 'neon'
  | 'candy'
  | 'ocean'
  | 'yellow'
  | 'lavender'
  | 'sunset';

type Variant = {
  id: string;
  no: string;
  name: string;
  themeClass: string;
  desc: string;
  band: Band;
  details: string[];
  cssCode: string;
  /** "row" → flat .fa-mini grid · "radial"/"animated"/"dock" → custom mini layout */
  shape?: 'row' | 'radial' | 'animated' | 'dock';
  /** Override the default text-label actions (e.g. icon-only for Animated). */
  actions?: FloaterAction[];
  featured?: boolean;
};

const variants: Variant[] = [
  {
    id: 'default',
    no: '01',
    name: 'Default',
    themeClass: 'theme-default',
    desc: 'Warm off-white surface, hairline border, soft shadow. The unopinionated baseline you copy and tweak.',
    band: 'paper',
    featured: true,
    details: [
      'border-radius: 12px',
      '--fa-bg: oklch(98.8% 0.003 80)',
      '1 px hairline · 12 px / 32 px shadow',
      'Tinted neutral toward warm paper',
    ],
    cssCode: `.fa-bar {
  --fa-bg: oklch(98.8% 0.003 80);
  --fa-fg: oklch(15% 0.018 270);
  --fa-border: oklch(91% 0.005 270);
  --fa-radius: 12px;
  --fa-radius-inner: 8px;
  --fa-shadow:
    0 1px 2px  oklch(15% 0.018 270 / .06),
    0 12px 32px oklch(15% 0.018 270 / .12);
}`,
  },
  {
    id: 'brutalist',
    no: '02',
    name: 'Brutalist',
    themeClass: 'theme-brutalist',
    desc: 'Two-pixel solid border, hard 5-pixel offset shadow, monospace. Refuses to be tasteful.',
    band: 'paper-deep',
    featured: true,
    details: [
      'border: 2 px solid black',
      'box-shadow: 5 px 5 px 0 black',
      '--fa-radius: 0',
      "font-family: 'JetBrains Mono'",
    ],
    cssCode: `.theme-brutalist.fa-bar {
  --fa-bg: oklch(98% 0.003 80);
  --fa-fg: oklch(13% 0 0);
  --fa-radius: 0;
  border: 2px solid var(--fa-fg);
  box-shadow: 5px 5px 0 var(--fa-fg);
  font-family: 'JetBrains Mono', monospace;
}`,
  },
  {
    id: 'dock',
    no: '03',
    name: 'Dock',
    themeClass: 'theme-dock',
    desc: 'macOS-style app dock — colorful tile icons on a brushed-metal bar. Hover lifts the icon. Overflow tray opens upward as a vertical stack.',
    band: 'gradient',
    featured: true,
    shape: 'dock',
    actions: dockActions,
    details: [
      'icon-only, 44 × 44 with gradient fills',
      'hover: translateY(-6px) scale(1.10)',
      'overflow popover renders icons stacked',
      'brushed metal bar via inset highlights',
    ],
    cssCode: `.theme-dock.fa-bar {
  --fa-bg: linear-gradient(180deg,
    oklch(82% 0.005 270),
    oklch(72% 0.008 270));
  --fa-fg: oklch(15% 0.018 270);
  --fa-radius: 18px;
  --fa-padding: 8px;
  --fa-gap: 6px;
  --fa-action-h: 44px;
  --fa-action-flex: 0 0 44px;
  --fa-width: auto;
  --fa-action-bg: transparent;
  --fa-shadow:
    inset 0 1px 0 oklch(100% 0 0 / 0.6),
    0 14px 32px oklch(15% 0.018 270 / 0.35);
}
.theme-dock .fa-action {
  border-radius: 11px;
  transition: transform 200ms cubic-bezier(.2,.8,.2,1);
}
.theme-dock .fa-action:hover:not(:disabled) {
  transform: translateY(-6px) scale(1.10);
}
/* overflow tray = vertical stack of icons,
   pinned above the + button */
.theme-dock .fa-popover {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  min-width: 0;
}
.theme-dock .fa-popover-item {
  width: 44px; height: 44px;
  padding: 0; border-radius: 11px;
}`,
  },
  {
    id: 'animated',
    no: '04',
    name: 'Animated',
    themeClass: 'theme-animated',
    desc: 'Icons bob constantly while the bar is open. On dismiss the whole bar collapses to a circle in the center, then drops away — pure CSS keyframes.',
    band: 'dark',
    shape: 'animated',
    actions: [
      { id: 'heart',    icon: <Stroke d={ICONS.heart} />,    ariaLabel: 'Like',     onSelect: () => {} },
      { id: 'bookmark', icon: <Stroke d={ICONS.bookmark} />, ariaLabel: 'Bookmark', onSelect: () => {} },
      { id: 'share',    icon: <Stroke d={ICONS.share} />,    ariaLabel: 'Share',    onSelect: () => {} },
      { id: 'copy',     icon: <Stroke d={ICONS.copy} />,     ariaLabel: 'Copy',     onSelect: () => {} },
    ],
    details: [
      'idle: per-button bob, --fa-i staggers delay',
      'exit: keyframe collapses bar 1 → 0.5 → drop',
      'buttons converge toward center on close',
      'pure CSS — no JS animation lib',
    ],
    cssCode: `.theme-animated.fa-bar {
  --fa-bg: oklch(20% 0.018 270);
  --fa-fg: oklch(96% 0.005 80);
  --fa-radius: 999px;
  --fa-radius-inner: 999px;
  --fa-action-h: 44px;
  --fa-action-flex: 0 0 44px;
  --fa-width: auto;
}
/* idle bob — staggered by button index */
.theme-animated.fa-bar[data-state='open'] .fa-action {
  animation: fa-anim-bob 1.6s ease-in-out infinite;
  animation-delay: calc(var(--fa-i) * 120ms);
}
@keyframes fa-anim-bob {
  0%, 100% { transform: translateY(0)    scale(1);    }
  50%      { transform: translateY(-4px) scale(1.06); }
}
/* exit: bar collapses to a circle in the middle, then drops */
.theme-animated.fa-bar[data-state='closed'] {
  animation: fa-anim-collapse 540ms cubic-bezier(.55,0,.35,1) forwards;
  transition: transform 540ms ease-in;  /* ensure transitionend fires */
}
@keyframes fa-anim-collapse {
  0%   { transform: translate(-50%, 0) scale(1);   border-radius: 999px; opacity: 1 }
  45%  { transform: translate(-50%, 0) scale(.45); border-radius: 50%;   opacity: 1 }
  100% { transform: translate(-50%, 220%) scale(.4); border-radius: 50%; opacity: 0 }
}
.theme-animated.fa-bar[data-state='closed'] .fa-action {
  animation: fa-anim-converge 240ms ease-in forwards;
}
@keyframes fa-anim-converge {
  to {
    transform:
      translateX(calc((var(--fa-n) / 2 - var(--fa-i) - .5) * -48px))
      scale(0);
    opacity: 0;
  }
}`,
  },
  {
    id: 'midnight',
    no: '05',
    name: 'Midnight',
    themeClass: 'theme-midnight',
    desc: 'Deep ink for dark UIs.',
    band: 'dark',
    details: [
      '--fa-bg: deep ink',
      '--fa-fg: paper white',
      '--fa-action-bg-hover: lighter ink',
      'shadow 12 px / 40 px / 0.4',
    ],
    cssCode: `.theme-midnight.fa-bar {
  --fa-bg: oklch(18% 0.02 270);
  --fa-fg: oklch(96% 0.005 80);
  --fa-border: oklch(28% 0.02 270);
  --fa-action-bg-hover: oklch(25% 0.02 270);
  --fa-shadow: 0 12px 40px oklch(15% 0.018 270 / .4);
}`,
  },
  {
    id: 'glass',
    no: '06',
    name: 'Glass',
    themeClass: 'theme-glass',
    desc: 'Translucent surface with backdrop-filter blur.',
    band: 'gradient',
    details: [
      'backdrop-filter: blur(24px) saturate(180%)',
      '--fa-bg: alpha 0.65',
      '--fa-radius: 18 px',
      'thin tinted border',
    ],
    cssCode: `.theme-glass.fa-bar {
  --fa-bg: oklch(98.8% 0.003 80 / 0.65);
  --fa-fg: oklch(15% 0.018 270);
  --fa-border: oklch(15% 0.018 270 / .08);
  --fa-radius: 18px;
  backdrop-filter: blur(24px) saturate(180%);
}`,
  },
  {
    id: 'terminal',
    no: '07',
    name: 'Terminal',
    themeClass: 'theme-terminal',
    desc: 'Phosphor green on deep green. Mono, lowercase.',
    band: 'terminal',
    details: [
      '--fa-bg: deep green',
      '--fa-fg: phosphor',
      'text-transform: lowercase',
      'border 1 px green',
    ],
    cssCode: `.theme-terminal.fa-bar {
  --fa-bg: oklch(13% 0.04 140);
  --fa-fg: oklch(85% 0.18 140);
  --fa-border: oklch(45% 0.10 140);
  --fa-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  text-transform: lowercase;
  letter-spacing: 0.04em;
}`,
  },
  {
    id: 'tape',
    no: '08',
    name: 'Tape',
    themeClass: 'theme-tape',
    desc: 'Masking-tape on a wall — dashed border, drawn shadow, ~1° tilt.',
    band: 'yellow',
    details: [
      '--fa-border-style: dashed',
      'transform on open: rotate(-1.2deg)',
      '--fa-shadow: 4 px 6 px 0 ink',
      '--fa-radius: 0 (sharp corners)',
    ],
    cssCode: `.theme-tape.fa-bar {
  --fa-bg: oklch(94% 0.06 80);
  --fa-fg: oklch(20% 0.04 60);
  --fa-border: oklch(20% 0.04 60);
  --fa-border-style: dashed;       /* <-- new knob   */
  --fa-radius: 0;
  --fa-shadow: 4px 6px 0 oklch(20% 0.04 60 / .18);
}
.theme-tape.fa-bar[data-state='open'] {
  transform: translate(-50%, 0) rotate(-1.2deg);
}`,
  },
  {
    id: 'pixel',
    no: '09',
    name: 'Pixel',
    themeClass: 'theme-pixel',
    desc: '8-bit chunky — layered offset shadows mimic stepped pixel borders.',
    band: 'lavender',
    details: [
      'layered shadows fake pixel border',
      'image-rendering: pixelated',
      "font-family: 'Courier New'",
      '--fa-radius: 0 (sharp)',
    ],
    cssCode: `.theme-pixel.fa-bar {
  --fa-bg: oklch(95% 0.005 80);
  --fa-fg: oklch(15% 0.018 270);
  --fa-radius: 0;
  --fa-action-bg: oklch(85% 0.05 270);
  --fa-shadow:
    0 0 0 4px oklch(15% 0.018 270),
    4px 4px 0 4px oklch(78% 0.08 270),
    8px 8px 0 4px oklch(15% 0.018 270);
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  image-rendering: pixelated;
}`,
  },
];

const previewActions = [
  { id: 'a', label: 'Reply' },
  { id: 'b', label: 'Forward' },
  { id: 'c', label: 'Archive' },
];

const liveActions = [
  { id: 'a', label: 'Reply', onSelect: () => {} },
  { id: 'b', label: 'Forward', onSelect: () => {} },
  { id: 'c', label: 'Archive', onSelect: () => {} },
  { id: 'd', label: 'Snooze', onSelect: () => {} },
  { id: 'e', label: 'Delete', variant: 'danger' as const, onSelect: () => {} },
];

/* ── Mini bar previews ─────────────────────────────── */
function MiniBar({ themeClass, shape }: { themeClass: string; shape?: Variant['shape'] }) {
  if (shape === 'radial') return <MiniRadial themeClass={themeClass} />;
  if (shape === 'animated') return <MiniAnimated themeClass={themeClass} />;
  if (shape === 'dock') return <MiniDock themeClass={themeClass} />;
  return (
    <div className={`fa-mini ${themeClass}`} aria-hidden="true">
      {previewActions.map((a) => (
        <span key={a.id} className="fa-mini-action">
          {a.label}
        </span>
      ))}
      <span className="fa-mini-action more">+</span>
    </div>
  );
}

const MINI_RADIAL_LABELS = ['♥', '★', '⌖', '↗', '+'];
function MiniRadial({ themeClass }: { themeClass: string }) {
  const n = MINI_RADIAL_LABELS.length;
  return (
    <div className={`fa-mini ${themeClass}`} aria-hidden="true">
      {MINI_RADIAL_LABELS.map((l, i) => (
        <span
          key={i}
          className="fa-mini-action"
          style={{ ['--mini-i' as string]: i, ['--mini-n' as string]: n }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

const MINI_ANIMATED_ICONS = [ICONS.heart, ICONS.bookmark, ICONS.share, ICONS.copy];
function MiniAnimated({ themeClass }: { themeClass: string }) {
  const n = MINI_ANIMATED_ICONS.length;
  return (
    <div className={`fa-mini ${themeClass}`} aria-hidden="true">
      {MINI_ANIMATED_ICONS.map((d, i) => (
        <span
          key={i}
          className="fa-mini-action"
          style={{ ['--mini-i' as string]: i, ['--mini-n' as string]: n }}
        >
          <Stroke d={d} />
        </span>
      ))}
    </div>
  );
}

const MINI_DOCK_ITEMS: DockIconName[] = [
  'calendar', 'mail', 'music', 'browser', 'photos', 'code',
];
function MiniDock({ themeClass }: { themeClass: string }) {
  return (
    <div className={`fa-mini ${themeClass}`} aria-hidden="true">
      {MINI_DOCK_ITEMS.map((name) => (
        <span key={name} className="fa-mini-action">
          <DockIcon name={name} />
        </span>
      ))}
      <span className="fa-mini-action more">+</span>
    </div>
  );
}

function Summon({
  children,
  actions,
}: {
  children?: ReactNode;
  actions?: FloaterAction[];
}) {
  const { show } = useFloaterActions();
  return (
    <button
      type="button"
      className="variant-summon"
      onClick={() => show(actions ?? liveActions)}
    >
      {children ?? (
        <>
          Summon <span aria-hidden="true">↑</span>
        </>
      )}
    </button>
  );
}

function maxVisibleFor(shape?: Variant['shape']): number {
  if (shape === 'radial') return 6;
  if (shape === 'animated') return 4;
  if (shape === 'dock') return 7;
  return 3;
}

// ─── Featured (spotlight) ────────────────────────────
function Spotlight({ v }: { v: Variant }) {
  return (
    <article className={`spotlight band-${v.band}`}>
      <div className="spotlight-stage">
        <MiniBar themeClass={v.themeClass} shape={v.shape} />
      </div>
      <div className="spotlight-info">
        <div className="spotlight-meta">
          <span className="spotlight-no">{v.no} / featured</span>
        </div>
        <h3 className="spotlight-name">{v.name}</h3>
        <p className="spotlight-desc">{v.desc}</p>
        <ul className="spotlight-details">
          {v.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
        <div className="spotlight-actions">
          <FloaterActionsProvider maxVisible={maxVisibleFor(v.shape)} className={v.themeClass}>
            <Summon actions={v.actions}>
              Summon at the bottom of the page <span aria-hidden="true">↗</span>
            </Summon>
          </FloaterActionsProvider>
        </div>
        <pre className="spotlight-css">{highlightCss(v.cssCode)}</pre>
      </div>
    </article>
  );
}

// ─── Mosaic — entire tile is the trigger ─────────────
function Tile({ v }: { v: Variant }) {
  return (
    <FloaterActionsProvider maxVisible={maxVisibleFor(v.shape)} className={v.themeClass}>
      <TileBody v={v} />
    </FloaterActionsProvider>
  );
}

function TileBody({ v }: { v: Variant }) {
  const [openCss, setOpenCss] = useState(false);
  const { show } = useFloaterActions();
  const handleSummon = () => show(v.actions ?? liveActions);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSummon();
    }
  };

  return (
    <div
      className={`tile-variant band-${v.band}`}
      role="button"
      tabIndex={0}
      aria-label={`Summon ${v.name} bar`}
      onClick={handleSummon}
      onKeyDown={onKeyDown}
    >
      <div className="tile-stage">
        <MiniBar themeClass={v.themeClass} shape={v.shape} />
      </div>
      <div className="tile-meta">
        <div>
          <span className="tile-no">{v.no}</span>
          <h3 className="tile-name">{v.name}</h3>
        </div>
        <button
          type="button"
          className="tile-toggle"
          aria-pressed={openCss}
          aria-label={openCss ? `Hide CSS for ${v.name}` : `Show CSS for ${v.name}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpenCss((o) => !o);
          }}
        >
          <span aria-hidden="true">{`{ }`}</span>
        </button>
      </div>
      <p className="tile-desc">{v.desc}</p>
      <div className="tile-css" data-open={openCss}>
        <div>
          <pre>{highlightCss(v.cssCode)}</pre>
        </div>
      </div>
    </div>
  );
}

// ─── CSS highlighter (small) ─────────────────────────
function highlightCss(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern =
    /(--[\w-]+)|('[^']*'|"[^"]*")|(oklch\([^)]+\))|(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(\d+(?:\.\d+)?(?:px|em|rem|%|deg|s|ms)?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(code)) !== null) {
    if (m.index > last) out.push(code.slice(last, m.index));
    if (m[1]) out.push(<span key={i++} className="csskey">{m[1]}</span>);
    else if (m[2] || m[3]) out.push(<span key={i++} className="cssval">{m[0]}</span>);
    else if (m[4]) out.push(<span key={i++} className="csscom">{m[0]}</span>);
    else if (m[5]) out.push(<span key={i++} className="cssval">{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function Customization() {
  const featured = variants.filter((v) => v.featured);
  const mosaic = variants.filter((v) => !v.featured);

  return (
    <section id="customize">
      <div className="page">
        <div className="section-h">
          <div>
            <span className="kicker">Customization</span>
            <h2>9 themes from one className.</h2>
          </div>
          <span className="section-h-meta">
            Three featured variants below — including layouts that escape the row entirely.
          </span>
        </div>
      </div>

      <div className="page customize-spotlights">
        {featured.map((v) => (
          <Spotlight key={v.id} v={v} />
        ))}
      </div>

      <div className="page customize-mosaic">
        <header className="mosaic-h">
          <h3 className="mosaic-h-title">More variants</h3>
          <span className="mosaic-h-meta">
            click <span className="mosaic-h-key" aria-hidden="true">{`{ }`}</span> to inspect
          </span>
        </header>
        <div className="tile-grid">
          {mosaic.map((v) => (
            <Tile key={v.id} v={v} />
          ))}
        </div>

        <p className="customize-foot">
          Every variant is a className applied to the Provider. The bar reads CSS custom
          properties at runtime — no JS theme provider, no context juggling. Override{' '}
          <code>--fa-bg</code>, <code>--fa-fg</code>, <code>--fa-radius</code>,{' '}
          <code>--fa-shadow</code> for color/shape, or escape the flex row entirely with{' '}
          <code>--fa-display</code>, <code>--fa-width</code>, <code>--fa-height</code> and
          per-button <code>--fa-i</code> / <code>--fa-n</code> to build radial, arc, spiral,
          or grid layouts in pure CSS.
        </p>
      </div>
    </section>
  );
}
