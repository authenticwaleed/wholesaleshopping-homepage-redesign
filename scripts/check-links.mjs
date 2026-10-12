// Checks every link on the built homepage (PLAN.md §9, test 10).
//
//   npm run build && node scripts/check-links.mjs
//
// To stay polite to the live store (it rate-limits with HTTP 429):
// - collection links are checked against the store's own collection list (/collections.json),
// - product links against its product feed (/products.json), a few requests in total,
// - every other link gets one request, one at a time.
// Writes a report to notes/link-check.md and exits with code 1 if a link is broken.

import { readFile, writeFile } from 'node:fs/promises';
import { STORE } from '../src/lib/config.js';

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retries network errors and rate limiting (429) a couple of times, waiting longer each time
async function request(url, { json = false } = {}) {
  for (let attempt = 1; ; attempt++) {
    await sleep(600 * attempt ** 2);
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        headers: { 'user-agent': USER_AGENT, accept: json ? 'application/json' : 'text/html,*/*' },
      });
      if (res.status === 429 && attempt < 3) continue;
      return { status: res.status, body: json && res.ok ? await res.json() : null };
    } catch (err) {
      if (attempt >= 3) throw err;
    }
  }
}

// Every page of a paginated Shopify JSON list (/collections.json or /products.json)
async function allHandles(path, key) {
  const handles = new Set();
  for (let page = 1; page <= 30; page++) {
    const { status, body } = await request(`${STORE}${path}?limit=250&page=${page}`, { json: true });
    if (status !== 200) throw new Error(`${path} page ${page}: HTTP ${status}`);
    if (!body[key].length) break;
    for (const item of body[key]) handles.add(item.handle);
  }
  return handles;
}

// ---- Collect links: everything in the built HTML, plus the product links scripts create at runtime ----
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const links = new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replaceAll('&amp;', '&')));
const snapshot = JSON.parse(await readFile(new URL('../src/data/products.json', import.meta.url), 'utf8'));
for (const p of snapshot.products) links.add(p.url);

const results = []; // { url, status, verdict: 'ok' | 'warn' | 'fail', note }
const record = (url, verdict, status, note = '') => results.push({ url, verdict, status, note });

const collections = new Map(); // handle → url
const products = new Map();
const others = [];
for (const url of links) {
  if (url.startsWith('/_astro/') || url.startsWith('#') || url === '/') continue; // the page's own files
  if (url.startsWith('tel:')) record(url, /^tel:\+\d{10,15}$/.test(url) ? 'ok' : 'fail', '-', 'phone number format');
  else if (url.startsWith('mailto:')) record(url, /^mailto:[^@\s]+@[^@\s]+\.[a-z]+$/i.test(url) ? 'ok' : 'fail', '-', 'email format');
  else if (url.startsWith(`${STORE}/collections/`)) collections.set(new URL(url).pathname.split('/')[2], url);
  else if (url.startsWith(`${STORE}/products/`)) products.set(new URL(url).pathname.split('/')[2], url);
  else if (/^https?:\/\//.test(url)) others.push(url);
  else if (url.startsWith('/')) {
    // A file served by this site (e.g. /logo.svg)
    const exists = await readFile(new URL(`../dist${url}`, import.meta.url)).then(() => true, () => false);
    record(url, exists ? 'ok' : 'fail', exists ? 200 : 404, 'local file');
  } else record(url, 'fail', '-', 'unrecognised link');
}

console.log(`Checking ${collections.size} collections, ${products.size} products and ${others.length} other links…`);

const liveCollections = await allHandles('/collections.json', 'collections');
for (const [handle, url] of collections) {
  record(url, liveCollections.has(handle) ? 'ok' : 'fail', '-', liveCollections.has(handle) ? 'in /collections.json' : 'collection not found');
}

const liveProducts = await allHandles('/products.json', 'products');
for (const [handle, url] of products) {
  record(url, liveProducts.has(handle) ? 'ok' : 'fail', '-', liveProducts.has(handle) ? 'in /products.json' : 'product not found');
}

// Social and review sites reject scripted requests (Facebook answers 400, Trustpilot 403) even when
// the page works fine in a browser, so their errors are flagged for a check by hand instead.
const BLOCKS_SCRIPTS = ['facebook.com', 'instagram.com', 'x.com', 'linkedin.com', 'tiktok.com', 'pinterest.co.uk', 'trustpilot.com'];
const blocksScripts = (url) => BLOCKS_SCRIPTS.some((domain) => new URL(url).hostname.endsWith(domain));

for (const url of others) {
  try {
    const { status } = await request(url);
    if (status < 400) record(url, 'ok', status);
    else if (status === 429 || blocksScripts(url)) record(url, 'warn', status, 'blocks automated requests, check by hand');
    else record(url, 'fail', status);
  } catch (err) {
    record(url, 'fail', '-', err.message);
  }
}

// ---- Report ----
const count = (v) => results.filter((r) => r.verdict === v).length;
const rows = [...results]
  .sort((a, b) => ['fail', 'warn', 'ok'].indexOf(a.verdict) - ['fail', 'warn', 'ok'].indexOf(b.verdict))
  .map((r) => `| ${{ ok: '✅', warn: '⚠️', fail: '❌' }[r.verdict]} | ${r.status} | ${r.url} | ${r.note} |`);
const report = `# Link check

Run on ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC by \`scripts/check-links.mjs\`: **${count('ok')} OK, ${count('warn')} to check by hand, ${count('fail')} broken** out of ${results.length} links.

| | Status | Link | Note |
|---|---|---|---|
${rows.join('\n')}
`;
await writeFile(new URL('../notes/link-check.md', import.meta.url), report);
console.log(`${count('ok')} OK · ${count('warn')} to check by hand · ${count('fail')} broken (report: notes/link-check.md)`);
for (const r of results.filter((x) => x.verdict !== 'ok')) console.log(`  ${r.verdict.toUpperCase()} ${r.status} ${r.url} ${r.note}`);
process.exit(count('fail') ? 1 : 0);
