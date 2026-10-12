// Page copy and links. Facts come from wholesaleshopping.co.uk – sources are listed in notes/real-facts.md.
// Rule: no invented claims. Anything unconfirmed is marked PLACEHOLDER.

export const STORE = 'https://www.wholesaleshopping.co.uk';
export const collectionUrl = (handle) => `${STORE}/collections/${handle}`;
export const pageUrl = (handle) => `${STORE}/pages/${handle}`;

export const FREE_DELIVERY_THRESHOLD = 300; // £, UK mainland

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

const link = (label, handle) => ({ label, href: collectionUrl(handle) });

// Shared mega-menu columns. Every handle is a real collection on the store.
const shopByPrice = {
  title: 'Shop by price',
  links: [
    link('Under £4.99', 'under-4-99'),
    link('Under £7.99', 'under-7-99'),
    link('Under £9.99', 'under-nine-ninety-nine'),
    link('Under £14.99', 'under-14-99'),
    link('Under £19.99', 'under-19-99'),
    link('Everything £5', 'everything-5'),
  ],
};

const shopByCountry = {
  title: 'Shop by country',
  links: [link('Made in Italy', 'womens-made-in-italy'), link('Made in UK', 'made-in-uk')],
};

// Main navigation: 7 items instead of the current 12 (PLAN.md §6.2)
export const mainNav = [
  { label: 'New In', href: collectionUrl('new-wholesale-clothing') },
  {
    label: 'Clothing',
    href: collectionUrl('all'),
    columns: [
      {
        title: 'Category',
        links: [
          link('Tops', 'womens-tops'),
          link('Dresses', 'womens-dresses'),
          link('Cardigans', 'womens-cardigan'),
          link('Coats & Jackets', 'womens-coats-jackets'),
          link('Trousers', 'womens-trousers'),
          link('Shop all clothing', 'all'),
        ],
      },
      {
        title: 'Shop by style',
        links: [
          link('Print tops', 'print-tops'),
          link('Plain tops', 'plain-tops'),
          link('Cotton tops', 'cotton-tops'),
          link('Print dresses', 'print-dress'),
        ],
      },
      shopByCountry,
      shopByPrice,
    ],
    feature: 'plain-belted-long-trench-coat-blazer',
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
          link('Sandals', 'footwear-sandals'),
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
          link('Chain bags', 'chain-bags'),
          link('Clutch bags', 'clutch-bags'),
        ],
      },
      {
        title: 'Accessories',
        links: [
          link('Scarves', 'wholesale-scarves'),
          link('Printed scarves', 'scarves-printed'),
          link('Jewellery', 'wholesale-jewellery'),
          link('Belts', 'belts'),
          link('Shop all accessories', 'accessories'),
        ],
      },
    ],
    feature: 'horse-print-scarves',
  },
  { label: 'Made in Italy', href: collectionUrl('womens-made-in-italy') },
  { label: 'Sale', href: collectionUrl('clearance'), highlight: true },
];

// One-tap routes into stock, shown under the search bar on phones
export const quickLinks = [
  link('New In', 'new-wholesale-clothing'),
  link('Best Sellers', 'best-seller'),
  link('Plus Size', 'wholesale-plus-size-clothing'),
  link('Footwear', 'wholesale-women-footwear'),
  link('Made in Italy', 'womens-made-in-italy'),
  link('Under £4.99', 'under-4-99'),
  link('Christmas', 'christmas'),
  link('Sale', 'clearance'),
];

export const hero = {
  eyebrow: 'UK fashion wholesaler',
  title: 'Wholesale fashion for UK boutiques & online sellers',
  proof: [
    { icon: 'package', text: 'Packs from 1 piece' },
    { icon: 'truck', text: 'Free UK mainland delivery over £300' },
    { icon: 'card', text: 'Pay later with Klarna' },
  ],
  primary: { label: 'Shop New In', href: collectionUrl('new-wholesale-clothing') },
  secondary: { label: 'Best Sellers', href: collectionUrl('best-seller') },
  // Products shown in the hero photos (real New In stock)
  looks: ['plain-belted-long-trench-coat-blazer', 'plain-two-tone-faux-fur-pockets-jacket'],
};
