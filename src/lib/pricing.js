// How a product's price is presented. Resellers compare cost per piece, so that leads;
// the pack it comes in sits underneath. Shared by product cards, Quick Add and search.

import { money } from './format.js';

// "Regular Size" / "Plus Size" / "One Size" options don't say how many pieces you get.
function sizeTypeLabel(packs) {
  const names = packs.map((p) => p.label.replace(/\s*size$/i, ''));
  if (names.length === 1 && /^one$/i.test(names[0])) return 'One size';
  return `${names.join(' & ')} sizes`;
}

export function priceSummary(product) {
  const best = product.from;
  if (!best) return null;
  const prices = new Set(product.variants.filter((v) => v.available).map((v) => v.perPiece ?? v.price));

  if (best.perPiece != null) {
    return {
      from: prices.size > 1,
      amount: money(best.perPiece),
      unit: 'per piece',
      detail: `${best.pack} · ${money(best.price)}`,
    };
  }

  // Sold by size type: show the price as listed and never invent a per-piece figure.
  return {
    from: prices.size > 1,
    amount: money(best.price),
    unit: '',
    detail: sizeTypeLabel(product.packs),
  };
}
