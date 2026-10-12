# Implementation Plan: WholesaleShopping.co.uk Homepage Redesign

NaskSoft "AI Web & CRO Builder" assessment · Plan written 12 Oct 2026, updated 13 Oct 2026 · Due around the evening of 14 Oct 2026

Repo: [authenticwaleed/wholesaleshopping-homepage-redesign](https://github.com/authenticwaleed/wholesaleshopping-homepage-redesign) · Requirements: [REQUIREMENTS.md](REQUIREMENTS.md) (the brief as a checklist, with each requirement mapped to a section of this plan)

---

## 1. Goal

Build a working, mobile-first homepage concept for WholesaleShopping.co.uk. It takes Fashion Nova's strongest UX patterns and adapts them for B2B fashion buyers: boutiques, online sellers and market traders.

**Success means a retailer can:**
- understand what the site offers within 5 seconds
- reach relevant stock in 1–2 taps
- add packs to the bag without leaving the homepage

---

## 2. Key decisions

| Decision | Choice | Why |
|---|---|---|
| Build type | Standalone prototype, not a Shopify theme | The brief allows it. It's faster, and lets us focus on UX and CRO |
| Framework | **Astro**, a static site builder that runs on Vite | Each section lives in its own file. Product cards are built into the HTML ahead of time, so the page loads fast on phones without a heavy JS framework |
| Interactivity | Plain JavaScript modules | Menus, Quick Add, the bag and search stay small and easy to explain |
| Styling | Plain CSS, mobile-first, with design tokens (CSS variables) | Readable, with consistent spacing and type |
| Data | A snapshot of real products from the store's public Shopify JSON | Real names, pack prices, photos and variant IDs |
| Links | Products and collections open the live wholesaleshopping.co.uk pages. Checkout uses a Shopify cart link | Every link works, and the journey ends at the real checkout |
| Hosting | Netlify, deployed by you (changed from Vercel on 13 Oct) | Build command `npm run build`, publish directory `dist`, Node 22.12 or later |
| Testing | Playwright, Lighthouse and a real phone | Shows that the interactions work at 4 screen sizes |
| Indexing | `noindex` meta tag and a small "concept" label in the footer | Avoids duplicate content and confusion with the real site |

---

## 3. Project structure

```
wholesaleshopping-homepage-redesign/
├── PLAN.md · REQUIREMENTS.md · CLAUDE.md
├── README.md                    # added at deploy: live link + how to run
├── package.json · astro.config.mjs · playwright.config.js
├── public/
│   ├── data/products.min.json   # loaded only when a shopper opens Quick Add or Search
│   └── logo.svg, favicon, icons
├── scripts/
│   └── fetch-products.mjs       # pulls real products from the live store
├── src/
│   ├── pages/index.astro        # the homepage: puts the sections together in order
│   ├── layouts/Base.astro       # <head>, fonts, meta (noindex), global CSS
│   ├── components/              # one file per section (see §6)
│   ├── scripts/                 # client JS: cart-store, quick-add, cart-drawer, search, menus, tabs
│   ├── data/
│   │   ├── products.json        # snapshot (generated)
│   │   └── content.js           # real copy: offers, trust facts, FAQs, links
│   └── styles/
│       ├── tokens.css           # colours, type scale, spacing, radius, z-index, motion
│       └── base.css             # reset, typography, buttons, chips, focus styles
├── tests/                       # Playwright specs
├── notes/
│   ├── ai-build-log.md          # running log: prompts, AI mistakes, fixes (graded)
│   └── screenshots/before/ · after/
└── docs/                        # final write-ups (Build Notes, CRO decisions, video outline)
```

---

## 4. Data pipeline

- **Script:** `scripts/fetch-products.mjs`, run with `npm run fetch-data`. Run it by hand, not on every build, and commit the output.
- **Sources:** `/collections/<handle>/products.json?limit=24` on the live store, for these collections:
  - `new-wholesale-clothing`
  - `best-seller`
  - `wholesale-plus-size-clothing`
  - `wholesale-women-footwear`
  - `womens-made-in-italy`
  - for the banners: `autumn-winter` and `christmas`
- **Normalised product shape:**
  ```json
  {
    "id": 0, "handle": "plain-knitted-belted-cotton-jogger",
    "title": "Plain Knitted Belted Cotton Jogger",
    "url": "https://www.wholesaleshopping.co.uk/products/plain-knitted-belted-cotton-jogger",
    "type": "Jogger", "origin": "Italy", "plus": true, "isNew": true,
    "images": ["<photo 1>", "<photo 2>"],
    "colours": ["Grey", "Camel"],
    "packs": [{ "label": "Pack of 3", "pieces": 3 }, { "label": "Pack of 1", "pieces": 1 }],
    "variants": [{ "id": 0, "colour": "Grey", "pack": "Pack of 3", "price": 29.25, "perPiece": 9.75, "available": true }],
    "fromPerPiece": 9.75,
    "collections": ["new-in", "plus-size"]
  }
  ```
- **Rules:**
  - Per-piece price = pack price ÷ pieces. This matches the live site, e.g. £29.25 ÷ 3 = £9.75.
  - Handle the inconsistent "Pack of 12" / "Pack Of 12" casing.
  - Where the size option isn't a pack (e.g. "Regular Size", "Plus Size", "One Pack"), show the pack price only.
  - Skip products where every variant is sold out, and remove duplicates that appear in several collections.
- **Images:** use the Shopify CDN's `&width=` parameter to build a `srcset` from 300 to 1000 px. Keep the first two photos of each product for the hover swap.
- **Outputs:**
  - `src/data/products.json`, used at build time to render the cards.
  - `public/data/products.min.json`, loaded lazily on the client.
- **Be polite:** about 8 requests in total. Re-run once before the final deploy to refresh stock.

---

## 5. Design system (a draft, to approve at Checkpoint 1)

- **Look:** clean monochrome fashion: a white background, near-black text, bold uppercase headings, sharp corners and lots of product photography. One accent colour from the WholesaleShopping brand is used for badges, sale prices and the progress bar.
- **Fonts:** headings in Archivo (condensed bold), body text in Inter. Both are self-hosted with Fontsource for speed.
- **Tokens:** colours, a fluid type scale using `clamp()`, spacing from 4 to 96 px, radius, shadows, z-index and motion durations.
- **Breakpoints, mobile-first:** base below 600 · 600 · 900 (the desktop menu appears here) · 1200 · 1440 (maximum container width).
- **Rules:**
  - Tap targets at least 44 px, and body text at least 16 px on mobile.
  - WCAG AA contrast.
  - Fixed aspect ratios on images, so the layout doesn't jump while loading.
  - Visible focus outlines.
  - Support for `prefers-reduced-motion`.
- **Copy:** UK English, short and benefit-first. **Only real claims.** Any placeholder is clearly marked and listed in the notes.

---

## 6. Page sections and component specs

**Page order:** Promo bar → Header → Hero → Trust strip → Categories → Product tabs → Shop by price → Promo banners → How wholesale works → Reviews → Newsletter & app → FAQ & SEO text → Footer.

**Overlays:** mobile menu, search, Quick Add and the bag drawer. Mobile also gets a bottom nav.

**Why this order:** the trust strip comes right after the main promise, and products appear within 2 scrolls on mobile. Discovery comes before persuasion, and long-form content goes at the end.

### 6.1 Promo bar
- **Offers:** 3 real offers rotate every 5 seconds with a fade:
  - "Free UK mainland delivery over £300" links to the delivery information page.
  - "20% off Autumn/Winter with code AW20 (min spend £100)" links to `autumn-winter`.
  - "Pay later with Klarna" links to `/pages/klarna`.
- **Behaviour:** rotation pauses on hover or focus, and there are previous/next buttons. It doesn't rotate when the user prefers reduced motion.
- **Done when:** each message fits on one line at 360 px and the layout doesn't jump between messages.

### 6.2 Header and mega menu (desktop, 900 px and wider)
- **Layout:** the header is sticky.
  - **Row 1:** logo · a wide search box · Account · Wishlist (with count) · Bag (with count).
  - **Row 2:** New In · Clothing · Plus Size · Footwear · Accessories · Made in Italy · Sale. This replaces the current 12 mixed menu items.
- **Mega menu:** columns for Category, Shop by country, Shop by price, and Featured (New In, Best Sellers, Christmas, Everything £5), plus one image tile.
- **Behaviour:** it opens on hover (after a short delay), on click or on Enter. Esc or a click outside closes it, and `aria-expanded` is kept up to date.
- **Done when:** every menu link goes to a real collection and the menu works with the keyboard alone.

### 6.3 Mobile header and menu (below 900 px)
- **Header:**
  - **Row 1:** menu button · logo · bag.
  - **Row 2:** a full-width search field that opens the search overlay.
- **Menu drawer:**
  - Tabs for Clothing, Plus Size, Footwear and Accessories, like Fashion Nova's department tabs.
  - Large rows, at least 48 px tall, with New In and Sale tiles at the top.
  - Contact details and delivery information at the bottom.
- **Behaviour:** focus stays inside the drawer. Esc or tapping the overlay closes it, and the page behind doesn't scroll.

### 6.4 Search overlay
- **Suggestions:** popular-search chips for Dresses, Knitwear, Boots, Plus Size, Made in Italy and Under £5.
- **Instant results:** drawn from the local product file, matching title, type and colour. Up to 6 results, each with a photo and per-piece price.
- **Full search:** pressing Enter or "See all results" goes to the real store search (`/search?q=`).

### 6.5 Hero (no carousel)
- **Copy** (approved at Checkpoint 1):
  - Eyebrow: "UK fashion wholesaler".
  - H1: "Wholesale fashion for UK boutiques & online sellers". This becomes the page's single H1.
  - Proof line: "Packs from 1 piece · Free UK mainland delivery over £300 · Pay later with Klarna".
- **Buttons:** **Shop New In** (primary) and **Best Sellers** (secondary).
- **Desktop:** text on the left with 2–3 real model photos.
- **Mobile:** one 4:5 photo with the text below it and full-width buttons. The category row starts on the first screen.
- **Loading:** the hero image loads first, with high priority and no lazy loading.

### 6.6 Trust strip
- **Items:** the real Trustpilot score, free UK mainland delivery over £300, Klarna, and UK phone and WhatsApp support.
- **Layout:** one row on desktop. On mobile it's a 2 × 2 grid, so everything is visible without swiping.

### 6.7 Category tiles
- **Tiles:** 8–10 categories: New In, Tops, Dresses, Knitwear, Coats & Jackets, Trousers, Plus Size, Footwear, Bags and Scarves.
- **Desktop:** a grid.
- **Mobile:** a horizontal swipe row that snaps into place. About 3.3 tiles are visible, so it's obvious the row scrolls.

### 6.8 Product tabs and product card
- **Tabs:** New In · Best Sellers · Plus Size · Footwear · Made in Italy. Each tab shows 12 products plus a "View all" link to the collection.
- **Behaviour:** standard ARIA tabs that switch on click or with the arrow keys.
- **Layout:** on desktop a 4–5 column row with arrows. On mobile a swipe row with about 2.2 cards visible.
- **Card:**
  - A 2:3 photo, which swaps to the second photo on hover on desktop.
  - Up to 2 badges (New / Made in Italy / Plus Size) and a wishlist heart.
  - The title, at most 2 lines.
  - **"£9.75 per piece"** in large text, with "Pack of 3 · £29.25" small underneath. If there are several packs, the large price reads "from £X per piece".
  - Colour swatches, or a colour count.
  - Quick Add: appears on hover on desktop; on mobile it's an always-visible "+" button of at least 44 px.
  - A "Sold out" state.

### 6.9 Quick Add
- **Form:** a modal on desktop, a bottom sheet on mobile. It shows:
  - the photo, title and country of origin
  - colour chips, with sold-out colours disabled
  - pack chips showing pack price and per-piece price, with a "Best value" label on the lowest per-piece price
  - a quantity stepper and line total
  - **Add to bag**, plus "View full details", which opens the real product page
- **After adding:** the sheet closes, the bag count briefly bounces and the bag drawer opens.
- **Accessibility:** it's a proper dialog: focus stays inside, Esc closes it, and focus returns to where it was.

### 6.10 Bag drawer
- **Progress bar:** "You're £X away from free UK mainland delivery", which changes to "Free delivery unlocked" at £300.
- **Line items:** photo, title, colour and pack, per-piece price, a quantity stepper, a remove button and the line total.
- **Totals:** a subtotal with the note "VAT & delivery calculated at checkout". Check the VAT wording on the live site.
- **Checkout:** a Shopify cart link (`/cart/<variantId>:<qty>,…`) on the real store; this is verified in step 0.6. There's also a "Continue shopping" button.
- **State:** the bag is saved in `localStorage`. The empty state shows links to New In and Best Sellers.

### 6.11 Shop by price
- Bold number tiles from "Under £5" to "Under £20", linking to the real price collections.
- Check whether those collections filter by piece price or pack price, and label the tiles to match.

### 6.12 Promo banners
- Two campaign tiles: Autumn/Winter, and Christmas or Everything £5. Each has live text and a button. They stack on mobile.

### 6.13 How wholesale works
- 4 steps: pick styles in packs → choose colours → pay now or later with Klarna → UK dispatch, with real dispatch times from the delivery page.
- Ends with a call to action.

### 6.14 Reviews
- The Trustpilot rating and 3 real review excerpts, with a link to Trustpilot. The cards swipe on mobile.

### 6.15 Newsletter and app
- An email sign-up that works on the front end only: it shows a success message and is marked as a demo.
- The real app-store badges.

### 6.16 FAQ and SEO text
- 5–6 real FAQs as `<details>` accordions.
- The current long SEO copy, shortened behind a "Read more" button.

### 6.17 Footer
- Columns for Shop, Help, Company and Contact, plus social links, payment icons and Trustpilot.
- On mobile the columns become accordions.
- A small "Concept prototype" line.

### 6.18 Bottom nav (mobile)
- Shop (opens the menu) · Search · Wishlist · Bag · Account, each with a count where relevant.
- It respects the iPhone safe area, and the page has bottom padding so nothing hides behind it.

### 6.19 Motion
- Elements fade up once as they scroll into view.
- Product photos swap on hover, the bag count bounces, drawers and sheets slide in, and the progress bar fills.
- Everything switches off when the user prefers reduced motion. Nothing auto-plays except the promo bar text, which can be paused.

---

## 7. CRO changes we're building (these become the CRO Decisions doc)

| # | Problem on the current site | Change | Expected benefit |
|---|---|---|---|
| 1 | Nothing above the fold says what the site is or who it's for. The hero is 4 slides with the text inside the images and no alt text, and the H1 is at the bottom of the page | A hero with real HTML text, a B2B headline, the H1 and 2 buttons | Visitors instantly see it's wholesale for retailers and know where to start, so fewer leave straight away |
| 2 | 12 top-menu items mixing categories, seasons and offers | 7 clear items and a grouped mega menu | Faster scanning and less choice overload |
| 3 | 5+ competing offers at the top, with free delivery shown twice | One rotating promo bar with 3 real offers | Offers actually get noticed and understood |
| 4 | Confusing card prices such as "£29.25 – £29.25 (Pack of 3 – Pack of 3)" | Per-piece price first, then pack size and price, with "Best value" in Quick Add | Buyers can compare margins easily and add to the bag without opening every product page |
| 5 | Trust signals buried in the footer and SEO text | A trust strip under the hero and a reviews section | Less perceived risk for first-time trade buyers |
| 6 | Few products on the homepage (4 + 20) and no New In row | Category tiles and a 5-tab product row | More products seen per visit and a faster route to relevant stock |
| 7 | Nothing encourages buyers to reach the £300 free-delivery threshold | A "£X away from free UK delivery" progress bar in the bag | Bigger average orders |
| 8 | On mobile, the banners' text sits inside the images and there's a long scroll before any products | A mobile-specific hero, categories on the first screen, a bottom nav and a Quick Add bottom sheet | Shoppers on phones reach products faster |

---

## 8. Build steps

### Phase 0: Setup and evidence (13 Oct, morning)
- [x] 0.1 Scaffold the Astro project. Set up git, `.gitignore` and the npm scripts (`dev`, `build`, `preview`, `fetch-data`, `test`).
- [x] 0.2 Start `notes/ai-build-log.md`. Backfill it with the brief, the research and this plan.
- [x] 0.3 Take "before" screenshots of the current site and Fashion Nova at 390 px and 1440 px with Playwright, into `notes/screenshots/before/`.
- [x] 0.4 Write and run `fetch-products.mjs`, then spot-check its prices against the live site.
- [x] 0.5 Gather the real facts into `src/data/content.js`:
  - the Trustpilot score, review count and 3 reviews
  - delivery times, payment methods and VAT wording
  - app-store links and the WhatsApp number
  - the logo, the brand colour and the FAQ text
- [x] 0.6 Check that the collection links work, and that the Shopify cart link reaches the checkout page. Stop there; place no order.
- **Done when:** `npm run dev` serves the base page, the data file has 60–80 valid products, and the facts list is complete.

### Phase 1: Design direction (13 Oct, morning)
- [x] 1.1 Write `tokens.css` and `base.css` (type, buttons, chips and focus styles).
- [x] 1.2 Build the Header, Hero and ProductCard as a sample of the look, on mobile and desktop.
- [x] 1.3 Screenshot both sizes.
- [x] **Checkpoint 1: you approve the look, the tone of the copy and the order of the sections.**

### Phase 2: The core shopping journey (13 Oct, afternoon)
- [x] 2.1 Promo bar
- [x] 2.2 Desktop header and mega menu; mobile header and menu drawer
- [x] 2.3 Search overlay
- [x] 2.4 Trust strip and category tiles
- [x] 2.5 Product tabs, with cards built from the data
- [x] 2.6 Quick Add (modal on desktop, bottom sheet on mobile)
- [x] 2.7 Cart store, bag drawer, progress bar and checkout link, plus the header and bottom-nav counts
- **Done when:** on both mobile and desktop, a shopper can go from the hero or a category/tab to Quick Add, then the bag, then the checkout link.

### Phase 3: Remaining sections and a mobile pass (13 Oct, evening)
- [x] 3.1 Shop by price, promo banners and How wholesale works
- [x] 3.2 Reviews, newsletter and app, FAQ and SEO text, and the footer
- [x] 3.3 Bottom nav, scroll animations and reduced-motion support
- [x] 3.4 A dedicated mobile pass at 360, 390 and 768 px: spacing, type, tap targets, sticky elements and safe areas
- [ ] **Checkpoint 2: you test on your own phone, using the dev server over Wi-Fi, and list any issues.**

### Phase 4: Test and fix (14 Oct, morning)
- [x] 4.1 Run the Playwright interaction tests (see §9) at 4 screen sizes.
- [x] 4.2 Check every link works, with no `#` placeholders left.
- [x] 4.3 Run Lighthouse in mobile mode on the production build and fix the top issues.
- [x] 4.4 Fix the bugs found, logging each one and its fix in the AI build log.
- [x] 4.5 Take "after" screenshots into `notes/screenshots/after/`.

### Phase 5: Deploy (14 Oct, midday)
- [ ] 5.1 Refresh the product data and make a production build.
- [ ] 5.2 You deploy to Netlify: build command `npm run build`, publish directory `dist`, Node 22.12 or later.
- [ ] 5.3 Test the live link on desktop and on your phone, and re-run Playwright against it.

### Phase 6: Write-ups and video (14 Oct, afternoon)
- [x] 6.1 Draft `docs/ai-build-notes.md` from the log (tools, process, prompts, what went wrong, the fix, what you learned). You rewrite it in your own words.
- [x] 6.2 Draft `docs/cro-decisions.md` with 8 Problem → Change → Benefit items and before/after screenshots.
- [x] 6.3 Draft the answer to "If you had one more day…".
- [x] 6.4 Write a 4-minute video outline. You record it, e.g. with OBS or Loom.
- [ ] 6.5 Export the docs to PDF, then submit the live link, the video and the docs.
- [ ] 6.6 Before making the repo public, remove `REQUIREMENTS.md` (it contains NaskSoft's brief) or check with NaskSoft first.

---

## 9. Test plan

**Automated checks** with Playwright at 360×740, 390×844, 768×1024 and 1440×900:
1. The page loads with no console errors.
2. There's no horizontal scrolling at any size.
3. The desktop mega menu opens on hover and from the keyboard, and Esc closes it.
4. The mobile menu opens, its tabs switch, focus stays inside it, and Esc or tapping the overlay closes it.
5. Typing in search shows results, and Enter goes to the real store search.
6. The product tabs switch on click and with the arrow keys.
7. Quick Add → Add to bag works:
   - the count updates and the drawer shows the item
   - the progress bar is correct
   - changing the quantity and removing items work
   - the bag survives a page reload
8. The checkout link contains the right variant IDs and quantities.
9. The wishlist button and its count work and survive a reload.
10. Every link returns HTTP 200; there are no dead links.
11. Buttons are at least 44 px on mobile, and every image has alt text.

**Lighthouse targets (mobile):** Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95. If a target is missed, explain why.

**Manual:** go through the brief's checklist on a real phone: navigation, buttons and links, sections, mobile layouts, product cards, readable text, animations and the overall journey.

---

## 10. AI build log (graded, so keep it up to date)

Each entry records: **when · what was asked (the prompt) · what the AI produced · what was wrong · how it was fixed · what was learned.** Save screenshots of any bad output.

The log feeds the AI Build Notes, and through them the "AI Tool Usage" (20%) and "Learning & Problem Solving" (10%) scores.

---

## 11. Out of scope (candidates for the "one more day" answer)

- a real checkout and customer accounts
- redesigned collection and product pages
- a real newsletter sign-up
- multiple currencies
- A/B testing
- converting the page into Shopify theme sections

---

## 12. Risks

| Risk | What we'll do |
|---|---|
| The cart link doesn't work on their store | Fall back to the product page link and explain this in the notes |
| Live products sell out or change | Use the data snapshot, refreshed before deploy |
| Trustpilot data can't be fetched | Use the rating shown on their own site, or a clearly marked placeholder |
| Shopify blocks loading its images from our site | Download the few images we use into `/public` |
| We run short of time | Cut in this order: reviews → How wholesale works → search overlay. The header, hero, trust strip, categories, product tabs, Quick Add, bag and mobile layout always stay |
