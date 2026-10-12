# WholesaleShopping.co.uk: homepage redesign concept

A mobile-first homepage concept for [WholesaleShopping.co.uk](https://www.wholesaleshopping.co.uk), a UK B2B fashion wholesaler. It takes Fashion Nova's strongest UX patterns and adapts them for trade buyers: prices per piece, pack sizes, Quick Add, a £100 minimum order and £300 free-delivery progress, and trust signals up front. Built for NaskSoft's "AI Web & CRO Builder" assessment.

**Live link:** _added after deploy_

- **Real data:** products, prices and photos come from the live store's public Shopify data.
- **Real links:** every collection, product and checkout link leads to the real store.
- **Concept only:** the page is a prototype. It carries `noindex` so it never competes with the real site.

## Run it

Requires Node.js 22.12 or later.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm test           # end-to-end tests at 4 screen sizes (builds and serves dist/ first)
```

| Script | What it does |
|---|---|
| `npm run fetch-data` | Refreshes the product snapshot from the live store (`src/data/products.json`) |
| `npm run check-links` | Checks every link on the built page against the live store (`notes/link-check.md`) |
| `npm run screenshots -- <url> <name> [dir]` | Phone and desktop screenshots, first screen and full page |
| `npm run make-font` | Rebuilds the 8 KB display font from Archivo |
| `npm run make-pdfs` | Turns the drafts in `docs/` into PDFs in `docs/pdf/` (run again after editing them) |

## Stack

Astro 7 (static HTML), plain JavaScript and plain CSS with design tokens. Playwright for tests, Lighthouse for speed and accessibility. No UI framework: the page ships about 9 KB of JavaScript (gzipped) for menus, Quick Add, the bag, search and the wishlist.

## Where things are

| | |
|---|---|
| `REQUIREMENTS.md` | The brief as checklists |
| `PLAN.md` | Implementation plan: section specs, CRO changes, build steps, tests |
| `src/components/` | One file per homepage section |
| `src/scripts/` | Browser behaviour: bag, Quick Add, search, menus, wishlist |
| `src/data/content.js` | All page copy and links (sourced facts only) |
| `notes/real-facts.md` | Every fact used on the page, with its source |
| `notes/ai-build-log.md` | How AI was used: prompts, what went wrong, how it was fixed |
| `notes/test-results.md` | Test, link-check and Lighthouse results |
| `notes/screenshots/` | Before (current site and Fashion Nova) and after screenshots |
| `docs/` | Submission drafts: AI Build Notes, CRO decisions, "one more day" answer, video outline, comparison images |
| `docs/pdf/` | The same documents as PDFs; `submission.pdf` combines the three to submit |
