// Build-time access to the product snapshot (src/data/products.json).

import data from '../data/products.json';
import { categories, collectionUrl } from '../data/content.js';

const byHandle = new Map(data.products.map((p) => [p.handle, p]));

// Category tiles with the photo chosen for each (content.js `photo` = index into the saved candidates)
export const categoryTiles = categories.map((c) => {
  const candidates = data.tiles?.[c.handle] ?? [];
  const pick = candidates[c.photo ?? 0] ?? candidates[0];
  return { ...c, href: collectionUrl(c.handle), image: pick?.image ?? null };
});
const resolve = (handles) => handles.map((h) => byHandle.get(h)).filter(Boolean);

export const productTabs = data.tabs.map((tab) => ({ ...tab, items: resolve(tab.products) }));

export const collectionProducts = (key) => resolve(data.collections[key]?.products ?? []);

export const getProduct = (handle) => byHandle.get(handle);
