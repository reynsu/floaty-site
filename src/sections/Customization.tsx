import { useState, type ReactNode } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'floaty';

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
  /** "row" → flat .fa-mini grid · "radial"/"arc" → custom mini layout */
  shape?: 'row' | 'radial' | 'arc';
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
    id: 'radial',
    no: '03',
    name: 'Radial',
    themeClass: 'theme-radial',
    desc: 'Donut layout — actions orbit a center using `--fa-i` / `--fa-n`. Pure CSS, no JS layout math, staggered entrance.',
    band: 'paper',
    featured: true,
    shape: 'radial',
    details: [
      '--fa-display: block (escape flex row)',
      '--fa-width / --fa-height: square canvas',
      'transform per-button: rotate→translate→un-rotate',
      'transition-delay: calc(var(--fa-i) * 35ms)',
    ],
    cssCode: `.theme-radial.fa-bar {
  --fa-display: block;
  --fa-width: 220px;
  --fa-height: 220px;
  --fa-radius-px: 90px;
  --fa-bg: transparent;
  --fa-shadow: none;
}
.theme-radial .fa-action {
  position: absolute;
  top: 50%; left: 50%;
  width: 56px; height: 56px;
  border-radius: 50%;
  /* --fa-i (index) and --fa-n (slot count)
     are set by floaty as inline style vars */
  transform:
    translate(-50%, -50%)
    rotate(calc(var(--fa-i) * 360deg / var(--fa-n)))
    translateY(calc(-1 * var(--fa-radius-px)))
    rotate(calc(-1 * var(--fa-i) * 360deg / var(--fa-n)));
  transition-delay: calc(var(--fa-i) * 35ms);
}`,
  },
  {
    id: 'arc',
    no: '04',
    name: 'Arc',
    themeClass: 'theme-arc',
    desc: 'Half-moon fan — same primitives as radial, but constrained to 180°. Buttons rise from a baseline.',
    band: 'dark',
    shape: 'arc',
    details: [
      'spread = 180° (not 360°)',
      'angle = -90° + i * 180° / (n-1)',
      'shape only changes one transform line',
      'inherits --fa-i / --fa-n knobs',
    ],
    cssCode: `.theme-arc.fa-bar {
  --fa-display: block;
  --fa-width: 280px;
  --fa-height: 150px;
  --fa-radius-px: 110px;
}
.theme-arc .fa-action {
  position: absolute;
  left: 50%; bottom: 0;
  width: 48px; height: 48px;
  border-radius: 50%;
  transform:
    translate(-50%, 50%)
    rotate(calc(-90deg + var(--fa-i) * 180deg
                  / max(1, calc(var(--fa-n) - 1))))
    translateY(calc(-1 * var(--fa-radius-px)))
    rotate(calc(90deg - var(--fa-i) * 180deg
                  / max(1, calc(var(--fa-n) - 1))));
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
    id: 'acid',
    no: '08',
    name: 'Acid',
    themeClass: 'theme-acid',
    desc: 'Saturated lime, uppercase, tight letter-spacing. Loud on purpose — for confirmation flows that must be impossible to miss.',
    band: 'lime',
    details: [
      '--fa-bg: lime · chroma 0.20',
      'text-transform: uppercase',
      'font-weight: 700',
      'letter-spacing: 0.02 em',
    ],
    cssCode: `.theme-acid.fa-bar {
  --fa-bg: oklch(78% 0.20 110);
  --fa-fg: oklch(15% 0.04 110);
  --fa-border: oklch(60% 0.18 110);
  --fa-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-size: 12px;
}`,
  },
  {
    id: 'tape',
    no: '09',
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
    no: '10',
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
  if (shape === 'arc') return <MiniArc themeClass={themeClass} />;
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

const MINI_ARC_LABELS = ['↖', '↑', '↗', '+'];
function MiniArc({ themeClass }: { themeClass: string }) {
  const n = MINI_ARC_LABELS.length;
  return (
    <div className={`fa-mini ${themeClass}`} aria-hidden="true">
      {MINI_ARC_LABELS.map((l, i) => (
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

function Summon({ children }: { children?: ReactNode }) {
  const { show } = useFloaterActions();
  return (
    <button type="button" className="variant-summon" onClick={() => show(liveActions)}>
      {children ?? (
        <>
          Summon <span aria-hidden="true">↑</span>
        </>
      )}
    </button>
  );
}

// ─── Featured (spotlight) ────────────────────────────
function Spotlight({ v }: { v: Variant }) {
  const provMaxVisible = v.shape === 'radial' ? 6 : v.shape === 'arc' ? 5 : 3;
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
          <FloaterActionsProvider maxVisible={provMaxVisible} className={v.themeClass}>
            <Summon>
              Summon at the bottom of the page <span aria-hidden="true">↗</span>
            </Summon>
          </FloaterActionsProvider>
        </div>
        <pre className="spotlight-css">{highlightCss(v.cssCode)}</pre>
      </div>
    </article>
  );
}

// ─── Mosaic ──────────────────────────────────────────
function Tile({ v }: { v: Variant }) {
  const [openCss, setOpenCss] = useState(false);
  const provMaxVisible = v.shape === 'radial' ? 6 : v.shape === 'arc' ? 5 : 3;
  return (
    <div className={`tile-variant band-${v.band}`}>
      <div className="tile-stage">
        <MiniBar themeClass={v.themeClass} shape={v.shape} />
      </div>
      <div className="tile-meta">
        <div>
          <span className="tile-no">{v.no}</span>
          <h3 className="tile-name">{v.name}</h3>
        </div>
        <div className="tile-actions">
          <FloaterActionsProvider maxVisible={provMaxVisible} className={v.themeClass}>
            <SummonInline />
          </FloaterActionsProvider>
          <button
            type="button"
            className="tile-toggle"
            aria-pressed={openCss}
            aria-label={openCss ? `Hide CSS for ${v.name}` : `Show CSS for ${v.name}`}
            onClick={() => setOpenCss((o) => !o)}
          >
            <span aria-hidden="true">{`{ }`}</span>
          </button>
        </div>
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

function SummonInline() {
  const { show } = useFloaterActions();
  return (
    <button type="button" className="tile-summon" onClick={() => show(liveActions)}>
      Summon <span aria-hidden="true">↑</span>
    </button>
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
            <h2>10 themes from one className.</h2>
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
