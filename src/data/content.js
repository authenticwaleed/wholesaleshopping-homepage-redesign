// Page copy and links. Every fact comes from wholesaleshopping.co.uk or its Trustpilot page;
// sources and exact quotes are in notes/real-facts.md. Rule: no invented claims.

import { STORE } from '../lib/config.js';

export { STORE };
export const collectionUrl = (handle) => `${STORE}/collections/${handle}`;
export const pageUrl = (handle) => `${STORE}/pages/${handle}`;
const link = (label, handle) => ({ label, href: collectionUrl(handle) });

export const TRUSTPILOT_URL = 'https://uk.trustpilot.com/review/wholesaleshopping.co.uk';
export const REGISTER_URL = `${STORE}/account/register`;

export const offers = [
  {
    strong: 'Free UK mainland delivery',
    text: 'on orders over £300',
    href: pageUrl('delivery-information'),
  },
  {
    strong: '20% off Autumn/Winter',
    text: 'code AW20 · min spend £100',
    detail: '· T&Cs apply', // desktop only, so the offer fits one line on phones
    href: collectionUrl('autumn-winter'),
  },
  {
    strong: 'Buy now, pay later',
    text: 'with Klarna',
    href: pageUrl('klarna'),
  },
];

// ---- Navigation: the store's own categories, regrouped from 12 top items into 7 ----

const shopByCountry = {
  title: 'Shop by country',
  links: [
    link('Made in Italy', 'womens-made-in-italy'),
    link('Made in UK', 'made-in-uk'),
    link('Made in China', 'wholesale-clothing-china'),
  ],
};

// These collections filter on the pack price, so the labels say so
const shopByPrice = {
  title: 'Shop by pack price',
  links: [
    link('Packs under £4.99', 'under-4-99'),
    link('Packs under £7.99', 'under-7-99'),
    link('Packs under £9.99', 'under-nine-ninety-nine'),
    link('Packs under £14.99', 'under-14-99'),
    link('Packs under £19.99', 'under-19-99'),
    link('Everything £5', 'everything-5'),
  ],
};

export const mainNav = [
  {
    label: 'New In',
    href: collectionUrl('new-wholesale-clothing'),
    columns: [
      {
        title: 'New in',
        links: [
          link('All new in', 'new-wholesale-clothing'),
          link('Clothing', 'womens-new-in'),
          link('Footwear', 'footwear-new-in'),
          link('Accessories', 'accessories-new-in'),
        ],
      },
      {
        title: 'Featured',
        links: [
          link('Best sellers', 'best-seller'),
          link('Autumn Winter', 'autumn-winter'),
          link('Christmas', 'christmas'),
          link('Everything £5', 'everything-5'),
        ],
      },
    ],
    feature: 'floral-print-two-pockets-loose-fit-cotton-dress',
  },
  {
    label: 'Clothing',
    href: collectionUrl('all'),
    columns: [
      {
        title: 'Womens',
        links: [
          link('Tops', 'womens-tops'),
          link('Jumpers', 'wholesale-womens-jumpers'),
          link('Cardigans', 'womens-cardigan'),
          link('Dresses', 'womens-dresses'),
          link('Coats & jackets', 'womens-coats-jackets'),
          link('Trousers', 'womens-trousers'),
          link('Leggings', 'womens-leggings'),
        ],
      },
      {
        title: 'More styles',
        links: [
          link('Shirts', 'womens-shirts'),
          link('Loungewear', 'loungewear'),
          link('Activewear', 'activewear'),
          link('Jumpsuits & playsuits', 'womens-jumpsuits-playsuits'),
          link('Co-ords', 'co-ords'),
          link('Mens', 'mens'),
          link('Shop all clothing', 'all'),
        ],
      },
      shopByCountry,
      shopByPrice,
    ],
    feature: 'plain-pleated-details-dress',
  },
  {
    label: 'Plus Size',
    href: collectionUrl('wholesale-plus-size-clothing'),
    columns: [
      {
        title: 'Plus size',
        links: [
          link('Plus size tops', 'plus-size-tops'),
          link('Plus size dresses', 'plus-size-dress'),
          link('Shop all plus size', 'wholesale-plus-size-clothing'),
        ],
      },
      shopByPrice,
    ],
    feature: 'plain-knitted-belted-cotton-jogger',
  },
  {
    label: 'Footwear',
    href: collectionUrl('wholesale-women-footwear'),
    columns: [
      {
        title: 'Footwear',
        links: [
          link('New in footwear', 'footwear-new-in'),
          link('Boots', 'footwear-boots'),
          link('Trainers', 'footwear-trainers'),
          link('Sandals', 'footwear-sandals'),
          link('Slippers', 'footwear-slippers'),
          link('Flip flops & sliders', 'footwear-flip-flops-sliders'),
          link('Shop all footwear', 'wholesale-women-footwear'),
        ],
      },
    ],
    feature: 'suede-side-zip-knee-high-ankle-boot',
  },
  {
    label: 'Accessories',
    href: collectionUrl('accessories'),
    columns: [
      {
        title: 'Bags',
        links: [
          link('All bags', 'womens-bags'),
          link('Shoulder bags', 'shoulder-bags'),
          link('Clutch bags', 'clutch-bags'),
          link('Tote bags', 'tote-bags'),
        ],
      },
      {
        title: 'Scarves & jewellery',
        links: [
          link('Scarves', 'wholesale-scarves'),
          link('Printed scarves', 'scarves-printed'),
          link('Jewellery', 'wholesale-jewellery'),
          link('Shop all accessories', 'accessories'),
        ],
      },
    ],
    feature: 'horse-print-scarves',
  },
  {
    label: 'Made in Italy',
    href: collectionUrl('womens-made-in-italy'),
    columns: [
      {
        title: 'Made in Italy',
        links: [
          link('Dresses', 'made-in-italy-dresses'),
          link('Tops', 'made-in-italy-tops'),
          link('Trousers', 'made-in-italy-trouser'),
          link('Shop all Made in Italy', 'womens-made-in-italy'),
        ],
      },
      shopByCountry,
    ],
    feature: 'mesh-overlay-layered-lace-trim-top',
  },
  { label: 'Sale', href: collectionUrl('clearance'), highlight: true },
];

// One-tap routes into stock, shown under the search field on phones
export const quickLinks = [
  link('New In', 'new-wholesale-clothing'),
  link('Best Sellers', 'best-seller'),
  link('Plus Size', 'wholesale-plus-size-clothing'),
  link('Jumpers', 'wholesale-womens-jumpers'),
  link('Footwear', 'wholesale-women-footwear'),
  link('Made in Italy', 'womens-made-in-italy'),
  link('Everything £5', 'everything-5'),
  link('Christmas', 'christmas'),
  link('Sale', 'clearance'),
];

export const popularSearches = ['Dresses', 'Jumpers', 'Leggings', 'Boots', 'Scarves', 'Plus size'];

// ---- Homepage sections ----

export const hero = {
  eyebrow: 'UK fashion wholesaler',
  title: 'Wholesale fashion for UK boutiques & online sellers',
  lede: 'New-season styles in packs from 1 piece. Every price is shown per piece, so you can compare margins at a glance.',
  primary: { label: 'Shop New In', href: collectionUrl('new-wholesale-clothing') },
  secondary: { label: 'Best Sellers', href: collectionUrl('best-seller') },
  // Products shown in the hero photos (real New In stock)
  looks: ['plain-belted-long-trench-coat-blazer', 'plain-two-tone-faux-fur-pockets-jacket'],
};

export const trust = {
  rating: { score: '4.8', label: 'Excellent', count: '1,111', href: TRUSTPILOT_URL },
  items: [
    {
      icon: 'package',
      title: 'Same-day dispatch',
      text: 'Order by 2pm, Monday to Friday',
      href: pageUrl('delivery-information'),
    },
    {
      icon: 'truck',
      title: 'Free UK delivery over £300',
      text: 'Standard delivery in 1–3 working days',
      href: pageUrl('delivery-information'),
    },
    {
      icon: 'card',
      title: 'Pay later with Klarna',
      text: 'Pay within 30 days',
      href: pageUrl('klarna'),
    },
  ],
};

// `photo` picks one of the candidate photos saved by scripts/fetch-products.mjs (chosen from a contact sheet)
export const categories = [
  { label: 'New In', handle: 'new-wholesale-clothing', photo: 3 },
  { label: 'Tops', handle: 'womens-tops', photo: 3 },
  { label: 'Dresses', handle: 'womens-dresses', photo: 2 },
  { label: 'Jumpers', handle: 'wholesale-womens-jumpers', photo: 0 },
  { label: 'Coats & Jackets', handle: 'womens-coats-jackets', photo: 2 },
  { label: 'Trousers', handle: 'womens-trousers', photo: 1 },
  { label: 'Plus Size', handle: 'wholesale-plus-size-clothing', photo: 0 },
  { label: 'Footwear', handle: 'wholesale-women-footwear', photo: 1 },
  { label: 'Bags', handle: 'womens-bags', photo: 0 },
  { label: 'Scarves', handle: 'wholesale-scarves', photo: 3 },
];

export const priceTiles = [
  { amount: '£4.99', handle: 'under-4-99' },
  { amount: '£7.99', handle: 'under-7-99' },
  { amount: '£9.99', handle: 'under-nine-ninety-nine' },
  { amount: '£14.99', handle: 'under-14-99' },
  { amount: '£19.99', handle: 'under-19-99' },
];

export const banners = [
  {
    eyebrow: 'Autumn/Winter',
    title: 'Layer up for the new season',
    text: 'Coats, jumpers and cosy layers for the colder months. Use code AW20 for 20% off (min spend £100).',
    cta: 'Shop Autumn Winter',
    href: collectionUrl('autumn-winter'),
    product: 'plain-two-tone-faux-fur-pockets-jacket',
  },
  {
    eyebrow: 'Christmas',
    title: 'Christmas stock is in',
    text: 'Festive leggings and dresses to stock for the season.',
    cta: 'Shop Christmas',
    href: collectionUrl('christmas'),
    product: 'santa-hat-penguin-xmas-swing-dress',
  },
];

export const howItWorks = [
  {
    title: 'Register your business',
    text: 'Open a wholesale account to place orders, see live stock and get trade offers.',
    link: { label: 'Register now', href: REGISTER_URL },
  },
  {
    title: 'Choose your packs',
    text: 'Packs start from 1 piece, and every product shows its price per piece.',
  },
  {
    title: 'Check out from £100',
    text: 'Pay by card or PayPal, or pay later with Klarna within 30 days. Prices exclude VAT.',
  },
  {
    title: 'Same-day dispatch',
    text: 'Order by 2pm Monday to Friday. UK delivery takes 1–3 working days and is free over £300.',
  },
];

export const reviews = {
  score: '4.8',
  label: 'Excellent',
  count: '1,111',
  href: TRUSTPILOT_URL,
  items: [
    { name: 'Sandra', date: 'October 2026', text: 'Excellent, fast delivery, stock is beautiful A*' },
    {
      name: 'Mary Jane',
      date: 'July 2026',
      text: 'Excellent customer service!!! Lovely quality clothing would definitely recommend 👌',
    },
    { name: 'Angela', date: 'July 2026', text: 'Good quality products and prompt delivery.' },
    {
      name: 'Adele',
      date: 'July 2026',
      text: 'Great products thank you. Competitive pricing and was offered 20% off, perfect',
    },
  ],
};

export const app = {
  appStore: 'https://apps.apple.com/gb/app/wholesale-shopping/id1547019574',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.shopify.wholesaleshopping',
};

export const faqs = [
  {
    q: 'Do I need an account to order?',
    a: 'Yes. Register for a wholesale account before you place an order. Once approved, you get pack pricing, live stock availability, exclusive offers and a faster checkout.',
  },
  {
    q: 'Are prices per pack or per piece?',
    a: 'Products are sold in packs. Every product shows the pack size and the price per piece, so you can compare quickly. Prices exclude VAT.',
  },
  {
    q: 'Is there a minimum order?',
    a: 'There is no minimum quantity, and packs start from 1 piece. The minimum order value is £100.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Orders placed before 2pm Monday to Friday are dispatched the same day. Standard UK delivery takes 1–3 working days, or choose next-day delivery at checkout.',
  },
  {
    q: 'Is UK delivery free?',
    a: 'Standard UK delivery is free on orders over £300. Below that it costs £12.99 for orders up to £200, or £9.99 for orders from £200 to £299.',
  },
  {
    q: 'Can I return items?',
    a: 'Contact us within 2 working days of receiving your order to start a return. UK customers then have 7 days to send the items back. Faulty or missing items are refunded in full; other returns can be exchanged or credited.',
  },
];

export const contact = {
  phone: { label: '+44 7482 071701', href: 'tel:+447482071701' },
  whatsapp: { label: 'WhatsApp us', href: 'https://wa.me/447482071701' },
  email: { label: 'sales@wholesaleshopping.co.uk', href: 'mailto:sales@wholesaleshopping.co.uk' },
  hours: 'Mon–Fri 9am–6pm · Sun 9am–3pm',
  address: '36C Broughton Street, Manchester M8 8NN',
};

export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/wholesaleshopping.co.uk/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@wholesaleshopping.co.uk' },
  { label: 'Facebook', href: 'https://www.facebook.com/Wholesaleshopping.co.uk/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@WholesaleShopping' },
  { label: 'Pinterest', href: 'https://www.pinterest.co.uk/wholesaleshopping' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/wholesaleshopping/' },
  { label: 'X', href: 'https://x.com/WholesaleSO' },
];

export const footerLinks = [
  {
    title: 'Shop',
    links: [
      link('New in', 'new-wholesale-clothing'),
      link('Best sellers', 'best-seller'),
      link('Plus size', 'wholesale-plus-size-clothing'),
      link('Footwear', 'wholesale-women-footwear'),
      link('Accessories', 'accessories'),
      link('Made in Italy', 'womens-made-in-italy'),
      link('Sale', 'clearance'),
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery information', href: pageUrl('delivery-information') },
      { label: 'Returns and refunds', href: pageUrl('returns-and-refund-policy') },
      { label: 'FAQs', href: pageUrl('faqs') },
      { label: 'Klarna pay later', href: pageUrl('klarna') },
      { label: 'Terms and conditions', href: pageUrl('terms-conditions') },
      { label: 'Privacy policy', href: pageUrl('privacy-policy') },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: pageUrl('about-us') },
      { label: 'Contact us', href: pageUrl('contact-us') },
      { label: 'Sell with us', href: pageUrl('sell-with-us') },
      { label: 'Blog', href: `${STORE}/blogs/all-post` },
      { label: 'Sitemap', href: pageUrl('sitemap') },
    ],
  },
];
