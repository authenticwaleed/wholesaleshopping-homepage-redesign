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
