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

  /* ── New variants 13 → 24 ─────────────────────────────── */
  {
    id: 'dock',
    no: '13',
    name: 'Dock',
    themeClass: 'theme-dock',
    desc: 'Compact translucent dock — actions hug their content, big radius.',
    band: 'dark',
    details: [
      '--fa-width: auto · shrinks to fit',
      '--fa-action-flex: 0 0 auto',
      '--fa-padding: 8 px · gap 4 px',
      'backdrop-filter: blur(28px) saturate(180%)',
    ],
    cssCode: `.theme-dock.fa-bar {
  --fa-bg: oklch(15% 0.018 270 / .78);
  --fa-fg: oklch(96% 0.005 80);
  --fa-radius: 22px;
  --fa-padding: 8px;
  --fa-gap: 4px;
  --fa-action-h: 38px;
  --fa-action-flex: 0 0 auto;     /* don't stretch */
  --fa-width: auto;                /* hug content   */
  backdrop-filter: blur(28px) saturate(180%);
}`,
  },
  {
    id: 'neon',
    no: '14',
    name: 'Neon',
    themeClass: 'theme-neon',
    desc: 'Synthwave glow — saturated magenta on near-black, all-caps mono.',
    band: 'neon',
    details: [
      '--fa-bg: oklch(14% 0.04 290)',
      'box-shadow: layered 24+60 px glow',
      'text-transform: uppercase',
      "font-family: 'JetBrains Mono'",
    ],
    cssCode: `.theme-neon.fa-bar {
  --fa-bg: oklch(14% 0.04 290);
  --fa-fg: oklch(94% 0.10 320);
  --fa-border: oklch(70% 0.25 320);
  --fa-shadow:
    0 0 0 1px  oklch(70% 0.25 320 / .55),
    0 0 24px   oklch(70% 0.25 320 / .45),
    0 0 60px   oklch(70% 0.25 320 / .35);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}`,
  },
  {
    id: 'outline',
    no: '15',
    name: 'Outline',
    themeClass: 'theme-outline',
    desc: 'No fill, just stroke. Inverts on hover. The minimalist option.',
    band: 'paper',
    details: [
      '--fa-bg: transparent',
      '--fa-border-w: 1.5 px',
      '--fa-radius: 999 px',
      'hover inverts to ink-on-paper',
    ],
    cssCode: `.theme-outline.fa-bar {
  --fa-bg: transparent;
  --fa-fg: oklch(15% 0.018 270);
  --fa-border: oklch(15% 0.018 270);
  --fa-border-w: 1.5px;
  --fa-radius: 999px;
  --fa-padding: 4px;
  --fa-action-bg-hover: oklch(15% 0.018 270);
  --fa-shadow: none;
  backdrop-filter: blur(8px);
}
.theme-outline .fa-action:hover {
  color: oklch(98% 0.003 80);   /* invert text */
}`,
  },
  {
    id: 'tape',
    no: '16',
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
    id: 'game',
    no: '17',
    name: 'Game',
    themeClass: 'theme-game',
    desc: 'Bright candy with a heavy 6-pixel drop. Reads as a video-game UI.',
    band: 'candy',
    details: [
      '--fa-border-w: 3 px solid ink',
      '--fa-shadow: 6 px 6 px 0 ink',
      '--fa-action-bg: light tint (not transparent)',
      '--fa-action-fw: 700',
    ],
    cssCode: `.theme-game.fa-bar {
  --fa-bg: oklch(75% 0.20 25);
  --fa-fg: oklch(20% 0.05 25);
  --fa-border: oklch(20% 0.05 25);
  --fa-border-w: 3px;
  --fa-action-bg: oklch(85% 0.16 25);   /* tile bg */
  --fa-shadow: 6px 6px 0 oklch(20% 0.05 25);
  --fa-action-fw: 700;
}`,
  },
  {
    id: 'gradient',
    no: '18',
    name: 'Gradient',
    themeClass: 'theme-gradient',
    desc: 'Sunset wash — orange → magenta → indigo. Glowing shadow tinted.',
    band: 'sunset',
    details: [
      'background: linear-gradient(135deg, …)',
      '--fa-action-bg: rgba(white, 0.10)',
      '--fa-shadow: 0 16 px 40 px tinted',
      '--fa-action-fw: 600',
    ],
    cssCode: `.theme-gradient.fa-bar {
  background: linear-gradient(135deg,
    oklch(72% 0.20 30)  0%,
    oklch(65% 0.22 340) 50%,
    oklch(60% 0.20 280) 100%);
  --fa-fg: oklch(98% 0.003 80);
  --fa-action-bg:       oklch(98% 0.003 80 / .10);
  --fa-action-bg-hover: oklch(98% 0.003 80 / .20);
  --fa-shadow: 0 16px 40px oklch(60% 0.20 280 / .45);
}`,
  },
  {
    id: 'material',
    no: '19',
    name: 'Material',
    themeClass: 'theme-material',
    desc: 'Material 3 elevated chip — generous radius, multi-layer drop shadow.',
    band: 'ocean',
    details: [
      '--fa-radius: 28 px (chip)',
      '--fa-action-px: 18 px',
      '--fa-gap: 0 (no separator)',
      'shadow: 3-layer elevation',
    ],
    cssCode: `.theme-material.fa-bar {
  --fa-bg: oklch(96% 0.05 250);
  --fa-fg: oklch(28% 0.10 250);
  --fa-radius: 28px;
  --fa-radius-inner: 20px;
  --fa-padding: 4px;
  --fa-gap: 0;
  --fa-action-px: 18px;
  --fa-shadow:
    0 1px  3px  oklch(15% 0.05 250 / .12),
    0 2px  8px  oklch(15% 0.05 250 / .08),
    0 12px 28px oklch(28% 0.10 250 / .18);
}`,
  },
  {
    id: 'receipt',
    no: '20',
    name: 'Receipt',
    themeClass: 'theme-receipt',
    desc: 'Italic Georgia, monochrome ink, dashed bottom edge — 1990s till slip.',
    band: 'paper',
    details: [
      "font-family: 'Georgia', italic",
      '--fa-radius: 0 (no rounding)',
      'border-bottom: 2 px dashed',
      '--fa-padding: 14 12 10',
    ],
    cssCode: `.theme-receipt.fa-bar {
  --fa-bg: oklch(98% 0.005 80);
  --fa-fg: oklch(15% 0.005 80);
  --fa-radius: 0;
  --fa-padding: 14px 12px 10px;
  --fa-gap: 0;
  font-family: 'Georgia', serif;
  font-style: italic;
  border-bottom: 2px dashed oklch(15% 0.005 80);
}`,
  },
  {
    id: 'sticky',
    no: '21',
    name: 'Sticky note',
    themeClass: 'theme-sticky',
    desc: 'Post-it yellow, ~2° rotation, handwritten font, drawn drop shadow.',
    band: 'yellow',
    details: [
      "font-family: 'Caveat', cursive",
      'transform on open: rotate(2deg)',
      'shadow: 8 14 18 px ink, drawn feel',
      '--fa-radius: 2 px (paper edge)',
    ],
    cssCode: `.theme-sticky.fa-bar {
  --fa-bg: oklch(94% 0.13 95);
  --fa-fg: oklch(22% 0.06 95);
  --fa-radius: 2px;
  --fa-padding: 10px;
  font-family: 'Caveat', cursive;
  font-size: 17px;
  --fa-shadow:
    0 2px 0 oklch(85% 0.16 95),
    8px 14px 18px oklch(22% 0.06 95 / .32);
}
.theme-sticky.fa-bar[data-state='open'] {
  transform: translate(-50%, 0) rotate(2deg);
}`,
  },
  {
    id: 'pixel',
    no: '22',
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
  {
    id: 'circle',
    no: '23',
    name: 'Circle',
    themeClass: 'theme-circle',
    desc: 'Each action a perfect 44 px circle. The bar shrinks to icon-row.',
    band: 'paper',
    details: [
      '--fa-radius-inner: 999 px',
      '--fa-action-h: 44 px',
      '--fa-action-px: 0 · py: 0',
      '--fa-action-flex: 0 0 44 px',
    ],
    cssCode: `.theme-circle.fa-bar {
  --fa-bg: oklch(98% 0.005 80);
  --fa-fg: oklch(15% 0.018 270);
  --fa-radius: 999px;
  --fa-radius-inner: 999px;       /* round actions */
  --fa-action-h: 44px;
  --fa-action-px: 0;
  --fa-action-py: 0;
  --fa-action-flex: 0 0 44px;     /* fixed circle  */
  --fa-width: auto;                /* hug content   */
  --fa-action-bg: oklch(94% 0.005 270);
}`,
  },
  {
    id: 'toast',
    no: '24',
    name: 'Toast',
    themeClass: 'theme-toast',
    desc: 'Anchored to the top instead of bottom — like a notification banner.',
    band: 'dark',
    details: [
      'bottom: auto · top: 16 px',
      'closed transform: translate(-50%, -180%)',
      '--fa-width: auto · hugs content',
      '--fa-radius: 999 px',
    ],
    cssCode: `.theme-toast.fa-bar {
  --fa-bg: oklch(20% 0.018 270);
  --fa-fg: oklch(96% 0.005 80);
  --fa-radius: 999px;
  --fa-padding: 4px;
  --fa-width: auto;
  --fa-action-h: 36px;
  --fa-action-flex: 0 0 auto;
  bottom: auto;
  top: calc(env(safe-area-inset-top, 0px) + 16px);
}
.theme-toast.fa-bar[data-state='closed'] {
  transform: translate(-50%, -180%);   /* slide up & out */
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
