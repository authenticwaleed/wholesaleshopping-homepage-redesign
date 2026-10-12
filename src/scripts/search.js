// Search panel (PLAN.md §6.4): instant matches from the product snapshot while typing, with
// "See all results" (and Enter) handing off to the store's full search.

import { loadProducts } from './catalogue-client.js';
import { escapeHtml as esc, openDialog, setupDialog } from './dialogs.js';
import { STORE } from '../lib/config.js';
import { sized } from '../lib/images.js';
import { priceSummary } from '../lib/pricing.js';

const MAX_RESULTS = 8;
const dialog = document.getElementById('search');

if (dialog) {
  const field = dialog.querySelector('[data-search-field]');
  const suggestions = dialog.querySelector('[data-search-suggestions]');
  const results = dialog.querySelector('[data-search-results]');
  const summary = dialog.querySelector('[data-search-summary]');
  const list = dialog.querySelector('[data-search-list]');
  const seeAll = dialog.querySelector('[data-search-all]');
  let timer;

  const words = (text) =>
    text
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.replace(/(ss)es$|s$/, '$1')); // "dresses" → "dress", "jumpers" → "jumper"

  const searchableText = (p) =>
    [p.title, p.type, p.origin, p.plus && 'plus size', ...p.colours].filter(Boolean).join(' ').toLowerCase();

  async function show(query) {
    const q = query.trim();
    suggestions.hidden = Boolean(q);
    results.hidden = !q;
    if (!q) return;

    seeAll.href = `${STORE}/search?q=${encodeURIComponent(q)}`;
    seeAll.textContent = `See all results for “${q}”`;
    try {
      const products = [...(await loadProducts()).values()];
      if (field.value.trim() !== q) return; // the visitor has typed more since
      const terms = words(q);
      const hits = products.filter((p) => terms.every((t) => searchableText(p).includes(t))).slice(0, MAX_RESULTS);
      summary.textContent = hits.length ? 'Top matches' : `No quick matches for “${q}”. Try the full search.`;
      list.innerHTML = hits
        .map((p) => {
          const price = priceSummary(p);
          return `
            <li>
              <a class="search-hit" href="${p.url}">
                <img src="${sized(p.images[0].src, 160)}" alt="" width="64" height="96" loading="lazy">
                <span class="search-hit__title">${esc(p.title)}</span>
                <span class="search-hit__price">${price ? `${price.from ? 'From ' : ''}${price.amount} ${price.unit}` : ''}</span>
              </a>
            </li>`;
        })
        .join('');
    } catch {
      summary.textContent = 'Quick results are unavailable. Press Enter to search the store.';
      list.innerHTML = '';
    }
  }

  function open(trigger, text = '') {
    field.value = text;
    openDialog(dialog, trigger);
    field.focus();
    show(text);
  }

  setupDialog(dialog);
  field.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => show(field.value), 120);
  });
  dialog.addEventListener('click', (event) => {
    const term = event.target.closest('[data-search-term]');
    if (!term) return;
    field.value = term.dataset.searchTerm;
    field.focus();
    show(field.value);
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-search]');
    if (trigger) {
      event.preventDefault();
      open(trigger);
    }
  });

  // The header fields open the panel when clicked or typed in (not on focus, so returning focus
  // to them after closing doesn't reopen it). Enter still submits them straight to the store search.
  for (const input of document.querySelectorAll('[data-search-input]')) {
    input.addEventListener('click', () => open(input, input.value));
    input.addEventListener('input', () => {
      const text = input.value;
      input.value = '';
      open(input, text);
    });
  }
}
