# Real facts: WholesaleShopping.co.uk

Verified facts for the homepage redesign. Every item below comes from a page fetched on **12 Oct 2026, 19:32–19:52 UTC** (13 Oct 2026, 00:32–00:52 local time, UTC+5). Anything that couldn't be verified is marked **NOT FOUND** or **UNVERIFIED**.

**How the facts were collected**
- About 58 requests were made, one at a time: 29 with `curl` (desktop Chrome User-Agent) and about 29 with WebFetch. No orders, forms, logins or checkout pages.
- With curl, Shopify returned **HTTP 429** (`retry-after: 60`) for `/products/*`, `/collections/<handle>` HTML pages and `/search`. The homepage, `/pages/*` and the `.json` endpoints returned 200. Those blocked pages were read with **WebFetch** instead; quotes from them are marked *(via WebFetch)*. WebFetch extracts text with a helper model, so its quotes are reliable but it can't report HTTP status codes.
- Trustpilot blocked curl with a 403 "Verifying Connection" page on both `uk.` and `www.`. WebFetch got through.
- The requests came from a Pakistani IP. The store's localisation form showed `country_code` "PK", but prices stayed in **GBP**.

---

## 1. Trustpilot

Source: https://uk.trustpilot.com/review/wholesaleshopping.co.uk and `?sort=recency` *(via WebFetch)*

| Fact | Value (exact) |
|---|---|
| TrustScore | **4.8**, labelled **"Excellent"** (star image alt "TrustScore 5 out of 5", so 5 stars are shown) |
| Total reviews | **1,111**: "(1,111)" under All reviews, "See all 1,111 reviews", "1k reviews" in the score block |
| Star split | 5-star 89%, 4-star 5%, 3-star 1%, 2-star <1%, 1-star 4% |
| Profile | "Claimed profile • July 2019"; "Asks customers to review"; category: Clothing wholesaler |
| Company details on Trustpilot | "36c Broughton St, M8 8NN, Manchester, United Kingdom"; "+44 7482 071701"; "sales@wholesaleshopping.co.uk" |

**The 3 most recent reviews** (sorted by "Most recent"; WebFetch reported each as Verified, GB):

1. **Sandra**, Rated 5 out of 5 stars, posted "3 days ago" (as of 12 Oct 2026; date of experience 5 October 2026)
   - Title: "Excellent"
   - Text: "Excellent, fast delivery, stock is beautiful A*"
2. **Angela**, Rated 5 out of 5 stars, posted Jul 30, 2026 (experience 22 July 2026)
   - Title: "Good quality products and prompt…"
   - Text: "Good quality products and prompt delivery."
3. **Mary Jane**, Rated 5 out of 5 stars, posted Jul 11, 2026 (experience 3 July 2026)
   - Title: "Excellent customer service!!"
   - Text: "Excellent customer service!!! Lovely quality clothing would definitely recommend 👌"
- Spare: **Adele**, 5/5, Jul 7, 2026. Title "Great products thank you". Text: "Great products thank you. Competitive pricing and was offered 20% off, perfect"

**Trustpilot on the store itself** (homepage HTML, https://www.wholesaleshopping.co.uk/)
- The footer has a TrustBox **"Review Collector"** widget: `data-template-id="56278e9abfbbba0bdcd568bc"`, `data-businessunit-id="5d1e128af49a260001a6e013"`. It links to `https://uk.trustpilot.com/review/wholesaleshopping.co.uk`.
- This widget shows **no score** in the HTML.

**Other rating claims on the site.** These are not Trustpilot figures, so don't reuse them as such:
- Homepage JSON-LD `LocalBusiness.aggregateRating`: `"ratingValue": "4.8", "reviewCount": "178"`. The source isn't stated.
- `/pages/best-sellers-flash-sale` has hard-coded text: "⭐ Excellent 4.8 — 1,300+ verified trade reviews". This conflicts with Trustpilot's 1,111.

## 2. Delivery

Source: https://www.wholesaleshopping.co.uk/pages/delivery-information (curl 200)

**Dispatch**
- "All orders placed before 02 PM Monday to Friday will be dispatched for shipping on the same day, any orders placed after 02 PM will be dispatched the following working day."
- "All orders received on the weekend will be dispatched the following Monday." "Excluding bank holidays."
- Product page *(via WebFetch)*: "Usually dispatched in 24 HRS".

**Couriers:** "We use DPD & UPS courier service".

**UK prices** (exact lines from the page):

| Line on page | Cost |
|---|---|
| "£0 - £200 UK Standard Shipping (1-3 Days)" | £12.99 |
| "£200 - £299 UK Standard Shipping (1-3 Days)" | £9.99 |
| "**£300 - Above UK Standard Shipping (1-3 Days)**" | **FREE** |
| "£300 - Next Day Expedited Shipping Fee UK Mainland* (1-2 Days)" | £9.99 |
| "Saturday Shipping - UK Mainland*" | "19.99" |

**Free UK mainland delivery threshold: £300, confirmed.**
- Homepage top bar: "FREE UK MAINLAND SHIPPING ON ORDERS ABOVE £300".
- Homepage FAQ: "we provide free standard UK delivery on all orders exceeding £300".

**Delivery times**
- Standard: "UK Standard Shipping (1 - 3 Working Days)".
- Next day: "Orders placed before 02.00 PM Monday to Thursday are eligible for next working day shipping (1-2 Days), when you select Next Day Expedited Shipping Option at checkout."
- Saturday: "Orders placed before 02.00 PM Friday are eligible for Saturday shipping".

**Box limits:** prices assume a "standard box weight of 15kg", sized 59.69 × 49.53 × 40.64 cm. "additional charges may apply if the box capacity is exceeded".

**Highlands & Islands of Scotland**
- Postcodes: IV, HS, KA27-28, KW, PA20-49, PA60-78, PH17-26, PH30-44, PH49-50, ZE.
- "Free Shipping on Orders Over £400!", otherwise "£14.99 per 15kg box".

**International**
- **EU Standard Shipping (2-4 Working Days)**, with "1st Box Full Price, Additional One Box Free!":
  - Zone 2, 3, 4 (Germany, Ireland, Monaco, Luxembourg, Netherlands, Belgium, France, Channel Islands): **£14.99 per box**.
  - Zone 5/51 (Denmark, Finland, Greece, Austria, Italy, Poland, Portugal (18 of 20 regions), Spain (50 of 52 provinces), Sweden, Bulgaria, Czechia, Estonia, Hungary, Latvia, Lithuania, Slovenia, Croatia, Slovakia, Romania): **£19.99 per box**.
- **USA (NY, NJ)** by UPS Express Saver: S-box (4 kg) £39.99; 1 box (15 kg) £79.99.
- Other countries: "select your country at checkout. You'll receive an instant shipping rate calculation".
- Customs: "For orders delivered outside the UK—especially to Northern Ireland—customs duties, import taxes, or other fees may apply … the sole responsibility of the recipient".

## 3. Returns

Source: https://www.wholesaleshopping.co.uk/pages/returns-and-refund-policy (curl 200)

**Window**
- "Customers have up to **2 working days** from the date they receive their order to initiate the return process", by contacting +447482071701 (wa.me link) or sales@wholesaleshopping.co.uk.

**Shipping the return back**
- "customers of UK orders must send their items via post within 7 days after the date of confirmation. For international orders, this period is extended to 15 days."
- "Customers are to return the items at their own risk, own arrangements, and at their own cost, unless specified otherwise."

**Conditions**
- Items must be in the same condition, "including the original packaging and invoice".
- "The items must not have been altered in any way."
- "For hygiene reasons, face masks, swimwear, and lingerie cannot be returned."

**Refunds**
- "A full refund will only be provided for products returned due to a fault with the item, or if a product is missing due to our own mistake. If your return is due to quality or sizing, the items are only available for exchange or store credit."
- "please allow up to 10-12 working days for us to confirm and process your refund."

**Return address:** Wholesale Shopping, 36C Broughton Street, Manchester, M8 8NN, United Kingdom.

**Conflict:** https://www.wholesaleshopping.co.uk/pages/faqs says "return the product without delay within 14 days". The homepage FAQ matches the policy (2 working days; then 7 days UK or 15 days international).

## 4. Payment methods

**Footer payment icons** (homepage)
- These are `<img>` tags using Shopify's `payment_icons/*.svg`, not inline SVGs. There are no `pi-*` ids in the HTML.
- Alt texts, in order: **visa, paypal, maestro, american express, discover**.

**Homepage JSON-LD**
- `Store.paymentAccepted`: "American Express, Visa, PayPal, Mastercard, Discover, Debit Card, Klarna, Clearpay".

**/pages/faqs**
- "you can enjoy convenient payment options through Google Pay and PayPal and we're not confined to these but go beyond it by offering Visa, Mastercard, American Express, Visa Electron, Apple Pay, Maestro, Klarna".

**/pages/klarna** (footer link label "Klarna Pay Later")
- "Klarna is a payment solution platform that allows you to instantly purchase any set amount of items from our shop with the ability to pay anytime later in installments but within a 30-day time period".
- "offers its customers the option to pay for their purchases later or in installments".
- The page has **no explicit "Pay in 3" wording**.

**Product page** *(via WebFetch)*
- Below Add to cart there is an image `clearpay_2.jpg` (no alt text) and three lines with no provider named:
  - "Purchases instantly and then pay for them in 4 automatic instalments."
  - "Pay later in 30 days with interest free or £12.67 in 3 monthly installments."
  - "Pay in 3 interest-free payments £30 in 3 months."
- These amounts don't match the £29.25 price, so they look like static text (an inference).

**Shop Pay is enabled.** The cart permalink redirected to `https://shop.app/checkout/11517606/…/shoppay?…` (see item 14).

## 5. VAT

**Conclusion:** the storefront shows **no VAT label**. The only explicit statement is in the T&Cs: **prices quoted exclude VAT**. Whether UK VAT is then added at checkout is **UNVERIFIED** (checkout wasn't opened).

**Terms & Conditions** (https://www.wholesaleshopping.co.uk/pages/terms-conditions)
- Price clause: "Unless otherwise stated, the prices quoted exclude VAT and delivery costs (in the case of goods) which will be added to the total amount due from you."
- International clause (ambiguous): "You will be responsible for payment of any such duties and/or taxes in addition to our price including VAT and the cost of delivery."
- Company details: "Our VAT Number is GB188546653".

**Product page** (https://www.wholesaleshopping.co.uk/products/plain-knitted-belted-cotton-jogger) *(via WebFetch; curl got 429)*
- Price "£29.25", with "Unit Price: £9.75" (Pack Quantity: 3) and "Unit Price: £10.00" (Pack Quantity: 1).
- No "Excl. VAT", "Inc VAT" or "Tax included" text anywhere.

**Collection pages** *(via WebFetch)*: prices are labelled "Per Piece: £…" with no VAT wording.

**/pages/faqs**: no statement on whether prices include VAT. The only VAT mention is the vendor commission ("20% commission including VAT").

**Delivery page**: "When registering your account online please ensure you have quoted your VAT registration number. For EU orders please provide your VAT number on checkout otherwise our processing system will automatically charge VAT calculated at the destination country's standard rate."

**Downloaded HTML**: no `taxes_included` or "Tax included" flag in any page.

## 6. Minimum order

**Effective minimum: £100 cart value**
- A site-wide inline script appears on the homepage, delivery, FAQs and T&Cs pages. It contains `const minOrderAmount = 100;`.
- When the cart total is below £100, it disables the checkout button and the dynamic payment buttons, and shows: "Minimum order amount is £${minOrderAmount} to proceed to checkout."
- This is **client-side only**, in the cart UI.

**No minimum quantity**
- Homepage FAQ: "There is no strict minimum order quantity, which gives you flexibility when restocking. However, we offer free standard UK delivery on orders over £300…"

**Promotion minimum**
- Top bar: "🍂 Autumn/Winter: 20% OFF | Use Code AW20 | Min Spend £100 | T&Cs Apply".

**Pack sizes**
- Products are sold in packs. Variant option values include "Pack of 1", "Pack of 3" and "Pack of 6" (from products.json).
- Homepage FAQ: "Items are sold in packs, and each product listing clearly shows the number of units per pack along with the per-unit price."

**Observation:** the cart permalink for one £29.25 item still returned a 302 to checkout (item 14). It therefore bypasses the cart-page script. Whether checkout itself enforces £100 is **UNVERIFIED**.

## 7. Contact

| Item | Value | Source |
|---|---|---|
| Phone | **+44 7482 071701** (`tel:+447482071701`) | /pages/contact-us; homepage contact widget ("Call · Connect with us for legal assistance"); JSON-LD |
| Email | **sales@wholesaleshopping.co.uk** | contact page, homepage widget ("Email Us"), JSON-LD |
| WhatsApp (homepage widget) | "Whatsapp · Need a quick help? Leave us a message · Text Us" links to `https://api.whatsapp.com/send/?phone=447903177705&text=…`, i.e. **+44 7903 177705** | homepage |
| WhatsApp (policy pages) | "Join What's APP : +447482071701", linking to `https://wa.me/+447482071701` | /pages/delivery-information, /pages/returns-and-refund-policy |
| WhatsApp (FAQ page) | `https://wa.me/447482071701` | /pages/faqs |
| Opening hours | "Monday-Friday 9am-6pm, Sunday 9am-3pm"; also "Support Hours 9AM TO 6PM Chat" | /pages/contact-us |
| Opening hours (JSON-LD) | Mon–Fri 09:00–18:00; Sunday 09:00–15:00 (no Saturday) | homepage JSON-LD |
| Trading address | "Wholesale Shopping 36C Broughton Street Manchester M8 8NN United Kingdom" | /pages/contact-us (also JSON-LD and the returns page) |
| Registered address | "Europa Fashion (UK) Ltd T/A Wholesale Shopping Suite Ro Morgan Reach House, 136 Hagley Road, Birmingham, West Midlands, United Kingdom, B16 9NX" | /pages/contact-us; T&Cs |
| Company no. | "8395791" (contact page); "08395791" (T&Cs) | |
| VAT no. | GB188546653 | contact, delivery and T&Cs pages |
| Other (JSON-LD) | `"foundingDate": "2012"`, founder "Muhammad Naveed", map https://maps.app.goo.gl/uLB1RpJ5WbU2B2wN8 | homepage |

**Notes**
- **Two different WhatsApp numbers** are in use: 447903177705 (homepage widget) and 447482071701 (policy and FAQ pages).
- The header's `tel:` and `mailto:` links are inside an HTML comment, so they aren't shown.
- The prefilled WhatsApp message includes marketing consent: "By sending this message, I agree to subscribe WSO and receive promotional messages from WSO via WhatsApp."

**Social links** (footer and JSON-LD `sameAs`):
- https://www.facebook.com/Wholesaleshopping.co.uk/
- https://x.com/WholesaleSO
- https://www.instagram.com/wholesaleshopping.co.uk/
- https://www.linkedin.com/company/wholesaleshopping/
- https://www.pinterest.co.uk/wholesaleshopping
- https://www.youtube.com/@WholesaleShopping
- https://www.tiktok.com/@wholesaleshopping.co.uk

## 8. Mobile app

**On the store:** **no** `apps.apple.com`, `itunes` or `play.google.com` link anywhere in the homepage HTML.
- "GET MOBILE APP" is a `<button type="button" id="toggleButton">` in the top bar, not a link.
- It reveals a QR image: https://cdn.shopify.com/s/files/1/1151/7606/files/App-QR-b.png?v=1732030552
- What the QR encodes is **NOT FOUND**: no QR decoder was available and the image wasn't downloaded.

**The listings below were found by web search, then verified by fetching each listing.** Both name the store's legal entity.

**App Store**
- URL: **https://apps.apple.com/gb/app/wholesale-shopping/id1547019574** *(via WebFetch)*
- "Wholesale Shopping", seller "EUROPA FASHION (UK) LTD"; "Developer Website" links to https://www.wholesaleshopping.co.uk/.
- 4.8 out of 5 (108 Ratings); "Free"; "Requires iOS 14.0 or later"; version "2.1", dated "11/09/2025".

**Google Play**
- URL: **https://play.google.com/store/apps/details?id=com.shopify.wholesaleshopping** (curl 200)
- "Wholesale Shopping – Apps on Google Play", developer "EUROPA FASHION (UK) LTD".
- Developer contact: sales@wholesaleshopping.co.uk; website https://www.wholesaleshopping.co.uk; "SUITE RO MORGAN REACH HOUSE 136 HAGLEY ROAD BIRMINGHAM B16 9NX".
- **4.2** stars, "63 reviews", "10k+" downloads, "Updated on 17 Jun 2026".

**Stale app listing text:** the App Store description says "FREE UK MAINLAND SHIPPING when placing orders of £200" and "10% off your 1st Order". The site now says £300, and /pages/faqs says 20% off the first order.

## 9. Brand assets

**Theme:** Kalles **4.2.3** (`"schema_name":"Kalles","schema_version":"4.2.3"`), theme id 152376639719.

**Logo:** **https://www.wholesaleshopping.co.uk/cdn/shop/files/WSO_Logo_Black.svg?v=1754305998** (SVG, alt "Wholesale Shopping")
- Desktop: `class="header__normal-logo"`, `width="180" height="50"`, srcset `&width=180` and `&width=360 2x`.
- Mobile: `class="header__mobile-logo"`, `width="120" height="33"`.
- The same file is the JSON-LD Organization `logo`.
- Only a black version appears on the homepage.
- The SVG's own viewBox was **not fetched** (to stay within the request budget).

**Favicon:** https://www.wholesaleshopping.co.uk/cdn/shop/files/32px.png?v=1780590424&width=32 (`rel="shortcut icon"`, PNG, 32 px).

**Apple touch icon:** https://www.wholesaleshopping.co.uk/cdn/shop/files/152px.png?v=1780590447&width=152 (152×152).

**Fonts:** `--font-body-family` and `--font-heading-family` are Poppins; `--font-family-3` is "Libre Baskerville". The homepage FAQ section uses `font-family:'Larsseit'`.

**Colours: `:root` custom properties in the homepage `<head>`**

| Token | Hex | Used for |
|---|---|---|
| `--accent-color` | #222222 | theme accent (hover: `--accent-color-darken` #000000) |
| `--button-background` / `--button-color` | #222 / #fff | buttons (hover #222222 / #fff) |
| `--heading-color` | #222222 | headings |
| `--text-color` | #383838 | body text |
| `--t4s-body-background` | #ffffff | page background |
| `--link-color` / `--link-color-hover` | #878787 / #222222 | links |
| `--secondary-color` | #222 | secondary accent |
| `--border-color` / `--border-primary-color` | #ddd / #333 | borders |
| `--primary-price-color` / `--secondary-price-color` | #b00101 / #878787 | primary and secondary price text |
| `--sale-badge-background` | #b00101 (text #fff) | Sale badge |
| `--new-badge-background` | #109533 (text #fff) | New badge |
| `--preorder-badge-background` | #0774d7 | Pre-order badge |
| `--soldout-badge-background` | #999999 | Sold-out badge |
| `--custom-badge-background` | #00A500 | custom badge |
| `--t4s-highlight-color` | #ec0101 | highlight (red) |
| `--t4s-success-color` / `--t4s-warning-color` / `--t4s-error-color` | #428445 / #e0b252 / #EB001B | status messages |
| `--t4s-dark-color` / `--t4s-light-color` | #222222 / #ffffff | dark and light |
| `--t4s-tooltip-background` | #383838 (text #fff) | tooltips |
| `--primary-sw-color` / `--secondary-sw-color` / `--border-sw-color` | #333 / #878787 / #ddd | swatches |
| `--lz-background` | #f5f5f5 | lazy-load placeholder |

**Section colours** (inline styles in the homepage body)
- Top bar: `--tb-background` #222222, `--tb-color` #ffffff.
- Header: `--h-bg-color` #ffffff, `--h-text-color` #222222 (hover #878787); cart count is #ffffff on #000000.
- Footer: `--bg-color` #222222; headings, text and links #ffffff (link hover #878787); border #e6e6e6.
- Bottom bar: text #878787, link hover **#56cfe1**.
- Product cards: title #222222 (hover **#56cfe1**); price #696969; sale price #ec0101; countdown background #56cfe1.
- **#56cfe1 (cyan)** is the hover and highlight accent for product cards and footer links. Otherwise the UI uses neutrals (#222222, #ffffff, #878787), with reds (#b00101, #ec0101) for prices and sale, and the badge colours above.

**Seasonal top banner:** `WSO_Halloween_Header_Banner.webp`.

## 10. Main navigation

Source: homepage `<ul data-menu-nav id="t4s-nav-ul">`. Mega-menu content is lazy-loaded by the theme from `https://www.wholesaleshopping.co.uk/?sections=mega-menu,mega-menu2` (fetched, 200).

**Top level, in order:**

1. **NEW IN** → `/collections/new-wholesale-clothing` (mega menu)
   - Clothing New In `/collections/womens-new-in`
   - Footwear New In `/collections/footwear-new-in`
   - Accessories New In `/collections/accessories-new-in`
   - Banner image `New-in_….jpg` (no link)
2. **SHOP BY STYLE** → `/collections/all` (mega menu)
   - **Womens** `/collections/womens` (heading)
     - Tops `/collections/womens-tops`
     - Jumpers `/collections/wholesale-womens-jumpers`
     - Leggings `/collections/womens-leggings`
     - Trousers `/collections/womens-trousers`
     - Dresses `/collections/womens-dresses`
     - Jackets `/collections/womens-coats-jackets`
     - Shirts `https://www.wholesaleshopping.co.uk/collections/womens-shirts`
     - Loungewear `/collections/loungewear`
     - Activewear `/collections/activewear`
     - Jumpsuits & Playsuits `/collections/womens-jumpsuits-playsuits`
     - Co-ords `/collections/co-ords`
     - Shorts `https://www.wholesaleshopping.co.uk/collections/shorts`
     - Cardigans `/collections/womens-cardigan`
   - **Mens** `/collections/mens` (heading)
     - Shorts `/collections/mens-shorts`
     - Tracksuits & Loungewear `https://www.wholesaleshopping.co.uk/collections/mens-tracksuits-loungewear`
   - Banner image `Shop-by-style_….jpg` (no link)
3. **SALE** → `/collections/clearance`
4. **PLUS SIZE** → `/collections/wholesale-plus-size-clothing`
5. **AUTUMN WINTER** → `/collections/autumn-winter`
6. **🎅CHRISTMAS** → `https://www.wholesaleshopping.co.uk/collections/christmas`
   - Dropdown with `data-handle="christmas-2026"`; its children are **NOT FOUND**. They load from `/search?type=article&q=christmas-2026&section_id=dropdown-menu`, which wasn't requested because `/search` returned 429.
7. **SHOP BY COUNTRY** → `#` (mega menu of image tiles)
   - Made in Italy `/collections/womens-made-in-italy`
   - Made In China `/collections/wholesale-clothing-china`
   - Made In UK `/collections/made-in-uk`
   - There is **no France entry**.
8. **FOOTWEAR** → `https://www.wholesaleshopping.co.uk/collections/wholesale-women-footwear` (mega menu)
   - Sandals `/collections/footwear-sandals`
   - Slippers `/collections/footwear-slippers`
   - Trainers `/collections/footwear-trainers`
   - Boots `/collections/footwear-boots`
   - Flip Flops Sliders `/collections/footwear-flip-flops-sliders`
   - Banner image (no link)
9. **ACCESSORIES** → `https://www.wholesaleshopping.co.uk/collections/accessories` (mega menu)
   - **Scarves** `…/collections/wholesale-scarves` (heading)
     - Printed `/collections/scarves-printed`
   - **Bags** `…/collections/womens-bags` (heading)
     - Shoulder bags `/collections/shoulder-bags`
     - Clutch bags `/collections/clutch-bags`
     - Tote bags `/collections/tote-bags`
   - Image tiles: Bags `/collections/womens-bags`, Scarf `/collections/wholesale-scarves`, Jewellery `/collections/wholesale-jewellery`
10. **MADE IN ITALY** → `/collections/womens-made-in-italy` (mega menu)
    - Dresses `/collections/made-in-italy-dresses`
    - Tops `/collections/made-in-italy-tops`
    - Trousers `/collections/made-in-italy-trouser`
11. **★ BEST SELLERS ★** → `/pages/best-sellers-flash-sale`
12. **EVERYTHING £5** → `https://www.wholesaleshopping.co.uk/collections/everything-5`

**Unused mega-menu block:** block 7 isn't attached to any homepage nav item. It contains Under £4.99 `/collections/under-4-99`, Under £7.99 `/collections/under-7-99`, Under £9.99 `/collections/under-nine-ninety-nine`, Under £14.99 `/collections/under-14-99`, Under £19.99 `/collections/under-19-99` and Everything £5 `/collections/everything-5`.

**All 52 collection handles** linked from the header and mega menus exist in today's `/collections.json`.

**Mobile drawer menu:** not retrieved (`/search/?view=mn` returned 429).

**Footer menus**
- **Information:** About us `/pages/about-us`, FAQs `/pages/faqs`, Sitemap `/pages/sitemap`, Blogs `/blogs/all-post`, Sell With Us `/pages/sell-with-us`, Contact Us `/pages/contact-us`, Vendors `/pages/sell-with-us`.
- **Popular Links:** New Arrivals `/collections/new-wholesale-clothing`, Made in Italy `/collections/womens-made-in-italy`, Trousers `/collections/womens-trousers`, Bags `/collections/womens-bags`, Jewellery `/collections/wholesale-jewellery`, Footwear `/collections/wholesale-women-footwear`.
- **Help:** Privacy Policy `/pages/privacy-policy`, Returns and Refund Policy `/pages/returns-and-refund-policy`, Delivery Information, Terms & Conditions `/pages/terms-conditions`, Klarna Pay Later `/pages/klarna`.

## 11. Homepage FAQs (tabs)

Source: homepage section `faqs_in_tabs`, heading "FAQs". There are 10 Q&As in 3 tabs, and the same 10 are in the homepage `FAQPage` JSON-LD.

**Tab 1: Clothing Queries**
- **How do you ensure the quality of your wholesale clothing?** "We work closely with trusted manufacturers and carefully select our sourcing partners to maintain consistent quality standards. Our transparent 1–5 star rating system and verified customer reviews help retailers see real feedback before buying…"
- **Do you supply plus-size wholesale clothing?** "Yes, we offer a wide selection of plus-size wholesale clothing across key categories…"

**Tab 2: Order-Related Queries**
- **Do I need a verified account to place a wholesale clothing order?** "Yes, you must register for a wholesale account before placing orders… Once approved, you'll gain access to pack pricing, live stock availability, exclusive offers, and a faster checkout experience."
- **Are prices shown per pack or per unit?** "Product pages display both the pack quantity and the unit price for clarity. Items are sold in packs, and each product listing clearly shows the number of units per pack along with the per-unit price…"
- **Is there a minimum order quantity required to place a wholesale order?** "There is no strict minimum order quantity, which gives you flexibility when restocking. However, we offer free standard UK delivery on orders over £300…"
- **How fast is wholesale clothing delivered?** "Normally, the orders dispatched are placed before 2 pm (Monday–Friday). Receive your order within 1–3 working days with standard UK delivery, or choose next-day shipping at checkout for faster arrival."
- **Do you offer free standard UK delivery on wholesale orders?** "Yes, we provide free standard UK delivery on all orders exceeding £300…"
- **Can I return bulk order clothing if there's an issue?** "You must contact customer support within 2 working days of receiving your order to initiate the return. Once approved, UK customers have 7 days, and international customers have 15 days to return the items in their original condition."

**Tab 3: Fashion Trends Queries**
- **How often do you add new wholesale stock?** "We add new arrivals every week to ensure retailers can stay aligned with current fashion trends and seasonal demand…" (see item 15 for what the data shows)
- **Do you stock Made in Italy and imported collections?** "Yes. We supply premium Made in Italy wholesale clothing with boutique appeal and high-quality fabrics. We also stock imported collections from China…"

## 12. Collection handles

**How each column was checked**
- **curl:** GET with redirects followed was tried on `new-wholesale-clothing` and `best-seller`. Both returned **HTTP 429** (`retry-after: 60`) with no redirect. I stopped there rather than keep retrying a blocked path.
- **WebFetch:** every one of the 24 handles loaded as a normal collection page, with no error, 404 or 429 and no redirect indicated. WebFetch doesn't expose the status code or final URL, so "200 at the same URL" is an inference. It is backed by each page's H1 matching its collection, pagination links (where WebFetch reported them) pointing to the same handle, and every handle being live in `/collections.json`.
- **products_count:** taken from a fresh `/collections.json?limit=250` (pages 1–2, 352 collections), not from 24 separate `/collections/<handle>.json` requests, to stay within the request budget.

| Handle | Title in /collections.json | products_count | HTML check *(via WebFetch)*: H1 |
|---|---|---|---|
| new-wholesale-clothing | New in | 235 | "New Collection Clothing Wholesale" (curl 429) |
| best-seller | Best Seller | 394 | "Best Seller" (curl 429) |
| wholesale-plus-size-clothing | Plus Size Clothing | 868 | "Wholesale Plus Size Clothing" |
| wholesale-women-footwear | Footwear | 608 | "Wholesale Shoes UK" |
| womens-made-in-italy | Made In Italy | 145 | "Wholesale Clothing Italy" |
| autumn-winter | Autumn Winter | 578 | "Wholesale Autumn Winter Clothing" |
| christmas | Christmas | 64 | "Wholesale Christmas Clothing" |
| everything-5 | Everything £5 | 45 | "Five Pound Clothes" |
| clearance | Clearance | 37 | "Clearance" |
| all | All | 926 | "Wholesale Clothing Manchester" |
| womens-tops | Tops | 294 | "Wholesale Fashion Tops" |
| womens-dresses | Dresses | 174 | "Wholesale Dress Suppliers" |
| womens-cardigan | Women's Cardigan | 41 | "Wholesale Cardigans UK" |
| womens-coats-jackets | Womens Coats Jackets | 32 | "Wholesale Coats and Jackets UK" |
| womens-trousers | Trousers | 68 | "Wholesale Womens Trousers Supplier" |
| womens-bags | Womens Bags | 479 | "Wholesale Bags UK" |
| wholesale-scarves | Scarves | 239 | "Wholesale Scarves UK" |
| accessories | Wholesale Accessories | 896 | "Wholesale Accessories UK" |
| wholesale-jewellery | Jewellery | 92 | "Wholesale Jewellery UK" |
| under-4-99 | Under 4.99 | 15 | "Wholesale Under 5 Pound Clothes" |
| under-7-99 | Under 7.99 | 114 | "Wholesale Under 8 Pound Clothes" |
| under-nine-ninety-nine | Under 9.99 | 828 | "Wholesale Under 10 Pound Clothes" |
| under-14-99 | Under 14.99 | 1591 | "Wholesale Under 15 Pound Clothes" |
| under-19-99 | Under 19.99 | 1825 | "Wholesale Under 20 Pound Clothes" |

**Visible vs counted products.** Where products.json was fetched, the number of products returned differs from `products_count`:

| Handle | Returned by products.json | products_count |
|---|---|---|
| new-wholesale-clothing | 125 (page 2 empty) | 235 |
| under-4-99 | 15 | 15 |
| under-7-99 | 110 | 114 |
| best-seller | 388 | 394 |

`products_count` appears to include products not exposed publicly, so treat it as an upper bound.

**Other handles** (from `/collections.json`; their HTML pages were not fetched)
- **Jumpers:** **`wholesale-womens-jumpers`** ("Wholesale Jumpers", 63). This is the "Jumpers" link in SHOP BY STYLE. Alternatives: `winter-jumpers` (63), `italian-jumpers` (51), `wholesale-christmas-jumpers` (11).
- **Knitwear:** `womens-knitwear` exists but has **0** products; `mens-knitwear` has 0.
- **Made in UK:** **`made-in-uk`** ("Made in UK", 151).
- **Made in China:** **`wholesale-clothing-china`** ("Made In China", 334).
- **Made in Italy:** `womens-made-in-italy` (145). Sub-collections: `made-in-italy-dresses` (66), `made-in-italy-tops` (243), `made-in-italy-trouser` (53).
- **Made in France:** **NOT FOUND**. None of the 352 collections has "France" or "French" in its handle or title, and the SHOP BY COUNTRY menu lists only Italy, China and UK. (The Google Play description mentions "Italian, French & Turkish", but no such collection exists.)

**/pages/best-sellers-flash-sale** (curl 200)
- It's a custom template with 6 product sections: "Trousers Flash Deals" (9), "Leggings Flash Deals" (8), "Tops Flash Deals" (7), "Shorts Flash Deals" (4), "Bags Flash Deals" (6) and "Activewear Flash Deals" (7). That's 41 products.
- The markup contains no collection handle.
- **All 41 products are in the `best-seller` collection**, checked against `/collections/best-seller/products.json` pages 1–2 (388 products). So the page shows a hand-picked subset of **best-seller**, grouped by category. This is an inference from membership, not from visible configuration.
- **Hard-coded claims; don't reuse them as facts:**
  - "721 retailers viewing this page right now"
  - "⭐ Excellent 4.8 — 1,300+ verified trade reviews"
  - "📦 2,140 packs sold in the last 24 hours"
  - "🇬🇧 Same-day dispatch from our UK warehouse"
- The countdown resets weekly (`data-mode="weekly"`, `data-anchor="2026-08-10T00:00:00Z"`), alongside "🔥 TODAY ONLY — DISCOUNT ENDING SOON 🔥" and "20% OFF · CODE: AW20 · Min spend £100 · T&Cs apply".

## 13. Price collections (per-piece or pack price?)

**Conclusion:** the "Under £4.99 … Under £19.99" collections filter on **variant price, which is the pack price**. A product is included when at least one in-stock variant costs less than the threshold. They do **not** use the per-piece price of multi-packs. "Pack of 1" variants are priced as a single piece, so the Pack of 1 price is often what gets a product in.

**Evidence**

- **Data checked**
  - `/collections/under-4-99/products.json`: 15 products.
  - `/collections/under-7-99/products.json`: 110 products.
  - Compared against today's new-in products.json and the 12 Oct `/products.json` sample: 279 products in total.
- **Every product in both collections has a cheap variant**
  - All **15/15** in under-4-99 and **110/110** in under-7-99 have a variant below the threshold.
  - All 15 in under-4-99 have an **in-stock** variant below £4.99.
- **Included because of the Pack of 1 price**
  - `plain-elasticated-hem-top`: "Pack of 1" £4.00 and "Pack of 3" £11.25 (£3.75 each). It's in under-4-99 thanks to the £4.00 Pack of 1.
  - Other members: `plain-soft-hair-band` "Pack of 6" £1.50; `floral-design-strong-hold-hair-clip` "Pack of 3" £3.00 / "Pack of 6" £4.50.
- **Cheap per piece but excluded**
  - **46** sample products cost under £4.99 per piece, but their cheapest pack is £4.99 or more. **None of them is in under-4-99.**
  - Examples: `horse-print-scarves` (cheapest pack £13.50, £4.25 each) and `floral-print-tassel-scarves-11` (pack £12.00, £3.75 each).
  - Likewise, **35** products under £7.99 per piece whose cheapest pack is £7.99 or more are **all absent** from under-7-99. Example: `crochet-floral-embroidered-lace-panel-cotton-top` (cheapest pack £8.00, £7.75 each).
- **Stock seems to matter**
  - 7 sample products have a variant under £7.99 but aren't in under-7-99. For 6 of them, every such variant is out of stock.
  - The 7th is unexplained: `santa-cap-print-christmas-leggings`, from the 12 Oct data, with "Regular Size" at £5.00 and available.
- **Pack size isn't always stated**
  - 8 of the 15 under-4-99 products have no "Pack of N" option (for example "One Size", "Regular Size/Plus Size", "S/M").
- **How the store labels prices**
  - Collection grids label the lowest variant price "Per Piece" *(via WebFetch)*. On /collections/under-4-99 the first product shows "Per Piece: £4.00", which is its Pack of 1 price even though its Pack of 3 works out at £3.75.
  - Product pages show "Unit Price: £x" per pack quantity.

## 14. Cart permalink

- **Variant:** `52809985818855`. That's `plain-knitted-belted-cotton-jogger`, "Grey / Pack of 3", £29.25. It is available in `/products.json` (12 Oct download) and was still available in today's `/collections/new-wholesale-clothing/products.json`.
- **Request (exactly one, made 12 Oct 2026 19:47:26 UTC):** `curl -sI -A "<Chrome UA>" https://www.wholesaleshopping.co.uk/cart/52809985818855:1`. Redirects were not followed.
- **Status:** `HTTP/2 302`
- **Location** (session tokens redacted):
  `https://shop.app/checkout/11517606/cn/<token>/en-pk/shoppay?_mcs=3.AMPS&_r=<…>&cart_link_id=<…>&redirect_source=checkout_universal_redirect&shop_pay_token=<redacted>&tracking_unique=<…>&tracking_visit=<…>&ur_back_url=https%3A%2F%2Fwww.wholesaleshopping.co.uk%2Fcheckouts%2Fcn%2F<token>%2Fen-pk%3F_r%3D<…>%26auto_redirect%3Dfalse%26cart_link_id%3D<…>%26edge_redirect%3Dtrue%26skip_shop_pay%3Dtrue&ur_verify=<…>`
- **What this shows:**
  - The permalink works and goes straight to a **Shop Pay-first checkout** (shop id 11517606), skipping the cart page and its £100 script.
  - `en-pk` reflects the Pakistani IP.
  - The checkout page was **not** opened and nothing was submitted.

## 15. New-in cadence

**Source:** `https://www.wholesaleshopping.co.uk/collections/new-wholesale-clothing/products.json?limit=250`, fetched 12 Oct 2026 19:42 UTC. It returned 125 products and page 2 was empty, although `products_count` is 235.

**Counts by `published_at`**

| Window | Products |
|---|---|
| Last 7 days | **4**: 3 on 12 Oct 2026, 1 on 7 Oct |
| Last 14 days | **9** |
| Last 30 days | **35** |

The counts are identical whether "now" is the fetch time or 13 Oct 2026 00:00 UTC.

**Newest four**
- 2026-10-12 13:45 BST: Plain Knitted Belted Cotton Jogger
- 2026-10-12 10:26: Plain Belted Long Trench Coat Blazer
- 2026-10-12 10:25: Plain Pleated Details Dress
- 2026-10-07 14:52: Curved Hem Womens Cotton Top

**By ISO week (Mon–Sun)**

| Week | Products |
|---|---|
| W42 (from 12 Oct, part week) | 3 |
| W41 (5–11 Oct) | 2 |
| W40 (28 Sep–4 Oct) | 7 |
| W39 (21–27 Sep) | 17 |
| W38 (14–20 Sep) | 6 |
| W37 (7–13 Sep) | 14 |
| W36 (31 Aug–6 Sep) | **0** |
| W35 | 6 |
| W34 | 13 |
| W33 | 28 |
| W32 | 6 |
| W31 | **0** |
| W30 | 3 |
| W29 | 3 |

**Verdict.** The site claims "We add new arrivals every week" (homepage FAQ). The data shows new products in **9 of the last 10 weeks**; there were none from 31 Aug to 6 Sep. Recent volume is low: 2 last week and 3 so far this week. "New styles every week" is broadly supported, but not strictly true and not in large numbers.

**Caveats**
- 22 of the 125 products have a `published_at` more than a day after `created_at` (re-published items). `published_at` therefore slightly overstates how many items are new.
- The theme setting `new_day_int: 7` means the "New" badge shows for 7 days.

---

## Conflicts and gaps to resolve before using copy

1. **Review counts:** Trustpilot shows **1,111** reviews at **4.8**. The site also claims 178 (JSON-LD) and "1,300+" (flash-sale page).
2. **WhatsApp:** **+44 7903 177705** in the homepage widget, but +44 7482 071701 on the delivery, returns and FAQ pages.
3. **Returns:** 2 working days (policy and homepage FAQ) vs "within 14 days" (/pages/faqs).
4. **Minimum order:** a £100 cart minimum (JavaScript) vs "no strict minimum order quantity" (FAQ). The AW20 code also needs a £100 minimum spend.
5. **Free shipping and discounts in the App Store listing:** £200 and 10% off, vs £300 and 20% off on the site.
6. **Klarna:** /pages/klarna describes paying later or in instalments within 30 days. The product page's pay-later lines name no provider.
7. **NOT FOUND or UNVERIFIED:**
   - What the "GET MOBILE APP" QR code points to
   - The CHRISTMAS dropdown's children
   - A "Made in France" collection
   - The logo SVG's own viewBox
   - Whether VAT is added at checkout
   - Whether checkout enforces the £100 minimum
   - Sandra's exact posting date (shown only as "3 days ago")
