# Plan: floaty-site → Astro with React islands + a11y/SEO/perf maximization

## Summary
Migrate the floaty-site showcase from a Vite + React 18 SPA to **Astro 5** with **partial hydration** (React islands only where state/interactivity is required). Most of the page becomes static HTML at build time; React ships only for the floaty live demos, modal dialog, and tab/copy UI. Bundle size, TTI, and Lighthouse scores all improve substantially. SEO/a11y/perf best practices are layered in alongside the migration.

## User Story
As a **visitor evaluating floaty for adoption**, I want the showcase site to load instantly, be perfectly accessible, and rank for "react floating toolbar" so that I can evaluate the library on slow connections, with assistive tech, and discover it via search.

## Problem → Solution
**Current (Vite SPA):** 60 KB JS gzipped + 12 KB CSS gzipped on every page; `<div id="root">` empty until React hydrates → CLS/LCP penalty + no useful HTML for crawlers. Single React tree, no a11y skip-link, no sitemap, no structured data, no OG image.

**Desired (Astro + islands):** Static HTML for everything except the ~5 interactive surfaces. JS payload shrinks to only what those islands need. SEO meta complete (canonical, OG, Twitter, JSON-LD, sitemap, robots). a11y: skip-link, AAA contrast spot-checks, focus order, aria-labelled sections, reduced-motion already done. Lighthouse 100/100/100/100.

## Metadata
- **Complexity**: **XL** — architectural change. Recommend executing as **3 phases** (see Phase Plan section below), each individually shippable.
- **Source PRD**: N/A (free-form request)
- **PRD Phase**: N/A
- **Estimated Files**: ~30 changed/created (10 deleted, 12 created, 8 updated)

---

## UX Design

### Before
```
┌──────────────────────────────────────────────┐
│  Browser → GET /                             │
│  ↓                                           │
│  index.html: empty <div id="root">           │
│  ↓                                           │
│  Download main.js (60KB gz) + css (12KB gz)  │
│  ↓                                           │
│  Parse + execute → React renders entire page │
│  ↓                                           │
│  Page visible (LCP)                          │
└──────────────────────────────────────────────┘
```

### After
```
┌──────────────────────────────────────────────┐
│  Browser → GET /                             │
│  ↓                                           │
│  Server returns full HTML (Astro SSG)        │
│  ├── Topbar, Hero text, all section headers, │
│  │   API table, Footer — all in HTML         │
│  └── 5 island scripts deferred via           │
│      client:load / client:visible            │
│  ↓                                           │
│  Page visible immediately (LCP < 1s)         │
│  ↓                                           │
│  Hero demo island hydrates (client:load)     │
│  Examples / Customize hydrate as scrolled    │
│  (client:visible)                            │
└──────────────────────────────────────────────┘
```

### Interaction Changes
| Touchpoint | Before | After | Notes |
|---|---|---|---|
| First byte → LCP | ~600–900ms | ~200–400ms | Static HTML, no React boot |
| JS shipped | 60 KB gz | ~15–25 KB gz | Only floaty + islands' code |
| Demo summon | works after hydration | identical, hydrates lazily | Visible content unchanged |
| Anchor nav (`#examples`) | works after hydration | works on first paint | HTML-native links |
| Crawler view | empty `<div>` | full HTML with text | SEO win |
| Reduced motion | already respected | preserved | No regression |

---

## Phase Plan

Because this is XL, execute as three phases on a single `astro` branch with preview deploys after each.

| Phase | Scope | Shippable? | Tasks |
|---|---|---|---|
| **P1** — Bootstrap + static shell | Astro infra, Layout, Topbar, Footer, API, section headers | ✅ Independent deploy possible | T1–T6 |
| **P2** — Islands | Hero demo, Examples cards, Customization (mosaic + spotlight + dialog) | ✅ Site fully functional | T7–T12 |
| **P3** — SEO/a11y/perf polish | Meta, sitemap, JSON-LD, OG image, robots, skip-link, fonts, Lighthouse pass | ✅ Final | T13–T18 |

**Rollout strategy**: develop on `astro` branch → vercel preview → merge to `main` only after Lighthouse 100/100/100/100 confirmed.

---

## Mandatory Reading

Files that MUST be read before implementing:

| Priority | File | Lines | Why |
|---|---|---|---|
| P0 | `floaty-site/src/sections/Hero.tsx` | 1–153 | Hero structure + demo island boundary |
| P0 | `floaty-site/src/sections/Examples.tsx` | all | 7 example cards, Demo/Code tab logic, multiple demos |
| P0 | `floaty-site/src/sections/Customization.tsx` | all | Spotlights + mosaic + CssDialog — biggest island |
| P0 | `floaty-site/src/sections/API.tsx` | all | Confirm static — promote to .astro |
| P0 | `floaty-site/src/components/Topbar.tsx` | all | Static nav |
| P0 | `floaty-site/src/sections/Footer.tsx` | all | Static |
| P0 | `floaty-site/src/styles/global.css` | all | 1500+ lines — must transfer 1:1 |
| P0 | `floaty-site/src/styles/themes.css` | all | 1100+ lines — must transfer 1:1 |
| P1 | `floaty-site/src/hooks/useScrollReveal.ts` | all | Single IntersectionObserver, runs once on mount |
| P1 | `floaty-site/src/components/Code.tsx` | all | Copyable code block |
| P1 | `floaty-site/src/components/highlight.tsx` | all | Code highlighter |
| P1 | `floaty-site/index.html` | all | Existing meta tags — merge into Astro head |
| P1 | `floaty-site/package.json` | all | Existing deps |
| P2 | `floater-actions/src/index.ts` | all | Lib API surface |

## External Documentation

| Topic | Source | Key Takeaway |
|---|---|---|
| Astro 5 partial hydration | https://docs.astro.build/en/concepts/islands/ | `client:load` hydrates immediately, `client:visible` defers until in viewport, `client:idle` waits for `requestIdleCallback`, `client:only="react"` skips SSR |
| @astrojs/react | https://docs.astro.build/en/guides/integrations-guide/react/ | Add via `npm astro add react` — handles SSR + islands |
| @astrojs/sitemap | https://docs.astro.build/en/guides/integrations-guide/sitemap/ | Auto-generates `/sitemap-index.xml` from page list |
| View Transitions | https://docs.astro.build/en/guides/view-transitions/ | `<ClientRouter />` in head — single-page-app feel without React Router |
| Astro asset pipeline | https://docs.astro.build/en/guides/images/ | `<Image>` from `astro:assets` for OG images, hashes for cache-busting |
| Lighthouse CI | https://github.com/GoogleChrome/lighthouse-ci | Locked thresholds in CI |

```
KEY_INSIGHT: Astro SSGs HTML at build time; React components passed `client:*`
             directives ship + hydrate independently as separate JS chunks.
APPLIES_TO: Every section that contains state. Avoids the SPA waterfall.
GOTCHA: Each island is its own React tree. State CANNOT cross islands without
        a portal/store. CssDialog must therefore live inside the same island
        as the tiles that open it (i.e. one Customization island, not many).

KEY_INSIGHT: Astro <slot /> works for static composition; React children CAN'T
             be passed across the Astro→React boundary as JSX. Pass strings,
             primitives, or serializable JSON only.
APPLIES_TO: Section headings around React islands.
GOTCHA: This forces "wrap in <section>...<MyIsland client:load />" pattern
        rather than "<MyIsland><h2>Title</h2></MyIsland>".

KEY_INSIGHT: floaty's <FloaterActionsProvider> renders a portal to document.body.
             Portals work in Astro islands as long as the island is "client:load"
             or "client:visible" — NOT "client:only" with SSR mismatch concerns.
APPLIES_TO: Every demo + variant tile.
GOTCHA: Use `client:only="react"` for the floaty demos to avoid SSR portal
        warnings. The lib already gates on `typeof document` but Astro will
        try to SSR by default.
```

---

## Architecture

### Strategic Design

**Approach**: In-place migration in the existing `floaty-site` repo on a new branch `astro`. Replace Vite tooling with Astro tooling, port existing CSS verbatim, decompose React tree into 5 islands + 1 layout + N static `.astro` components.

**Alternatives Considered**:
- **Next.js App Router** — heavier than needed; we don't need API routes, server actions, or RSC. Astro is purpose-built for content + islands.
- **Plain HTML + sprinkled React** (e.g. via Vite multi-page) — works but loses Astro's first-class slot/component system, build-time props passing, and ecosystem (sitemap/integrations).
- **Move to a new repo `floaty-site-astro`** — rejected; same URL, same deploy target, less churn.
- **Keep React SPA, add SSG via vite-plugin-ssr** — partial fix; doesn't solve "ship JS for static parts".

**Scope**:
- Full Astro toolchain (`astro.config.mjs`, `tsconfig.json`, integrations).
- Replace `index.html` + `main.tsx` + `App.tsx` with `src/pages/index.astro` + `src/layouts/Layout.astro`.
- Convert Topbar, Footer, API, section headers, Hero typography to `.astro`.
- Keep Hero demo, each Examples card, all of Customization (incl. dialog), and the floaty bar live demos as React islands.
- Add: sitemap, robots.txt, OG image, JSON-LD, structured headings, skip-link.
- Visual parity — zero design regression.

**NOT Building**:
- Multi-page routing (still single-page; just /).
- Dark mode toggle.
- i18n.
- Blog/MDX.
- Service worker.
- Analytics.
- Any backend / API routes.

---

## Patterns to Mirror

Code patterns the new code must follow.

### NAMING_CONVENTION
```tsx
// SOURCE: src/sections/Hero.tsx:94
export function Hero() { … }

// SOURCE: src/components/Topbar.tsx:1
export function Topbar() { … }
```
**Astro equivalent**: `.astro` files use the filename as the component name (`Hero.astro` → `import Hero from './Hero.astro'`). Default export. PascalCase filenames.

### ISLAND_BOUNDARY (new — to be applied)
```astro
---
// src/pages/index.astro
import Layout      from '../layouts/Layout.astro';
import Topbar      from '../components/Topbar.astro';
import Hero        from '../sections/Hero.astro';
import HeroDemo    from '../islands/HeroDemo';   // .tsx
---
<Layout title="floaty — React floating action toolbar">
  <Topbar />
  <main>
    <Hero>
      <HeroDemo client:load />
    </Hero>
    …
  </main>
</Layout>
```

### REACT_ISLAND_PATTERN (new — to be applied)
```tsx
// src/islands/HeroDemo.tsx
import { FloaterActionsProvider } from 'floaty';
import 'floaty/styles.css';
import { HeroDemoStage } from './HeroDemoStage';

export default function HeroDemo() {
  return (
    <FloaterActionsProvider maxVisible={3}>
      <HeroDemoStage />
    </FloaterActionsProvider>
  );
}
```

### CSS_IMPORT (must transfer)
```ts
// SOURCE: src/main.tsx:1
import './styles/global.css';
import './styles/themes.css';
```
**Astro equivalent**: import the two stylesheets in `Layout.astro`'s frontmatter. Astro inlines critical bits and emits the rest with content-hash filenames automatically.

### EXISTING_META_TAGS (must merge)
```html
<!-- SOURCE: index.html:1-26 -->
<meta name="theme-color" content="#fafaf6" />
<meta name="description" content="floaty — a microscopic React toolbar..." />
<meta property="og:title" content="floaty — React floating action toolbar" />
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer..." />
```
Move into `Layout.astro` `<head>`, expand with full OG/Twitter/canonical/JSON-LD set.

### STATELESS_COMPONENT
```tsx
// SOURCE: src/components/Topbar.tsx:1
export function Topbar() {
  return (
    <header className="topbar">
      <div className="page topbar-inner">…</div>
    </header>
  );
}
```
→ Becomes pure `.astro` (no script section needed):
```astro
---
// src/components/Topbar.astro
---
<header class="topbar">
  <div class="page topbar-inner">…</div>
</header>
```
**Note**: JSX `className` → HTML `class`. `aria-*` and `data-*` are identical.

### USE_SCROLL_REVEAL_HOOK
```ts
// SOURCE: src/hooks/useScrollReveal.ts:1
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal=""]');
    const obs = new IntersectionObserver(...);
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
```
**Astro equivalent**: Inline `<script>` in `Layout.astro` (runs once, client-side, after hydration). Strip the React hook entirely — pure DOM API.

```astro
<script>
  // src/layouts/Layout.astro — inline script
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-reveal=""]');
  if (reduce) { els.forEach(el => el.setAttribute('data-reveal','in')); }
  else {
    const obs = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) {
        e.target.setAttribute('data-reveal','in');
        obs.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(el => obs.observe(el));
  }
</script>
```

---

## Files to Change

| File | Action | Justification |
|---|---|---|
| `package.json` | UPDATE | Replace vite + plugin-react with astro + @astrojs/react + @astrojs/sitemap |
| `vite.config.ts` | DELETE | Replaced by `astro.config.mjs` |
| `astro.config.mjs` | CREATE | Astro entry point + integrations |
| `tsconfig.json` | UPDATE | Extend astro/tsconfigs/strict |
| `tsconfig.node.json` | DELETE | Astro doesn't need it |
| `index.html` | DELETE | Replaced by Layout.astro |
| `src/main.tsx` | DELETE | No SPA bootstrap |
| `src/App.tsx` | DELETE | Replaced by `src/pages/index.astro` |
| `src/layouts/Layout.astro` | CREATE | HTML shell, head, fonts, scripts |
| `src/pages/index.astro` | CREATE | Compose sections + islands |
| `src/components/Topbar.astro` | CREATE | Port of Topbar.tsx |
| `src/components/Topbar.tsx` | DELETE | Replaced by .astro |
| `src/sections/Footer.astro` | CREATE | Port of Footer.tsx |
| `src/sections/Footer.tsx` | DELETE | Replaced by .astro |
| `src/sections/API.astro` | CREATE | Port of API.tsx (already stateless) |
| `src/sections/API.tsx` | DELETE | Replaced by .astro |
| `src/sections/HeroLayout.astro` | CREATE | Static text + slot for the demo island |
| `src/sections/Hero.tsx` | DELETE | Static parts moved to .astro; demo extracted to island |
| `src/sections/ExamplesLayout.astro` | CREATE | Section header + slot for examples island |
| `src/sections/CustomizationLayout.astro` | CREATE | Section header + slot for customization island |
| `src/islands/HeroDemo.tsx` | CREATE | The Live/Source tabbed demo only |
| `src/islands/Examples.tsx` | CREATE | All 7 example cards (each card has demo + code tab) |
| `src/islands/Customization.tsx` | CREATE | Spotlights + mosaic + dialog (same island = shared dialog state) |
| `src/styles/global.css` | UPDATE | Add reveal-state classes that the inline observer toggles |
| `src/styles/themes.css` | KEEP | No change |
| `src/hooks/useScrollReveal.ts` | DELETE | Replaced by inline script in Layout |
| `public/robots.txt` | CREATE | `User-agent: *  Allow: /  Sitemap: https://floaty.dev/sitemap-index.xml` |
| `public/og-image.png` | CREATE | 1200×630 OG card (or generate via Satori at build time) |
| `public/favicon.svg` + variants | CREATE | SVG + PNG fallbacks + manifest.webmanifest |
| `src/pages/sitemap-helper.ts` | CREATE (optional) | Single-page sitemap is automatic via @astrojs/sitemap |
| `.github/workflows/lighthouse.yml` | CREATE | Lighthouse CI gate |

## NOT Building

- Multi-page navigation — still SPA-feel, just static-first.
- Server-rendered or runtime-personalized content.
- Markdown content collections (no blog).
- Astro middleware / edge functions.
- Dark mode.
- Analytics or feedback widgets.
- Tests for Astro components (visual parity is the test; Lighthouse + manual QA).
- Migration of `floater-actions` (the lib) — this plan only touches `floaty-site`.

---

## Step-by-Step Tasks

### PHASE 1 — Bootstrap + static shell

#### Task 1: Install Astro + integrations on `astro` branch
- **ACTION**: Create branch, swap deps, run `npx astro add react sitemap`.
- **IMPLEMENT**:
  ```bash
  git checkout -b astro
  rm -rf node_modules package-lock.json vite.config.ts tsconfig.node.json
  npm i -D astro @astrojs/react @astrojs/sitemap @types/react @types/react-dom typescript
  npm i react react-dom
  # floaty stays as-is (file: dependency)
  ```
- **MIRROR**: Existing `package.json` retains `name`, `version`, `description`, `floaty` dep.
- **IMPORTS**: N/A (build config).
- **GOTCHA**: Do NOT delete `node_modules/floaty` — it's a `file:` link to `../floater-actions/dist`. Re-link after `npm i`.
- **VALIDATE**: `npx astro --version` prints v5+; `npx astro check` runs (will report "no pages yet").

#### Task 2: Create `astro.config.mjs`
- **ACTION**: Write top-level Astro config.
- **IMPLEMENT**:
  ```js
  import { defineConfig } from 'astro/config';
  import react from '@astrojs/react';
  import sitemap from '@astrojs/sitemap';

  export default defineConfig({
    site: 'https://floaty.dev', // update if domain differs
    integrations: [react(), sitemap()],
    server: { host: '127.0.0.1' },
    devToolbar: { enabled: false },
    build: { inlineStylesheets: 'auto' }, // inline small CSS, link the rest
  });
  ```
- **MIRROR**: `vite.config.ts` had `server.host = '127.0.0.1'` — preserve.
- **IMPORTS**: as shown.
- **GOTCHA**: `site` must be set or `@astrojs/sitemap` produces relative URLs.
- **VALIDATE**: `npx astro check` clean.

#### Task 3: `tsconfig.json`
- **ACTION**: Extend Astro's strict preset.
- **IMPLEMENT**:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "react"
    },
    "include": ["src/**/*", "astro.config.mjs"],
    "exclude": ["dist"]
  }
  ```
- **MIRROR**: Existing strictness level (was already strict).
- **IMPORTS**: N/A.
- **GOTCHA**: Astro auto-injects `astro/types`. Don't manually declare globals.
- **VALIDATE**: `npx astro check` reports zero TS errors.

#### Task 4: Create `Layout.astro`
- **ACTION**: HTML shell, head, fonts, global scripts.
- **IMPLEMENT**:
  ```astro
  ---
  // src/layouts/Layout.astro
  import '../styles/global.css';
  import '../styles/themes.css';
  import 'floaty/styles.css';

  interface Props {
    title?: string;
    description?: string;
  }
  const {
    title = 'floaty — React floating action toolbar',
    description = 'A microscopic React toolbar. ~8 KB, zero deps, fully themable.',
  } = Astro.props;
  const canonical = new URL(Astro.url.pathname, Astro.site).toString();
  ---
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#fafaf6" />
      <meta name="color-scheme" content="light" />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <!-- Open Graph -->
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={new URL('/og-image.png', Astro.site)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={new URL('/og-image.png', Astro.site)} />

      <!-- Fonts: preconnect + non-blocking -->
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />

      <!-- JSON-LD -->
      <script type="application/ld+json" set:html={JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": "floaty",
        "description": description,
        "codeRepository": "https://github.com/reynsu/floaty",
        "programmingLanguage": "TypeScript",
        "license": "https://opensource.org/licenses/MIT",
      })} />

      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />

      <title>{title}</title>
    </head>
    <body>
      <a href="#top" class="skip-link">Skip to content</a>
      <slot />
      <script is:inline>
        // Scroll-reveal: replaces useScrollReveal hook
        (() => {
          const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
          const els = document.querySelectorAll('[data-reveal=""]');
          if (reduce) { els.forEach(el => el.setAttribute('data-reveal','in')); return; }
          const obs = new IntersectionObserver(es => {
            for (const e of es) if (e.isIntersecting) {
              e.target.setAttribute('data-reveal','in');
              obs.unobserve(e.target);
            }
          }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
          els.forEach(el => obs.observe(el));
        })();
      </script>
    </body>
  </html>
  ```
- **MIRROR**: `index.html:1-26` for head tags; `useScrollReveal.ts` for observer logic.
- **IMPORTS**: as shown.
- **GOTCHA**: `set:html` is required for raw JSON-LD; do NOT use string interpolation in a `<script type="application/ld+json">` — it'll be HTML-escaped.
- **VALIDATE**: View source on dev server shows complete `<head>` with canonical, OG, JSON-LD.

#### Task 5: Convert `Topbar.tsx` → `Topbar.astro`
- **ACTION**: Direct port — JSX → Astro template syntax.
- **IMPLEMENT**:
  ```astro
  ---
  // src/components/Topbar.astro
  ---
  <header class="topbar">
    <div class="page topbar-inner">
      <div class="topbar-l">
        <a href="#top" class="topbar-logo">floaty<span class="slash">/</span></a>
        <span class="ver">v0.1.0</span>
      </div>
      <nav class="topbar-r" aria-label="Main">
        <a href="#examples">Examples</a>
        <a href="#customize">Customize</a>
        <a href="#api">API</a>
        <a href="https://github.com/reynsu/floaty" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
        </a>
      </nav>
    </div>
  </header>
  ```
- **MIRROR**: `Topbar.tsx:1` exactly — same DOM, same classes.
- **IMPORTS**: none.
- **GOTCHA**: Add `aria-label="Main"` to the `<nav>` (was missing — small a11y win).
- **VALIDATE**: Visual parity in dev preview; lighthouse a11y reports nav landmarks.

#### Task 6: Convert `Footer.tsx` → `Footer.astro` and `API.tsx` → `API.astro`
- **ACTION**: Direct port — same as Task 5.
- **IMPLEMENT**: 1:1 JSX→Astro for both. API.tsx is data-only with a render function — port the data arrays into the frontmatter and the `.map()` calls into Astro `{...map(...)}`.
- **MIRROR**: existing files; add `aria-label="Footer"` (already present).
- **IMPORTS**: none beyond the two data arrays in API.astro.
- **GOTCHA**: API.tsx uses a small `<code>` formatting helper — port verbatim into the .astro template using `{cond ? <span/> : null}`.
- **VALIDATE**: Visual diff: side-by-side dev (old) vs preview (new) — pixel-perfect.

**End of Phase 1**: Site renders static shell (Topbar/Footer/API/Hero text/section headers). All interactive areas show placeholder boxes. Deploy preview should be valid HTML, fonts loading, OG meta complete.

---

### PHASE 2 — Islands

#### Task 7: Extract Hero text → `HeroLayout.astro` + extract demo → `HeroDemo.tsx` island
- **ACTION**: Split current `Hero.tsx` into a static layout and a React island for the live demo card.
- **IMPLEMENT**:
  - `src/sections/HeroLayout.astro`: kicker, h1, hero-prose, install pill markup. Provides a `<slot />` for the demo card.
  - `src/islands/HeroDemo.tsx`: contains `HeroDemoStage` + `FloaterActionsProvider`, exports default. Tabs (Live/Source) use existing `useState` pattern.
  - `src/components/CopyableInstall.tsx` (small island, default exported): the single clipboard-copy button row. Or keep static markup and use a tiny inline script. Prefer the inline-script approach to avoid an extra island.
- **MIRROR**: `src/sections/Hero.tsx:94-152` for layout; `:1-89` for demo internals.
- **IMPORTS** (in index.astro):
  ```astro
  import HeroLayout from '../sections/HeroLayout.astro';
  import HeroDemo from '../islands/HeroDemo';
  ...
  <HeroLayout>
    <HeroDemo client:load />
  </HeroLayout>
  ```
- **GOTCHA**: `client:load` because the hero is above-the-fold and users will interact immediately. `client:visible` would cause a brief delay for the demo to be tappable.
- **VALIDATE**: Click Tap-to-summon → bar appears. Tab to Source → code shows.

#### Task 8: Extract Examples → `ExamplesLayout.astro` + `ExamplesIsland.tsx`
- **ACTION**: Section header in Astro, all 7 example cards as one React island.
- **IMPLEMENT**:
  - `src/sections/ExamplesLayout.astro` provides `<section id="examples"><div class="page"><div class="section-h" data-reveal="">…</div><slot /></div></section>`.
  - `src/islands/Examples.tsx`: copy current `Examples.tsx` body but DROP the outer `<section>` and `.section-h` markup (now in Astro).
- **MIRROR**: `src/sections/Examples.tsx:464-545`.
- **IMPORTS**: `floaty`, `'floaty/styles.css'`, demos.
- **GOTCHA**: Use `client:visible` — the examples are below the fold; deferring saves ~40 KB of TTI cost.
- **VALIDATE**: Scroll to Examples → cards reveal-fade in (data-reveal observer still fires from inline script). Each demo summons. Demo/Code tab works.

#### Task 9: Extract Customization → `CustomizationLayout.astro` + `CustomizationIsland.tsx`
- **ACTION**: Section header + mosaic header in Astro; spotlights + mosaic tiles + CssDialog as one React island.
- **IMPLEMENT**:
  - Static parts (`.section-h`, `.mosaic-h`, `.customize-foot`) → `CustomizationLayout.astro`.
  - Interactive parts (Spotlight summon button + CSS panel, every Tile + Dialog) → island.
  - Variant data array stays in `src/data/variants.tsx` (must be `.tsx` because some entries hold JSX `icon` ReactNodes for the dock icons).
- **MIRROR**: `src/sections/Customization.tsx`.
- **IMPORTS**: react, floaty, variants data.
- **GOTCHA**:
  - The whole Customization section is ONE island so `cssVariant` state is shared across tiles.
  - `client:visible` — deferred until scrolled.
  - The `data-reveal=""` attributes on `.section-h` (in .astro) and on tiles (in island) both work — the inline observer query selects ALL `[data-reveal=""]` regardless of source.
- **VALIDATE**: Click any tile → bar summons. Click `{ }` → dialog opens with copy button. ESC dismisses.

#### Task 10: Static shell of `index.astro`
- **ACTION**: Compose the full page.
- **IMPLEMENT**:
  ```astro
  ---
  import Layout from '../layouts/Layout.astro';
  import Topbar from '../components/Topbar.astro';
  import HeroLayout from '../sections/HeroLayout.astro';
  import HeroDemo from '../islands/HeroDemo';
  import ExamplesLayout from '../sections/ExamplesLayout.astro';
  import Examples from '../islands/Examples';
  import CustomizationLayout from '../sections/CustomizationLayout.astro';
  import Customization from '../islands/Customization';
  import API from '../sections/API.astro';
  import Footer from '../sections/Footer.astro';
  ---
  <Layout>
    <Topbar />
    <main>
      <HeroLayout>
        <HeroDemo client:load />
      </HeroLayout>
      <ExamplesLayout>
        <Examples client:visible />
      </ExamplesLayout>
      <CustomizationLayout>
        <Customization client:visible />
      </CustomizationLayout>
      <API />
      <Footer />
    </main>
  </Layout>
  ```
- **MIRROR**: `src/App.tsx` ordering.
- **IMPORTS**: as shown.
- **GOTCHA**: Astro doesn't allow JSX `children` to cross into React islands as React nodes — use `<slot />` in the .astro layouts.
- **VALIDATE**: Build runs without warnings. Page renders identically to previous SPA. Network tab shows multiple JS chunks (one per island).

#### Task 11: Delete obsolete files
- **ACTION**: Remove the React SPA scaffolding.
- **IMPLEMENT**:
  ```bash
  git rm src/main.tsx src/App.tsx index.html vite.config.ts tsconfig.node.json
  git rm src/components/Topbar.tsx src/sections/Footer.tsx src/sections/API.tsx
  git rm src/sections/Hero.tsx           # static parts moved, demo extracted
  git rm src/hooks/useScrollReveal.ts    # replaced by inline script
  ```
- **MIRROR**: N/A.
- **IMPORTS**: N/A.
- **GOTCHA**: Don't delete `Examples.tsx` and `Customization.tsx` yet — Tasks 8 & 9 import their internal demos. Move them to `src/islands/` instead.
- **VALIDATE**: `git status` shows only renames + the deletes you intended; build passes.

#### Task 12: Verify visual parity
- **ACTION**: Side-by-side check vs `main`.
- **IMPLEMENT**: Run `git worktree add ../floaty-site-old main`; `cd ../floaty-site-old && npm i && npm run dev` on port 5173. New Astro on 4321. Open both, compare each section.
- **VALIDATE**: Pixel-perfect match. Lighthouse-Lite quick check shows JS bundle reduced ≥50%.

**End of Phase 2**: Functional Astro site with islands. Behavior identical, payload smaller.

---

### PHASE 3 — SEO / a11y / perf polish

#### Task 13: SEO assets — robots, OG image, favicon set, manifest
- **ACTION**: Add `public/` assets.
- **IMPLEMENT**:
  - `public/robots.txt`:
    ```
    User-agent: *
    Allow: /
    Sitemap: https://floaty.dev/sitemap-index.xml
    ```
  - `public/og-image.png` — 1200×630, render via Figma export OR generate at build time with `satori` (skip if static png is fine).
  - `public/favicon.svg` — small mark of "/" (orange) on transparent.
  - `public/apple-touch-icon.png` — 180×180.
  - `public/manifest.webmanifest`:
    ```json
    { "name": "floaty", "short_name": "floaty", "icons": [{"src":"/icon-192.png","sizes":"192x192","type":"image/png"}], "theme_color":"#fafaf6", "background_color":"#fafaf6", "display":"standalone" }
    ```
- **MIRROR**: N/A.
- **IMPORTS**: N/A.
- **GOTCHA**: `@astrojs/sitemap` writes `/sitemap-index.xml` automatically — ensure `site` is set in config.
- **VALIDATE**: After build, `dist/sitemap-index.xml` exists; visit `/robots.txt`, `/og-image.png`, `/manifest.webmanifest`.

#### Task 14: a11y polish
- **ACTION**: Skip-link, landmark labels, focus order, color audit.
- **IMPLEMENT**:
  - Skip link added in `Layout.astro` (Task 4).
  - CSS for `.skip-link`:
    ```css
    .skip-link {
      position: absolute; left: -9999px;
      padding: 8px 12px; background: var(--fg); color: var(--bg);
      border-radius: 6px; z-index: 9999;
    }
    .skip-link:focus { left: 12px; top: 12px; }
    ```
  - Verify each `<section>` has `aria-labelledby` pointing at its `<h2>` id; add `id` to each `h2` (`hero-h`, `examples-h`, `customize-h`, `api-h`).
  - Run axe-core in dev: `npx @axe-core/cli http://localhost:4321` after fixing.
  - Already-darkened `--fg-3` and `--acc-2` from earlier audit — keep.
- **MIRROR**: existing CSS variables; existing aria-label patterns on `<nav>`s.
- **IMPORTS**: N/A.
- **GOTCHA**: `:focus-visible` already styled — make sure skip-link uses it too.
- **VALIDATE**: axe-core 0 violations. Lighthouse a11y = 100.

#### Task 15: Performance — fonts, critical CSS, code-split
- **ACTION**: Font loading optimization + bundle audit.
- **IMPLEMENT**:
  - Add `media="print" onload="this.media='all'"` pattern to fontshare/google-fonts links to make them non-blocking, with a `<noscript>` fallback. **Better**: keep the `<link rel="stylesheet">` but add `<link rel="preload" as="style">` first. Decide based on Lighthouse FCP delta.
  - `font-display: swap` is already in the CSS URLs.
  - `astro.config.mjs` `build.inlineStylesheets: 'auto'` already inlines critical bits.
  - Audit `dist/assets/*.js` sizes — confirm <30 KB gz total across islands.
- **MIRROR**: existing preconnect tags.
- **IMPORTS**: N/A.
- **GOTCHA**: Don't `preload` fonts you don't immediately use — it just steals bandwidth from the LCP element.
- **VALIDATE**: Lighthouse perf = 100. LCP < 1s on simulated 3G.

#### Task 16: Best-practice meta — canonical, lang, Twitter handle, theme-color
- **ACTION**: Final meta sweep.
- **IMPLEMENT**:
  - `<html lang="en">` (Layout.astro head).
  - Twitter `<meta name="twitter:site" content="@yourhandle" />` if applicable (skip if none).
  - Canonical URL constructed from `Astro.site` + `Astro.url.pathname`.
  - `theme-color` already at `#fafaf6` — add a dark counterpart via `media`:
    ```html
    <meta name="theme-color" content="#fafaf6" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#191c22" media="(prefers-color-scheme: dark)" />
    ```
- **MIRROR**: existing meta.
- **IMPORTS**: N/A.
- **GOTCHA**: Validate OG/Twitter cards via https://cards-dev.twitter.com/validator and https://www.opengraph.xyz/.
- **VALIDATE**: Card validators show correct preview.

#### Task 17: Lighthouse CI gate
- **ACTION**: Add GitHub Action that runs Lighthouse against the preview deploy.
- **IMPLEMENT**:
  ```yaml
  # .github/workflows/lighthouse.yml
  name: Lighthouse
  on: [pull_request]
  jobs:
    lh:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: 20 }
        - run: npm ci && npm run build
        - uses: treosh/lighthouse-ci-action@v12
          with:
            urls: 'http://localhost:4321/'
            uploadArtifacts: true
            temporaryPublicStorage: true
            configPath: ./.lighthouserc.json
  ```
  `.lighthouserc.json`:
  ```json
  { "ci": { "assert": { "assertions": {
      "categories:performance": ["error", {"minScore": 0.95}],
      "categories:accessibility": ["error", {"minScore": 1}],
      "categories:best-practices": ["error", {"minScore": 1}],
      "categories:seo": ["error", {"minScore": 1}]
  }}}}
  ```
- **MIRROR**: N/A.
- **IMPORTS**: N/A.
- **GOTCHA**: a11y must hit exactly 1.0 — any new violation fails CI.
- **VALIDATE**: PR runs the action and shows Lighthouse summary in checks.

#### Task 18: Final QA + delete legacy artifacts
- **ACTION**: Manual QA, screenshot diff, ship.
- **IMPLEMENT**: see Manual Validation checklist below. Then `git merge astro` after sign-off.
- **VALIDATE**: see Acceptance Criteria.

---

## Testing Strategy

### Unit Tests
None — Astro components are mostly markup; React islands are visually verified. Existing floaty lib has 25 tests upstream.

### Integration / E2E
Manual browser testing per checklist below. (Optionally add Playwright later — out of scope for this migration.)

### Edge Cases Checklist
- [ ] First paint with JS disabled — page is fully readable (no demos, but text is fine)
- [ ] Slow 3G — text visible <2s, demos hydrate after but page is usable
- [ ] Reduced-motion — reveal animations skipped, dialog opens instantly
- [ ] Keyboard-only — Tab order: skip-link → topbar → demo summon → tab buttons → each tile → API table → footer
- [ ] Screen reader (VoiceOver) — landmarks announced (banner, main, contentinfo, navigation), each section's h2 announced before content
- [ ] Mobile portrait (375×812) — same layout as before
- [ ] Color contrast — every text element ≥ 4.5:1 (already audited)
- [ ] Crawler view — `curl -A "Googlebot" https://preview.url | grep "Floating actions"` returns the H1
- [ ] OG card preview — Twitter & Discord show correct image/title/description

---

## Validation Commands

### Static Analysis
```bash
cd floaty-site
npx astro check
```
EXPECT: 0 errors, 0 warnings.

### Build
```bash
npm run build
```
EXPECT: `dist/` populated; output sizes printed; sitemap-index.xml present.

### Bundle audit
```bash
ls -la dist/_astro/*.js | awk '{ total += $5 } END { print "Total JS:", total/1024, "KB" }'
```
EXPECT: < 90 KB raw (≈ 30 KB gz).

### Dev server
```bash
npm run dev
```
EXPECT: server on http://127.0.0.1:4321/, HMR works.

### Lighthouse (local)
```bash
npm run build && npm run preview &
sleep 3
npx lighthouse http://localhost:4321 --only-categories=performance,accessibility,best-practices,seo --view
```
EXPECT: 100/100/100/100 (perf may vary 95–100 on machine load).

### Accessibility
```bash
npx @axe-core/cli http://localhost:4321
```
EXPECT: 0 violations.

### Manual Validation
- [ ] Hero summon button shows the bar
- [ ] All 7 example cards work (Demo + Code tabs)
- [ ] All 9 customization tiles work (click summons + `{ }` opens dialog)
- [ ] Dialog Copy button writes to clipboard (test in real browser, not iframe)
- [ ] All anchor links scroll smoothly to targets
- [ ] Reduced-motion preference disables the reveal/dialog animations
- [ ] Footer links open in new tabs with `rel="noreferrer"`
- [ ] View source — full HTML present, no `<div id="root"></div>` only
- [ ] `curl http://localhost:4321/robots.txt` returns the sitemap line
- [ ] `curl http://localhost:4321/sitemap-index.xml` returns valid XML

---

## Acceptance Criteria
- [ ] All 18 tasks completed across 3 phases
- [ ] All validation commands pass
- [ ] Visual parity with current site — no design regression
- [ ] Lighthouse: Perf ≥ 95, A11y = 100, Best-Practices = 100, SEO = 100
- [ ] JS bundle ≤ 30 KB gzipped (vs current 60 KB)
- [ ] LCP ≤ 1s on simulated 4G
- [ ] axe-core: 0 violations
- [ ] Crawler-view test: Googlebot sees the H1, all section headings, API table content
- [ ] OG card validators show correct preview
- [ ] Astro `astro check` clean
- [ ] CI gate green

## Completion Checklist
- [ ] Code follows discovered patterns (verbatim CSS port; same DOM structure for parity)
- [ ] Error handling unchanged (floaty's existing dev warnings preserved)
- [ ] No hardcoded values (Astro.site URL, JSON-LD URLs use the env)
- [ ] Documentation updated: README mentions Astro + Lighthouse score badge
- [ ] No unnecessary scope additions (no dark mode, no blog, no analytics)
- [ ] Self-contained — no questions needed during implementation

## Risks
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| floaty portal rendering breaks under SSR | Medium | High | Use `client:only="react"` on demo islands so SSR is skipped; the lib already gates on `typeof document` |
| CSS specificity conflicts after import re-order | Low | Medium | Astro inlines stylesheets in import order; mirror Layout.astro import order to current main.tsx |
| Lighthouse 95 perf cap due to fontshare TTFB | Medium | Low | Keep fonts as-is; if perf <95 self-host Switzer subset. Don't block merge. |
| Live demos hydrate too late, frustrating users | Low | Medium | Hero demo uses `client:load`; Examples/Customize use `client:visible` with rootMargin to start hydration just before visible |
| Variant data with React nodes (icons) breaks at SSR boundary | Medium | Medium | Keep variants data inside the React island, never as Astro frontmatter |
| Tab-state in HeroDemo lost when island remounts on theme change | Low | Low | No theme change in scope; not applicable |
| Existing uncommitted dialog light-style edit conflicts during P1 file deletes | Low | Low | Commit it on `main` first (`git stash` then `git stash pop` post-checkout if needed) |

## Notes
- **Domain**: Plan assumes `https://floaty.dev`. Update `astro.config.mjs` `site` if different (the JSON-LD and sitemap depend on it).
- **OG image**: 1200×630. Quickest path is exporting from Figma. If you want it generated at build time from a template (so the version number is dynamic), add `satori` + a small endpoint. Out of P3 scope by default.
- **Pending in working tree**: a CSS edit to `.css-dialog-frame` / `.css-dialog-head` / `.css-dialog-pre` lightening the dialog colors is uncommitted. Commit on `main` BEFORE starting the migration so the port has the final styles.
- **Why one Customization island, not many?** The `CssDialog` shares state across all tiles. Splitting tiles into separate islands would require either per-tile dialogs (worse UX, more JS) or a global store (extra dep). One island = simplest correct solution.
- **`useScrollReveal` removal**: Doing this as a single inline script in `Layout.astro` ships zero extra JS for that feature (fits inside the 14 KB initial-document budget).
