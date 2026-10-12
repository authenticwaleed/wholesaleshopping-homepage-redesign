// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The dev toolbar sits over the page; keep it off so previews and screenshots show the real UI.
  devToolbar: { enabled: false },
  // The stylesheet is small (about 10 KB), so inlining it saves a render-blocking request
  build: { inlineStylesheets: 'always' },
});
