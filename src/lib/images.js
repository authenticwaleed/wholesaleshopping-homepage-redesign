// Shopify's image CDN resizes on the fly with a `width` parameter, so phones download small files.

export function sized(src, width) {
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  return url.toString();
}

export function srcset(src, widths = [240, 360, 480, 640, 800]) {
  return widths.map((width) => `${sized(src, width)} ${width}w`).join(', ');
}
