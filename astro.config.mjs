import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain so canonical URLs, OG tags,
// and the sitemap point at the right place.
export default defineConfig({
  site: 'https://floaty.dev',
  integrations: [react(), sitemap()],
  server: { host: '127.0.0.1' },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
  vite: {
    // react-floaty is a file: dependency rebuilt via tsup; keep its prebundle stable.
    optimizeDeps: { include: ['react-floaty'] },
  },
});
