// Build-time access to the product snapshot (src/data/products.json).

import data from '../data/products.json';

const byHandle = new Map(data.products.map((p) => [p.handle, p]));
const resolve = (handles) => handles.map((h) => byHandle.get(h)).filter(Boolean);

export const productTabs = data.tabs.map((tab) => ({ ...tab, items: resolve(tab.products) }));

export const collectionProducts = (key) => resolve(data.collections[key]?.products ?? []);

export const getProduct = (handle) => byHandle.get(handle);
