// @ts-check
import { defineConfig } from 'astro/config';

// User page (Strafer14.github.io) on a custom domain → base stays '/'.
export default defineConfig({
  site: 'https://www.strafer.dev',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
