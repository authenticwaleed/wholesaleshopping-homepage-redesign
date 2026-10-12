// Quick Add (PLAN.md §6.9): choose colour, pack size and number of packs, then add to the bag
// without leaving the homepage.

import { loadProducts } from './catalogue-client.js';
import { closeDialog, escapeHtml as esc, openDialog, setupDialog } from './dialogs.js';
import { icons } from './icons.js';
import { addToBag } from './store.js';
import { STORE } from '../lib/config.js';
import { money } from '../lib/format.js';
import { sized } from '../lib/images.js';

const MAX_PACKS = 99;
const dialog = document.getElementById('quick-add');
const body = dialog?.querySelector('[data-quick-add-body]');
let product = null;

const variantFor = (colour, pack) => product.variants.find((v) => v.colour === colour && v.pack === pack);
const inStock = (colour) => product.variants.some((v) => v.colour === colour && v.available);
// Compare packs on price per piece (or per pack when the store doesn't say how many pieces)
const unitPrice = (v) => v.perPiece ?? v.price;

function bestVariantFor(colour) {
  return product.variants
    .filter((v) => v.colour === colour && v.available)
    .sort((a, b) => unitPrice(a) - unitPrice(b))[0];
}

// placeholder: the photo already loaded on the card that was clicked, shown until the sharper one arrives
function render(placeholder) {
  const photo = product.images[0];
  // Start on the best-value option in stock, so Quick Add matches the card's "From £x per piece"
  const best = product.variants.filter((v) => v.available).sort((a, b) => unitPrice(a) - unitPrice(b))[0];
  const firstColour = best?.colour ?? product.colours.find(inStock) ?? product.colours[0] ?? null;
  const backdrop = placeholder?.startsWith('https://cdn.shopify.com/') ? ` style="background-image:url('${placeholder}')"` : '';

  body.innerHTML = `
    <form class="qa" data-qa-form>
      <div class="qa__media"${backdrop}>
        <img src="${sized(photo.src, 640)}" alt="${esc(product.title)}" width="640" height="960">
      </div>
      <div class="qa__details">
        ${product.origin ? `<p class="qa__origin">Made in ${esc(product.origin)}</p>` : ''}
        <h2 class="qa__title">${esc(product.title)}</h2>
        <p class="qa__price" data-qa-price></p>

        ${
          product.colours.length
            ? `<fieldset class="qa__group">
                <legend class="qa__label">Colour: <strong data-qa-colour></strong></legend>
                <div class="qa__options qa__options--colours">
                  ${product.colours
                    .map(
                      (c) => `<label class="option"><input type="radio" name="colour" value="${esc(c)}"
                        ${c === firstColour ? 'checked' : ''} ${inStock(c) ? '' : 'disabled'}><span>${esc(c)}</span></label>`,
                    )
                    .join('')}
                </div>
              </fieldset>`
            : ''
        }

        ${
          product.packs.length
            ? `<fieldset class="qa__group">
                <legend class="qa__label">${product.packs.some((p) => p.pieces) ? 'Pack size' : 'Size'}</legend>
                <div class="qa__options qa__options--packs">
                  ${product.packs
                    .map(
                      (p) => `<label class="option option--pack"><input type="radio" name="pack" value="${esc(p.label)}"><span>
                        <b>${esc(p.label)}</b><small data-pack-price></small><em class="qa__best" hidden>Best value</em></span></label>`,
                    )
                    .join('')}
                </div>
              </fieldset>`
            : ''
        }

        <div class="qa__qty">
          <span class="qa__label" id="qa-qty-label">Number of packs</span>
          <div class="stepper">
            <button type="button" data-step="-1" aria-label="One pack fewer">${icons.minus}</button>
            <input type="number" name="qty" value="1" min="1" max="${MAX_PACKS}" inputmode="numeric" aria-labelledby="qa-qty-label">
            <button type="button" data-step="1" aria-label="One pack more">${icons.plus}</button>
          </div>
        </div>

        <div class="qa__buy">
          <p class="qa__total" data-qa-total aria-live="polite"></p>
          <button class="btn btn--block" type="submit" data-qa-add>Add to bag</button>
        </div>
        <a class="qa__more" href="${product.url}">View full product details ${icons.arrowRight}</a>
        <p class="qa__note">Prices exclude VAT.</p>
      </div>
    </form>`;

  const img = body.querySelector('.qa__media img');
  const showPhoto = () => img.classList.add('is-loaded');
  if (img.complete) showPhoto();
  else img.addEventListener('load', showPhoto, { once: true });

  const form = body.querySelector('[data-qa-form]');
  form.addEventListener('change', update);
  form.qty.addEventListener('input', update);
  form.addEventListener('click', (event) => {
    const step = event.target.closest('[data-step]');
    if (!step) return;
    form.qty.value = Number(form.qty.value || 1) + Number(step.dataset.step);
    update();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    add(form);
  });
  update();
}

function selection(form) {
  const colour = product.colours.length ? form.querySelector('input[name="colour"]:checked')?.value ?? null : null;
  const packInputs = [...form.querySelectorAll('input[name="pack"]')];

  // Only packs that exist and are in stock for this colour can be chosen
  for (const input of packInputs) {
    const v = variantFor(colour, input.value);
    input.disabled = !v?.available;
    input.parentElement.querySelector('[data-pack-price]').textContent = v
      ? v.pieces > 1
        ? `${money(v.price)} · ${money(v.perPiece)} each`
        : money(v.price)
      : 'Not available';
  }

  // Keep a valid pack selected, defaulting to the best value one
  let packInput = packInputs.find((i) => i.checked && !i.disabled);
  if (packInputs.length && !packInput) {
    const best = bestVariantFor(colour);
    packInput = packInputs.find((i) => i.value === best?.pack);
    if (packInput) packInput.checked = true;
  }

  // "Best value" marks the cheapest price per piece, only when there's a real choice
  const available = packInputs.filter((i) => !i.disabled);
  const best = bestVariantFor(colour);
  for (const input of packInputs) {
    input.parentElement.querySelector('.qa__best').hidden = available.length < 2 || input.value !== best?.pack;
  }

  const pack = packInput?.value ?? null;
  return { colour, pack, variant: variantFor(colour, pack) };
}

function update() {
  const form = body.querySelector('[data-qa-form]');
  const { colour, variant } = selection(form);
  const qty = Math.min(MAX_PACKS, Math.max(1, Math.floor(Number(form.qty.value)) || 1));
  if (String(qty) !== form.qty.value) form.qty.value = qty;

  const colourName = form.querySelector('[data-qa-colour]');
  if (colourName) colourName.textContent = colour ?? '';

  form.querySelector('[data-qa-price]').innerHTML = !variant
    ? 'Not available in this colour'
    : variant.pieces > 1
      ? `<strong>${money(variant.perPiece)}</strong> per piece · ${esc(variant.pack)} for ${money(variant.price)}`
      : `<strong>${money(variant.price)}</strong>${variant.pieces === 1 ? ' per piece' : ''}${variant.pack ? ` · ${esc(variant.pack)}` : ''}`;

  form.querySelector('[data-step="-1"]').disabled = qty <= 1;
  form.querySelector('[data-step="1"]').disabled = qty >= MAX_PACKS;

  const addButton = form.querySelector('[data-qa-add]');
  addButton.disabled = !variant?.available;
  if (variant?.available) {
    const pieces = variant.pieces ? ` (${qty * variant.pieces} pieces)` : '';
    form.querySelector('[data-qa-total]').textContent = `${qty} × ${variant.pack ?? 'item'}${pieces} = ${money(variant.price * qty)}`;
    addButton.textContent = `Add to bag · ${money(variant.price * qty)}`;
  } else {
    form.querySelector('[data-qa-total]').textContent = '';
    addButton.textContent = 'Sold out';
  }
}

function add(form) {
  const { colour, pack, variant } = selection(form);
  if (!variant?.available) return;
  addToBag(
    {
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      url: product.url,
      image: product.images[0].src,
      colour,
      pack,
      pieces: variant.pieces,
      price: variant.price,
    },
    Number(form.qty.value),
  );
  closeDialog(dialog);
  window.dispatchEvent(new CustomEvent('bag:open'));
}

if (dialog) {
  setupDialog(dialog);

  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-quick-add]');
    if (!trigger) return;
    event.preventDefault();
    const handle = trigger.dataset.quickAdd;
    const placeholder = trigger.closest('.card, .saved')?.querySelector('img')?.currentSrc;

    // Quick Add can be opened from another panel (e.g. the wishlist), so close that first
    for (const open of document.querySelectorAll('dialog[open]')) if (open !== dialog) open.close();

    body.innerHTML = '<p class="qa__status">Loading…</p>';
    openDialog(dialog, trigger.isConnected ? trigger : null);
    try {
      product = (await loadProducts()).get(handle);
      if (!product) throw new Error(`Unknown product ${handle}`);
      render(placeholder);
    } catch {
      body.innerHTML = `<p class="qa__status">Sorry, this product couldn't be loaded.
        <a href="${STORE}/products/${encodeURIComponent(handle)}">View it on the store</a>.</p>`;
    }
  });
}
