// Wishlist: heart buttons on product cards, the header count, and a drawer of saved products
// that buyers can add to the bag from. Useful for building up an order over a few visits.

import { loadProducts } from './catalogue-client.js';
import { escapeHtml as esc, openDialog, setupDialog } from './dialogs.js';
import { getWishlist, isWishlisted, toggleWishlist, wishlistCount } from './store.js';
import { sized } from '../lib/images.js';
import { priceSummary } from '../lib/pricing.js';

const dialog = document.getElementById('wishlist');

function renderHearts() {
  for (const heart of document.querySelectorAll('[data-wishlist]')) {
    const saved = isWishlisted(heart.dataset.wishlist);
    heart.setAttribute('aria-pressed', String(saved));
  }
  const count = wishlistCount();
  for (const badge of document.querySelectorAll('[data-wishlist-count]')) {
    badge.textContent = count;
    badge.dataset.count = count;
  }
  // Starts with the visible text ("Saved") so voice-control users can say what they see
  const label = count ? `Saved items, ${count}` : 'Saved items, none';
  for (const button of document.querySelectorAll('[data-open-wishlist]')) button.setAttribute('aria-label', label);
}

async function renderDrawer() {
  if (!dialog?.open) return;
  const list = dialog.querySelector('[data-wishlist-items]');
  const handles = getWishlist();
  dialog.querySelector('[data-wishlist-empty]').hidden = handles.length > 0;
  if (!handles.length) {
    list.innerHTML = '';
    return;
  }
  try {
    const products = await loadProducts();
    list.innerHTML = handles
      .map((handle) => products.get(handle))
      .filter(Boolean)
      .map((p) => {
        const price = priceSummary(p);
        return `
          <li class="saved">
            <a class="saved__photo" href="${p.url}" tabindex="-1" aria-hidden="true">
              <img src="${sized(p.images[0].src, 200)}" alt="" width="80" height="120" loading="lazy">
            </a>
            <div class="saved__info">
              <a class="saved__title" href="${p.url}">${esc(p.title)}</a>
              ${price ? `<p class="saved__price">${price.from ? 'From ' : ''}<strong>${price.amount}</strong> ${price.unit}</p>` : ''}
              <div class="saved__actions">
                <button class="btn btn--outline saved__add" type="button" data-quick-add="${p.handle}">Quick add</button>
                <button class="saved__remove" type="button" data-wishlist="${p.handle}" aria-pressed="true">Remove</button>
              </div>
            </div>
          </li>`;
      })
      .join('');
  } catch {
    list.innerHTML = '<li class="saved__error">Saved items couldn’t be loaded. Please try again.</li>';
  }
}

document.addEventListener('click', (event) => {
  const heart = event.target.closest('[data-wishlist]');
  if (heart) {
    event.preventDefault();
    toggleWishlist(heart.dataset.wishlist);
    return;
  }
  const opener = event.target.closest('[data-open-wishlist]');
  if (opener && dialog) {
    event.preventDefault();
    openDialog(dialog, opener);
    renderDrawer();
  }
});

if (dialog) setupDialog(dialog);
window.addEventListener('wishlist:change', () => {
  renderHearts();
  renderDrawer();
});
renderHearts();
