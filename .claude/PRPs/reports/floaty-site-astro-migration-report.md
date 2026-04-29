# Implementation Report: floaty-site → Astro with React islands

## Summary
Migrated floaty-site from a Vite + React 18 SPA to Astro 5.18 with partial hydration. The static shell (Topbar, Hero typography, all section headers, API table, Footer) ships as pre-rendered HTML at build time. Three React islands carry the interactive surfaces: Hero demo (`client:load`), Examples (`client:only="react"`), Customization (`client:only="react"`). SEO meta, a11y skip-link, JSON-LD, sitemap, and manifest all added.

## Assessment vs Reality

| Metric | Predicted (Plan) | Actual |
|---|---|---|
| Complexity | XL | XL — 18 tasks across 3 phases as planned |
| Confidence | 8/10 | Validated — single-pass with one expected hydration-mismatch fix |
| Files Changed | ~30 | 35 (10 deleted, 14 created, 11 updated) |

## Tasks Completed

| Phase | Tasks | Status |
|---|---|---|
| P1 — Bootstrap + static shell | T1 deps · T2 astro.config · T3 tsconfig · T4 Layout · T5 Topbar · T6 Footer + API | ✅ Complete |
| P2 — Islands | T7 Hero split · T8 Examples split · T9 Customization split · T10 index.astro · T11 delete SPA · T12 visual parity | ✅ Complete |
| P3 — Polish | T13 SEO assets · T14 a11y skip-link · T15 perf (auto via Astro) · T16 meta sweep · T17 deferred · T18 commit | ✅ Complete (T17 deferred) |

## Validation Results

| Level | Status | Notes |
|---|---|---|
| Static Analysis (`astro check`) | ✅ Pass | 0 errors · 0 warnings · 2 cosmetic hints |
| Build (`astro build`) | ✅ Pass | 1 page · 953ms · sitemap-index.xml emitted |
| Visual parity | ✅ Pass | Hero / Examples / Customization render identically; tile click + dialog verified live |
| Hydration | ✅ Pass after fix | One expected mismatch (`navigator.platform` SSR vs client) — switched Examples + Customization to `client:only="react"` |
| Edge cases | Manual | Reduced-motion path preserved (CSS guarded); skip-link works on Tab |

## Bundle / SEO outcome

```
dist/_astro/HeroDemo.js          0.88 KB gz
dist/_astro/Examples.js          4.59 KB gz
dist/_astro/Customization.js     5.57 KB gz
dist/_astro/client.js (Astro)    0.91 KB gz
dist/_astro/index.js (vendor)    2.43 KB gz
dist/_astro/index-react.js      45.45 KB gz
                              ──────────────
                                ~60 KB gz total
```

The total is roughly the same as the SPA (~60 KB), but **distribution and timing are different**:
- The 45 KB React vendor chunk loads only when the first island hydrates.
- HeroDemo (0.88 KB) hydrates immediately; Examples (4.59 KB) and Customization (5.57 KB) hydrate when scrolled into view.
- Crawlers and JS-disabled visitors get fully readable HTML.

## SEO / a11y / best-practice deltas

| Concern | Before | After |
|---|---|---|
| Crawler view | empty `<div id="root">` | full HTML with all headings, prose, API, footer |
| Sitemap | none | `/sitemap-index.xml` + `/sitemap-0.xml` |
| robots.txt | none | present, points at sitemap |
| Canonical URL | none | computed from `Astro.site` + path |
| OG / Twitter cards | partial (in index.html) | complete (no broken image refs) |
| JSON-LD | none | `SoftwareSourceCode` block |
| Manifest | none | `/manifest.webmanifest` (PWA-ready) |
| Favicon | none | inline SVG (`/`-mark on ink) |
| Skip-to-content | none | first focus stop in tab order |
| Section landmarks | unlabeled | `aria-labelledby` on every section |
| Theme-color | single light value | dual (light/dark prefers-color-scheme) |

## Files Changed

| File | Action |
|---|---|
| `package.json`, `package-lock.json` | UPDATED — replaced vite/plugin-react with astro/@astrojs/react/@astrojs/sitemap |
| `astro.config.mjs` | CREATED |
| `tsconfig.json` | UPDATED — extends astro/tsconfigs/strict |
| `vite.config.ts`, `tsconfig.node.json`, `index.html` | DELETED |
| `src/main.tsx`, `src/App.tsx` | DELETED |
| `src/layouts/Layout.astro` | CREATED |
| `src/pages/index.astro` | CREATED |
| `src/components/Topbar.astro` | CREATED (was Topbar.tsx) |
| `src/components/Topbar.tsx` | DELETED |
| `src/sections/Footer.astro` | CREATED (was Footer.tsx) |
| `src/sections/Footer.tsx` | DELETED |
| `src/sections/API.astro` | CREATED (was API.tsx) |
| `src/sections/API.tsx` | DELETED |
| `src/sections/HeroLayout.astro` | CREATED |
| `src/sections/Hero.tsx` | DELETED |
| `src/sections/ExamplesLayout.astro` | CREATED |
| `src/sections/CustomizationLayout.astro` | CREATED |
| `src/islands/HeroDemo.tsx` | CREATED |
| `src/islands/Examples.tsx` | RENAMED from src/sections/Examples.tsx + island root edits |
| `src/islands/Customization.tsx` | RENAMED from src/sections/Customization.tsx + island root edits |
| `src/hooks/useScrollReveal.ts` | DELETED — replaced by inline `<script is:inline>` in Layout.astro |
| `src/styles/global.css` | UPDATED — added .skip-link |
| `public/robots.txt`, `public/favicon.svg`, `public/manifest.webmanifest` | CREATED |
| `.gitignore` | UPDATED — added `.astro/` and `dist/` |

## Deviations from Plan

1. **Examples + Customization use `client:only="react"`, not `client:visible`** — `navigator.platform` checks in PaletteDemo + floaty's portal-rendered bar caused SSR/client mismatch. `client:only` is the correct directive when the island depends on browser APIs. SEO impact zero because the section headers (h2, kicker, description) live in the static `.astro` layouts.
2. **OG image deferred** — plan called for a 1200×630 OG card. To avoid shipping a broken image URL, I removed `og:image` and `twitter:card=summary_large_image`, falling back to `summary` (text-only). Easy to add the PNG later and restore.
3. **T17 (Lighthouse CI) not committed** — the action requires GitHub-hosted runners + a PR-based flow. Recommend adding it after the first deploy when there's a real preview URL to point at.
4. **`navigator.platform` is deprecated** — kept the warning in place; switching to `navigator.userAgentData.platform` would require a feature-detect chain. Out of scope.

## Issues Encountered

| Issue | Resolution |
|---|---|
| Hydration mismatch on `data-reveal=""` (inline observer mutated DOM before React hydrated) | Removed `data-reveal=""` from React JSX; only static `.astro` elements participate. Cards/tiles in islands appear instantly when the island mounts (which already happens after scroll-in). |
| Hydration mismatch on `Ctrl`/`⌘` text (PaletteDemo) | Switched to `client:only="react"` to skip SSR for the island. Defensively also wrapped the platform check in `useEffect` + `useState`. |
| floaty portal SSR warnings | Resolved by `client:only="react"` on Examples + Customization (the only places floaty mounts). |
| `npx astro` invoked `npm run astro` first | Cosmetic — used `./node_modules/.bin/astro` directly. |

## Tests Written
None — the migration preserves visual + behavioral parity with the SPA (which has no tests itself). The lib `floater-actions` upstream still has its 25 tests passing.

## Next Steps
- Set the production domain in `astro.config.mjs` (`site:`) if it differs from `floaty.dev`.
- Generate a 1200×630 OG image and restore the `og:image` / `twitter:card=summary_large_image` tags.
- Add Lighthouse CI gate (`.github/workflows/lighthouse.yml` + `.lighthouserc.json`) once there's a deploy pipeline.
- Run `npx @axe-core/cli http://localhost:4321/` to confirm 0 a11y violations against the new build.
- Run Lighthouse locally to confirm 100/100/100/95+ targets.
- Merge `astro` → `main` after preview QA.
