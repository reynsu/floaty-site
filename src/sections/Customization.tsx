import { useState, type ReactNode } from 'react';
import { FloaterActionsProvider, useFloaterActions } from 'floaty';

type Variant = {
  id: string;
  no: string;
  name: string;
  themeClass: string;
  desc: string;
  stageBg?: 'dark' | 'gradient' | 'warm';
  details: string[];
  cssCode: string;
};

const variants: Variant[] = [
  {
    id: 'default',
    no: '01',
    name: 'Default',
    themeClass: 'theme-default',
    desc: 'Warm off-white surface, hairline border, soft shadow.',
    details: [
      '--fa-radius: 12px',
      '--fa-bg: oklch(98.8% 0.003 80)',
      'border: 1px hairline',
      'shadow: 12px 32px / 0.12',
    ],
    cssCode: `.fa-bar {
  --fa-bg: oklch(98.8% 0.003 80);
  --fa-fg: oklch(15% 0.018 270);
  --fa-border: oklch(91% 0.005 270);
  --fa-radius: 12px;
  --fa-radius-inner: 8px;
  --fa-shadow: 0 12px 32px oklch(15% 0.018 270 / .12);
}`,
  },
  {
    id: 'midnight',
    no: '02',
    name: 'Midnight',
    themeClass: 'theme-midnight',
    desc: 'Deep ink surface for dark UIs. White text, low-key shadow.',
    stageBg: 'dark',
    details: [
      '--fa-bg: oklch(18% 0.02 270)',
      '--fa-fg: oklch(96% 0.005 80)',
      '--fa-action-bg-hover: lighter ink',
      'shadow: 12px 40px / 0.4',
    ],
    cssCode: `.theme-midnight.fa-bar {
  --fa-bg:    oklch(18% 0.02 270);
  --fa-fg:    oklch(96% 0.005 80);
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
    stageBg: 'gradient',
    details: [
      'backdrop-filter: blur(24px) saturate(180%)',
      '--fa-bg: rgba(98, .65 alpha)',
      '--fa-radius: 18px',
      '--fa-border: rgba(15, .08 alpha)',
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
    stageBg: 'dark',
    details: [
      '--fa-radius: 999px',
      '--fa-radius-inner: 999px',
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
    id: 'brutalist',
    no: '05',
    name: 'Brutalist',
    themeClass: 'theme-brutalist',
    desc: 'Hard edges, 5px solid shadow, mono type.',
    details: [
      'border: 2px solid black',
      'box-shadow: 5px 5px 0 black',
      '--fa-radius: 0',
      'font: JetBrains Mono',
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
    id: 'terminal',
    no: '06',
    name: 'Terminal',
    themeClass: 'theme-terminal',
    desc: 'Phosphor green on dark. Mono, lowercase, 4px corners.',
    stageBg: 'dark',
    details: [
      '--fa-bg: deep green',
      '--fa-fg: phosphor',
      'text-transform: lowercase',
      'border: 1px green',
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
    desc: 'System toolbar feel — translucent, glossy, soft radius.',
    stageBg: 'gradient',
    details: [
      'backdrop-filter: blur(40px) saturate(180%)',
      'inset highlight (0.5px white top)',
      '--fa-radius: 11px',
      '--fa-bg: light translucent',
    ],
    cssCode: `.theme-mac.fa-bar {
  --fa-bg: oklch(96% 0.005 270 / 0.85);
  --fa-fg: oklch(15% 0.018 270);
  --fa-radius: 11px;
  --fa-shadow: inset 0 .5px 0 oklch(100% 0 0 / .6),
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
    details: [
      'background: linear-gradient(180deg, ...)',
      '--fa-fg: deep blue ink',
      '--fa-border: cool blue 85%',
      '--fa-radius: 10px',
    ],
    cssCode: `.theme-stripe.fa-bar {
  --fa-bg: linear-gradient(180deg,
    oklch(99% 0.003 240),
    oklch(96% 0.015 240));
  --fa-fg: oklch(20% 0.05 240);
  --fa-border: oklch(85% 0.04 240);
  --fa-radius: 10px;
  background: linear-gradient(180deg,
    oklch(99% 0.003 240),
    oklch(96% 0.015 240));
}`,
  },
  {
    id: 'notion',
    no: '09',
    name: 'Notion',
    themeClass: 'theme-notion',
    desc: 'Tight 6px corners, layered hairlines + drop shadow.',
    details: [
      '--fa-radius: 6px',
      'shadow: layered (1px ring + 2 blurs)',
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
    0 4px 12px oklch(15% 0.018 270 / .08),
    0 12px 32px oklch(15% 0.018 270 / .06);
}`,
  },
  {
    id: 'discord',
    no: '10',
    name: 'Discord',
    themeClass: 'theme-discord',
    desc: 'Branded purple, bold weight, generous radius.',
    details: [
      '--fa-bg: brand purple',
      '--fa-fg: paper white',
      'font-weight: 600',
      '--fa-radius: 14px',
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
    desc: 'Warm peach surface, soft 18px radius. Friendly.',
    stageBg: 'warm',
    details: [
      '--fa-bg: oklch(94% 0.04 25)',
      '--fa-fg: oklch(28% 0.10 25)',
      '--fa-radius: 18px',
      'shadow: tinted peach',
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
  {
    id: 'acid',
    no: '12',
    name: 'Acid',
    themeClass: 'theme-acid',
    desc: 'Saturated lime, uppercase, tight letter-spacing. Bold.',
    details: [
      '--fa-bg: lime saturation 0.20',
      'text-transform: uppercase',
      'font-weight: 700',
      'box-shadow: tinted lime',
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
];

const previewActions: Array<{ id: string; label: string }> = [
  { id: 'a', label: 'Reply' },
  { id: 'b', label: 'Forward' },
  { id: 'c', label: 'Archive' },
];

function MiniBar({ themeClass }: { themeClass: string }) {
  return (
    <div className={`fa-mini ${themeClass}`} role="presentation">
      {previewActions.map((a) => (
        <button key={a.id} type="button" tabIndex={-1}>
          {a.label}
        </button>
      ))}
      <button type="button" tabIndex={-1} className="more">
        +
      </button>
    </div>
  );
}

function VariantTrigger({
  themeClass,
  children,
}: {
  themeClass: string;
  children?: ReactNode;
}) {
  const { show } = useFloaterActions();
  return (
    <button
      type="button"
      className="variant-summon"
      onClick={() =>
        show([
          { id: 'a', label: 'Reply', onSelect: () => {} },
          { id: 'b', label: 'Forward', onSelect: () => {} },
          { id: 'c', label: 'Archive', onSelect: () => {} },
          { id: 'd', label: 'Snooze', onSelect: () => {} },
          { id: 'e', label: 'Delete', variant: 'danger', onSelect: () => {} },
        ])
      }
      data-theme={themeClass}
    >
      {children}
    </button>
  );
}

function VariantCard({ v }: { v: Variant }) {
  const [openCss, setOpenCss] = useState(false);
  return (
    <div className="variant">
      <div className="variant-stage" data-bg={v.stageBg}>
        <MiniBar themeClass={v.themeClass} />
      </div>
      <div className="variant-meta">
        <span className="variant-name">{v.name}</span>
        <span className="variant-no">{v.no}</span>
      </div>
      <div className="variant-desc">{v.desc}</div>
      <ul style={{ padding: '0 14px 12px', display: 'grid', gap: 4, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--fg-3)' }}>
        {v.details.map((d, i) => (
          <li key={i} style={{ display: 'flex', gap: 6 }}>
            <span style={{ color: 'var(--acc-2)' }}>›</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <div className="variant-actions">
        <FloaterActionsProvider maxVisible={3} className={v.themeClass}>
          <VariantTrigger themeClass={v.themeClass}>
            Summon ↑
          </VariantTrigger>
        </FloaterActionsProvider>
        <button
          type="button"
          className="variant-toggle"
          aria-pressed={openCss}
          aria-label="Toggle CSS"
          onClick={() => setOpenCss((o) => !o)}
        >
          {`{ }`}
        </button>
      </div>
      <div className="variant-css" data-open={openCss}>
        <div>
          <pre>{highlightCss(v.cssCode)}</pre>
        </div>
      </div>
    </div>
  );
}

// Tiny CSS highlighter — wraps css-vars, strings, and oklch() in spans.
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
  return (
    <section id="customize">
      <div className="page">
        <div className="section-h">
          <div>
            <span className="kicker">Customization</span>
            <h2 style={{ marginTop: 10 }}>12 themes. Pure CSS variables.</h2>
          </div>
          <span className="section-h-meta">
            Click <b style={{ color: 'var(--fg)' }}>{`{ }`}</b> to inspect each variant's overrides.
          </span>
        </div>

        <div className="variant-grid">
          {variants.map((v) => (
            <VariantCard key={v.id} v={v} />
          ))}
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: 'var(--fg-3)',
            maxWidth: '60ch',
          }}
        >
          Every variant is a <code style={{ fontFamily: 'var(--mono)', color: 'var(--fg)', background: 'var(--bg-2)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>className</code> applied to the Provider.
          The bar reads CSS custom properties at runtime — no JS theme provider, no context juggling.
          Compose your own by overriding any of <code style={{ fontFamily: 'var(--mono)', color: 'var(--acc-2)', fontSize: 12 }}>--fa-bg</code>, <code style={{ fontFamily: 'var(--mono)', color: 'var(--acc-2)', fontSize: 12 }}>--fa-fg</code>, <code style={{ fontFamily: 'var(--mono)', color: 'var(--acc-2)', fontSize: 12 }}>--fa-radius</code>, <code style={{ fontFamily: 'var(--mono)', color: 'var(--acc-2)', fontSize: 12 }}>--fa-shadow</code>, and the action background tokens.
        </p>
      </div>
    </section>
  );
}
