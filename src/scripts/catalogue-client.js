// Loads the product snapshot in the browser only when it's first needed (Quick Add or Search),
// so it never slows down the first page load.

let products;

export function loadProducts() {
  products ??= fetch('/data/products.min.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => new Map(data.products.map((p) => [p.handle, p])))
    .catch((err) => {
      products = undefined; // let the next attempt try again
      throw err;
    });
  return products;
}
