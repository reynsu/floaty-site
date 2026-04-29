# Local Review: `astro` branch (5 commits since `main`)

**Reviewed**: 2026-04-29
**Branch**: `astro` → `main`
**Decision**: **APPROVE with comments** — fix one MEDIUM nit before merging to main.

## Summary
The Astro migration plus subsequent perf and rename work are sound. Build clean, types clean, lib tests still 25/25. One stale config reference and a few accessibility/best-practice nits. No CRITICAL or HIGH issues; safe to merge after the MEDIUM fixes.

## Findings

### CRITICAL
None.

### HIGH
None.

### MEDIUM

#### M-1 · Stale Vite `optimizeDeps` reference
**File**: `astro.config.mjs:15`

```js
optimizeDeps: { include: ['floaty'] },
```

The package was renamed `floaty` → `react-floaty` in commit `836977b`. Vite silently ignores include entries that don't resolve, so this isn't an error today — but the prebundle hint no longer applies, which can cause a longer cold-start on first dev run.

**Fix**:
```js
optimizeDeps: { include: ['react-floaty'] },
```

#### M-2 · Redundant `<nav>` aria-labels
**Files**: `src/sections/Footer.astro:13`, `src/components/Topbar.astro:13`

```html
<nav class="topbar-r" aria-label="Main">
<nav class="foot-r" aria-label="Footer">
```

`<footer> > <nav aria-label="Footer">` is redundant — the `<footer>` landmark already names itself "contentinfo". Screen readers will announce both. The topbar's "Main" label is fine but `<nav aria-label="Primary">` is the more conventional naming.

**Fix**: drop the footer's `aria-label` (or change to `Site links`); rename topbar to `Primary` for clarity. Pure a11y nit — does not block.

### LOW

#### L-1 · `navigator.platform` is deprecated
**File**: `src/islands/Examples.tsx:219`

```ts
setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
```

The plan called this out and chose to keep it (modern replacement `navigator.userAgentData.platform` is Chromium-only and would need a fallback chain). The deprecation prints a TS hint but the runtime works in every browser. Acceptable.

#### L-2 · Twitter card downgraded to `summary`
**File**: `src/layouts/Layout.astro:54`

The plan explicitly called this out — until a 1200×630 OG card lands at `public/og-image.png`, the card stays text-only. Note for the post-merge follow-up.

#### L-3 · Reveal observer assumes empty-string attribute exactly
**File**: `src/layouts/Layout.astro:88`

```js
const els = document.querySelectorAll('[data-reveal=""]');
```

If anyone ever sets `data-reveal="something-other-than-in"`, the observer won't watch it. Today no caller does. Adding a small comment to flag the contract would be polite but not necessary.

#### L-4 · React island `client:only` skips SSR for two large sections
**File**: `src/pages/index.astro:23,27`

```astro
<Examples client:only="react" />
<Customization client:only="react" />
```

This is the correct directive (PaletteDemo's `navigator.platform` and floaty's `document.body` portal both required it), and SEO is preserved by the section-h `<h2>` elements living in the static `.astro` layouts. Just verify with `curl https://<deploy-url>/ | grep -E 'Seven real|9 themes'` after the first deploy that crawlers see those headings.

#### L-5 · `astro-floaty` package URL pre-publish
**File**: `src/sections/Footer.astro:15`

```html
<a href="https://www.npmjs.com/package/react-floaty">npm</a>
```

Fine after publish. Until then the link 404s. Worth a placeholder `<a aria-disabled="true">` if you ship the site before the npm release.

## Validation Results

| Check | Result |
|---|---|
| `astro check` (type) | ✅ Pass — 0 errors / 0 warnings / 2 hints (deprecation + cosmetic) |
| `astro build` | ✅ Pass — 1 page · 1.25s · sitemap-index.xml emitted |
| Lib tests (upstream) | ✅ 25 / 25 pass |
| Visual parity | ✅ Verified live in preview during migration |
| a11y skip-link | ✅ Tab-first focus stop |

## Files Reviewed (significant only — skipped lockfile + reports)

| File | Change | Verdict |
|---|---|---|
| `astro.config.mjs` | A | M-1 (stale include) |
| `tsconfig.json` | M | OK — extends astro/tsconfigs/strict |
| `package.json` | M | OK — react-floaty dep correct |
| `src/layouts/Layout.astro` | A | OK — L-3 comment opportunity |
| `src/pages/index.astro` | A | OK — L-4 verify post-deploy |
| `src/components/Topbar.astro` | A (was .tsx) | M-2 nav label nit |
| `src/sections/Footer.astro` | A (was .tsx) | M-2 nav label nit, L-5 link |
| `src/sections/API.astro` | A (was .tsx) | OK |
| `src/sections/HeroLayout.astro` | A | OK — inline copy script is well-scoped |
| `src/sections/ExamplesLayout.astro` | A | OK |
| `src/sections/CustomizationLayout.astro` | A | OK |
| `src/islands/HeroDemo.tsx` | A | OK — auto-summon respects reduced-motion |
| `src/islands/Examples.tsx` | R (from sections) | L-1 deprecation note only |
| `src/islands/Customization.tsx` | R (from sections) | OK — single dialog state shared correctly |
| `src/styles/global.css` | M | OK — content-visibility + contain rules well-scoped |
| `public/robots.txt` | A | OK |
| `public/favicon.svg` | A | OK |
| `public/manifest.webmanifest` | A | OK |
| `.gitignore` | M | OK — ignores `.astro/` and `dist/` |
| `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, 4 `.tsx` ports | D | OK — all replaced by `.astro` equivalents |

## Recommendation

**APPROVE with comments**. Fix M-1 (one-character change in astro.config.mjs) before merging to `main`. M-2 is a polite a11y improvement; the rest are non-blocking notes for the post-merge follow-up list (OG image, npm publish, post-deploy crawler check).

## Next Steps

1. Fix M-1: `'floaty'` → `'react-floaty'` in `astro.config.mjs`.
2. (Optional) Fix M-2: drop the redundant `aria-label` on the footer nav, rename topbar's to `Primary`.
3. Merge `astro` → `main`.
4. Publish `react-floaty@0.1.0` to npm.
5. Generate `public/og-image.png` (1200×630) and restore `og:image` + `summary_large_image`.
6. Set up `@astrojs/check` in CI + add the Lighthouse-CI gate the plan deferred.
