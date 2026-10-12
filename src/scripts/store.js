// Bag and wishlist state in the browser. Saved in localStorage so it survives a reload, and
// announced with window events ('bag:change', 'wishlist:change') so every badge and panel stays in sync.

import { STORE } from '../lib/config.js';

const BAG_KEY = 'ws-bag';
const WISHLIST_KEY = 'ws-wishlist';

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or full storage: the bag still works for this visit.
  }
}

let bag = read(BAG_KEY);
let wishlist = new Set(read(WISHLIST_KEY));

const announce = (name) => window.dispatchEvent(new CustomEvent(name));

function saveBag() {
  write(BAG_KEY, bag);
  announce('bag:change');
}

function saveWishlist() {
  write(WISHLIST_KEY, [...wishlist]);
  announce('wishlist:change');
}

// ---- Bag: one line per variant (colour + pack) ----

export const getBag = () => bag;
export const bagCount = () => bag.reduce((count, line) => count + line.qty, 0);
export const bagSubtotal = () => bag.reduce((sum, line) => sum + line.price * line.qty, 0);

export function addToBag(item, qty = 1) {
  const existing = bag.some((line) => line.variantId === item.variantId);
  bag = existing
    ? bag.map((line) => (line.variantId === item.variantId ? { ...line, qty: line.qty + qty } : line))
    : [...bag, { ...item, qty }];
  saveBag();
}

export function setQty(variantId, qty) {
  bag =
    qty > 0
      ? bag.map((line) => (line.variantId === variantId ? { ...line, qty } : line))
      : bag.filter((line) => line.variantId !== variantId);
  saveBag();
}

export const removeFromBag = (variantId) => setQty(variantId, 0);

// Shopify cart permalink: opens the real store's checkout with these variants and quantities.
export const checkoutUrl = () => `${STORE}/cart/${bag.map((line) => `${line.variantId}:${line.qty}`).join(',')}`;

// ---- Wishlist: product handles ----

export const getWishlist = () => [...wishlist];
export const isWishlisted = (handle) => wishlist.has(handle);
export const wishlistCount = () => wishlist.size;

export function toggleWishlist(handle) {
  if (wishlist.has(handle)) wishlist.delete(handle);
  else wishlist.add(handle);
  saveWishlist();
  return wishlist.has(handle);
}

// Keep other open tabs in sync
window.addEventListener('storage', (event) => {
  if (event.key === BAG_KEY) {
    bag = read(BAG_KEY);
    announce('bag:change');
  } else if (event.key === WISHLIST_KEY) {
    wishlist = new Set(read(WISHLIST_KEY));
    announce('wishlist:change');
  }
});
