// Shopify's image CDN resizes on the fly with a `width` parameter, so phones download small files.

export function sized(src, width) {
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  return url.toString();
}

export function srcset(src, widths = [240, 360, 480, 640, 800]) {
  return widths.map((width) => `${sized(src, width)} ${width}w`).join(', ');
}

// The CDN can also crop, so a box that shows only part of a tall photo doesn't download the rest.
// ratio = height ÷ width of the box; crop keeps the top by default (that's where the faces are).
export function cropped(src, width, ratio, crop = 'top') {
  const url = new URL(sized(src, width));
  url.searchParams.set('height', String(Math.round(width * ratio)));
  url.searchParams.set('crop', crop);
  return url.toString();
}

export function croppedSrcset(src, widths, ratio, crop = 'top') {
  return widths.map((width) => `${cropped(src, width, ratio, crop)} ${width}w`).join(', ');
}

// A 1×1 transparent GIF: lets a <picture> skip downloading a photo on screens where it's hidden
export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
