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

const STORE = 'https://www.wholesaleshopping.co.uk';
const FETCH_LIMIT = 40; // products requested per collection (some get filtered out)
const KEEP = 16; // products kept per collection: 12 shown + spares
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

const COUNTRIES = ['Italy', 'France', 'United Kingdom', 'Turkey', 'China', 'India', 'Bangladesh', 'Portugal', 'Spain'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const round2 = (n) => Math.round(n * 100) / 100;

async function getCollection(handle) {
  const url = `${STORE}/collections/${handle}/products.json?limit=${FETCH_LIMIT}`;
  const res = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()).products;
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
      available: v.available,
    };
  });

  const inStock = variants.filter((v) => v.available);
  // The cheapest per-piece price on offer is what a reseller compares first.
  const best = [...inStock].sort((a, b) => (a.perPiece ?? a.price) - (b.perPiece ?? b.price))[0];
  const packs = [...new Map(variants.filter((v) => v.pack).map((v) => [v.pack, { label: v.pack, pieces: v.pieces }])).values()]
    .sort((a, b) => (a.pieces ?? 0) - (b.pieces ?? 0));
  const tags = p.tags.map((t) => t.toLowerCase());

  return {
    id: p.id,
    handle: p.handle,
    title: p.title.trim(),
    url: `${STORE}/products/${p.handle}`,
    type: (p.product_type || '').split('>').pop().trim() || null,
    origin: originOf(p),
    plus: tags.some((t) => t.includes('plus size')),
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

const products = new Map(); // handle → product
const tabs = [];
const collections = {};

for (const source of [...TABS, ...EXTRA]) {
  try {
    let list = (await getCollection(source.handle)).map(normalise).filter((p) => p.available && p.images.length);
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
  await sleep(500);
}

if (!products.size) {
  console.error('No products fetched – nothing written.');
  process.exit(1);
}

const newIn = new Set(tabs.find((t) => t.key === 'new-in')?.products ?? []);
for (const p of products.values()) p.isNew = newIn.has(p.handle);

const data = { fetchedAt: new Date().toISOString(), source: STORE, tabs, collections, products: [...products.values()] };

await mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true });
await writeFile(new URL('../src/data/products.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
await writeFile(new URL('../public/data/products.min.json', import.meta.url), JSON.stringify(data));
console.log(`Saved ${data.products.length} unique products`);
