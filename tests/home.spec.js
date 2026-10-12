// End-to-end checks for the homepage (PLAN.md §9, REQUIREMENTS.md §6), run at four screen sizes
// (see playwright.config.js). Every test also fails if the page logs a JavaScript error.

import { readFileSync } from 'node:fs';
import { expect, test as base } from '@playwright/test';

const STORE = 'https://www.wholesaleshopping.co.uk';
const data = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url), 'utf8'));

const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      // A product photo that's slow or blocked on Shopify's image server isn't a page bug
      // (scripts/check-links.mjs checks the store links separately)
      if (msg.text().startsWith('Failed to load resource') && msg.location().url.startsWith('https://cdn.shopify.com/')) return;
      errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await use(page);
    expect(errors, 'JavaScript errors on the page').toEqual([]);
  },
});

const isDesktop = (testInfo) => testInfo.project.name === 'desktop';

test.beforeEach(async ({ page }) => {
  // Don't wait for every product photo: with four screen sizes running at once that can take 30s+
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

test.describe('layout', () => {
  test('fits the screen with no sideways scrolling', async ({ page }) => {
    // Compare with the visible screen width: on phones `innerWidth` grows to fit too-wide content
    const { layout, screen } = await page.evaluate(() => ({
      layout: document.documentElement.scrollWidth,
      screen: visualViewport.width,
    }));
    expect(layout).toBeLessThanOrEqual(Math.ceil(screen));
  });

  test('first screen shows the headline and both hero buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/wholesale fashion for uk boutiques/i);
    const visibleHeight = await page.evaluate(() => visualViewport.height);
    for (const name of ['Shop New In', 'Best Sellers']) {
      const box = await page.locator('.hero__actions').getByRole('link', { name }).boundingBox();
      expect(box.y + box.height, `"${name}" is on the first screen`).toBeLessThanOrEqual(visibleHeight);
    }
  });

  test('offer bar shows the real offers', async ({ page }) => {
    await expect(page.locator('.promo')).toContainText('£300');
  });

  test('every image has alt text (empty for decorative ones)', async ({ page }) => {
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
  });

  test('no placeholder links', async ({ page }) => {
    // The bag's checkout and the search "See all" link get their real address when used
    await expect(page.locator('a[href="#"]:not([data-checkout]):not([data-search-all])')).toHaveCount(0);
  });

  test('controls are big enough to tap', async ({ page }, testInfo) => {
    test.skip(isDesktop(testInfo), 'touch screens only');
    const targets = await page.evaluate(() =>
      [...document.querySelectorAll('a[href], button, input, summary, [role="tab"]')]
        .filter((el) => !el.closest('dialog') && el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
        .map((el) => {
          const box = el.getBoundingClientRect();
          const name = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().slice(0, 32);
          return { label: `${el.tagName.toLowerCase()} "${name}" ${Math.round(box.width)}×${Math.round(box.height)}`, w: box.width, h: box.height };
        })
        .filter((t) => t.w > 0),
    );
    const underMinimum = targets.filter((t) => t.w < 24 || t.h < 24).map((t) => t.label);
    const underComfort = targets.filter((t) => t.h < 44).map((t) => t.label);
    testInfo.annotations.push({ type: 'under 44px tall', description: underComfort.join('; ') || 'none' });
    expect(underMinimum, 'targets smaller than 24×24px (WCAG 2.2 minimum)').toEqual([]);
  });
});

test.describe('navigation', () => {
  test('desktop mega menu opens on hover and keyboard, and Esc closes it', async ({ page }, testInfo) => {
    test.skip(!isDesktop(testInfo), 'desktop menu only');
    const clothing = page.locator('.nav__item.has-mega', { has: page.locator('.nav__link', { hasText: 'Clothing' }) });
    const mega = clothing.locator('.mega');

    await clothing.hover();
    await expect(mega).toBeVisible();
    await expect(mega.getByRole('link', { name: 'Jumpers' })).toHaveAttribute('href', `${STORE}/collections/wholesale-womens-jumpers`);
    await page.mouse.move(5, 700);
    await expect(mega).toBeHidden();

    await clothing.locator('.nav__link').focus();
    await expect(mega).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(mega).toBeHidden();
  });

  test('phone menu opens, switches department and closes', async ({ page }, testInfo) => {
    test.skip(isDesktop(testInfo), 'phone and tablet menu');
    const menu = page.locator('#menu');
    await page.locator('.header [data-open-menu]').click();
    await expect(menu).toBeVisible();

    await menu.getByRole('tab', { name: 'Footwear' }).click();
    await expect(menu.getByRole('tabpanel')).toContainText('Boots');

    // The page behind is inert while the menu is open
    const outsideFocusable = await page.evaluate(() => {
      const link = document.querySelector('.hero__actions a');
      link.focus();
      return document.activeElement === link;
    });
    expect(outsideFocusable).toBe(false);

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();

    await page.locator('.header [data-open-menu]').click();
    await expect(menu).toBeVisible();
    const { width } = page.viewportSize();
    await page.mouse.click(width - 5, 300); // the backdrop beside the drawer
    await expect(menu).toBeHidden();
  });

  test('search shows quick matches and hands off to the store search', async ({ page }, testInfo) => {
    if (isDesktop(testInfo)) await page.locator('#header-search').click();
    else await page.locator('.header [data-open-search]').click();
    const search = page.locator('#search');
    await expect(search).toBeVisible();

    await page.keyboard.type('boots');
    await expect(search.locator('.search-hit').first()).toBeVisible();
    await expect(search.locator('[data-search-all]')).toHaveAttribute('href', `${STORE}/search?q=boots`);
    await expect(search.locator('form')).toHaveAttribute('action', `${STORE}/search`);
  });

  test('product tabs switch by click and with the arrow keys', async ({ page }) => {
    const tabs = page.getByRole('tablist', { name: 'Product groups' });
    await tabs.getByRole('tab', { name: 'Footwear' }).click();
    await expect(page.locator('#panel-footwear')).toBeVisible();
    await expect(page.locator('#panel-new-in')).toBeHidden();

    await tabs.getByRole('tab', { name: 'Footwear' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: 'Made in Italy' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#panel-made-in-italy')).toBeVisible();
  });
});

test.describe('buying', () => {
  test('Quick Add puts packs in the bag, and the bag survives a reload', async ({ page }, testInfo) => {
    const card = page.locator('#panel-new-in .card').first();
    await card.scrollIntoViewIfNeeded();
    if (isDesktop(testInfo)) await card.hover();
    await card.locator('[data-quick-add]').click();

    const sheet = page.locator('#quick-add');
    const add = sheet.locator('[data-qa-add]');
    await expect(add).toBeEnabled();
    await sheet.getByRole('button', { name: 'One pack more' }).click();
    await expect(sheet.locator('input[name="qty"]')).toHaveValue('2');
    const amount = (await add.innerText()).match(/£[\d,.]+/)[0];
    await add.click();

    const bag = page.locator('#bag');
    await expect(bag).toBeVisible();
    await expect(bag.locator('[data-bag-subtotal]')).toHaveText(amount);
    await expect(page.locator('.header [data-bag-count]')).toHaveText('2');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header [data-bag-count]')).toHaveText('2');
  });

  test('bag enforces the £100 minimum, then hands off to the store checkout', async ({ page }) => {
    const product = data.products.find((p) => p.variants.some((v) => v.available && v.price >= 20 && v.price <= 60));
    const variant = product.variants.find((v) => v.available && v.price >= 20 && v.price <= 60);
    const line = {
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      url: product.url,
      image: product.images[0].src,
      colour: variant.colour,
      pack: variant.pack,
      pieces: variant.pieces,
      price: variant.price,
      qty: 1,
    };
    await page.evaluate((l) => localStorage.setItem('ws-bag', JSON.stringify([l])), line);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.header [data-open-bag]').click();

    const bag = page.locator('#bag');
    const checkout = bag.locator('[data-checkout]');
    await expect(bag.locator('.bag-progress__text')).toContainText('minimum order');
    await expect(checkout).toHaveText(/minimum order £100/i);
    await expect(checkout).toHaveAttribute('aria-disabled', '');

    const forMinimum = Math.ceil(100 / variant.price);
    await bag.locator('[data-line-qty]').fill(String(forMinimum));
    await bag.locator('[data-line-qty]').blur();
    await expect(checkout).toHaveText(/checkout/i);
    await expect(checkout).toHaveAttribute('href', `${STORE}/cart/${variant.id}:${forMinimum}`);
    await expect(bag.locator('.bag-progress__text')).toContainText('for free UK delivery');

    const forFreeDelivery = Math.ceil(300 / variant.price);
    await bag.locator('[data-line-qty]').fill(String(forFreeDelivery));
    await bag.locator('[data-line-qty]').blur();
    await expect(bag.locator('.bag-progress__text')).toContainText('Free UK delivery unlocked');

    await bag.getByRole('button', { name: 'Remove' }).click();
    await expect(bag.locator('[data-bag-empty]')).toBeVisible();
  });

  test('wishlist hearts are remembered and listed', async ({ page }, testInfo) => {
    const heart = page.locator('#panel-new-in .card').nth(1).locator('[data-wishlist]');
    await heart.scrollIntoViewIfNeeded();
    await heart.click();
    await expect(heart).toHaveAttribute('aria-pressed', 'true');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#panel-new-in .card').nth(1).locator('[data-wishlist]')).toHaveAttribute('aria-pressed', 'true');

    const opener = isDesktop(testInfo) ? page.locator('.header [data-open-wishlist]') : page.locator('.bottom-nav [data-open-wishlist]');
    await opener.click();
    await expect(page.locator('#wishlist .saved')).toHaveCount(1);
  });
});

test.describe('reduced motion', () => {
  test('content shows without animation and offers do not rotate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    // Sections further down are fully visible straight away (no fade-in waiting for a scroll)
    await expect(page.locator('.faq-about')).toHaveCSS('opacity', '1');
    const first = await page.locator('.promo__item.is-active').innerText();
    await page.waitForTimeout(5500);
    await expect(page.locator('.promo__item.is-active')).toHaveText(first);
  });
});
