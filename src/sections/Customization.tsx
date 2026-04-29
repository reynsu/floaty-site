import { useState, type ReactNode } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'floaty';

type Variant = {
  id: string;
  no: string;
  name: string;
  themeClass: string;
  desc: string;
  band: 'paper' | 'paper-deep' | 'dark' | 'gradient' | 'warm' | 'discord' | 'terminal' | 'lime';
  details: string[];
  cssCode: string;
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
    no: '05',
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
    id: 'acid',
    no: '12',
    name: 'Acid',
    themeClass: 'theme-acid',
    desc: 'Saturated lime, uppercase, tight letter-spacing. Loud on purpose — for confirmation flows that must be impossible to miss.',
    band: 'lime',
    featured: true,
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
  --fa-shadow: 0 12px 32px oklch(78% 0.20 110 / .5);
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-size: 12px;
}`,
  },
  {
    id: 'midnight',
    no: '02',
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
    no: '03',
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
    id: 'pill',
    no: '04',
    name: 'Pill',
    themeClass: 'theme-pill',
    desc: 'Fully rounded dock-style. Ink background, ghost actions.',
    band: 'dark',
    details: [
      '--fa-radius: 999 px',
      '--fa-radius-inner: 999 px',
      '--fa-bg: ink',
      'no border',
    ],
    cssCode: `.theme-pill.fa-bar {
  --fa-bg: oklch(15% 0.018 270);
  --fa-fg: oklch(96% 0.005 80);
  --fa-border: transparent;
  --fa-radius: 999px;
  --fa-radius-inner: 999px;
}`,
  },
  {
    id: 'terminal',
    no: '06',
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
    id: 'mac',
    no: '07',
    name: 'macOS',
    themeClass: 'theme-mac',
    desc: 'System-toolbar feel — translucent, glossy, soft radius.',
    band: 'gradient',
    details: [
      'backdrop-filter: blur(40 px) saturate(180%)',
      'inset highlight (0.5 px white)',
      '--fa-radius: 11 px',
      'translucent base',
    ],
    cssCode: `.theme-mac.fa-bar {
  --fa-bg: oklch(96% 0.005 270 / 0.85);
  --fa-fg: oklch(15% 0.018 270);
  --fa-radius: 11px;
  --fa-shadow:
    inset 0 .5px 0 oklch(100% 0 0 / .6),
    0 14px 40px oklch(15% 0.018 270 / .18);
  backdrop-filter: blur(40px) saturate(180%);
}`,
  },
  {
    id: 'stripe',
    no: '08',
    name: 'Stripe',
    themeClass: 'theme-stripe',
    desc: 'Subtle linear-gradient surface, cool-blue tint.',
    band: 'paper',
    details: [
      'background: linear-gradient(180deg, …)',
      '--fa-fg: deep blue ink',
      '--fa-border: cool blue 85%',
      '--fa-radius: 10 px',
    ],
    cssCode: `.theme-stripe.fa-bar {
  background: linear-gradient(180deg,
    oklch(99% 0.003 240),
    oklch(96% 0.015 240));
  --fa-fg: oklch(20% 0.05 240);
  --fa-border: oklch(85% 0.04 240);
  --fa-radius: 10px;
}`,
  },
  {
    id: 'notion',
    no: '09',
    name: 'Notion',
    themeClass: 'theme-notion',
    desc: 'Tight 6-pixel corners, layered hairlines + soft drop shadow.',
    band: 'paper',
    details: [
      '--fa-radius: 6 px',
      'shadow: 1 px ring + 2 blurs',
      '--fa-action-bg-hover: 6% ink',
      'minimal accent',
    ],
    cssCode: `.theme-notion.fa-bar {
  --fa-bg: oklch(98% 0.005 80);
  --fa-fg: oklch(15% 0.018 270);
  --fa-border: oklch(15% 0.018 270 / .08);
  --fa-radius: 6px;
  --fa-shadow:
    0 0 0 1px oklch(15% 0.018 270 / .04),
    0 4px 12px  oklch(15% 0.018 270 / .08),
    0 12px 32px oklch(15% 0.018 270 / .06);
}`,
  },
  {
    id: 'discord',
    no: '10',
    name: 'Discord',
    themeClass: 'theme-discord',
    desc: 'Branded purple, bold weight, generous radius.',
    band: 'discord',
    details: [
      '--fa-bg: brand purple',
      '--fa-fg: paper white',
      'font-weight: 600',
      '--fa-radius: 14 px',
    ],
    cssCode: `.theme-discord.fa-bar {
  --fa-bg: oklch(38% 0.10 270);
  --fa-fg: oklch(96% 0.005 80);
  --fa-border: oklch(48% 0.12 270);
  --fa-radius: 14px;
  --fa-action-bg-hover: oklch(45% 0.12 270);
  font-weight: 600;
}`,
  },
  {
    id: 'pastel',
    no: '11',
    name: 'Pastel',
    themeClass: 'theme-pastel',
    desc: 'Warm peach surface, 18-pixel radius. Friendly.',
    band: 'warm',
    details: [
      '--fa-bg: oklch(94% 0.04 25)',
      '--fa-fg: oklch(28% 0.10 25)',
      '--fa-radius: 18 px',
      'shadow tinted peach',
    ],
    cssCode: `.theme-pastel.fa-bar {
  --fa-bg: oklch(94% 0.04 25);
  --fa-fg: oklch(28% 0.10 25);
  --fa-border: oklch(82% 0.08 25);
  --fa-radius: 18px;
  --fa-radius-inner: 12px;
  --fa-shadow: 0 12px 32px oklch(75% 0.10 25 / .5);
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

function MiniBar({ themeClass }: { themeClass: string }) {
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
  return (
    <article className={`spotlight band-${v.band}`}>
      <div className="spotlight-stage">
        <MiniBar themeClass={v.themeClass} />
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
          <FloaterActionsProvider maxVisible={3} className={v.themeClass}>
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

// ─── Mosaic (the other 9) ────────────────────────────
function Tile({ v }: { v: Variant }) {
  const [openCss, setOpenCss] = useState(false);
  return (
    <div className={`tile-variant band-${v.band}`}>
      <div className="tile-stage">
        <MiniBar themeClass={v.themeClass} />
      </div>
      <div className="tile-meta">
        <div>
          <span className="tile-no">{v.no}</span>
          <h3 className="tile-name">{v.name}</h3>
        </div>
        <div className="tile-actions">
          <FloaterActionsProvider maxVisible={3} className={v.themeClass}>
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
            <h2>12 themes from one className.</h2>
          </div>
          <span className="section-h-meta">
            Three featured variants below. Nine more in the gallery.
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
          properties at runtime — no JS theme provider, no context juggling. Compose your
          own by overriding <code>--fa-bg</code>, <code>--fa-fg</code>,{' '}
          <code>--fa-radius</code>, <code>--fa-shadow</code>, and the action background tokens.
        </p>
      </div>
    </section>
  );
}
