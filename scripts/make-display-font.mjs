// Builds the display font used for headings and prices: Archivo pinned to the one style the design
// uses (extra-bold, 75% width) with Latin characters only. The full variable font is 88 KB and was
// competing with the hero photo for bandwidth on phones (Lighthouse, 13 Oct).
//
//   npm run make-font   → public/fonts/archivo-display.woff2 (commit the result)

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const source = new URL('../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2', import.meta.url);
const target = new URL('../public/fonts/archivo-display.woff2', import.meta.url);

// Printable ASCII plus the punctuation and symbols used in headings and prices
const ascii = String.fromCharCode(...Array.from({ length: 95 }, (_, i) => i + 32));
const characters = `${ascii}£€’‘“”–—·…×`;

const original = await readFile(source);
const font = await subsetFont(original, characters, {
  targetFormat: 'woff2',
  variationAxes: { wght: 800, wdth: 75 },
});

await mkdir(new URL('../public/fonts/', import.meta.url), { recursive: true });
await writeFile(target, font);
console.log(`archivo-display.woff2: ${(original.length / 1024).toFixed(0)} KB → ${(font.length / 1024).toFixed(1)} KB`);
