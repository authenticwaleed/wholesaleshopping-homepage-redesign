// Screenshots a page at phone and desktop sizes – used for the "before" (current site, Fashion Nova)
// and "after" (our homepage) evidence in the write-ups.
//
//   npm run screenshots -- <url> <name> [outDir]
//   e.g. npm run screenshots -- https://www.wholesaleshopping.co.uk ws-current notes/screenshots/before
//
// Saves <name>-mobile-fold.jpg, <name>-mobile-full.jpg, <name>-desktop-fold.jpg and <name>-desktop-full.jpg
// (JPEG keeps the repo small; full-page PNGs were up to 5 MB each)

import { mkdir } from 'node:fs/promises';
import { chromium, devices } from '@playwright/test';

const [url, name, outDir = 'notes/screenshots/before'] = process.argv.slice(2);
if (!url || !name) {
  console.error('Usage: npm run screenshots -- <url> <name> [outDir]');
  process.exit(1);
}

const SIZES = {
  mobile: { ...devices['iPhone 13'], deviceScaleFactor: 2 }, // 390×844, touch, iOS user agent
  desktop: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  },
};

// Scroll down in steps so lazy-loaded images and sections render before the full-page shot,
// then wait until every image has actually arrived (otherwise slow photos show as empty boxes).
async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    window.scrollTo(0, 0);
  });
  // Only images that can be seen: lazy images in closed tabs, closed panels or off-screen parts of
  // swipe rows never load until needed, by design
  await page
    .waitForFunction(
      () =>
        [...document.images]
          .filter((img) => {
            const box = img.getBoundingClientRect();
            return img.checkVisibility() && box.width > 0 && box.right > 0 && box.left < innerWidth;
          })
          .every((img) => img.complete),
      null,
      { timeout: 15_000 },
    )
    .catch(() => console.warn('  some visible images were still loading after 15s'));
  await page.waitForTimeout(500);
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const [size, device] of Object.entries(SIZES)) {
  // The fold shot uses the device's pixel density; the full page uses 1x to keep the file manageable.
  for (const shot of ['fold', 'full']) {
    const context = await browser.newContext({ ...device, ...(shot === 'full' && { deviceScaleFactor: 1 }), locale: 'en-GB' });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(4000); // let banners, fonts and any pop-ups appear, as a real visitor would see them
    if (shot === 'full') await scrollThrough(page);
    const path = `${outDir}/${name}-${size}-${shot}.jpg`;
    await page.screenshot({ path, fullPage: shot === 'full', type: 'jpeg', quality: 80 });
    console.log(`✓ ${path}`);
    await context.close();
  }
}

await browser.close();
