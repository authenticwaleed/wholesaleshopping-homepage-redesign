// Turns the submission drafts in docs/ into PDFs in docs/pdf/.
//
//   npm run make-pdfs
//
// Markdown → HTML (marked) → PDF (Playwright's Chromium), using the site's own fonts and logo.
// The "Draft for you to edit" note at the top of each file is left out of the PDF:
// edit the .md files, then run this again.
//
// Also writes submission.pdf: AI Build Notes + CRO decisions + "one more day" in one file.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';
import { chromium } from '@playwright/test';

const docsDir = new URL('../docs/', import.meta.url);
const outDir = new URL('pdf/', docsDir);

const DOCS = [
  { file: 'ai-build-notes.md', submit: true },
  { file: 'cro-decisions.md', submit: true },
  { file: 'one-more-day.md', submit: true },
  { file: 'video-outline.md', submit: false }, // for you, while recording
];

const SUBTITLE = 'WholesaleShopping.co.uk homepage redesign · NaskSoft AI Web &amp; CRO assessment · October 2026';

const base64 = async (url) => (await readFile(url)).toString('base64');

// Drop the "> **Draft for you to edit.** …" note (and its continuation lines)
function withoutDraftNote(markdown) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.startsWith('> **Draft for you to edit.**'));
  if (start === -1) return markdown;
  let end = start;
  while (end < lines.length && lines[end].startsWith('>')) end++;
  return [...lines.slice(0, start), ...lines.slice(end)].join('\n');
}

// Embed images so the PDF never depends on file paths
async function inlineImages(html) {
  const sources = [...new Set([...html.matchAll(/src="(images\/[^"]+)"/g)].map((m) => m[1]))];
  for (const src of sources) {
    const type = src.endsWith('.png') ? 'image/png' : 'image/jpeg';
    html = html.replaceAll(`src="${src}"`, `src="data:${type};base64,${await base64(new URL(src, docsDir))}"`);
  }
  return html;
}

async function bodyFor(file) {
  const markdown = withoutDraftNote(await readFile(new URL(file, docsDir), 'utf8'));
  // Put the subtitle line straight after the document's title
  const html = marked.parse(markdown).replace(/(<\/h1>)/, `$1<p class="subtitle">${SUBTITLE}</p>`);
  return `<article>${await inlineImages(html)}</article>`;
}

const fonts = `
  @font-face { font-family: 'Inter'; font-weight: 100 900;
    src: url(data:font/woff2;base64,${await base64(new URL('../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', import.meta.url))}) format('woff2'); }
  @font-face { font-family: 'Archivo Display'; font-weight: 800; font-stretch: 75%;
    src: url(data:font/woff2;base64,${await base64(new URL('../public/fonts/archivo-display.woff2', import.meta.url))}) format('woff2'); }`;
const logo = `data:image/svg+xml;base64,${await base64(new URL('../public/logo.svg', import.meta.url))}`;

const page = (articles) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<style>
  ${fonts}
  @page { size: A4; margin: 18mm 18mm 20mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; color: #111; }
  article + article { break-before: page; }
  .logo { display: block; height: 9mm; margin: 0 0 7mm; border: 0; }
  h1, h2 { font-family: 'Archivo Display', 'Arial Narrow', sans-serif; font-weight: 800; font-stretch: 75%;
    text-transform: uppercase; line-height: 1.05; break-after: avoid; }
  h1 { font-size: 24pt; margin: 0 0 2mm; }
  h2 { font-size: 14pt; margin: 7mm 0 2.5mm; }
  h3 { font-size: 11pt; margin: 5mm 0 1.5mm; break-after: avoid; }
  .subtitle { margin: 0 0 6mm; font-size: 8.5pt; color: #666; }
  p { margin: 0 0 2.5mm; orphans: 3; widows: 3; }
  ul, ol { margin: 0 0 3mm; padding-left: 5mm; }
  li { margin-bottom: 1.2mm; break-inside: avoid; }
  li > ul, li > ol { margin: 1mm 0 0; }
  strong { font-weight: 700; }
  code { font-family: ui-monospace, 'DejaVu Sans Mono', monospace; font-size: 0.88em; background: #f4f3f1; padding: 0 0.8mm; border-radius: 1mm; }
  a { color: inherit; }
  hr { border: 0; border-top: 0.3mm solid #ddd; margin: 5mm 0; }
  table { width: 100%; border-collapse: collapse; margin: 2mm 0 4mm; font-size: 8.8pt; line-height: 1.4; }
  th, td { border: 0.3mm solid #ddd; padding: 1.8mm 2.2mm; text-align: left; vertical-align: top; }
  th { background: #f4f3f1; font-weight: 700; }
  tr { break-inside: avoid; }
  img { display: block; max-width: 100%; max-height: 105mm; margin: 3mm auto 5mm; border: 0.3mm solid #e4e4e4; break-inside: avoid; }
  blockquote { margin: 0 0 3mm; padding: 2mm 4mm; border-left: 1mm solid #111; background: #f4f3f1; }
</style>
</head>
<body>
${articles.map((a) => a.replace('<article>', `<article><img class="logo" src="${logo}" alt="Wholesale Shopping">`)).join('\n')}
</body>
</html>`;

const footer = `<div style="width:100%; padding:0 18mm; font-family:sans-serif; font-size:7.5px; color:#888; display:flex; justify-content:space-between;">
  <span>WholesaleShopping.co.uk homepage redesign</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage();

async function print(articles, name) {
  await tab.setContent(page(articles), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const pdf = await tab.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: footer,
  });
  await writeFile(new URL(name, outDir), pdf);
  console.log(`✓ docs/pdf/${name} (${(pdf.length / 1024).toFixed(0)} KB)`);
}

const bodies = {};
for (const doc of DOCS) {
  bodies[doc.file] = await bodyFor(doc.file);
  await print([bodies[doc.file]], doc.file.replace(/\.md$/, '.pdf'));
}
await print(DOCS.filter((d) => d.submit).map((d) => bodies[d.file]), 'submission.pdf');

await browser.close();
