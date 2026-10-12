// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The dev toolbar sits over the page; keep it off so previews and screenshots show the real UI.
  devToolbar: { enabled: false },
  // The stylesheet is small (about 10 KB), so inlining it saves a render-blocking request
  build: { inlineStylesheets: 'always' },
  // Files under 10 KB referenced from CSS are embedded as data URLs: this puts the 8 KB display font
  // straight into the page, so headings render in it from the first paint
  vite: { build: { assetsInlineLimit: 10 * 1024 } },
});
