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
  stats: { label: string; value: string }[];
};

// All brands below are fictional and created as sample work.
export const cases: CaseStudy[] = [
  {
    slug: "northdrift-ceramics",
    brand: "Northdrift Ceramics",
    kind: "Maker shop launch",
    headline: "A calm, tactile launch page for a one-person pottery studio",
    summary: "Pre-order page for a small-batch ceramics drop, built around photography and a waitlist.",
    brief:
      "A solo potter wanted one page to announce a spring collection, explain the making process and collect waitlist sign-ups before the shop opened.",
    approach: [
      "Warm clay-and-sand palette with plenty of whitespace so the pieces carry the page.",
      "Process told in three short beats: throw, glaze, fire.",
      "One clear action repeated twice: join the waitlist.",
    ],
    palette: ["#F4EDE4", "#C8734A", "#2E2A26", "#9DB4A0"],
    image: "/work/landing/northdrift-ceramics.svg",
    stats: [
      { label: "Turnaround", value: "48h" },
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
      "A two-founder team needed a credible page to share on launch day: what the product does, why it's different and an email capture for early access.",
    approach: [
      "Dark UI with a single violet accent to feel technical without being cold.",
      "Hero shows the product, not stock art: a drafted newsletter mid-edit.",
      "Social proof slots ready to fill once beta users report back.",
    ],
    palette: ["#0F0E17", "#7C5CFF", "#E8E6F3", "#2CE6B5"],
    image: "/work/landing/quillbyte.svg",
    stats: [
      { label: "Turnaround", value: "48h" },
      { label: "Sections", value: "7" },
      { label: "Revision rounds", value: "1" },
    ],
  },
  {
    slug: "fennel-and-fig",
    brand: "Fennel & Fig",
    kind: "Creator course",
    headline: "A friendly sales page for a meal-prep creator's first course",
    summary: "Course landing page with curriculum, creator bio, testimonials and a single price.",
    brief:
      "A food creator with a growing YouTube audience wanted a page to sell a 4-week meal-prep course, linking from video descriptions.",
    approach: [
      "Fresh greens and fig purple, rounded shapes and big friendly type.",
      "Curriculum laid out week by week so buyers know exactly what they get.",
      "Price and guarantee side by side to reduce hesitation.",
    ],
    palette: ["#F7F5EC", "#3F7D4E", "#7A3B69", "#F2B84B"],
    image: "/work/landing/fennel-and-fig.svg",
    stats: [
      { label: "Turnaround", value: "48h" },
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

export function getOffer(id: ServiceId) {
  return offers.find((o) => o.id === id)!;
}

export function formatPrice(o: Offer) {
  return `$${o.price}${o.unit ?? ""}`;
}
