// Copies a snapshot of real products from the live WholesaleShopping store (Shopify's public
// product JSON) and trims it to what the homepage needs.
//
//   npm run fetch-data
//
// Writes:
//   src/data/products.json         – used at build time to render the product cards
//   public/data/products.min.json  – loaded in the browser only when Quick Add or Search opens
//
// Run it by hand (not on every build) and commit the output, so builds never depend on the live site.

import { mkdir, writeFile } from 'node:fs/promises';
import { STORE } from '../src/lib/config.js';
import { banners, categories, hero, mainNav } from '../src/data/content.js';

const FETCH_LIMIT = 40; // products requested per collection (some get filtered out)
const KEEP = 16; // products kept per collection: 12 shown + spares
const TILE_CANDIDATES = 4; // photos kept per category tile, to choose from
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';

// Homepage product tabs → store collections (PLAN.md §6.8)
const TABS = [
  { key: 'new-in', label: 'New In', handle: 'new-wholesale-clothing', newestFirst: true },
  { key: 'best-sellers', label: 'Best Sellers', handle: 'best-seller' },
  { key: 'plus-size', label: 'Plus Size', handle: 'wholesale-plus-size-clothing' },
  { key: 'footwear', label: 'Footwear', handle: 'wholesale-women-footwear' },
  { key: 'made-in-italy', label: 'Made in Italy', handle: 'womens-made-in-italy' },
];

// Collections used for the promo banners, not shown as tabs
const EXTRA = [
  { key: 'autumn-winter', handle: 'autumn-winter' },
  { key: 'christmas', handle: 'christmas' },
];

// Products the page names directly (hero, banners, menu features) are always included
const PINNED = [...hero.looks, ...banners.map((b) => b.product), ...mainNav.map((item) => item.feature)].filter(Boolean);

const COUNTRIES = ['Italy', 'France', 'United Kingdom', 'Turkey', 'China', 'India', 'Bangladesh', 'Portugal', 'Spain'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const round2 = (n) => Math.round(n * 100) / 100;

async function getJson(path) {
  await sleep(500); // one request at a time, gently
  const res = await fetch(`${STORE}${path}`, { headers: { 'user-agent': USER_AGENT, accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

const rawCollections = new Map(); // handle → raw products, so each collection is fetched once
async function getCollection(handle, limit = FETCH_LIMIT) {
  if (!rawCollections.has(handle)) {
    rawCollections.set(handle, (await getJson(`/collections/${handle}/products.json?limit=${limit}`)).products);
  }
  return rawCollections.get(handle);
}

// "Pack of 3" / "Pack Of 12" → 3 / 12. Options like "Regular Size" or "One Pack" don't say how many pieces.
function piecesIn(label) {
  const match = /pack\s+of\s+(\d+)/i.exec(label ?? '');
  return match ? Number(match[1]) : null;
}

function originOf(product) {
  const fromTags = COUNTRIES.find((country) => product.tags.includes(country));
  if (fromTags) return fromTags;
  const text = (product.body_html ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ');
  const match = /Country of Origin:?\s*([A-Z][a-z]+(?: [A-Z][a-z]+)*)/.exec(text);
  return match ? match[1] : null;
}

function normalise(p) {
  const tags = Array.isArray(p.tags) ? p.tags : String(p.tags ?? '').split(/,\s*/); // product.json gives a string
  const optionAt = (pattern) => p.options.findIndex((o) => pattern.test(o.name));
  const colourAt = optionAt(/colou?r/i);
  const packAt = optionAt(/size|pack/i);

  const variants = p.variants.map((v) => {
    const options = [v.option1, v.option2, v.option3];
    const pack = packAt >= 0 ? options[packAt].replace(/pack\s+of/i, 'Pack of') : null;
    const pieces = piecesIn(pack);
    const price = Number(v.price);
    return {
      id: v.id,
      colour: colourAt >= 0 ? options[colourAt] : null,
      pack,
      pieces,
      price,
      perPiece: pieces ? round2(price / pieces) : null,
      // product.json has no `available` flag; fall back to stock policy and quantity when present
      available: v.available ?? (v.inventory_policy === 'continue' || (v.inventory_quantity ?? 1) > 0),
    };
  });

  const inStock = variants.filter((v) => v.available);
  // The cheapest per-piece price on offer is what a reseller compares first.
  const best = [...inStock].sort((a, b) => (a.perPiece ?? a.price) - (b.perPiece ?? b.price))[0];
  const packs = [...new Map(variants.filter((v) => v.pack).map((v) => [v.pack, { label: v.pack, pieces: v.pieces }])).values()]
    .sort((a, b) => (a.pieces ?? 0) - (b.pieces ?? 0));
  const lowerTags = tags.map((t) => t.toLowerCase());

  return {
    id: p.id,
    handle: p.handle,
    title: p.title.trim(),
    url: `${STORE}/products/${p.handle}`,
    type: (p.product_type || '').split('>').pop().trim() || null,
    origin: originOf({ ...p, tags }),
    plus: lowerTags.some((t) => t.includes('plus size')),
    isNew: false, // set below from the New In collection
    publishedAt: p.published_at,
    images: p.images.slice(0, 2).map((i) => ({ src: i.src, width: i.width, height: i.height })),
    colours: [...new Set(variants.map((v) => v.colour).filter(Boolean))],
    packs,
    variants,
    from: best ? { perPiece: best.perPiece, price: best.price, pack: best.pack, pieces: best.pieces } : null,
    available: inStock.length > 0,
  };
}

const usable = (p) => p.available && p.images.length > 0;
const products = new Map(); // handle → product
const tabs = [];
const collections = {};
const tiles = {};

for (const source of [...TABS, ...EXTRA]) {
  try {
    let list = (await getCollection(source.handle)).map(normalise).filter(usable);
    if (source.newestFirst) list.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
    list = list.slice(0, KEEP);
    for (const p of list) if (!products.has(p.handle)) products.set(p.handle, p);

    const entry = {
      key: source.key,
      handle: source.handle,
      url: `${STORE}/collections/${source.handle}`,
      products: list.map((p) => p.handle),
    };
    if (source.label) tabs.push({ label: source.label, ...entry });
    else collections[source.key] = entry;
    console.log(`✓ ${source.handle}: kept ${list.length}`);
  } catch (err) {
    console.error(`✗ ${source.handle}: ${err.message}`);
  }
}

for (const handle of PINNED) {
  if (products.has(handle)) continue;
  try {
    const p = normalise((await getJson(`/products/${handle}.json`)).product);
    products.set(handle, p);
    console.log(`✓ pinned ${handle}${usable(p) ? '' : ' (warning: sold out or no photo)'}`);
  } catch (err) {
    console.error(`✗ pinned ${handle}: ${err.message} – update src/data/content.js`);
  }
}

// Category tiles (PLAN.md §6.7): a few candidate photos per category
for (const { handle } of categories) {
  try {
    const list = (await getCollection(handle, 12)).map(normalise).filter(usable).slice(0, TILE_CANDIDATES);
    tiles[handle] = list.map((p) => ({ product: p.handle, title: p.title, image: p.images[0].src }));
    console.log(`✓ tile ${handle}: ${list.length} photos`);
  } catch (err) {
    console.error(`✗ tile ${handle}: ${err.message}`);
  }
}

if (!products.size) {
  console.error('No products fetched – nothing written.');
  process.exit(1);
}

const newIn = new Set(tabs.find((t) => t.key === 'new-in')?.products ?? []);
for (const p of products.values()) p.isNew = newIn.has(p.handle);

const data = {
  fetchedAt: new Date().toISOString(),
  source: STORE,
  tabs,
  collections,
  tiles,
  products: [...products.values()],
};

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/products.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
// The browser copy only needs the products (tabs and tiles are already in the HTML)
await writeFile(new URL('../public/data/products.min.json', import.meta.url), JSON.stringify({ products: data.products }));
console.log(`Saved ${data.products.length} unique products and ${Object.keys(tiles).length} category tiles`);
