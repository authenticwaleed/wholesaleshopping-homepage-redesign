# AI Build Log

The raw material for the AI Build Notes (REQUIREMENTS.md D-3). Add an entry after every notable step: what was asked, what the AI did, what was wrong, how it was fixed, and what was learned. Keep it factual; the final notes get rewritten from this.

**Main tool:** Claude Code (model: Claude Opus 5.5) in the terminal. It reads files, runs commands, writes code and takes screenshots.

---

## 1. Understanding the brief (12 Oct, evening)
- **Prompt:** "understand this file:///home/waleed/Downloads/AI%20Web%20CRO%20Assessment.pdf assesment"
- **AI did:**
  - Read the 6-page PDF and summarised the task, the deliverables and the scoring weights.
  - Pointed out that about 30% of the score (AI usage plus learning) is judged mainly from the written notes, so the log has to be kept from the very start.
- **Checked:** I asked it to confirm it had read the right file. It listed the content page by page.

## 2. Research before planning (12 Oct)
- **Prompt:** "make a implementation plan first"
- **AI did:** before planning, it downloaded the live homepage, the store's public product data (Shopify `products.json`) and Fashion Nova's homepage, and analysed them with small scripts.
- **Findings on the current homepage** (Shopify, Kalles theme):
  - 12 mixed top-menu items.
  - 5+ competing offers at the top, with free delivery shown twice.
  - Hero slides are images only, with the text inside the pictures and no alt text.
  - The only H1 is buried in an SEO text block near the bottom.
  - Prices read like "£29.25 – £29.25 (Pack of 3 – Pack of 3)".
  - Trust signals appear only in the footer.
  - Products are sold in packs of 1–12, priced per piece.
- **Findings on Fashion Nova** (Shopify Hydrogen):
  - a slim offer bar
  - big search
  - "Shop by Category" tiles
  - a tabbed "Shop the Latest" product row
  - Quick Add on product cards
  - a "$X away from free shipping" message
- **Why it matters:** the CRO decisions are based on real problems we observed, not guesses.

## 3. What went wrong: the first "plan" wasn't an implementation plan (12 Oct)
- **What happened:** the AI's first answer was mostly research findings and a list of section ideas, ending with a question. It wasn't the step-by-step build plan I wanted, so I asked again: "implementation plan".
- **Fix:** it wrote a full technical plan (now `PLAN.md`) covering:
  - the stack and folder structure
  - the data pipeline
  - specs for every section, with "done when" criteria
  - the CRO table, test plan and risks
- **Stack change:** the AI changed its own earlier suggestion from "Vite + plain JS" to **Astro** (which runs on Vite). Each section is its own file, and product cards are pre-built into the HTML, which is faster on phones.
- **Learned:** say exactly what format you want, e.g. "a step-by-step implementation plan with files, tasks and tests".

## 4. Repo, requirements and project instructions (13 Oct)
- **Prompts:**
  - "what is the project name which tackstack we are going to use…"
  - "git@github.com:authenticwaleed/wholesaleshopping-homepage-redesign.git clon this … make a md file … plan.md or requirement.md"
- **AI did:**
  - Suggested the repo name and stack, then cloned the empty repo.
  - Wrote `REQUIREMENTS.md`: the brief as checklists, with every item mapped to a plan section.
  - Wrote `CLAUDE.md`: instructions every Claude Code session loads, so the AI keeps following the plan.
  - Committed and pushed (`b740a4c`).
- **Note:** `REQUIREMENTS.md` contains NaskSoft's brief. Keep the repo private, or remove that file before making the repo public.

## 5. Phase 0: project setup (13 Oct)
- **AI did:**
  - Set up Astro 7.3.8 by hand rather than with the interactive starter, so only what's needed gets added.
  - Self-hosted the fonts (Inter and Archivo).
  - Added a `noindex` tag so the concept never competes with the real site in search.
  - Pinned Playwright to 1.62.1, the version whose browser was already downloaded on this machine. This avoided a large download.

## 6. Real product data, and the first data mistake (13 Oct)
- **AI did:**
  - Wrote `scripts/fetch-products.mjs` and pulled 70 real products from 7 collections.
  - Spot-checked one product: Plain Knitted Belted Cotton Jogger, Pack of 3, £29.25 → **£9.75 per piece**, the same as the live site.
- **What went wrong:**
  - The AI's script assumed every product's "Size" option is a pack size ("Pack of 3"). In fact **26 of the 70 products** use "Regular Size / Plus Size / One Size" instead, so their per-piece price came out empty.
  - Some of those prices are clearly for a whole pack (£24 harem trousers whose URL says "pack-of-6"). Others look like a single piece (£5 Christmas leggings).
- **Fix (for now):** never invent a per-piece price. Those products show their price with the size type, and the live product pages will be checked for the real pack details.
- **Also went wrong:** the store returned **HTTP 429 (too many requests)** because the fact-checking helper and the data script were requesting pages at the same time. Requests were paused.
- **Learned:** space out requests to a live store, and run only one scraper at a time.

## 7. "Before" screenshots (13 Oct)
- `scripts/screenshots.mjs` captures each page at phone (390 px) and desktop (1440 px) sizes, both the first screen and the full page, into `notes/screenshots/before/`.
- **Fashion Nova, what we saw:**
  - a black offer bar with a countdown timer
  - logo, account, wishlist and bag icons
  - department tabs and a big rounded search bar
  - a full-width photo hero whose text ("40% OFF EVERYTHING") is baked into the image
- **Decision: no countdown timer.** We only show urgency when there's a real deadline, because fake urgency hurts trust with business buyers.

## 8. Phase 1: the look, and what the screenshots caught (13 Oct)
- **Process:** build a section, screenshot it at 390 px and 1440 px, look at it, fix it. Each round found real problems.
- **Choosing photos:** the AI built a contact sheet of 30 real product photos. New In uses moody night-time London street shots, which suit an editorial hero. The hero uses the green trench coat and the faux-fur jacket.
- **Bug 1 – desktop hero overflow:**
  - **Problem:** the AI gave the hero a fixed height. The 6-line headline pushed the bullet points and buttons out of the black panel, white text on white, overlapping the next section.
  - **Fix:** `min-height` instead of `height`, a smaller desktop headline (14 characters per line) and a wider text column.
- **Bug 2 – useless product tags:** the "shop this look" tags were cut off to "Plain Belte…". On mobile they also covered the model's face.
  - **Fix:** full product name and per-piece price on two lines. Tags show on desktop only.
- **False alarm:** a full-page screenshot showed faint "Quick add" bars on every card.
  - **Checked:** the button's computed style (`opacity: 0`) and a normal viewport screenshot. Both showed it was only an artifact of the full-page screenshot mode, not a real bug.
  - **Learned:** confirm a visual bug in a second way before "fixing" it.
- **Bug 3 – mobile buttons below the fold:**
  - **Problem:** after adding the header, search box and quick-link chips (about 215 px), the 4:5 hero pushed "Shop New In" off the first screen.
  - **Fix:**
    - The hero height now adapts to the screen height: `clamp(340px, 100svh − 215px, 520px)`.
    - The eyebrow label is hidden on phones, because the headline already says it.
    - Chips and offer bar slimmed down.
  - **Measured:** button bottom edge at 648 px on a 664 px iPhone 13 viewport, and 624 px on a 653 px Android viewport. No horizontal scroll.
- **Bug 4 – off-centre offer text on phones:**
  - **Problem:** the offers share one slot. The longest (AW20) wrapped to two lines, which made the bar 50 px tall, and the one-line offers sat at the top of it.
  - **Fix:** the offers are now centred, and phones show a shorter AW20 line ("T&Cs apply" appears on desktop only). Measured: 40 px bar, 0 px off-centre on iPhone 13.
- **Design decision – one-tap chips:** quick-link chips (New In, Best Sellers, Plus Size, Footwear, Made in Italy, Under £4.99, Christmas, Sale) sit under the mobile search box. A buyer who knows what they need is one tap from stock, straight from the first screen.

## 9. Checkpoint 1 feedback: use the real logo (13 Oct)
- **Prompt:** "yes commit and push, use real logo"
- **AI did:**
  - Found the logo (`WSO_Logo_Black.svg`) in the homepage HTML saved earlier, so no extra requests went to the rate-limited store.
  - Downloaded it once from Shopify's image CDN.
  - Checked the file before using it: 6 KB of plain vector shapes, with no scripts or external links.
  - Replaced the temporary text logo with it (126 px wide on phones, 180 px on desktop, the same sizes as the live site).
- **Also:** screenshots are now saved as JPEG instead of PNG. The full Fashion Nova page went from 4.9 MB to 1 MB, which keeps the repo small.
- **Small bug:** Astro removed the space before "· T&Cs apply" in the offer bar ("£100· T&Cs"). Fixed by adding an explicit `{' '}`.

## 10. Real facts change the design (13 Oct)
- **AI did:** a background helper agent collected sourced facts into `notes/real-facts.md` (15 sections, about 58 requests).
  - **What went wrong:** the store returned **HTTP 429** for product and collection pages, and Trustpilot blocked plain `curl`. The helper switched to another fetch tool (WebFetch) and recorded which facts came from where.
- **Facts that changed the page:**
  - **Trustpilot 4.8 "Excellent", 1,111 reviews.** This replaces the inconsistent "178" and "1,300+" figures used elsewhere on the site.
  - **Same-day dispatch for orders placed by 2pm Mon–Fri.** A strong B2B fact that the current homepage barely mentions.
  - **£100 minimum order:** the live cart blocks checkout below it. Our bag now warns early, with a two-step progress bar (£100 minimum, then £300 free delivery), instead of surprising buyers at checkout.
  - **Prices exclude VAT** (T&Cs). This is now said clearly in the product section, Quick Add and the bag.
  - **The "Under £X" collections filter by pack price**, not per-piece price, so our tiles say "Packs under £X". Otherwise the per-piece labels on cards would have contradicted them.
  - **A wholesale account is required to order** (FAQ). "Register a trade account" now appears in the menu and in "How wholesale works".
  - **Cart permalink works:** `/cart/<variant>:<qty>` returns a 302 to the store's Shop Pay checkout, so our bag can hand off real orders.
- **Conflicts kept out of the copy:**
  - Two WhatsApp numbers: we use the one that matches the phone line and the policy pages.
  - Returns window: 2 working days (policy) vs 14 days (FAQ page). We use the policy.
  - "New styles every week": true in 9 of the last 10 weeks only, so we don't claim it.
- **Before screenshots of the current site** showed real issues on phones:
  - The hero headline is baked into the image and cut off below the fold.
  - No buttons or products on the first screen.
  - Two promo messages overlapping in a thin strip.
  - The Chat bubble covering "Search" in the bottom bar.

## 11. Phase 2: the core shopping journey (13 Oct)
- **Built:**
  - trust strip and category tiles (photos picked from a contact sheet of real products)
  - tabbed "Shop the latest" row
  - **Quick Add** (bottom sheet on phones, centred window on desktop)
  - bag drawer (progress bar, quantity steppers, Shopify checkout link)
  - wishlist drawer, search panel with instant matches, mobile menu with department tabs, keyboard and touch support for the mega menu
- **Tested with a Playwright journey script:**
  - Desktop: tabs → Quick Add → add 3 packs → bag opens → +1 → reload keeps the bag → mega menu by keyboard and Esc → search "boots" (7 matches).
  - Mobile: menu tabs → wishlist heart → Quick Add → bag → search "jumper" (5 matches).
  - No console errors, and no horizontal scroll.
- **Bugs the checks caught:**
  1. **Lists losing their spacing:**
     - **Problem:** the CSS reset `ul[role='list'] { padding: 0 }` was more specific than the component classes. Bag lines touched the drawer edges, the line total was cut off, and the swipe rows lost their edge-to-edge bleed.
     - **Fix:** wrap the reset in `:where()` (zero specificity). Measured before and after: `padding-left` went from 0px to the intended value.
  2. **Hollow trust stars:**
     - **Problem:** the icon component spread custom attributes after its defaults. In HTML the first duplicate attribute wins, so `fill="currentColor"` was ignored.
     - **Fix:** merge the attributes in the component's code instead.
  3. **Blank photos in Quick Add and the bag:**
     - **Checked first:** it wasn't a broken link; the 640 px photo took about 0.7 s to arrive.
     - **Fix:** show the card's already-loaded photo immediately as a placeholder, then fade in the sharp one. Bag thumbnails use the small size that's usually already cached.
  4. **Quick Add didn't match the card:**
     - **Problem:** the card said "From £17.75 per piece (Pack of 3)", but Quick Add opened on the first colour, where only Pack of 1 at £18.00 was in stock.
     - **Fix:** Quick Add now opens on the best-value variant that's in stock, the same one the card advertises.
  5. **Repeated price:** "£18.00 per piece · Pack of 1 £18.00" became "£18.00 per piece · Pack of 1".
  6. **Add button below the fold:** on phones the Add to bag button sat below the fold inside the sheet. It's now pinned to the bottom of the sheet (measured: button bottom at 652 px on a 664 px screen).
  7. **My own test was wrong:** "Footwear" matched two tabs (product tabs and menu tabs) while the menu was open. Fixed by scoping the locator to the menu. The page was fine.

## 12. Phase 3: remaining sections and the mobile pass (13 Oct)
- **Built:**
  - **Shop by pack price:** tiles labelled "Packs under £X", because the store's collections filter by pack price.
  - **Seasonal banners:** live text over real product photos; the whole banner is one tap target.
  - **How wholesale ordering works:** 4 sourced steps (account, packs, £100 minimum and payment, same-day dispatch).
  - **Reviews:** the real Trustpilot rating and reviews.
  - **Newsletter:** says honestly that it's a demo, so nobody is subscribed to the real list by accident. Plus links to the real app listings.
  - **FAQ:** 6 trade questions as accordions.
  - **About:** the store's SEO copy, folded behind "Read more".
  - **Footer:** accordions on phones, contact details, payment methods, company and VAT numbers, and a "concept" note.
  - **Mobile bottom bar:** Shop, Search, Saved, Bag and Account.
- **Bug 1 – the page was wider than the phone:**
  - **Problem:** the full-page phone screenshot came out 421 px wide on a 390 px phone. The newsletter's grid column couldn't shrink below the email field plus button (CSS grid items default to `min-width: auto`), so the whole page laid out at 421 px. A real phone would show the page slightly zoomed out with sideways scrolling.
  - **Fix:** `grid-template-columns: minmax(0, 1fr)` and a full-width input. Verified at 320, 360, 390, 768 and 1440 px: layout width equals screen width.
- **What went wrong with my own test:**
  - **Problem:** my "no horizontal scroll" check compared `scrollWidth` with `innerWidth`. On mobile `innerWidth` itself grows to fit too-wide content, so the check always said 0.
  - **Fix:** the check now compares against `visualViewport.width`, the real screen width.
  - **Learned:** a test can pass for the wrong reason, so check what it actually measures.
- **Full-page screenshot artifacts, second time:**
  - **Problem:** the banners showed black because their lazy-loaded photos hadn't arrived yet.
  - **Fix:** the screenshot script now waits for every visible image.
  - **The first two versions of that wait never finished:** images in closed tabs, closed panels and off-screen parts of swipe rows only load when needed, by design. The wait now ignores them.
- **Small fixes:**
  - The footer showed "−" markers on desktop, because a more specific `[open]` rule beat the desktop override.
  - A white strip sat under the dark footer on phones. The space reserved for the bottom bar moved into the footer's own padding.
  - "How it works" numbers were misaligned. Fixed with equal-width digits; all titles now start at 72 px.

## 13. Phase 4: automated tests, link check, Lighthouse (13 Oct)
- **Built:**
  - a Playwright suite (`tests/home.spec.js`) at 4 screen sizes, covering every item in the brief's testing checklist
  - `scripts/check-links.mjs`, which checks collection and product links against the store's own JSON lists, to stay polite to its rate limiting
  - `scripts/serve.mjs`, a tiny server for the built site
- **Surprise 1 – Astro runs its servers in the background:** Astro 7 detected the AI agent (`AI_AGENT` is set) and moved `astro dev` and `astro preview` into the background. That breaks test runners, which expect the server to stay in the foreground. **Fix:** a 50-line Node server for `dist/`, with gzip so speed tests stay realistic.
- **First test run: 43 passed, 8 failed.** What the failures really were:
  - **Reduced motion – the test was wrong:** `test.use({ reducedMotion })` wasn't applied. A fresh browser with reduced motion showed the page was correct. **Fix:** `page.emulateMedia()` in the test.
  - **Real bug – the footer "X" (Twitter) link was 10 px wide.** Now at least 44×44 px. Afterwards every control on phones was raised to 44 px (offer arrows, chips, logo, contact links), and the hero height formula was adjusted so the buttons still fit the first screen.
  - **Timeouts – a test problem, not a page problem:**
    - **What happened:** with 4 screen sizes running at once, waiting for the browser's "load" event (every product photo from Shopify's CDN) took over 30 s.
    - **Measured:** a single page load fires "load" after 1.7 s, so shoppers aren't affected.
    - **Fix:** tests wait for the page itself (`domcontentloaded`), use 2 workers, and ignore slow-photo console errors from the CDN.
- **Final result:** 51 passed, 5 skipped by design.
- **Link check:** 146 OK, 0 broken.
  - Facebook (HTTP 400) and Trustpilot (403) reject scripts but work in a browser, which I checked by hand.
  - **Also went wrong:** one run crashed on a network hiccup, so requests now retry. And my cleanup command `pkill -f "serve.mjs …"` matched its own shell and killed it (exit code 144). I now stop the server by its process ID instead.
- **Lighthouse** (full table in `notes/test-results.md`):
  - phone performance 90 → **91**, desktop 81 → **92**
  - accessibility **100**, best practices 96 → **100**
  - desktop layout shift 0.072 → **0**, desktop LCP 3.3 s → **1.8 s**
  - **Fixes, all found by reading the audit details rather than guessing:**
    - a favicon, because the browser's automatic `/favicon.ico` request returned 404
    - a label mismatch on the "Saved" button
    - inlined CSS
    - the second desktop hero photo was lazy-loaded although it's above the fold
    - photos pre-cropped by Shopify's CDN (`&height=…&crop=top`, checked first with a test request)
    - mega-menu photos that downloaded while their menus were closed
    - preloaded fonts
  - **Biggest single win:** the 88 KB variable font was competing with the hero photo on phones. The design only uses one style of it, so `subset-font` pins it to extra-bold at 75% width: **8 KB**. The headline looks identical.
- **Learned:**
  - When a test fails, find out whether the page or the test is wrong. Three of my four failure types were the test.
  - Read the audit details before fixing: the slowest element on desktop wasn't the photo I assumed.

## 14. Phase 6: write-up drafts, and two bugs the comparison image caught (13 Oct)
- **Prompts:**
  - *"no need to deploy, we will do it on Netlify, I will do this myself"*: I chose the hosting and deploy it myself.
  - *"yes"*: start the write-ups.
- **AI did:**
  - Drafted `docs/ai-build-notes.md`, `docs/cro-decisions.md` (8 decisions), `docs/one-more-day.md` and `docs/video-outline.md` from this log, `notes/real-facts.md` and `notes/test-results.md`, then checked every number against those files.
  - Made side-by-side "current site vs redesign" images and feature screenshots in `docs/images/`.
- **Bug 1 – the bottom bar hid the hero buttons on phones:**
  - **How it was found:** the side-by-side image for the CRO doc showed the fixed bottom bar covering "Shop New In" and "Best Sellers". All 51 tests had passed, because the first-screen test only checked the buttons were inside the screen.
  - **Fix:** the hero height now also subtracts the bar (`--bottom-bar` token), and the test checks the buttons against the bar's top edge. Measured: buttons end at 580 px, the bar starts at 607 px (iPhone 13).
- **Bug 2 – the offer bar lost its spaces:**
  - **What happened:** "Free UK mainland **deliveryon** orders over £300". When the links became flex boxes (to make them 44 px tall), flex layout dropped the spaces between the bold part and the plain text.
  - **Fix:** an inner span, plus a new test that checks the exact wording.
- **Result:** 55 tests pass at 4 sizes.
- **Learned:**
  - Making something to show people (the comparison image) was the best test of the day. Look at the whole screen the way a buyer would, not just at what the tests measure.
  - A fix in one place (bigger tap targets) can break another (the spaces).

## 15. PDFs of the write-ups (13 Oct)
- **Prompt:** *"yes make the pdf files"*
- **AI did:** wrote `scripts/make-pdfs.mjs` (`npm run make-pdfs`). It converts the Markdown drafts to HTML with `marked`, using the site's own fonts and logo, then prints them to A4 PDFs in Playwright's Chromium, with page numbers. The "Draft for you to edit" notes are left out.
  - **Output:** one PDF per document, plus `submission.pdf` combining the AI Build Notes, the CRO decisions and the "one more day" answer (10 pages).
- **Checked:** page counts (`pdfinfo`), that no draft note remained (`pdftotext`), and page images (`pdftoppm`) for layout.
- **Decision:** I used Chromium's print-to-PDF rather than building the PDFs by hand with reportlab. The documents are Markdown with tables and screenshots, and a browser lays those out properly.

## 16. Deploying to Netlify, and what only the live site revealed (13 Oct)
- **Prompts:**
  - *"add netlify.toml file for deploy"*
  - *"…unable to switch the project, previous SaaSquatch is still present"* (Netlify's GitHub import screen kept looping back to an older repo)
  - *"do option 2, deploy from my computer"*
  - *"done authorized"*
- **AI did:**
  - Wrote `netlify.toml` (build, Node 22, caching, `noindex`) and proved it with a fresh clone, `npm ci` and `npm run build`.
  - Deployed from this computer with the Netlify CLI to https://wholesaleshopping-homepage-redesign.netlify.app.
- **What went wrong (the AI's mistake):**
  - **What happened:** I started a second copy of the Netlify CLI (`npx … status`) while the first was still installing. Both wrote into the same download folder, corrupting the install (`TAR_ENTRY_ERROR`), and the login hung before it ever showed an authorization page. The approval you clicked at that point wasn't this login.
  - **Fix:** stopped the stuck process, deleted the corrupted download, installed the CLI once into its own folder, then used `netlify login --request` (a login ticket made for agents), giving you the link and polling `--check` until you approved.
- **Live site problems, each caught by testing the live link:**
  1. **Every file returned 401.** The team had login protection on all deploys. Changed to protect preview deploys only.
  2. **Badge over the bottom bar:**
     - **What happened:** 54/55 tests passed. The wishlist test failed intermittently at 360 px, waiting for the bottom bar's "Saved" button. Sampling the page showed an iframe on top of it: Netlify's injected "Built with Netlify" badge (`#nl-badge-frame`, fixed bottom-right, highest z-index). On phones it covered Saved, Bag and Account.
     - **Fix:** turned it off (`built_with_badge_enabled: false`). Result: 55/55.
  3. **Desktop layout shift 0.072:** text reflowed when the fonts arrived after first paint; locally there's no network delay, so it never showed.
     - **First guess was wrong:** embedding the 8 KB heading font changed nothing (0.071).
     - **Real cause:** the Lighthouse details pointed to the body font (Inter). A size-matched fallback (Arial or Liberation Sans with Inter's metrics) brought it to **0.018**.
- **Measured honestly:** performance varies with the server's response time from here (134–1,008 ms). It ranged 82–96 on phones and 84–99 on desktop, so the notes give the range, not the best run. Accessibility and best practices were 100 every time.
- **Learned:**
  - Test the deployed site. Hosting adds its own problems (access protection, an injected badge), and real network timing shows problems localhost hides.
  - One Lighthouse run isn't a result: run it more than once.

## 17. Walkthrough PDF: each section mapped to the brief (13 Oct)
- **Prompt:** *"make a pdf walkthrough including screenshots which section belongs to which part according to the client requirements"*
- **AI did:**
  - Wrote `scripts/walkthrough-screenshots.mjs`. It captures 29 screenshots from the live site: every section at desktop and phone size, plus the mega menu, phone menu, Quick Add, bag and search states.
  - Wrote `docs/walkthrough.md`: 19 sections, each with desktop and phone side by side, what it does, the brief's exact words it meets (with the part of the brief they come from), and the Fashion Nova idea it adapts. It ends with a table from every requirement to its sections.
  - The PDF is `docs/pdf/walkthrough.pdf` (17 pages).
- **What went wrong:**
  - **A name clash:** the script first crashed because I named the site address `URL`, hiding JavaScript's built-in `URL` class.
  - **Bottom bar over the screenshots:** on phone section screenshots, the fixed bottom bar sat on top of the content. Correct on a real phone, but it hid content in a document. While capturing single sections the script now hides the bar and stops the header sticking. First-screen and menu shots keep them.
  - **A half-empty first page:** section 1's two large images couldn't fit under the intro, so section 1 now flows across the page break.
