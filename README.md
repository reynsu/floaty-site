# floaty-site

Astro 5 + React-island showcase for [react-floaty](https://github.com/reynsu/floaty) — live demos of the floating action toolbar across mobile and desktop contexts.

## Stack

- **Astro 5** — static-first, partial hydration
- **React 18** — only inside three islands (`HeroDemo`, `Examples`, `Customization`)
- **`react-floaty`** — the library being showcased
- **Vercel** — deploy target via `@astrojs/vercel`

Most of the page is pre-rendered HTML; React ships only for interactive surfaces.

## Sections

- **Hero** — interactive bar with auto-summon and Live/Source tabs
- **Examples** — seven live use cases (Demo + Code per card)
- **Customization** — nine themes, including radial / animated / dock layouts
- **API** — Provider props + hook surface

## Development

```bash
npm install
npm run dev          # http://127.0.0.1:4321/
```

The site pulls `react-floaty` directly from GitHub via `github:reynsu/floaty#main`.
The lib's `dist/` is gitignored, but a `prepare` script in its `package.json`
rebuilds it automatically on every `npm install` — including the one Vercel
runs during deploy. Once the package is published to npm, switch to:

```diff
- "react-floaty": "github:reynsu/floaty#main",
+ "react-floaty": "^0.1.0",
```

## Build & Preview

```bash
npm run build        # static output to dist/ + .vercel/output/static
npm run preview      # serves dist/ locally
```

`astro check` runs as part of `npm run build` — type errors fail the build.

## Deploy to Vercel

Two ways:

### A. Connect the GitHub repo (recommended)

1. Sign in at [vercel.com](https://vercel.com) and pick **Add New… → Project**.
2. Import `reynsu/floaty-site`.
3. Vercel auto-detects Astro and uses `npm run build`. No further config needed.
4. (Optional) Set env var `SITE_URL` to your custom domain (e.g. `https://floaty.dev`) so canonical URLs, the sitemap, and OG meta point at the right place.
5. Deploy. Subsequent pushes to `main` trigger preview / production builds automatically.

### B. Vercel CLI (one-off)

```bash
npm i -g vercel
vercel login
vercel                # creates a preview deploy
vercel --prod         # promotes to production
```

### What's already wired

- **`@astrojs/vercel` adapter** in `astro.config.mjs` (`output: 'static'`)
- **`vercel.json`** — security headers (HSTS, frame-options, referrer-policy, permissions-policy), immutable cache for `_astro/*` + favicons + manifest, short cache for sitemap/robots
- **Web Analytics** enabled via the adapter (`webAnalytics: { enabled: true }`)
- **Build artifacts**: `dist/` (Astro) + `.vercel/output/` (Vercel build output API). Both gitignored.

### Env vars

| Name | Required | Default | Purpose |
|---|---|---|---|
| `SITE_URL` | no | `https://floaty.dev` | Canonical URL, OG `og:url`, sitemap entries |

## License

MIT
