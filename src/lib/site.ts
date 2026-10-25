export const site = {
  name: "Shipday Studio",
  url: "https://shipdaystudio.com",
  email: "hello@shipdaystudio.com",
  tagline: "Fixed-price design for businesses, creators and brands worldwide. Shipped in days, not weeks.",
  description:
    "Remote, fixed-price design studio for businesses, creators and brands worldwide. Landing pages and logos in 48h, YouTube thumbnails in 24h. No calls.",
  /** Marketing copy is remote and worldwide. The country appears only in the legal identity (site.legal). No personal name or street address is published anywhere on the site. */
  reach: "Remote studio working with businesses, creators and brands worldwide, in any industry.",
  x: { handle: "@ShipdayStudio", url: "https://x.com/ShipdayStudio" },
  /** Public operator and data controller details for the legal pages. No personal name or street address. */
  legal: {
    operator: "Shipday Studio",
    country: "Switzerland",
  },
};

/** Brief questions per package id (same order and wording as tools/intake.py CHECKS, so the first email is usually complete). */
const briefFields: Record<string, string[]> = {
  thumbnails: [
    "Channel (link or name) and what it's about:",
    "The 4 videos (a working title or one-line topic each):",
    "1.",
    "2.",
    "3.",
    "4.",
    "Exact words on each thumbnail (or leave blank and we write them):",
    "Look to match (your current thumbnails or a channel you like):",
    "Face or product in it? Attach the photo(s):",
    "Language for the text:",
  ],
  "thumbnail-single": [
    "Channel (link or name) and what it's about:",
    "The video (working title or one-line topic):",
    "Exact words on the thumbnail (or leave blank and we write them):",
    "Look to match (your current thumbnails or a channel you like):",
    "Face or product in it? Attach the photo(s):",
    "Language for the text:",
  ],
  "creator-lite": [
    "Channel (link or name) and what it's about:",
    "First video (working title or one-line topic):",
    "Exact words on the thumbnail (or leave blank and we write them):",
    "Look to match (your current thumbnails or a channel you like):",
    "Face or product in it? Attach the photo(s):",
    "Language for the text:",
  ],
  "creator-plan": [
    "Channel (link or name) and what it's about:",
    "First video (working title or one-line topic):",
    "Exact words on the thumbnail (or leave blank and we write them):",
    "Look to match (your current thumbnails or a channel you like):",
    "Face or product in it? Attach the photo(s):",
    "Language for the text:",
  ],
  "launch-kit": [
    "Exact channel name (spelling and capitals as they should appear):",
    "What the channel is about and who it's for (link if it exists):",
    "The first 4 videos (a working title or one-line topic each):",
    "1.",
    "2.",
    "3.",
    "4.",
    "Banner text besides the name (upload schedule, tagline, handle):",
    "Looks, channels or colours you like or want to avoid:",
    "Face or product in it? Attach the photo(s):",
    "Language for the text:",
  ],
  logo: [
    "Exact name (spelling and capitals as they should appear):",
    "What the business does and who it's for:",
    "Tagline with the logo? If so, what is it:",
    "Styles, logos or colours you like or want to avoid:",
    "Where it'll be used most (website, app icon, signage, social, print):",
  ],
  landing: [
    "What you do or sell, in a couple of sentences:",
    "Who the page is for:",
    "The one action a visitor should take, and where it goes:",
    "Key facts we must get right (offer, prices, hours, contact details):",
    "Logo, colours, fonts or photos to use (attach or link):",
    "Sites you like the look of:",
    "Where it should go live (your domain and host):",
  ],
  upkeep: [
    "Site URL:",
    "How we get access (host, repo or CMS):",
    "First change you'd like:",
  ],
};

const genericBriefFields = [
  "What I do / my project:",
  "Who it's for:",
  "Links (site, socials, examples I like):",
  "Text, logo or files to include (attach or link):",
];

/** Pre-filled mailto link for sending a brief after paying. Pass the package id (as in ?product=) to get that package's questions. */
export function briefMailto(service?: string, id?: string) {
  const subject = `Brief: ${service ?? "my Shipday Studio order"}`;
  const fields = (id && briefFields[id]) || genericBriefFields;
  const body = [
    "Hi Shipday Studio,",
    "",
    `Package: ${service ?? ""}`,
    "Email used at Stripe checkout: ",
    "",
    ...fields,
    "Anything else:",
  ].join("\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Sectors shown in the "Who we work with" strip. Illustrative of breadth, not a client list. */
export const industries = [
  "SaaS & tech",
  "E-commerce",
  "Restaurants & hospitality",
  "Local services",
  "Health & wellness",
  "Coaches & consultants",
  "Creators & YouTubers",
  "Gaming",
  "Finance",
  "Real estate",
  "Non-profits",
];

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
  /** Live Stripe Payment Link for this service (see stripe-catalog.json), tagged with client_reference_id=site. */
  stripeLink: string;
  /** Extra ways to buy the same service (e.g. a single thumbnail or a monthly plan), shown inside its pricing card. */
  options?: OfferOption[];
  /** Plain label for the main package when options are listed next to it, e.g. "4 thumbnails, $79 total". */
  packLabel?: string;
};

/** A smaller or recurring variant of a package, bought through its own Stripe Payment Link. */
export type OfferOption = {
  /** Value of ?product= on the /thanks/ redirect for this option's Payment Link. */
  id: string;
  name: string;
  /** Short line shown in the pricing card, e.g. "1 thumbnail, $20, 24h". */
  label: string;
  summary: string;
  price: number;
  unit?: string;
  turnaround: string;
  includes: string[];
  stripeLink: string;
};

/** Source tag appended to every Stripe Payment Link on the website (convention in stripe-catalog.json and RULES.md). */
export const SITE_REF = "?client_reference_id=site";

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
    stripeLink: `https://buy.stripe.com/3cIeVebOc8eCaEPbIycjS00${SITE_REF}`,
  },
  {
    id: "thumbnails",
    name: "Thumbnail pack",
    price: 79,
    turnaround: "24h",
    summary: "Four YouTube thumbnails built to be read at a glance.",
    includes: ["4 thumbnails, 1280×720", "Bold, legible titles", "Source files included", "1 revision round"],
    stripeLink: `https://buy.stripe.com/9B6bJ2aK8amK9AL4g6cjS01${SITE_REF}`,
    packLabel: "4 thumbnails, $79 total",
    options: [
      {
        id: "thumbnail-single",
        name: "Single thumbnail",
        label: "1 thumbnail, $20, 24h",
        summary: "One custom YouTube thumbnail, delivered within 24h of your brief.",
        price: 20,
        turnaround: "24h",
        includes: ["1 thumbnail, 1280×720", "Bold, legible title", "Source file included", "1 revision round"],
        stripeLink: `https://buy.stripe.com/00w8wQ9G43Ym3cn3c2cjS04${SITE_REF}`,
      },
      {
        id: "creator-lite",
        name: "Creator Lite",
        label: "Creator Lite, 4 thumbnails/month, $79/mo",
        summary: "4 custom YouTube thumbnails a month (up to 1 a week), each delivered within 24h of its brief. Cancel any time.",
        price: 79,
        unit: "/month",
        turnaround: "Ongoing",
        includes: ["4 thumbnails a month, 1280×720", "Up to 1 a week, each in 24h", "Source files included", "Cancel any time"],
        stripeLink: `https://buy.stripe.com/8x2eVedWkamKbIT5kacjS06${SITE_REF}`,
      },
      {
        id: "creator-plan",
        name: "Creator plan",
        label: "Creator plan, 12 thumbnails/month, $179/mo",
        summary: "12 custom YouTube thumbnails a month (up to 3 a week), each delivered within 24h of its brief. Cancel any time.",
        price: 179,
        unit: "/month",
        turnaround: "Ongoing",
        includes: ["12 thumbnails a month, 1280×720", "Up to 3 a week, each in 24h", "Source files included", "Cancel any time"],
        stripeLink: `https://buy.stripe.com/cNi28s9G4gL88wH7sicjS05${SITE_REF}`,
      },
    ],
  },
  {
    id: "logo",
    name: "Logo pack",
    price: 149,
    turnaround: "48h",
    summary: "Three logo concepts. Pick one, get the final files.",
    includes: ["3 distinct concepts", "Final SVG + PNG files", "Light & dark versions", "1 revision round"],
    stripeLink: `https://buy.stripe.com/00w14obOc9iG9AL9AqcjS02${SITE_REF}`,
    packLabel: "3 logo concepts, $149 total",
    options: [
      {
        id: "launch-kit",
        name: "Channel Launch Kit",
        label: "Channel Launch Kit: logo, banner, profile picture + 4 thumbnails, $199, 48h",
        summary: "Everything a new channel needs: a logo, a channel banner, a profile picture and 4 custom thumbnails, delivered within 48h of your brief.",
        price: 199,
        turnaround: "48h",
        includes: ["Logo (2 concepts, final SVG + PNG)", "Channel banner, 2560×1440", "Profile picture, 800×800", "4 thumbnails, 1280×720", "1 revision round"],
        stripeLink: `https://buy.stripe.com/cNi28s8C0gL814f9AqcjS07${SITE_REF}`,
      },
    ],
  },
  {
    id: "upkeep",
    name: "Upkeep",
    price: 49,
    unit: "/month",
    turnaround: "Ongoing",
    summary: "Small edits and updates to your site, handled for you.",
    includes: ["Text & image swaps", "Small layout tweaks", "Dependency updates", "Cancel any time"],
    stripeLink: `https://buy.stripe.com/6oUeVedWk9iG8wHdQGcjS03${SITE_REF}`,
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
    a: "Shipday Studio is an independent, fully remote design studio. Production runs on an AI-assisted workflow, and every deliverable is quality-checked before delivery, with revisions included, which is how we keep prices fixed and turnaround short.",
  },
  {
    q: "Do you work with clients in my country or industry?",
    a: "Yes. We work with businesses, creators and brands in any country, market or industry, selling any product or service. Everything runs by email and Stripe checkout, so there are no calls to schedule across time zones.",
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

/** Visual style range used by the "more examples" filters. These are style choices, never quality or price tiers. */
export type Look = "Clean & simple" | "Balanced" | "Rich & detailed";
export const looks: Look[] = ["Clean & simple", "Balanced", "Rich & detailed"];

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
  /** Full responsive concept page ("See the design") hosted under /demos/ (static, noindex). */
  demo?: string;
  /** Mobile screenshot (360x779) shown next to the desktop card. */
  mobile?: string;
  /** Buyer segment this concept is built for (homepage featured set). */
  segment?: string;
  /** Shown in the homepage featured set, in this order. */
  featured?: number;
  industry: string;
  look: Look;
  stats: { label: string; value: string }[];
};

const stats = (sections: string) => [
  { label: "Package turnaround", value: "48h" },
  { label: "Sections", value: sections },
  { label: "Revision rounds", value: "1" },
];

// All brands below are fictional and created as sample work. None of them is a client project.
export const cases: CaseStudy[] = [
  {
    slug: "vantorel",
    brand: "Vantorel",
    kind: "B2B SaaS homepage",
    segment: "SaaS & indie founders",
    featured: 1,
    industry: "SaaS & tech",
    look: "Rich & detailed",
    style: "Refined dark SaaS",
    headline: "A precise, dark launch page for a finance-automation product",
    summary: "Dark SaaS homepage with a product dashboard built in code, a bento feature grid, a three-step setup and an early-access CTA.",
    brief:
      "Imagined brief: a seed-stage team building month-end close automation for finance teams needs a credible launch homepage that shows the product, not stock art.",
    approach: [
      "Near-black canvas with a soft violet glow and a faint grid, so the product UI is the brightest thing on the page.",
      "The dashboard is real HTML, not a screenshot mock-up, so it stays sharp at every screen size and is easy to update.",
      "No logo wall or testimonials: the page is ready for real proof once beta users arrive.",
    ],
    palette: ["#07080C", "#8B7CFF", "#5EEAD4", "#EDEEF3"],
    image: "/work/v3/lp-vantorel.webp",
    imageSize: [1200, 2526],
    card: "/work/v3/lp-vantorel-card.webp",
    mobile: "/work/v3/lp-vantorel-mobile.webp",
    demo: "/demos/vantorel/",
    stats: stats("6"),
  },
  {
    slug: "calm-podium",
    brand: "The Calm Podium",
    kind: "Online course sales page",
    segment: "Coaches & course creators",
    featured: 2,
    industry: "Coaching & courses",
    look: "Balanced",
    style: "Soft, warm conversion page",
    headline: "A calm, conversion-focused sales page for a public-speaking course",
    summary: "Course page with a clear promise, a who-it's-for check, a six-week plan, a single price card with a refund policy, an FAQ and a sticky mobile CTA.",
    brief:
      "Imagined brief: a coach launching a six-week small-group course for quiet professionals wants a page that sells seats without hype, fake scarcity or invented testimonials.",
    approach: [
      "Instrument Serif headlines and Figtree body text in cream, sage and apricot, so the page feels as calm as the promise.",
      "Abstract clay imagery instead of a face, so the page works before there is a professional photo shoot.",
      "One action everywhere: reserve a seat, with the price, refund window and cohort date always visible on mobile.",
    ],
    palette: ["#FBF6EE", "#22382E", "#E0835A", "#8DA68F"],
    image: "/work/v3/lp-calm-podium.webp",
    imageSize: [1200, 2881],
    card: "/work/v3/lp-calm-podium-card.webp",
    mobile: "/work/v3/lp-calm-podium-mobile.webp",
    demo: "/demos/calm-podium/",
    stats: stats("7"),
  },
  {
    slug: "osteria-fennella",
    brand: "Osteria Fennella",
    kind: "Restaurant homepage with bookings",
    segment: "Local businesses with bookings",
    featured: 3,
    industry: "Restaurants & food",
    look: "Rich & detailed",
    style: "Warm trattoria with booking widget",
    headline: "A warm neighbourhood-restaurant homepage built around booking a table",
    summary: "Restaurant homepage with a booking widget on the first screen, a short menu with prices, the dining room, opening hours and group dining.",
    brief:
      "Imagined brief: a twelve-table osteria is tired of phone bookings and wants a homepage where people can see tonight's menu and pick a table in a few taps.",
    approach: [
      "The booking widget overlaps the hero, so the main action is visible before anyone scrolls.",
      "Bricolage Grotesque with Caslon italics, tomato red and deep green: Italian warmth without clichés.",
      "Menu, hours and access info as real text, so it is readable, searchable and easy to update.",
    ],
    palette: ["#F6EEDC", "#C2412A", "#1E4636", "#4D5A2E"],
    image: "/work/v3/lp-osteria-fennella.webp",
    imageSize: [1200, 2447],
    card: "/work/v3/lp-osteria-fennella-card.webp",
    mobile: "/work/v3/lp-osteria-fennella-mobile.webp",
    demo: "/demos/osteria-fennella/",
    stats: stats("6"),
  },
  {
    slug: "maison-orrevel",
    brand: "Maison Orrevel",
    kind: "Fragrance house homepage",
    segment: "Luxury DTC brands",
    featured: 4,
    industry: "Luxury & beauty",
    look: "Clean & simple",
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
    image: "/work/v3/lp-maison-orrevel.webp",
    imageSize: [1200, 3280],
    card: "/work/v3/lp-maison-orrevel-card.webp",
    mobile: "/work/v3/lp-maison-orrevel-mobile.webp",
    demo: "/demos/maison-orrevel/",
    stats: stats("6"),
  },
  {
    slug: "vesperkeel",
    brand: "Vesperkeel",
    kind: "Indie game launch page",
    segment: "Gaming & indie studios",
    featured: 5,
    industry: "Gaming & entertainment",
    look: "Rich & detailed",
    style: "Cinematic dark fantasy",
    headline: "A cinematic wishlist page for a fictional co-op sky-sailing game",
    summary: "Game page with full-bleed key art, wishlist and trailer actions, three gameplay pillars, a media grid, a public roadmap and a playtest sign-up.",
    brief:
      "Imagined brief: a small studio (the fictional Lanternmoth Games) needs a page that turns trailer views into wishlists and playtest sign-ups ahead of early access.",
    approach: [
      "Key art does the selling: the headline sits in the dark sky, and on mobile the art moves above the text instead of being cropped away.",
      "Cinzel for the title and Chakra Petch for UI text, with lantern amber and teal pulled from the art.",
      "Generic store wording and no platform logos, so the page can point anywhere the studio sells.",
    ],
    palette: ["#080B17", "#F2B35B", "#46D3C8", "#E9E4D8"],
    image: "/work/v3/lp-vesperkeel.webp",
    imageSize: [1200, 3310],
    card: "/work/v3/lp-vesperkeel-card.webp",
    mobile: "/work/v3/lp-vesperkeel-mobile.webp",
    demo: "/demos/vesperkeel/",
    stats: stats("6"),
  },
  {
    slug: "pipewren",
    brand: "Pipewren Plumbing",
    kind: "Trades homepage redesign",
    industry: "Local services",
    look: "Balanced",
    style: "Friendly, trustworthy trades",
    headline: "A redesign concept that turns a dated plumbing site into a booking page",
    summary: "Before-and-after concept: a cluttered, dated homepage rebuilt around online booking, clear pricing, services and service area.",
    brief:
      "Imagined brief: a local plumbing firm's old site says 'please call' for every price and has no way to book. They want customers to book a visit online and trust the price before anyone arrives.",
    approach: [
      "Quick booking (job type and day) sits in the hero, replacing 'call now' and a phone-only workflow.",
      "Prices shown as 'from' figures, plus a three-step 'how pricing works' block to answer the main worry up front.",
      "Navy, copper and mint with Plus Jakarta Sans: friendly and tidy, the way you want a tradesperson to be.",
    ],
    palette: ["#10213D", "#D96C34", "#DDF0E6", "#EEF4FA"],
    image: "/work/v3/lp-pipewren.webp",
    imageSize: [1200, 2175],
    card: "/work/v3/lp-pipewren-card.webp",
    mobile: "/work/v3/lp-pipewren-mobile.webp",
    demo: "/demos/pipewren/",
    stats: stats("6"),
  },
  {
    slug: "smilewick-dental",
    brand: "Smilewick Dental",
    kind: "Dental clinic homepage",
    industry: "Health & clinics",
    look: "Clean & simple",
    style: "Bright, calm clinic",
    headline: "A bright, reassuring homepage for a small dental clinic",
    summary: "Clinic homepage with next free appointment slots, opening-hours highlights, three treatments, up-front prices and a booking CTA.",
    brief:
      "Imagined brief: a two-chair dental clinic wants nervous patients to feel at ease and to book online instead of calling during work hours.",
    approach: [
      "Mint, white and light oak with Instrument Serif headlines: clinical-clean but warm.",
      "Next free slots shown on the hero image, so booking feels quick before the first click.",
      "Prices stated plainly, because cost is the question most patients won't ask.",
    ],
    palette: ["#FFFFFF", "#0F6B5C", "#CFEDE3", "#10231F"],
    image: "/work/v3/lp-smilewick-dental.webp",
    imageSize: [1200, 1702],
    card: "/work/v3/lp-smilewick-dental-card.webp",
    mobile: "/work/v3/lp-smilewick-dental-mobile.webp",
    demo: "/demos/smilewick-dental/",
    stats: stats("6"),
  },
  {
    slug: "halvenna-studio",
    brand: "Halvenna Studio",
    kind: "Wedding photographer homepage",
    industry: "Weddings & events",
    look: "Clean & simple",
    style: "Soft editorial minimal",
    headline: "A soft, editorial homepage for a wedding and elopement photographer",
    summary: "Split-screen hero, a short philosophy line, three packages with starting prices, an image strip and a date-check enquiry.",
    brief:
      "Imagined brief: a photographer who takes a few weddings a year wants a homepage that feels like their work and filters for couples who value quiet, unposed photos.",
    approach: [
      "Cormorant Garamond and lots of linen-coloured space, letting one photo carry the hero.",
      "Packages show starting prices, so enquiries arrive from couples who already fit the budget.",
      "A single 'check your date' action instead of a long contact form on the first screen.",
    ],
    palette: ["#F4EEE4", "#2A241D", "#A9824B", "#E2D7C6"],
    image: "/work/v3/lp-halvenna-studio.webp",
    imageSize: [1200, 2000],
    card: "/work/v3/lp-halvenna-studio-card.webp",
    mobile: "/work/v3/lp-halvenna-studio-mobile.webp",
    demo: "/demos/halvenna-studio/",
    stats: stats("5"),
  },
  {
    slug: "kettlefin-strength",
    brand: "Kettlefin Strength",
    kind: "Gym homepage",
    industry: "Fitness",
    look: "Rich & detailed",
    style: "Bold, high-contrast",
    headline: "A loud, confident homepage for a small-group strength gym",
    summary: "Full-bleed gym hero with oversized type, a ticker, three class types, a weekly timetable and a free-class offer.",
    brief:
      "Imagined brief: a coached strength gym wants a homepage that feels like walking into the room and turns visitors into free-trial bookings.",
    approach: [
      "Anton headlines at poster size, with outline type and a lime ticker for energy.",
      "The timetable is a real, scrollable table, so it stays readable on a phone.",
      "One offer repeated twice: book a free class.",
    ],
    palette: ["#0D0D0C", "#FF5A1F", "#D7FF3A", "#F2EFE9"],
    image: "/work/v3/lp-kettlefin-strength.webp",
    imageSize: [1200, 1874],
    card: "/work/v3/lp-kettlefin-strength-card.webp",
    mobile: "/work/v3/lp-kettlefin-strength-mobile.webp",
    demo: "/demos/kettlefin-strength/",
    stats: stats("5"),
  },
  {
    slug: "quernstead-food-share",
    brand: "Quernstead Food Share",
    kind: "Nonprofit homepage",
    industry: "Nonprofit & community",
    look: "Balanced",
    style: "Bright, friendly community",
    headline: "A cheerful, practical homepage for a community food-share charity",
    summary: "Nonprofit homepage with a clear mission line, sample impact figures (labelled as such), three ways to help and a monthly giving block.",
    brief:
      "Imagined brief: a volunteer-run food share wants more weekend drivers and monthly donors, and wants people who need food to know there are no forms.",
    approach: [
      "Bricolage Grotesque with a highlighter effect on the key word, in leaf green and carrot orange.",
      "Volunteering and giving get equal weight, because both keep the pantry open.",
      "Impact numbers are clearly labelled as sample figures in this concept.",
    ],
    palette: ["#FFFBF3", "#2E6B3A", "#F07A2B", "#CDE8B5"],
    image: "/work/v3/lp-quernstead-food-share.webp",
    imageSize: [1200, 1512],
    card: "/work/v3/lp-quernstead-food-share-card.webp",
    mobile: "/work/v3/lp-quernstead-food-share-mobile.webp",
    demo: "/demos/quernstead-food-share/",
    stats: stats("5"),
  },
  {
    slug: "haldane-and-oat",
    brand: "Haldane & Oat",
    kind: "DTC home goods store",
    industry: "Retail & DTC",
    look: "Balanced",
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
    stats: stats("7"),
  },
  {
    slug: "northdrift-ceramics",
    brand: "Northdrift Ceramics",
    kind: "Maker shop launch",
    industry: "Retail & DTC",
    look: "Clean & simple",
    style: "Calm maker minimal",
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
    stats: stats("6"),
  },
  {
    slug: "quillbyte",
    brand: "Quillbyte",
    kind: "SaaS waitlist",
    industry: "SaaS & tech",
    look: "Clean & simple",
    style: "Focused dark product page",
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
    stats: stats("7"),
  },
  {
    slug: "fennel-and-fig",
    brand: "Fennel & Fig",
    kind: "Creator course",
    industry: "Coaching & courses",
    look: "Balanced",
    style: "Friendly creator course",
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
    stats: stats("8"),
  },
];

/** Homepage featured landing pages, one per buyer segment. */
export const featuredCases = cases.filter((c) => c.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

/** Before/after redesign concept. The "before" is deliberately dated and was made by us; both sides are fictional. */
export const redesign = {
  slug: "pipewren",
  brand: "Pipewren Plumbing",
  before: { src: "/work/v3/lp-pipewren-before-card.webp", full: "/work/v3/lp-pipewren-before.webp" },
  after: { src: "/work/v3/lp-pipewren-card.webp", demo: "/demos/pipewren/" },
};

/** Earlier flat SVG thumbnails (thumb-1 is also used in the homepage hero collage). */
export const thumbnails = [
  { file: "/work/thumbnails/thumb-1.svg", alt: "Sample thumbnail: 'I tried 5 budget mics' for a fictional tech channel" },
  { file: "/work/thumbnails/thumb-2.svg", alt: "Sample thumbnail: '30 day sourdough' for a fictional baking channel" },
  { file: "/work/thumbnails/thumb-3.svg", alt: "Sample thumbnail: 'My first $1K month' for a fictional founder channel" },
  { file: "/work/thumbnails/thumb-4.svg", alt: "Sample thumbnail: 'Alps on $40 a day' for a fictional travel channel" },
  { file: "/work/thumbnails/thumb-5.svg", alt: "Sample thumbnail: 'Stop doing this in your UI' for a fictional design channel" },
  { file: "/work/thumbnails/thumb-6.svg", alt: "Sample thumbnail: '5AM routine, honest review' for a fictional lifestyle channel" },
];

export const logos = [
  { file: "/work/logos/tidewell.svg", name: "Tidewell", note: "Swim school" },
  { file: "/work/logos/brightloom.svg", name: "Brightloom", note: "Textile studio" },
  { file: "/work/logos/cobalt-owl.svg", name: "Cobalt Owl", note: "Night-shift coffee" },
];

export type ThumbSample = {
  id: string;
  file: string;
  small?: string;
  niche: string;
  title: string;
  look: Look;
  alt: string;
  /** Homepage featured order. */
  featured?: number;
  /** A/B concept pairs share a pair id: two different takes on the same video. */
  pair?: { id: string; variant: "A" | "B"; angle: string };
  /** Caption label; defaults to "Concept · fictional channel" (e.g. "Concept · fictional game"). */
  concept?: string;
};

/** All thumbnail concepts. Every channel is fictional. */
export const thumbSamples: ThumbSample[] = [
  { id: "gaming-a", file: "/work/v3/thumb-gaming-a.webp", small: "/work/v3/thumb-gaming-a-640.webp", niche: "Gaming", title: "Beating the final boss with 1 HP", look: "Rich & detailed", featured: 1,
    pair: { id: "gaming", variant: "A", angle: "Challenge-led: the stakes in two words" },
    alt: "Gaming thumbnail concept for a fictional channel: huge yellow '1 HP' with 'No heals' and 'No armour' labels beside a purple-lit dragon in a cavern" },
  { id: "gaming-b", file: "/work/v3/thumb-gaming-b.webp", small: "/work/v3/thumb-gaming-b-640.webp", niche: "Gaming", title: "Beating the final boss with 1 HP", look: "Rich & detailed", featured: 2,
    pair: { id: "gaming", variant: "B", angle: "Curiosity-led: a close-up and a near-empty health bar" },
    alt: "Gaming thumbnail concept for a fictional channel: 'It saw me first' in white and pink beside a close-up of a glowing dragon eye, with a nearly empty health bar" },
  { id: "finance-a", file: "/work/v2/thumb-finance-stop-saving.webp", small: "/work/v2/thumb-finance-stop-saving-640.webp", niche: "Money & finance", title: "Why saving alone loses you money", look: "Rich & detailed", featured: 3,
    pair: { id: "finance", variant: "A", angle: "Bold instruction: tells the viewer what to do" },
    alt: "Finance thumbnail concept for a fictional channel: 'Stop saving. Start owning' in bold white and gold type beside a glowing stack of gold coins and a rising chart" },
  { id: "finance-b", file: "/work/v3/thumb-finance-b.webp", small: "/work/v3/thumb-finance-b-640.webp", niche: "Money & finance", title: "Why saving alone loses you money", look: "Balanced", featured: 4,
    pair: { id: "finance", variant: "B", angle: "Problem-led: a visual metaphor for the loss" },
    alt: "Finance thumbnail concept for a fictional channel: 'Your savings are leaking' next to a cracked pink piggy bank spilling coins on a teal background" },
  { id: "tech", file: "/work/v2/thumb-tech-worth-449.webp", small: "/work/v2/thumb-tech-worth-449-640.webp", niche: "Tech review", title: "Worth $449? 6 months later", look: "Balanced", featured: 5,
    alt: "Tech review thumbnail concept for a fictional channel: 'Worth $449? 6 months later' in white and orange next to unbranded graphite headphones" },
  { id: "edu", file: "/work/v3/thumb-edu.webp", small: "/work/v3/thumb-edu-640.webp", niche: "Education & explainers", title: "Why planes fly curved routes", look: "Balanced", featured: 6,
    alt: "Education thumbnail concept for a fictional channel: 'Why planes fly curved' over Earth at night, with a dashed curved route and a straight red line between two cities" },
  { id: "travel", file: "/work/v2/thumb-travel-last-road-north.webp", small: "/work/v2/thumb-travel-last-road-north-640.webp", niche: "Travel vlog", title: "The last road north", look: "Rich & detailed", featured: 7,
    alt: "Travel thumbnail concept for a fictional channel: 'The last road north' over a golden-hour fjord with a winding coastal road and a red cabin" },
  { id: "crime", file: "/work/v3/thumb-crime.webp", small: "/work/v3/thumb-crime-640.webp", niche: "True crime & documentary", title: "The missing tape (fictional case)", look: "Rich & detailed", featured: 8,
    alt: "Documentary thumbnail concept for a fictional channel and fictional case: 'The missing tape' in white and red beside an old cassette recorder circled in red on a desk of case files" },
  { id: "space", file: "/work/v3/thumb-space.webp", small: "/work/v3/thumb-space-640.webp", niche: "Faceless & AI channels", title: "What's inside a black hole?", look: "Clean & simple", featured: 9,
    alt: "Faceless science channel thumbnail concept: 'What's inside?' in white and orange next to a glowing black hole on a black starfield" },
  { id: "roblox-egg", file: "/work/v4/thumb-roblox-egg.webp", small: "/work/v4/thumb-roblox-egg-640.webp", niche: "Roblox games", title: "Hatching a 1 in 10,000 pet", look: "Rich & detailed", concept: "Concept · fictional game",
    alt: "Roblox-style video thumbnail concept for a fictional game: '1 in 10,000' and 'It hatched?!' beside a blocky avatar bursting out of a cracked rainbow egg, with a small orange dragon pet" },
  { id: "roblox-obby", file: "/work/v4/thumb-roblox-obby.webp", small: "/work/v4/thumb-roblox-obby-640.webp", niche: "Roblox games", title: "Emberspire Obby: 100 new stages", look: "Rich & detailed", concept: "Concept · fictional game",
    alt: "Roblox-style experience thumbnail concept for a fictional obby game: 'Emberspire Obby' and a '100 new stages' badge beside a blocky avatar jumping between glowing platforms over lava" },
  { id: "roblox-shark", file: "/work/v4/thumb-roblox-shark.webp", small: "/work/v4/thumb-roblox-shark-640.webp", niche: "Roblox games", title: "100 days at sea with a shark", look: "Balanced", concept: "Concept · fictional game",
    alt: "Roblox-style video thumbnail concept for a fictional survival game: 'Don't swim' and 'Day 47 / 100' beside a blocky avatar wading away from a giant blocky shark" },
  { id: "roblox-horror", file: "/work/v4/thumb-roblox-horror.webp", small: "/work/v4/thumb-roblox-horror-640.webp", niche: "Roblox games", title: "Escaping the hallway on night 5", look: "Rich & detailed", concept: "Concept · fictional game",
    alt: "Roblox-style horror thumbnail concept for a fictional game: 'He's faster' in white and red and a 'Night 5' tag as a blocky avatar runs from a shadow monster with red eyes down a green-lit school hallway" },
  { id: "kit-glitchpaw", file: "/work/v4/thumb-kit-glitchpaw.webp", small: "/work/v4/thumb-kit-glitchpaw-640.webp", niche: "Gaming", title: "1 HP left vs. the Titan boss", look: "Rich & detailed",
    alt: "Gaming thumbnail concept from the Glitchpaw channel kit (fictional channel): '1 HP' in lime and 'Left' in white with a red 'vs. Titan MK-9' tag, beside a small purple robot cat in front of a giant mech boss" },
  { id: "kit-slow-kettle", file: "/work/v4/thumb-kit-slow-kettle.webp", small: "/work/v4/thumb-kit-slow-kettle-640.webp", niche: "Food & cooking", title: "Sunday stew, 1 pot, 3 hours", look: "Balanced",
    alt: "Cooking thumbnail concept from the Slow Kettle channel kit (fictional channel): 'Sunday' in cream serif and 'Stew' in orange with a '1 pot · 3 hours' tag, beside a steaming bowl of beef and carrot stew on a dark wooden table" },
  { id: "mics", file: thumbnails[0].file, niche: "Tech review", title: "I tried 5 budget mics", look: "Clean & simple", alt: thumbnails[0].alt },
  { id: "sourdough", file: thumbnails[1].file, niche: "Food & cooking", title: "30 day sourdough", look: "Clean & simple", alt: thumbnails[1].alt },
  { id: "1k-month", file: thumbnails[2].file, niche: "Money & finance", title: "My first $1K month", look: "Clean & simple", alt: thumbnails[2].alt },
  { id: "alps", file: thumbnails[3].file, niche: "Travel vlog", title: "Alps on $40 a day", look: "Clean & simple", alt: thumbnails[3].alt },
  { id: "ui-tips", file: thumbnails[4].file, niche: "Design & creative", title: "Stop doing this in your UI", look: "Clean & simple", alt: thumbnails[4].alt },
  { id: "5am", file: thumbnails[5].file, niche: "Lifestyle", title: "5AM routine, honest review", look: "Clean & simple", alt: thumbnails[5].alt },
];

export type LogoSample = {
  id: string;
  name: string;
  industry: string;
  note: string;
  look: Look;
  file: string;
  small?: string;
  size: [number, number];
  alt: string;
  /** Full brand system board (homepage featured set). */
  system?: boolean;
  featured?: number;
};

/** Channel Launch Kit concepts: logo, banner, profile picture and one thumbnail shown together. Every channel is fictional. */
export type KitSample = {
  id: string;
  channel: string;
  niche: string;
  note: string;
  /** 1600x1200 kit board (banner, profile picture, logo and one thumbnail together). */
  board: string;
  small: string;
  /** 1280x720 preview of the 2560x1440 banner. */
  banner: string;
  /** 400x400 profile picture. */
  pfp: string;
  /** Matching thumbnail in thumbSamples. */
  thumb: string;
  alt: string;
  bannerAlt: string;
};

export const kitSamples: KitSample[] = [
  { id: "glitchpaw", channel: "Glitchpaw", niche: "Gaming channel", note: "Indie boss-fight runs", thumb: "kit-glitchpaw",
    board: "/work/v4/kit-glitchpaw-board.webp", small: "/work/v4/kit-glitchpaw-board-800.webp", banner: "/work/v4/kit-glitchpaw-banner.webp", pfp: "/work/v4/kit-glitchpaw-pfp.webp",
    alt: "Channel kit concept for Glitchpaw, a fictional gaming channel: a neon city banner with a purple robot-cat mark and the Glitchpaw wordmark, a round profile picture of the mark with a lime ring, the logo on dark, and a '1 HP left' boss-fight thumbnail",
    bannerAlt: "Glitchpaw channel banner concept (fictional channel): a purple robot-cat mark and the Glitchpaw wordmark over a rainy neon city skyline" },
  { id: "slow-kettle", channel: "Slow Kettle", niche: "Cooking channel", note: "One-pot dinners", thumb: "kit-slow-kettle",
    board: "/work/v4/kit-slow-kettle-board.webp", small: "/work/v4/kit-slow-kettle-board-800.webp", banner: "/work/v4/kit-slow-kettle-banner.webp", pfp: "/work/v4/kit-slow-kettle-pfp.webp",
    alt: "Channel kit concept for Slow Kettle, a fictional cooking channel: a cream banner with a terracotta kettle mark, the Slow Kettle serif wordmark and a stew photo, a round terracotta profile picture, the logo on cream, and a 'Sunday stew' thumbnail",
    bannerAlt: "Slow Kettle channel banner concept (fictional channel): a terracotta kettle mark, the Slow Kettle wordmark and 'One-pot dinners, low and slow' next to a photo of a bowl of stew" },
];

/** All logo concepts. Every brand is fictional. */
export const logoSamples: LogoSample[] = [
  { id: "aurivane", name: "Aurivane", industry: "Tech startups", note: "Grid battery startup", look: "Clean & simple", system: true, featured: 1,
    file: "/work/v3/logo-aurivane-system.webp", small: "/work/v3/logo-aurivane-system-800.webp", size: [1600, 1200],
    alt: "Aurivane brand system concept for a fictional energy-storage startup: monoline A with a blue vane stroke and lowercase wordmark on light and dark, a blue app icon, a dark round social avatar and a front-and-back business card" },
  { id: "osteria-fennella", name: "Osteria Fennella", industry: "Restaurants & hospitality", note: "Neighbourhood osteria", look: "Balanced", system: true, featured: 2,
    file: "/work/v3/logo-osteria-fennella-system.webp", small: "/work/v3/logo-osteria-fennella-system-800.webp", size: [1600, 1200],
    alt: "Osteria Fennella brand system concept for a fictional restaurant: round fennel-sprig stamp and heavy 'Fennella' wordmark with an italic tagline on cream and deep green, a tomato-red app icon, a green social avatar and a business card" },
  { id: "maison-orrevel", name: "Maison Orrevel", industry: "Luxury & fashion", note: "Perfume house", look: "Clean & simple", system: true, featured: 3,
    file: "/work/v3/logo-maison-orrevel-system.webp", small: "/work/v3/logo-maison-orrevel-system-800.webp", size: [1600, 1200],
    alt: "Maison Orrevel brand system concept for a fictional perfume house: a slim oval mark with a bronze diamond and a spaced serif ORREVEL wordmark on ivory and black, an app icon, a bronze social avatar and a business card" },
  { id: "vexhound", name: "Vexhound", industry: "Gaming & esports", note: "Esports team mascot", look: "Rich & detailed", system: true, featured: 4,
    file: "/work/v3/logo-vexhound-system.webp", small: "/work/v3/logo-vexhound-system-800.webp", size: [1600, 1200],
    alt: "Vexhound brand system concept for a fictional esports team: an angular violet hound-head mascot with lime eyes and a bold VEXHOUND wordmark on light and dark, an app icon, a violet social avatar and a business card" },
  { id: "ashcombe-ferrand", name: "Ashcombe Ferrand", industry: "Professional services", note: "Advisory firm", look: "Clean & simple", system: true, featured: 5,
    file: "/work/v3/logo-ashcombe-ferrand-system.webp", small: "/work/v3/logo-ashcombe-ferrand-system-800.webp", size: [1600, 1200],
    alt: "Ashcombe Ferrand brand system concept for a fictional advisory firm: a framed serif AF monogram in navy and brass with a serif wordmark on light and dark, an app icon, a brass social avatar and a business card" },
  { id: "puddlewhistle", name: "Puddlewhistle Play Club", industry: "Kids & community", note: "Weekend play club", look: "Rich & detailed", system: true, featured: 6,
    file: "/work/v3/logo-puddlewhistle-system.webp", small: "/work/v3/logo-puddlewhistle-system-800.webp", size: [1600, 1200],
    alt: "Puddlewhistle Play Club brand system concept for a fictional kids' club: a smiling blue raindrop character with a rounded wordmark on cream and navy, a yellow app icon, a navy social avatar and a business card" },
  { id: "stillmoor", name: "Stillmoor", industry: "Health & wellness", note: "Wellness retreat", look: "Clean & simple",
    file: "/work/v2/logo-stillmoor.webp", small: "/work/v2/logo-stillmoor-800.webp", size: [1600, 800],
    alt: "Stillmoor logo concept for a fictional wellness retreat: an arched doorway framing a rising sun over still water, with a spaced serif wordmark, on light and dark tiles" },
  { id: "lunebrook", name: "Lunebrook", industry: "Restaurants & hospitality", note: "Tea house", look: "Balanced",
    file: "/work/v2/logo-lunebrook.webp", small: "/work/v2/logo-lunebrook-800.webp", size: [1600, 800],
    alt: "Lunebrook logo concept for a fictional tea house: a brass crescent moon above two brook waves, with a soft serif wordmark, on light and dark tiles" },
  { id: "calm-podium", name: "The Calm Podium", industry: "Coaching & courses", note: "Speaking course", look: "Clean & simple",
    file: "/work/v3/logo-calm-podium.webp", small: "/work/v3/logo-calm-podium-800.webp", size: [1600, 800],
    alt: "The Calm Podium logo concept for a fictional speaking course: an arch over a podium line with an apricot dot, and a serif wordmark, on cream and deep green tiles" },
  { id: "smilewick", name: "Smilewick", industry: "Health & wellness", note: "Dental clinic", look: "Clean & simple",
    file: "/work/v3/logo-smilewick-dental.webp", small: "/work/v3/logo-smilewick-dental-800.webp", size: [1600, 800],
    alt: "Smilewick logo concept for a fictional dental clinic: a rounded teal tile with a smile line, and a sans-serif wordmark, on light and dark tiles" },
  { id: "kettlefin", name: "Kettlefin", industry: "Fitness", note: "Strength gym", look: "Balanced",
    file: "/work/v3/logo-kettlefin.webp", small: "/work/v3/logo-kettlefin-800.webp", size: [1600, 800],
    alt: "Kettlefin logo concept for a fictional strength gym: a kettlebell with an orange arrow and a tall condensed wordmark, on light and black tiles" },
  { id: "pipewren", name: "Pipewren", industry: "Local services", note: "Plumbing & heating", look: "Clean & simple",
    file: "/work/v3/logo-pipewren.webp", small: "/work/v3/logo-pipewren-800.webp", size: [1600, 800],
    alt: "Pipewren logo concept for a fictional plumber: a pipe bend with a copper drop in a rounded navy tile, and a bold wordmark, on white and navy tiles" },
  { id: "tidewell", name: "Tidewell", industry: "Kids & community", note: "Swim school", look: "Clean & simple", file: logos[0].file, size: [600, 600], alt: "Tidewell logo concept for a fictional swim school" },
  { id: "brightloom", name: "Brightloom", industry: "Retail & crafts", note: "Textile studio", look: "Balanced", file: logos[1].file, size: [600, 600], alt: "Brightloom logo concept for a fictional textile studio" },
  { id: "cobalt-owl", name: "Cobalt Owl", industry: "Restaurants & hospitality", note: "Night-shift coffee", look: "Balanced", file: logos[2].file, size: [600, 600], alt: "Cobalt Owl logo concept for a fictional night-shift coffee bar" },
];

export function getOffer(id: ServiceId) {
  return offers.find((o) => o.id === id)!;
}

/** Every package and package option, for JSON-LD, Terms and the /thanks/ page. */
export function allOffers() {
  return offers.flatMap((o) => [
    { id: o.id as string, name: o.name, summary: o.summary, price: o.price, unit: o.unit, turnaround: o.turnaround, includes: o.includes, stripeLink: o.stripeLink },
    ...(o.options ?? []).map((x) => ({ id: x.id, name: x.name, summary: x.summary, price: x.price, unit: x.unit, turnaround: x.turnaround, includes: x.includes, stripeLink: x.stripeLink })),
  ]);
}

/** Anything with a Stripe Payment Link: a package or one of its options (e.g. a monthly thumbnail plan). */
export type Buyable = { id: string; name: string; price: number; unit?: string; turnaround: string; stripeLink: string };

/** A package option by id, e.g. "creator-lite" or "creator-plan". */
export function getOption(id: string): OfferOption | undefined {
  return offers.flatMap((o) => o.options ?? []).find((x) => x.id === id);
}

export function formatPrice(o: { price: number; unit?: string }) {
  return `$${o.price}${o.unit ?? ""}`;
}
