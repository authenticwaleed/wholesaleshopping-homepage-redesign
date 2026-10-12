// Bag drawer (PLAN.md §6.10): order lines, quantity changes, progress towards the £100 minimum order
// and £300 free UK delivery, and a checkout link that carries the bag to the real store.

import { escapeHtml as esc, openDialog, setupDialog } from './dialogs.js';
import { icons } from './icons.js';
import { bagCount, bagSubtotal, checkoutUrl, getBag, removeFromBag, setQty } from './store.js';
import { FREE_DELIVERY_THRESHOLD, MIN_ORDER } from '../lib/config.js';
import { money } from '../lib/format.js';
import { sized } from '../lib/images.js';

const dialog = document.getElementById('bag');

function renderCounts() {
  const count = bagCount();
  for (const badge of document.querySelectorAll('[data-bag-count]')) {
    badge.textContent = count;
    badge.dataset.count = count;
  }
  const label = count ? `Bag, ${count} ${count === 1 ? 'pack' : 'packs'}` : 'Bag, empty';
  for (const button of document.querySelectorAll('[data-open-bag]')) button.setAttribute('aria-label', label);
}

function progressHtml(subtotal) {
  const message =
    subtotal < MIN_ORDER
      ? `Add <strong>${money(MIN_ORDER - subtotal)}</strong> to reach the £${MIN_ORDER} minimum order`
      : subtotal < FREE_DELIVERY_THRESHOLD
        ? `Add <strong>${money(FREE_DELIVERY_THRESHOLD - subtotal)}</strong> for free UK delivery`
        : '<strong>Free UK delivery unlocked</strong> on this order';
  const filled = Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD) * 100;
  const minMark = (MIN_ORDER / FREE_DELIVERY_THRESHOLD) * 100;
  return `
    <p class="bag-progress__text">${message}</p>
    <div class="bag-progress__track" aria-hidden="true">
      <span class="bag-progress__fill${subtotal >= FREE_DELIVERY_THRESHOLD ? ' is-done' : ''}" style="width:${filled}%"></span>
      <span class="bag-progress__mark${subtotal >= MIN_ORDER ? ' is-done' : ''}" style="left:${minMark}%"></span>
    </div>
    <div class="bag-progress__labels" aria-hidden="true">
      <span style="left:${minMark}%">£${MIN_ORDER} minimum</span>
      <span>£${FREE_DELIVERY_THRESHOLD} free delivery</span>
    </div>`;
}

function lineHtml(line) {
  const details = [line.colour, line.pack].filter(Boolean).map(esc).join(' · ');
  const unit = line.pieces > 1 ? `${money(line.price / line.pieces)} per piece` : money(line.price);
  return `
    <li class="bag-line">
      <a class="bag-line__photo" href="${line.url}" tabindex="-1" aria-hidden="true">
        <img src="${sized(line.image, 240)}" alt="" width="80" height="120">
      </a>
      <div class="bag-line__info">
        <a class="bag-line__title" href="${line.url}">${esc(line.title)}</a>
        <p class="bag-line__meta">${details}</p>
        <p class="bag-line__meta">${unit}</p>
        <div class="bag-line__actions">
          <div class="stepper stepper--small">
            <button type="button" data-line-step="-1" data-variant="${line.variantId}" aria-label="One pack fewer of ${esc(line.title)}">${icons.minus}</button>
            <input type="number" value="${line.qty}" min="1" max="99" inputmode="numeric" data-line-qty="${line.variantId}" aria-label="Packs of ${esc(line.title)}">
            <button type="button" data-line-step="1" data-variant="${line.variantId}" aria-label="One pack more of ${esc(line.title)}">${icons.plus}</button>
          </div>
          <button type="button" class="bag-line__remove" data-remove="${line.variantId}">Remove</button>
        </div>
      </div>
      <p class="bag-line__total">${money(line.price * line.qty)}</p>
    </li>`;
}

function render() {
  renderCounts();
  if (!dialog) return;
  const lines = getBag();
  const subtotal = bagSubtotal();
  const count = bagCount();

  dialog.querySelector('[data-bag-heading-count]').textContent = count ? `(${count})` : '';
  dialog.querySelector('[data-bag-progress]').innerHTML = progressHtml(subtotal);
  dialog.querySelector('[data-bag-empty]').hidden = lines.length > 0;
  dialog.querySelector('[data-bag-foot]').hidden = lines.length === 0;
  // Redrawing the lines replaces their buttons, so remember which one had keyboard focus
  const active = document.activeElement;
  const refocus = active?.dataset?.lineStep
    ? `[data-line-step="${active.dataset.lineStep}"][data-variant="${active.dataset.variant}"]`
    : active?.dataset?.lineQty
      ? `[data-line-qty="${active.dataset.lineQty}"]`
      : null;
  dialog.querySelector('[data-bag-lines]').innerHTML = lines.map(lineHtml).join('');
  if (refocus) dialog.querySelector(refocus)?.focus();
  dialog.querySelector('[data-bag-subtotal]').textContent = money(subtotal);

  // Mirror the store's own rule: checkout opens once the bag reaches the minimum order
  const checkout = dialog.querySelector('[data-checkout]');
  const canCheckout = subtotal >= MIN_ORDER;
  checkout.toggleAttribute('aria-disabled', !canCheckout);
  checkout.classList.toggle('is-disabled', !canCheckout);
  checkout.textContent = canCheckout ? `Checkout · ${money(subtotal)}` : `Minimum order £${MIN_ORDER}`;
  checkout.href = canCheckout ? checkoutUrl() : '#';
}

if (dialog) {
  setupDialog(dialog);

  dialog.addEventListener('click', (event) => {
    const step = event.target.closest('[data-line-step]');
    if (step) {
      const line = getBag().find((l) => String(l.variantId) === step.dataset.variant);
      if (line) setQty(line.variantId, line.qty + Number(step.dataset.lineStep));
      return;
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) {
      removeFromBag(Number(remove.dataset.remove));
      dialog.querySelector('[data-close]').focus(); // the removed line's button is gone
      return;
    }
    const checkout = event.target.closest('[data-checkout]');
    if (checkout?.hasAttribute('aria-disabled')) event.preventDefault();
  });

  dialog.addEventListener('change', (event) => {
    const input = event.target.closest('[data-line-qty]');
    if (!input) return;
    const qty = Math.min(99, Math.max(0, Math.floor(Number(input.value)) || 0));
    setQty(Number(input.dataset.lineQty), qty);
  });
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-bag]');
  if (!trigger) return;
  event.preventDefault();
  openDialog(dialog, trigger);
});

window.addEventListener('bag:open', () => openDialog(dialog));
window.addEventListener('bag:change', render);
render();
