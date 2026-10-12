# Test results (Phase 4, 13 Oct 2026)

Evidence for REQUIREMENTS.md §6 (Testing) and the "Execution & Testing" criterion.

## 1. Automated end-to-end tests (Playwright)

`npm test` builds the site, serves it and runs `tests/home.spec.js` at four screen sizes: desktop 1440×900, tablet 768×1024, iPhone 13 (390×664) and Android 360×640.

**Result: 51 passed, 5 skipped by design** (desktop-only tests are skipped on phones, and phone-only tests on desktop). Every test also fails if the page logs a JavaScript error.

| Brief's checklist (REQUIREMENTS.md §6) | Automated test |
|---|---|
| Navigation works | Desktop mega menu opens on hover and by keyboard, and Esc closes it. Phone menu opens, switches department, keeps the page behind inert, and closes with Esc or the backdrop |
| Buttons and links work | No placeholder `#` links. Search hands off to the store search. The checkout link carries the right variant and quantity. Plus the link check below |
| Sections behave correctly | Product tabs switch by click and with the arrow keys. Quick Add adds to the bag. Bag minimum-order and free-delivery rules. Wishlist |
| Mobile layouts do not break | Layout width = screen width at all four sizes (also checked at 320 px) |
| Product cards are usable | Quick Add from a card at every size. Tap targets at least 24 px (WCAG 2.2); in practice everything is now at least 44 px tall |
| Text remains readable | Lighthouse accessibility 100 (contrast, labels, names) |
| Animations do not interfere | With reduced motion on, every section is fully visible straight away and the offers stop rotating |
| The overall journey feels natural | Quick Add → bag → reload keeps the bag → checkout handoff. Plus your test on a real phone (Checkpoint 2) |

## 2. Link check (`npm run check-links`)

**146 OK, 0 broken, 2 checked by hand** out of 148 links. All 51 collection links and 70 product links exist on the live store. Facebook and Trustpilot block scripted requests but work in a browser. Full report: `notes/link-check.md`.

## 3. Lighthouse (production build, Lighthouse 12.8.2)

| Run | Device | Performance | Accessibility | Best practices | SEO* | LCP | CLS |
|---|---|---|---|---|---|---|---|
| 1 (first audit) | Phone | 90 | 100 | 96 | 63 | 3.6 s | 0.001 |
| 1 | Desktop | 81 | 100 | 96 | 63 | 3.3 s | 0.072 |
| 2 (fixes below) | Phone | 90 | 100 | 100 | 63 | 3.6 s | 0 |
| 2 | Desktop | 85 | 100 | 100 | 63 | 2.7 s | 0 |
| 3 (smaller font) | Phone | **91** | **100** | **100** | 63 | **3.4 s** | **0** |
| 3 | Desktop | **92** | **100** | **100** | 63 | **1.8 s** | **0** |

\*SEO is 63 on purpose: the concept carries `noindex` so it never competes with the real site in search results. That alone fails Lighthouse's "page is crawlable" check.

**What changed between runs:**
- **Run 2:**
  - Favicon added (the browser's automatic `/favicon.ico` request was a 404 console error).
  - The bottom bar's accessible label now starts with its visible text ("Saved").
  - CSS is inlined instead of render-blocking.
  - Both desktop hero photos load straight away; the second was lazy-loaded although it's above the fold.
  - Hero and banner photos come pre-cropped from Shopify's CDN.
  - Mega-menu photos load only when their menu opens.
  - Fonts are preloaded (this fixed the desktop layout shift in the hero text).
- **Run 3:** the display font is pinned to the one style the design uses (extra-bold, 75% width), cutting it from 88 KB to 8 KB so it no longer competes with the hero photo on phones.

**Known trade-off:** about 2,600 page elements. All five product tabs are built into the page so switching tabs is instant. Rendering the hidden tabs only when opened would cut this, at the cost of a short delay on first switch.

## 4. Live site (Netlify): https://wholesaleshopping-homepage-redesign.netlify.app

- **Tests against the live link:** `BASE_URL=https://wholesaleshopping-homepage-redesign.netlify.app npm test`. **55 passed**, 5 skipped by design.
- **Headers:** `x-robots-tag: noindex, nofollow` on every file. Brotli compression. `cache-control: public,max-age=31536000,immutable` on `/_astro/` files.
- **Lighthouse on the live site, final runs:**

  | Device | Performance | Accessibility | Best practices | LCP | CLS |
  |---|---|---|---|---|---|
  | Phone | 87 | 100 | 100 | 3.5 s | 0 |
  | Desktop | 99 | 100 | 100 | 0.8 s | 0.018 |

  Performance varied between runs with the server's response time from Pakistan (134–1,008 ms): 82–96 on phones and 84–99 on desktop. Accessibility and best practices were 100 in every run.
- **Problems found on the live site, and the fixes:**
  1. **HTTP 401 on every file.** The team had "team login" protection on all deploys. Changed to protect preview deploys only (`sso_login_context: non_production`).
  2. **The wishlist test failed sometimes at 360 px.** Netlify injected a "Built with Netlify" badge (a fixed iframe at the highest z-index) over the bottom bar's Saved, Bag and Account buttons. Turned it off (`built_with_badge_enabled: false`).
  3. **Desktop layout shift 0.072:** text reflowed when the web fonts arrived after first paint.
     - Embedding the 8 KB heading font changed nothing (0.071). The cause was the body font.
     - A size-matched fallback for Inter (Arial or Liberation Sans with Inter's metrics) brought it to **0.018**.

## 5. Still to do by hand
- Checkpoint 2: test on a real phone over Wi-Fi.
- Test the live link on a real phone.
