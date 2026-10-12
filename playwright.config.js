// @ts-check
// End-to-end tests (PLAN.md §9), run on the built site at four screen sizes.
//
//   npm test                         builds, serves dist/ on :4322 and runs every test
//   BASE_URL=https://… npm test      runs the same tests against the deployed site
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:4322';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Every page pulls dozens of product photos from Shopify's CDN; more workers just compete for bandwidth
  workers: 2,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
    { name: 'iphone-13', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    {
      name: 'android-360',
      use: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && node scripts/serve.mjs 4322',
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
