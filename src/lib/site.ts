export const site = {
  name: "Shipday Studio",
  url: "https://shipdaystudio.com",
  email: "hello@shipdaystudio.com",
  tagline: "Fixed-price design for creators and founders. Shipped in days, not weeks.",
  description:
    "Shipday Studio is a fixed-price design studio for creators and founders: landing pages in 48h, YouTube thumbnail packs in 24h, logo packs in 48h, and monthly upkeep. Clear prices in USD, no calls required.",
  /** Public location shown in marketing copy. No personal name or street address is published anywhere on the site. */
  location: "Switzerland",
  x: { handle: "@ShipdayStudio", url: "https://x.com/ShipdayStudio" },
  /** Public operator and data controller details for the legal pages. No personal name or street address. */
  legal: {
    operator: "Shipday Studio",
    country: "Switzerland",
  },
};

/** Pre-filled mailto link for sending a brief after paying. */
export function briefMailto(service?: string) {
  const subject = `Brief: ${service ?? "my Shipday Studio order"}`;
  const body = [
    "Hi Shipday Studio,",
    "",
    `Package: ${service ?? ""}`,
    "Email used at Stripe checkout: ",
    "",
    "What I do / my project:",
    "Who it's for:",
    "Links (site, socials, examples I like):",
    "Text, logo or files to include (attach or link):",
    "Anything else:",
  ].join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type ServiceId = "landing" | "thumbnails" | "logo" | "upkeep";

export type Offer = {
  id: ServiceId;
  name: string;
  price: number;
  unit?: string;
  turnaround: string;
  summary: string;
  includes: string[];
  featured?: boolean;
  /** Live Stripe Payment Link for this service (see stripe-catalog.json). */
  stripeLink: string;
};

export const offers: Offer[] = [
  {
    id: "landing",
    name: "Landing page",
    price: 390,
    turnaround: "48h",
    summary: "A one-page site that explains what you do and gets people to act.",
    includes: [
      "Copy written for you",
      "Custom design, mobile-first",
      "Deployed to your domain",
      "1 revision round",
    ],
    featured: true,
    stripeLink: "https://buy.stripe.com/3cIeVebOc8eCaEPbIycjS00",
  },
  {
    id: "thumbnails",
    name: "Thumbnail pack",
    price: 79,
    turnaround: "24h",
    summary: "Four YouTube thumbnails built to be read at a glance.",
    includes: ["4 thumbnails, 1280×720", "Bold, legible titles", "Source files included", "1 revision round"],
    stripeLink: "https://buy.stripe.com/9B6bJ2aK8amK9AL4g6cjS01",
  },
  {
    id: "logo",
    name: "Logo pack",
    price: 149,
    turnaround: "48h",
    summary: "Three logo concepts. Pick one, get the final files.",
    includes: ["3 distinct concepts", "Final SVG + PNG files", "Light & dark versions", "1 revision round"],
    stripeLink: "https://buy.stripe.com/00w14obOc9iG9AL9AqcjS02",
  },
  {
    id: "upkeep",
    name: "Upkeep",
    price: 49,
    unit: "/month",
    turnaround: "Ongoing",
    summary: "Small edits and updates to your site, handled for you.",
    includes: ["Text & image swaps", "Small layout tweaks", "Dependency updates", "Cancel any time"],
    stripeLink: "https://buy.stripe.com/6oUeVedWk9iG8wHdQGcjS03",
  },
];

export const steps = [
  {
    title: "Pick & pay",
    body: "Choose a fixed-price package and pay securely through Stripe checkout. The price is the price: no quotes, no discovery calls.",
  },
  {
    title: "Send your brief",
    body: "Email hello@shipdaystudio.com with what you do, who it's for and any links or files. Five minutes is plenty.",
  },
  {
    title: "Get it shipped",
    body: "Finished files land in your inbox within the stated turnaround, with one revision round included on every one-off package.",
  },
];

export const faq = [
  {
    q: "Who is behind Shipday Studio?",
    a: "Shipday Studio is an independent studio based in Switzerland. Production runs on an AI-assisted workflow, and every deliverable is reviewed by a human before delivery, which is how we keep prices fixed and turnaround short.",
  },
  {
    q: "When does the clock start?",
    a: "Turnaround starts once payment is confirmed and your brief is complete. If anything is missing, we'll ask by email, and the clock pauses until you reply.",
  },
  {
    q: "What if I don't like the result?",
    a: "Every one-off package includes one revision round: send one list of changes within 14 days of delivery. If we haven't started work yet, you can cancel for a full refund.",
  },
  {
    q: "Do I own the work?",
    a: "Yes. Once paid in full, you own the final deliverables and can use them however you like.",
  },
  {
    q: "Do you do hosting and domains?",
    a: "We deploy your landing page to a domain and hosting account you own (domain and hosting fees, if any, are yours). You keep the accounts; we never lock you in.",
  },
  {
    q: "What currency do you charge in?",
    a: "All prices are in US dollars (USD). Your bank may convert at its own rate.",
  },
  {
    q: "How do I cancel Upkeep?",
    a: "Email hello@shipdaystudio.com any time. Upkeep stops at the end of the month you've already paid for.",
  },
];

export type CaseStudy = {
  slug: string;
  brand: string;
  kind: string;
  headline: string;
  summary: string;
  brief: string;
  approach: string[];
  palette: string[];
  image: string;
  /** Intrinsic size of `image` (defaults to the original 1200x2200 SVG samples). */
  imageSize?: [number, number];
  /** Optional 4:3 crop of the hero used on gallery cards. */
  card?: string;
  /** Short aesthetic label shown on gallery cards. */
  style?: string;
  stats: { label: string; value: string }[];
};

// All brands below are fictional and created as sample work.
export const cases: CaseStudy[] = [
  {
    slug: "maison-orrevel",
    brand: "Maison Orrevel",
    kind: "Fragrance house homepage",
    style: "Editorial serif luxury",
    headline: "A quiet, editorial homepage for a small-batch perfume house",
    summary: "Magazine-style homepage with a single hero fragrance, a notes breakdown, a brand line and a three-piece collection.",
    brief:
      "Imagined brief: an independent perfumer launching a numbered Eau de Parfum wants a homepage that feels like a printed magazine, sells one hero scent and introduces the wider collection.",
    approach: [
      "Large Cormorant serif headlines with generous whitespace, so the page reads like a printed spread.",
      "Ivory, ink and bronze only: one accent colour keeps it calm and expensive.",
      "The composition is told as top, heart and base notes, so buyers understand the scent before they smell it.",
    ],
    palette: ["#F4EFE7", "#1E1A15", "#8C6A43", "#D9CFC1"],
    image: "/work/v2/maison-orrevel.webp",
    imageSize: [1200, 3401],
    card: "/work/v2/maison-orrevel-card.webp",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "6" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "vantorel",
    brand: "Vantorel",
    kind: "B2B SaaS homepage",
    style: "Refined dark SaaS",
    headline: "A precise, dark homepage for a finance-automation product",
    summary: "Dark SaaS homepage with a product dashboard built in code, a bento feature grid, a three-step setup and an early-access CTA.",
    brief:
      "Imagined brief: a seed-stage team building month-end close automation for finance teams needs a credible launch homepage that shows the product, not stock art.",
    approach: [
      "Near-black canvas with a soft violet glow and a faint grid, so the product UI is the brightest thing on the page.",
      "The dashboard is real HTML, not a screenshot mock-up, so it stays sharp and easy to update.",
      "No logo wall or testimonials: the page is ready for real proof once beta users arrive.",
    ],
    palette: ["#07080C", "#8B7CFF", "#5EEAD4", "#EDEEF3"],
    image: "/work/v2/vantorel.webp",
    imageSize: [1200, 2618],
    card: "/work/v2/vantorel-card.webp",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "6" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "haldane-and-oat",
    brand: "Haldane & Oat",
    kind: "DTC home goods store",
    style: "Warm minimal DTC",
    headline: "A warm, tactile storefront for a linen bedding brand",
    summary: "Direct-to-consumer homepage with a lifestyle hero, colourway swatches, a product row, a materials story and a newsletter sign-up.",
    brief:
      "Imagined brief: a small linen bedding label moving off marketplaces wants its own storefront homepage that feels as soft as the product and makes the bestsellers easy to buy.",
    approach: [
      "Soft Fraunces headlines and Manrope body text, with oat, clay and sage taken straight from the fabric.",
      "Colourways are shown as swatches from the first screen, because colour is the main buying decision.",
      "Care instructions are part of the page, which answers the most common pre-purchase question.",
    ],
    palette: ["#F6F0E7", "#B4633F", "#7F8F72", "#2A241E"],
    image: "/work/v2/haldane-and-oat.webp",
    imageSize: [1200, 3080],
    card: "/work/v2/haldane-and-oat-card.webp",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "7" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "northdrift-ceramics",
    brand: "Northdrift Ceramics",
    kind: "Maker shop launch",
    headline: "A calm, tactile launch page for a one-person pottery studio",
    summary: "Pre-order page for a small-batch ceramics drop, built around photography and a waitlist.",
    brief:
      "Imagined brief: a solo potter wants one page to announce a spring collection, explain the making process and collect waitlist sign-ups before the shop opens.",
    approach: [
      "Warm clay-and-sand palette with plenty of whitespace so the pieces carry the page.",
      "Process told in three short beats: throw, glaze, fire.",
      "One clear action repeated twice: join the waitlist.",
    ],
    palette: ["#F4EDE4", "#C8734A", "#2E2A26", "#9DB4A0"],
    image: "/work/landing/northdrift-ceramics.svg",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "6" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "quillbyte",
    brand: "Quillbyte",
    kind: "SaaS waitlist",
    headline: "A crisp product page for an AI newsletter-drafting tool",
    summary: "Dark, focused SaaS landing page with a product mock, three benefits and pricing teaser.",
    brief:
      "Imagined brief: a two-founder team needs a credible page to share on launch day: what the product does, why it's different and an email capture for early access.",
    approach: [
      "Dark UI with a single violet accent to feel technical without being cold.",
      "Hero shows the product, not stock art: a drafted newsletter mid-edit.",
      "Social proof slots left empty, ready for real beta feedback.",
    ],
    palette: ["#0F0E17", "#7C5CFF", "#E8E6F3", "#2CE6B5"],
    image: "/work/landing/quillbyte.svg",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "7" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "fennel-and-fig",
    brand: "Fennel & Fig",
    kind: "Creator course",
    headline: "A friendly sales page for a meal-prep creator's first course",
    summary: "Course landing page with curriculum, creator bio, review placeholders and a single price.",
    brief:
      "Imagined brief: a food creator with a YouTube audience wants a page to sell a 4-week meal-prep course, linking from video descriptions.",
    approach: [
      "Fresh greens and fig purple, rounded shapes and big friendly type.",
      "Curriculum laid out week by week so buyers know exactly what they get.",
      "Price and guarantee side by side to reduce hesitation.",
    ],
    palette: ["#F7F5EC", "#3F7D4E", "#7A3B69", "#F2B84B"],
    image: "/work/landing/fennel-and-fig.svg",
    stats: [
      { label: "Package turnaround", value: "48h" },
      { label: "Sections", value: "8" },
      { label: "Revision rounds", value: "1" },
    ],
  },
];

export const thumbnails = [
  { file: "/work/thumbnails/thumb-1.svg", alt: "Sample thumbnail: 'I tried 5 budget mics' for a fictional tech channel" },
  { file: "/work/thumbnails/thumb-2.svg", alt: "Sample thumbnail: '30 day sourdough' for a fictional baking channel" },
  { file: "/work/thumbnails/thumb-3.svg", alt: "Sample thumbnail: 'My first $1K month' for a fictional founder channel" },
  { file: "/work/thumbnails/thumb-4.svg", alt: "Sample thumbnail: 'Alps on $40 a day' for a fictional travel channel" },
  { file: "/work/thumbnails/thumb-5.svg", alt: "Sample thumbnail: 'Stop doing this in Figma' for a fictional design channel" },
  { file: "/work/thumbnails/thumb-6.svg", alt: "Sample thumbnail: '5AM routine, honest review' for a fictional lifestyle channel" },
];

export const logos = [
  { file: "/work/logos/tidewell.svg", name: "Tidewell", note: "Swim school" },
  { file: "/work/logos/brightloom.svg", name: "Brightloom", note: "Textile studio" },
  { file: "/work/logos/cobalt-owl.svg", name: "Cobalt Owl", note: "Night-shift coffee" },
];

/** Newer, photo-based thumbnail concepts (1280x720 WebP, with a 640px variant). Channels are fictional. */
export const featuredThumbnails = [
  {
    file: "/work/v2/thumb-finance-stop-saving.webp",
    small: "/work/v2/thumb-finance-stop-saving-640.webp",
    niche: "Finance",
    title: "Stop saving. Start owning",
    alt: "Sample finance thumbnail for a fictional channel: 'Stop saving. Start owning' in bold white and gold type beside a glowing stack of gold coins and a rising chart",
  },
  {
    file: "/work/v2/thumb-travel-last-road-north.webp",
    small: "/work/v2/thumb-travel-last-road-north-640.webp",
    niche: "Travel",
    title: "The last road north",
    alt: "Sample travel thumbnail for a fictional channel: 'The last road north' over a cinematic golden-hour fjord with a winding coastal road and a red cabin",
  },
  {
    file: "/work/v2/thumb-tech-worth-449.webp",
    small: "/work/v2/thumb-tech-worth-449-640.webp",
    niche: "Tech review",
    title: "Worth $449? 6 months later",
    alt: "Sample tech review thumbnail for a fictional channel: 'Worth $449? 6 months later' in white and orange next to unbranded graphite headphones",
  },
];

/** Newer logo concepts, each shown as a light and a dark tile (1600x800 WebP, with an 800px variant). Brands are fictional. */
export const featuredLogos = [
  {
    file: "/work/v2/logo-stillmoor.webp",
    small: "/work/v2/logo-stillmoor-800.webp",
    name: "Stillmoor",
    note: "Wellness retreat",
    alt: "Stillmoor logo concept for a fictional wellness retreat: an arched doorway framing a rising sun over still water, with a spaced serif wordmark, on light and dark tiles",
  },
  {
    file: "/work/v2/logo-lunebrook.webp",
    small: "/work/v2/logo-lunebrook-800.webp",
    name: "Lunebrook",
    note: "Tea house",
    alt: "Lunebrook logo concept for a fictional tea house: a brass crescent moon above two brook waves, with a soft serif wordmark, on light and dark tiles",
  },
  {
    file: "/work/v2/logo-aurivane.webp",
    small: "/work/v2/logo-aurivane-800.webp",
    name: "Aurivane",
    note: "Grid battery startup",
    alt: "Aurivane logo concept for a fictional energy storage startup: a monoline letter A crossed by an offset blue vane stroke, with a geometric lowercase wordmark, on light and dark tiles",
  },
];

export function getOffer(id: ServiceId) {
  return offers.find((o) => o.id === id)!;
}

export function formatPrice(o: Offer) {
  return `$${o.price}${o.unit ?? ""}`;
}
