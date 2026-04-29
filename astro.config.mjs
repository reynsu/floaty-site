import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Update `site` to the production domain so canonical URLs, OG tags,
// and the sitemap point at the right place. Vercel deploys override
// this with the deployment URL via the SITE env var if you wire it up.
const SITE = process.env.SITE_URL ?? 'https://floaty.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: false,
  }),
  integrations: [react(), sitemap()],
  server: { host: '127.0.0.1' },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
  vite: {
    // react-floaty is a file: dependency rebuilt via tsup; keep its prebundle stable.
    optimizeDeps: { include: ['react-floaty'] },
  },
});
