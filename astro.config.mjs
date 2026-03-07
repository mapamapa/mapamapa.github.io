import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mapamapa.github.io',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
