// Screenshots every homepage section (desktop and phone), plus the interactive states, for the
// walkthrough document (docs/walkthrough.md → docs/pdf/walkthrough.pdf).
//
//   node scripts/walkthrough-screenshots.mjs [url]     (default: the live Netlify site)
//
// Saves JPEGs to docs/images/walkthrough/. Animations are switched off (reduced motion) so every
// section is captured fully visible.

import { mkdir } from 'node:fs/promises';
import { chromium, devices } from '@playwright/test';

const SITE = process.argv[2] ?? 'https://wholesaleshopping-homepage-redesign.netlify.app/';
const OUT = new URL('../docs/images/walkthrough/', import.meta.url).pathname;
const JPEG = { type: 'jpeg', quality: 82 };

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

// Wait until the photos inside an element have actually arrived
async function photosLoaded(page, selector) {
  await page
    .waitForFunction(
      (sel) =>
        [...document.querySelectorAll(`${sel} img`)]
          .filter((img) => img.checkVisibility() && img.getBoundingClientRect().width > 0)
          .every((img) => img.complete && img.naturalWidth > 0),
      selector,
      { timeout: 15_000 },
    )
    .catch(() => console.warn(`  photos still loading in ${selector}`));
}

// While capturing single sections, hide the fixed bottom bar and stop the header sticking, so they
// don't sit on top of the section in the image (on a real phone they float over the page as designed)
async function sectionMode(page, on) {
  await page.evaluate((on) => {
    document.getElementById('shot-style')?.remove();
    if (!on) return;
    const style = document.createElement('style');
    style.id = 'shot-style';
    style.textContent = '.bottom-nav{display:none!important}.header{position:static!important}';
    document.head.append(style);
  }, on);
}

async function section(page, selector, name) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await photosLoaded(page, selector);
  await page.waitForTimeout(300);
  await el.screenshot({ path: `${OUT}${name}.jpg`, ...JPEG });
  console.log(`✓ ${name}`);
}

async function view(page, name, clip) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}${name}.jpg`, ...(clip && { clip }), ...JPEG });
  console.log(`✓ ${name}`);
}

async function open(context) {
  const page = await context.newPage();
  await page.goto(SITE, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  return page;
}

// ---------- Desktop ----------
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
let d = await open(desktop);
await photosLoaded(d, '.hero');
await view(d, 'desktop-first-screen');
await view(d, 'desktop-header', { x: 0, y: 0, width: 1440, height: 156 });
await d.locator('.nav__item.has-mega', { has: d.locator('.nav__link', { hasText: 'Clothing' }) }).hover();
await photosLoaded(d, '.nav');
await view(d, 'desktop-mega-menu', { x: 0, y: 0, width: 1440, height: 600 });
await d.mouse.move(5, 890);
await sectionMode(d, true);
await section(d, '.hero', 'desktop-hero');
await section(d, '.trust', 'desktop-trust');
await section(d, '[aria-labelledby="categories-title"]', 'desktop-categories');
await section(d, '[data-tabs]', 'desktop-latest');
await section(d, '[aria-labelledby="prices-title"]', 'desktop-pack-prices');
await section(d, '.banners', 'desktop-banners');
await section(d, '.how', 'desktop-how-it-works');
await section(d, '[aria-labelledby="reviews-title"]', 'desktop-reviews');
await section(d, '.newsletter', 'desktop-newsletter');
await d.locator('.faq__item summary').first().click();
await section(d, '.faq-about', 'desktop-faq');
await section(d, '.footer', 'desktop-footer');
await sectionMode(d, false);

// Quick Add → bag with enough packs to pass the £100 minimum
await d.locator('#latest-title').scrollIntoViewIfNeeded();
const card = d.locator('#panel-new-in .card').first();
await card.hover();
await card.locator('[data-quick-add]').click();
await d.waitForSelector('#quick-add [data-qa-form]');
await photosLoaded(d, '#quick-add');
await view(d, 'desktop-quick-add');
await d.locator('#quick-add [data-step="1"]').click();
await d.locator('#quick-add [data-qa-add]').click();
await d.waitForSelector('#bag[open]');
await photosLoaded(d, '#bag');
await view(d, 'desktop-bag');
await d.keyboard.press('Escape');

// Search with instant results
await d.evaluate(() => scrollTo(0, 0));
await d.locator('#header-search').click();
await d.keyboard.type('boots');
await d.waitForSelector('#search .search-hit');
await photosLoaded(d, '#search');
await view(d, 'desktop-search');
await desktop.close();

// ---------- Phone ----------
const phone = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 2, reducedMotion: 'reduce' });
let p = await open(phone);
await photosLoaded(p, '.hero');
await view(p, 'phone-first-screen');
await sectionMode(p, true);
await section(p, '.trust', 'phone-trust');
await section(p, '[aria-labelledby="categories-title"]', 'phone-categories');
await section(p, '[data-tabs]', 'phone-latest');
await section(p, '[aria-labelledby="prices-title"]', 'phone-pack-prices');
await section(p, '.banner', 'phone-banner');
await section(p, '.how', 'phone-how-it-works');
await section(p, '.footer', 'phone-footer');
await sectionMode(p, false);

// Menu drawer
await p.evaluate(() => scrollTo(0, 0));
await p.locator('.header [data-open-menu]').click();
await p.waitForTimeout(300);
await view(p, 'phone-menu');
await p.keyboard.press('Escape');

// Quick Add sheet → bag below the £100 minimum
const phoneCard = p.locator('#panel-new-in .card').first();
await phoneCard.scrollIntoViewIfNeeded();
await phoneCard.locator('[data-quick-add]').tap();
await p.waitForSelector('#quick-add [data-qa-form]');
await photosLoaded(p, '#quick-add');
await view(p, 'phone-quick-add');
await p.locator('#quick-add [data-qa-add]').tap();
await p.waitForSelector('#bag[open]');
await photosLoaded(p, '#bag');
await view(p, 'phone-bag');
await p.keyboard.press('Escape');

// Search
await p.locator('.header [data-open-search]').click();
await p.keyboard.type('jumper');
await p.waitForSelector('#search .search-hit');
await photosLoaded(p, '#search');
await view(p, 'phone-search');
await phone.close();

await browser.close();
