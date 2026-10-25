import type { ServiceId } from "./site";

/**
 * Search-targeted service pages (/services/<slug>/). Copy is honest: every sample is a concept for a
 * fictional brand, there are no client names, reviews or results, and marketing copy stays remote and worldwide.
 */
export type SampleSet =
  | { kind: "landing"; slugs: string[] }
  | { kind: "thumbnails"; ids: string[] }
  | { kind: "logos"; ids: string[] }
  | { kind: "kits"; ids: string[] };

export type ServicePage = {
  slug: string;
  offer: ServiceId;
  /** Short label used in navigation and cards. */
  label: string;
  /** <title> (the layout template appends " | Shipday Studio"). Keep under ~45 chars. */
  metaTitle: string;
  /** Meta description, 120-160 chars. */
  metaDescription: string;
  eyebrow: string;
  h1: string;
  /** Tail of h1 shown in the accent colour, like the homepage hero ("…, shipped in 48 hours."). */
  h1Accent?: string;
  intro: string[];
  /** What the buyer gets, beyond the package checklist. */
  sections: { title: string; body: string }[];
  fit: string[];
  notIncluded: string[];
  samples: SampleSet;
  /** Show the Pipewren before/after redesign concept above the samples. */
  beforeAfter?: boolean;
  /** Extra sample groups (e.g. thumbnails and a logo on a game page). */
  extras?: { title: string; note?: string; samples: SampleSet }[];
  moreHref: string;
  /** Optional heading and intro for the samples section (defaults suit one-off packages). */
  workHeading?: string;
  workIntro?: string;
  /** One-off package option sold on this page instead of the main package (option id in site.ts), e.g. "launch-kit". */
  buy?: string;
  /** Monthly plans sold on this page (package option ids in site.ts); the first is the main call to action. */
  plans?: string[];
  /** Copy for subscription pages built on the shared layout. Without it, monthly pages use the Upkeep defaults. */
  monthlyCopy?: {
    ticks: string[];
    howHeading: string;
    emailLabel: string;
    steps: { title: string; body: string }[];
    pricingHeading: string;
    pricingIntro: string;
    whatYouGet: string;
    footerNote: string;
    ctaHeading: string;
    ctaText: string;
  };
  faq: { q: string; a: string }[];
  related: string[];
};

export const services: ServicePage[] = [
  {
    slug: "landing-page-design",
    offer: "landing",
    label: "Landing page design",
    metaTitle: "Landing page design, $390 in 48 hours",
    metaDescription:
      "Fixed-price landing page design: copy written for you, custom mobile-first design, deployed to your domain in 48h for $390. Remote, worldwide, any industry.",
    eyebrow: "Landing page design",
    h1: "A landing page that says what you do, designed and live in 48 hours.",
    h1Accent: "designed and live in 48 hours.",
    intro: [
      "One focused page: who it is for, what they get, why they should trust it, and one clear action. We write the copy, design it mobile-first, build it in clean code and deploy it to your domain.",
      "It is a fixed price of $390, paid up front through Stripe. There are no calls, no quotes and no hourly billing. Send a short brief by email and the 48-hour clock starts.",
    ],
    sections: [
      { title: "Copy written for you", body: "You send notes, links or an old site. We turn them into a headline, benefits, proof points you can actually back up, an FAQ and a call to action, in plain language your buyers use." },
      { title: "Designed for phones first", body: "Most visitors arrive on a phone. Headlines, buttons and forms are laid out for a small screen first, then scaled up for desktop." },
      { title: "Deployed to your domain", body: "We put the page live on a domain and hosting account you own. You keep the accounts and the code; nothing is locked to us." },
      { title: "Fast and accessible", body: "Static pages with real text, sensible headings and alt text, so they load quickly, read well with a screen reader and can be found by search engines." },
    ],
    fit: [
      "You are launching a product, service, course, event or local business and need one page that converts.",
      "Your current site is dated, slow or confusing and you want one clear page instead.",
      "You would rather pay a fixed price than book discovery calls and wait for a quote.",
    ],
    notIncluded: [
      "Multi-page sites, online shops, logins, dashboards or custom back-end features.",
      "Domain and hosting fees (usually small, and paid to the provider you choose).",
      "Paid ads, SEO campaigns or ongoing content. Upkeep ($49/month) covers small edits after launch.",
    ],
    samples: { kind: "landing", slugs: ["vantorel", "calm-podium", "osteria-fennella", "pipewren", "maison-orrevel", "vesperkeel"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "What do I need to send?", a: "A short email: what you sell, who it is for, the one action you want visitors to take, and any links, logo or photos you already have. Five minutes is plenty. If something is missing we ask, and the clock pauses until you reply." },
      { q: "Can you connect a form, booking tool or checkout?", a: "Yes, if it is a tool you already use that offers an embed or a link, such as a form service, a booking calendar or a payment link. We do not build custom back-end features." },
      { q: "Which industries do you design for?", a: "Any. We work remotely with businesses, creators and brands in any country and any industry. The samples on this page are concepts for fictional brands across SaaS, courses, restaurants, trades, luxury and games." },
      { q: "What if I want changes?", a: "One revision round is included: send one consolidated list of changes within 14 days of delivery. For ongoing edits after that, Upkeep is $49 a month and can be cancelled any time." },
    ],
    related: ["landing-page-price", "saas-landing-page-design", "ecommerce-landing-page-design", "local-business-website-design", "indie-game-landing-page", "website-upkeep-price"],
  },
  {
    slug: "landing-page-price",
    offer: "landing",
    label: "What $390 gets you",
    metaTitle: "What's in a $390 landing page?",
    metaDescription:
      "Landing page price, explained: what the fixed $390 covers (copy, design, build, deploy, 1 revision), what it doesn't, and how the 48 hours work.",
    eyebrow: "Landing page price, explained",
    h1: "What's in a $390 landing page, line by line.",
    h1Accent: "line by line.",
    intro: [
      "A fixed price only helps if you know exactly what it buys. This page lists everything the $390 landing page package includes, what it leaves out, and what happens between paying and going live, so you can compare it fairly with a quote or a template.",
      "Short version: one page, copy written for you, a custom mobile-first design, clean static code, deployed to a domain you own, and one revision round. Delivered within 48 hours of a complete brief.",
    ],
    sections: [
      { title: "1. The copy", body: "A headline and subheadline, benefits written in your buyers' words, a short 'how it works', an FAQ and one call to action repeated down the page. Built from your notes, links or old site. Proof sections use only things you can back up; we never invent testimonials or numbers." },
      { title: "2. The design", body: "A custom layout and type and colour choices for your brand (we work from your logo if you have one), designed for a phone screen first and then scaled up to desktop. Not a template with your name swapped in." },
      { title: "3. The build", body: "Clean static HTML and CSS with real text, proper headings, alt text, a page title and meta description. Fast to load, readable by screen readers and search engines, and easy for any developer to edit." },
      { title: "4. Going live", body: "We deploy the page to a domain and hosting account in your name and connect your existing form, booking calendar or payment link if you use one. You keep the accounts and the files." },
      { title: "5. One revision round", body: "After delivery, send one consolidated list of changes within 14 days and we apply it. After that, small edits are covered by Upkeep at $49 a month, which you can cancel any time." },
      { title: "6. How the price stays fixed", body: "One page, one scope, no calls, no hourly billing. Production runs on an AI-assisted workflow and every page is quality-checked before delivery, with a revision round included, which is what keeps the price and the 48 hours predictable." },
    ],
    fit: [
      "You need one page that explains an offer and asks for one action, and you want to know the full cost before you start.",
      "You have been quoted for discovery calls and multi-week timelines for what is really one page.",
      "You would rather own clean code on your own hosting than rent a page builder subscription.",
    ],
    notIncluded: [
      "Extra pages, a blog, an online shop, logins or anything that needs a back end. These need a custom quote elsewhere; we don't sell them.",
      "Domain registration and hosting fees, which you pay to the provider (many static hosts have free plans).",
      "A logo (that's the separate $149 logo pack), photography, paid ads or ongoing SEO work.",
    ],
    samples: { kind: "landing", slugs: ["vantorel", "osteria-fennella", "calm-podium"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Are there any extra costs after the $390?", a: "Only what third parties charge you directly: your domain registration and any hosting plan you choose. There are no add-ons from us unless you choose Upkeep ($49 a month) for edits after the revision round." },
      { q: "What exactly happens in the 48 hours?", a: "The clock starts once payment is confirmed and your brief is complete. We write the copy, design and build the page, review it, deploy it and email you the live link. If something is missing from the brief, we ask by email and the clock pauses until you reply." },
      { q: "How many sections does the page have?", a: "Usually five to seven: a hero with the main action, benefits or features, how it works, proof you can back up, the offer or pricing, an FAQ and a closing call to action. The exact mix depends on what you sell." },
      { q: "What if I change my mind before you start?", a: "If we haven't started work yet, you can cancel for a full refund through Stripe. Once work has started, the revision round is how changes are handled. Full details are in the terms." },
      { q: "Why is it cheaper than an agency?", a: "Because the scope is deliberately small and fixed: one page, no meetings, an AI-assisted workflow, a quality check before delivery, and one revision round. If you need a multi-page site, strategy workshops or a long-term partner, an agency is the better fit." },
    ],
    related: ["landing-page-design", "website-redesign", "saas-landing-page-design", "ecommerce-landing-page-design", "logo-design-price", "youtube-thumbnail-price", "website-upkeep-price"],
  },
  {
    slug: "saas-landing-page-design",
    offer: "landing",
    label: "SaaS landing pages",
    metaTitle: "SaaS landing page design, fixed $390",
    metaDescription:
      "SaaS and startup landing page design: clear positioning, product UI built in code, early-access or demo CTA. $390, live in 48h. Remote, any country.",
    eyebrow: "For SaaS, AI and dev-tool startups",
    h1: "A SaaS landing page that explains the product in one scroll.",
    h1Accent: "in one scroll.",
    intro: [
      "Early-stage products lose visitors when the homepage is vague. We write and design a launch page that names the problem, shows the product, explains how it works in three steps and asks for one action: join the waitlist, book a demo or start a trial.",
      "Fixed price, $390, delivered in 48 hours and deployed to your domain. Built as fast static code, so you can hand it to your developers or keep it as is.",
    ],
    sections: [
      { title: "Positioning before pixels", body: "We start from the job your product does and who pays for it, then write a headline a buyer would repeat. 'The all-in-one platform' becomes what it actually does." },
      { title: "Product UI, not stock art", body: "Where it helps, the product preview is built in HTML from your screenshots or descriptions, so it stays sharp on every screen and is easy to update when the product changes." },
      { title: "Proof you can back up", body: "No invented logos or testimonials. If you have beta users, integrations or a security page, we feature them. If not, the page leaves room to add real proof later." },
      { title: "One clear call to action", body: "Waitlist, demo or trial: one primary action repeated through the page, with a secondary link for people who want detail." },
    ],
    fit: [
      "Pre-launch or early-access SaaS, AI tools, APIs and developer tools.",
      "B2B products that need a credible homepage for investors, partners or first customers.",
      "Founders who want the time back, not another side project.",
    ],
    notIncluded: [
      "App screens, dashboards or product UX design.",
      "Docs sites, blogs or multi-page marketing sites.",
      "Pricing calculators, logins or anything that needs a back end.",
    ],
    samples: { kind: "landing", slugs: ["vantorel", "quillbyte"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Can you work from a Figma file or an existing site?", a: "Yes. Send whatever you have: a deck, a Notion doc, screenshots or an old landing page. We rewrite and redesign from there." },
      { q: "Will my developers be able to edit it?", a: "Yes. It is clean, framework-free or lightweight static code, deployed to hosting you own. You get the files." },
      { q: "Do you write the copy in English only?", a: "Copy is written in English by default. If you need another language, mention it in the brief and we will tell you before starting whether we can deliver it to the same standard." },
    ],
    related: ["landing-page-design", "logo-design", "coach-landing-page-design"],
  },
  {
    slug: "coach-landing-page-design",
    offer: "landing",
    label: "Coach & course pages",
    metaTitle: "Landing pages for coaches and courses",
    metaDescription:
      "Sales page design for coaches, consultants and course creators: a clear promise, who it's for, your offer and one booking action. $390, live in 48h.",
    eyebrow: "For coaches, consultants and course creators",
    h1: "A calm, credible sales page for your coaching offer or course.",
    h1Accent: "for your coaching offer or course.",
    intro: [
      "People buy coaching when they recognise themselves on the page. We write a page around one promise, a clear 'who this is for', what happens week by week, the price and your refund terms, then one action: book a call, apply or reserve a seat.",
      "No hype, no fake countdown timers, no invented testimonials. $390 fixed, delivered in 48 hours and deployed to your domain.",
    ],
    sections: [
      { title: "A promise in plain words", body: "A headline your ideal client would say out loud, followed by the outcome, the format and the commitment it takes." },
      { title: "Who it is for, and who it is not", body: "A short self-check that filters out poor-fit enquiries and makes the right people feel seen." },
      { title: "Your offer, laid out", body: "Sessions, modules or cohort dates, what is included, the price and your refund window, visible without hunting." },
      { title: "Works with your tools", body: "We link or embed the booking calendar, form or payment link you already use." },
    ],
    fit: [
      "Coaches, therapists, consultants, trainers and course creators.",
      "Workshops, cohorts, memberships and one-to-one programmes.",
      "Anyone moving from 'DM me for details' to a page that sells on its own.",
    ],
    notIncluded: [
      "Course platforms, member areas or video hosting.",
      "Email marketing sequences or funnels across several pages.",
      "Professional photography (we design around the photos you have, or use abstract imagery).",
    ],
    samples: { kind: "landing", slugs: ["calm-podium", "fennel-and-fig", "kettlefin-strength", "halvenna-studio"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "I don't have testimonials yet. Is that a problem?", a: "No. We never invent them. The page leans on a clear promise, your approach, what is included and an honest refund policy, and leaves a section ready for real testimonials when you have them." },
      { q: "Can visitors book or pay on the page?", a: "Yes, through the tools you already use: a booking calendar link or embed, a form, or a payment link from your payment provider." },
      { q: "I don't have professional photos.", a: "That's fine. We can design with abstract imagery, typography and colour, as in the course concept on this page, and swap in photos later." },
    ],
    related: ["landing-page-design", "logo-design", "local-business-website-design"],
  },
  {
    slug: "ecommerce-landing-page-design",
    offer: "landing",
    label: "E-commerce & DTC landing pages",
    metaTitle: "E-commerce and DTC landing page design, $390",
    metaDescription:
      "E-commerce landing page design for DTC and Shopify brands: product hero, colourways, bestsellers and Shop buttons to your store. $390 fixed, live in 48h.",
    eyebrow: "For DTC, Shopify and online product brands",
    h1: "A product landing page that makes your bestseller easy to buy.",
    h1Accent: "easy to buy.",
    intro: [
      "Marketplace listings and stock store themes tend to look alike. We design one focused page around your product: a hero that shows it in use, the details that decide the purchase (colours, sizes, materials, care), your bestsellers, and buttons that go straight to the product pages or checkout you already have.",
      "For brands selling on Shopify, WooCommerce, Etsy, Squarespace or a payment link, anywhere in the world: $390 fixed, deployed to your domain within 48 hours. It's one page that sends buyers to your store, not a new store.",
    ],
    sections: [
      { title: "The product in the first screen", body: "A headline, one image of the product in use and the main Shop button above the fold, with a 'from' price so buyers know where they stand before they scroll." },
      { title: "The details that decide the sale", body: "Colourways as swatches, sizes, materials and care in plain words: the questions shoppers ask before they buy, answered on the page instead of in your inbox." },
      { title: "Shop buttons wired to your store", body: "Every button links to a product page, collection, cart link or checkout your platform already provides. Your store keeps handling stock, payments and shipping." },
      { title: "A brand look, not a stock theme", body: "Type, colour and layout taken from your product and packaging, from warm and tactile to quiet editorial luxury, built as a fast static page with real text search engines can read." },
    ],
    fit: [
      "DTC brands launching a product, a new colourway or a seasonal drop that needs its own page.",
      "Shops moving off marketplaces that want a branded front page pointing to their store.",
      "Small brands and makers whose store theme looks like everyone else's and doesn't tell the product story.",
      "Brands running ads, creator or newsletter campaigns that need one focused page to send traffic to.",
    ],
    notIncluded: [
      "Building, migrating or theming a store: product catalogue, cart, checkout, inventory, payments or a Shopify theme. We link to the store you already run.",
      "Product photography: we design with your photos, or clearly placeholder imagery until you have them.",
      "Paid ads, email flows or SEO campaigns. Upkeep ($49/month) covers small edits after launch.",
    ],
    samples: { kind: "landing", slugs: ["haldane-and-oat", "maison-orrevel", "northdrift-ceramics"] },
    extras: [
      {
        title: "Brand logo concept",
        note: "Logos are a separate $149 pack, shown because new product brands often order both. The textile studio is fictional.",
        samples: { kind: "logos", ids: ["brightloom"] },
      },
    ],
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Do you build my Shopify store?", a: "No. This is one landing page that sends buyers to the store you already run on Shopify, WooCommerce, Etsy, Squarespace or similar. Your store keeps the catalogue, cart, payments and shipping. We don't build, migrate or theme stores." },
      { q: "Where does the page live?", a: "On a domain or subdomain you own: your main domain if the store sits elsewhere, or a campaign address such as launch.yourbrand.com. We deploy it to hosting in your name, so you keep the accounts and the code. A version built as a Shopify theme section or template isn't included." },
      { q: "Can visitors buy straight from the page?", a: "Buttons can go to a product page, a pre-filled cart link or a checkout or payment link your platform provides, and we can place your platform's buy-button embed if it offers one. We don't build a cart of our own." },
      { q: "What do I need to send?", a: "Product names, prices and links to the product pages, a few photos, and a line on who buys it and why. Packaging, brand colours or an old site help with the look. If something is missing we ask, and the clock pauses until you reply." },
      { q: "Is Haldane & Oat a real brand?", a: "No. It's a concept for a fictional linen bedding label, made to show the approach: colourway swatches from the first screen, a bestseller row, a materials story and care instructions. Its prices are illustrative. Maison Orrevel and Northdrift Ceramics are fictional brands too." },
    ],
    related: ["landing-page-design", "landing-page-price", "logo-design", "website-redesign"],
  },
  {
    slug: "local-business-website-design",
    offer: "landing",
    label: "Local business websites",
    metaTitle: "Local business website design, $390",
    metaDescription:
      "One-page websites for restaurants, trades, clinics, gyms and shops: services, prices, hours, area and online booking up front. $390 fixed, live in 48h.",
    eyebrow: "For restaurants, trades, clinics, gyms and shops",
    h1: "A one-page website that gets local customers to book, call or visit.",
    h1Accent: "book, call or visit.",
    intro: [
      "Local customers want four things fast: what you do, roughly what it costs, when you are open and how to book. We build a single, fast page around exactly that, with the main action on the first screen.",
      "Whether you run a restaurant, a plumbing firm, a dental clinic or a studio anywhere in the world, it is the same fixed price: $390, live on your domain in 48 hours.",
    ],
    sections: [
      { title: "Booking on the first screen", body: "Table booking, a quote request, a call button or a link to your booking system, placed where people see it before they scroll." },
      { title: "Prices and hours as real text", body: "Menus, 'from' prices, opening hours and service areas written as text, so they are readable on any phone and can be picked up by search engines and maps." },
      { title: "Redesigns welcome", body: "Send us your old site. We keep what works, cut the clutter and rebuild it as one clear page. See the before-and-after plumbing concept below." },
      { title: "Yours to keep", body: "Deployed to a domain and hosting you own. Upkeep is optional at $49 a month for menu changes, new photos and seasonal hours." },
    ],
    fit: [
      "Restaurants, cafés, bakeries and bars.",
      "Trades and home services, clinics and practices, gyms and studios, salons and shops.",
      "Local non-profits and community groups.",
    ],
    notIncluded: [
      "Online shops with carts and stock management.",
      "Building a booking or ordering system (we connect the one you already use).",
      "Managing your map listings or review profiles.",
    ],
    beforeAfter: true,
    samples: { kind: "landing", slugs: ["osteria-fennella", "smilewick-dental", "kettlefin-strength", "quernstead-food-share", "halvenna-studio"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Can you add my menu or price list?", a: "Yes. Send it as a PDF, photo or text and we set it as real text on the page. With Upkeep, we update it whenever it changes." },
      { q: "Do I need a domain already?", a: "No. If you don't have one, we tell you how to register one in your own name (usually a small yearly fee to the registrar), then deploy the page to it." },
      { q: "Will it show up on Google?", a: "The page is built with proper titles, descriptions, headings and structured text, which is what search engines read. Rankings depend on many things we don't control, so we don't promise positions." },
    ],
    related: ["website-redesign", "restaurant-website-design", "dental-website-design", "gym-website-design", "nonprofit-website-design", "website-upkeep-price"],
  },
  {
    slug: "website-redesign",
    offer: "landing",
    label: "Website redesign",
    metaTitle: "Website redesign as one clear page, $390",
    metaDescription:
      "Website redesign for a dated or cluttered site: we keep what works, rewrite the copy and rebuild it as one fast, mobile-first page. $390 fixed, live in 48h.",
    eyebrow: "Website redesign",
    h1: "Turn a dated website into one clear page that gets people to act.",
    h1Accent: "gets people to act.",
    intro: [
      "Most old sites don't fail because of the colours. They fail because the visitor can't tell in five seconds what you offer, what it costs and what to do next. We read your current site, keep the content that works, cut the rest and rebuild it as one focused, mobile-first page.",
      "Send the link to your current site. For a fixed $390 we rewrite the copy, design and build the new page, and deploy it to your domain within 48 hours.",
    ],
    sections: [
      { title: "An honest audit first", body: "We list what the old site does well (real reviews you already have, clear service names, photos) and what gets in the way: walls of text, 'call for prices', buried contact details, slow image sliders." },
      { title: "Copy rewritten, not just restyled", body: "The headline says what you do and for whom. Prices, service areas and the main action move to the top, in plain language, as real text." },
      { title: "Your domain, no downtime surprises", body: "We deploy the new page to hosting you own and point your domain at it when you're ready. Email records stay untouched, so your mailboxes keep working." },
      { title: "From many pages to one", body: "Five thin pages often work better as one strong one. Old pages like 'About' or 'Services' become sections, and anything you still need can link out to existing pages." },
    ],
    fit: [
      "Your site looks dated on phones, loads slowly or was built years ago in a page builder.",
      "Visitors call or email to ask questions the site should already answer.",
      "You want a modern page without migrating a whole multi-page site or CMS.",
    ],
    notIncluded: [
      "Migrating blogs, online shops or large multi-page sites (the package is one page).",
      "Moving or rebuilding your email setup, CMS or booking system (we link to the ones you use).",
      "Recovering old content from a site you no longer have access to.",
    ],
    beforeAfter: true,
    samples: { kind: "landing", slugs: ["smilewick-dental", "kettlefin-strength", "halvenna-studio"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Do I lose my current site?", a: "Not until you decide. We build the new page on your hosting first, send you the link, and only switch your domain over once you approve it. Your old site files stay wherever they are now." },
      { q: "Will a redesign hurt my search rankings?", a: "We keep the important text, titles and headings, and use proper meta descriptions and structured text, which helps search engines understand the page. If old pages had their own traffic, tell us and we will advise on keeping or redirecting them. We can't promise rankings." },
      { q: "My site has ten pages. Can it really be one?", a: "Often, yes, for a small business: services, prices, about, area and contact fit well as sections of one page. If you truly need several pages, this package isn't the right fit and we will say so before you pay." },
      { q: "Can you keep my logo and colours?", a: "Yes. Send them and we design around them. If the logo itself needs a refresh, the logo pack is $149 and can be ordered separately." },
    ],
    related: ["local-business-website-design", "landing-page-price", "logo-design"],
  },
  {
    slug: "restaurant-website-design",
    offer: "landing",
    label: "Restaurant websites",
    metaTitle: "Restaurant website design, $390 fixed",
    metaDescription:
      "Restaurant website design: menu with prices, hours, location and table booking on the first screen, as one fast mobile page. $390, live in 48h, any cuisine.",
    eyebrow: "For restaurants, cafés and bars",
    h1: "A restaurant website where guests can see the menu and book in a few taps.",
    h1Accent: "book in a few taps.",
    intro: [
      "Guests usually look you up on a phone, often standing outside or deciding between two places. They want tonight's menu with prices, your opening hours, where you are, and a way to book. We build one fast page that answers all four on the first screens, in the mood of your room.",
      "Cafés, bistros, bars, bakeries, food trucks and fine dining, in any city: $390 fixed, deployed to your domain within 48 hours.",
    ],
    sections: [
      { title: "Booking up front", body: "Your table-booking tool, a reservation request form or a call button placed on the first screen, so a hungry visitor doesn't have to scroll." },
      { title: "The menu as real text", body: "No blurry menu PDFs. Dishes and prices are set as text, readable on any phone and picked up by search engines. Send a photo or PDF of your menu and we type it in." },
      { title: "Hours, address and groups", body: "Opening hours, a map link, access notes, private dining or group bookings and dietary information, each where guests look for it." },
      { title: "A look that matches the room", body: "Type, colour and photography that feel like your place, whether it's a candlelit trattoria, a bright brunch café or a late-night bar." },
    ],
    fit: [
      "Independent restaurants, cafés, bars, bakeries and food trucks.",
      "Places relying on a social profile or a menu PDF instead of a real website.",
      "Owners who want to update the menu without learning a page builder (Upkeep covers menu changes for $49 a month).",
    ],
    notIncluded: [
      "Online ordering, delivery or a booking system of our own (we connect the reservation or ordering tool you already use).",
      "Food photography (we design around your photos, or use atmospheric imagery until you have them).",
      "Managing your map listing, delivery-app profiles or reviews.",
    ],
    samples: { kind: "landing", slugs: ["osteria-fennella"] },
    extras: [
      {
        title: "Restaurant and café logo concepts",
        note: "Logos are a separate $149 pack, shown here because many restaurants order both. All brands are fictional.",
        samples: { kind: "logos", ids: ["osteria-fennella", "lunebrook", "cobalt-owl"] },
      },
    ],
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Which booking tools can you connect?", a: "Any reservation or ordering service that gives you a booking link or an embed code. We place it on the page; we don't build a booking system ourselves." },
      { q: "How do menu changes work?", a: "One round of changes is included within 14 days of delivery. After that, Upkeep ($49 a month, cancel any time) covers menu and price updates, seasonal hours and new photos." },
      { q: "Can the page be in my local language?", a: "Copy is written in English by default. If you need another language, or two, mention it in the brief and we'll confirm before starting whether we can deliver it to the same standard." },
      { q: "Is the Osteria Fennella sample a real restaurant?", a: "No. It's a concept for a fictional restaurant, made to show the approach: booking first, menu as text, hours and group dining. You can see the full design and scroll it on your phone." },
    ],
    related: ["local-business-website-design", "logo-design", "website-redesign", "website-upkeep-price"],
  },
  {
    slug: "wedding-photographer-website-design",
    offer: "landing",
    label: "Wedding photographer websites",
    metaTitle: "Wedding photographer website design, $390",
    metaDescription:
      "Website design for wedding and elopement photographers: a portfolio-led page with packages, starting prices and a check-your-date enquiry. $390, live in 48h.",
    eyebrow: "For wedding and elopement photographers",
    h1: "A wedding photography website that lets your photos lead and your dates fill.",
    h1Accent: "your dates fill.",
    intro: [
      "Couples decide with their eyes first, then look for three answers: does this feel like us, roughly what does it cost, and are you free on our date. We design one calm, image-led page around your best work, your packages with starting prices, and a single 'check your date' enquiry.",
      "It's a fixed $390, written, designed and deployed to your domain within 48 hours, for photographers working anywhere in the world.",
    ],
    sections: [
      { title: "Your photos carry the page", body: "A hero built around one photo you choose, then a short curated strip of your favourite frames. Images are resized and compressed for phones, so the page stays fast without looking soft." },
      { title: "Packages with starting prices", body: "Elopement, full day, albums or add-ons, each with a 'from' price. Couples outside your range self-filter, so the enquiries you get are from people who already fit." },
      { title: "A short enquiry, not a long form", body: "Date, location and a line about their day, linked to the form or client-management tool you already use. A short line on when you reply sets expectations." },
      { title: "A voice that sounds like you", body: "A philosophy line and an about section written from your notes, in your tone, whether that's quiet and editorial, documentary or joyful and loud." },
    ],
    fit: [
      "Wedding, elopement, engagement and family photographers, and wedding videographers.",
      "Photographers whose portfolio lives on social media or a slow gallery template.",
      "Small studios taking a limited number of weddings a year who want fewer, better-fitting enquiries.",
    ],
    notIncluded: [
      "Client galleries, proofing, print sales or a booking and contract system (we link to the ones you use).",
      "A multi-page portfolio or blog: the package is one page with a curated selection of your images.",
      "Photo editing or retouching. We use your images as supplied.",
    ],
    samples: { kind: "landing", slugs: ["halvenna-studio"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "How many photos can the page show?", a: "Usually one hero image and a strip or grid of six to twelve favourites. A tight selection shows your style better than a full archive and keeps the page fast. For full galleries, we link to the gallery service you already use." },
      { q: "Can couples check my availability on the page?", a: "Yes, through your existing tools: a contact form, a client-management enquiry form or a booking link. We place it as the main action; we don't build an availability calendar ourselves." },
      { q: "Should I show prices?", a: "We recommend 'from' prices for each package, as in the Halvenna concept, because it saves both sides time. It's your call: we can also write a 'collections start at' line instead." },
      { q: "Is Halvenna Studio a real photographer?", a: "No. It's a concept for a fictional wedding photographer, made to show the approach: one photo-led hero, packages with starting prices and a single date-check enquiry. You can see the full design and scroll it on your phone." },
    ],
    related: ["coach-landing-page-design", "logo-design", "website-redesign"],
  },
  {
    slug: "dental-website-design",
    offer: "landing",
    label: "Dental clinic websites",
    metaTitle: "Dental clinic website design, $390 fixed",
    metaDescription:
      "Dental website design: online booking on the first screen, treatments, clear prices, opening hours and help for nervous patients. $390 fixed, live in 48h.",
    eyebrow: "For dental clinics and practices",
    h1: "A dental clinic website that puts nervous patients at ease and gets them booked.",
    h1Accent: "gets them booked.",
    intro: [
      "Most people put off the dentist, and a confusing website gives them one more reason to. Patients want to know what you treat, what a visit costs, when you're open and how to book without phoning. We design one calm, clear page that answers all of that, with booking on the first screen.",
      "Independent practices, small group clinics and specialists, in any country: $390 fixed, deployed to your domain within 48 hours.",
    ],
    sections: [
      { title: "Booking before the scroll", body: "Your online booking system, a request form or a call button placed in the hero and repeated down the page. If your booking tool offers an embed, we can surface it right there." },
      { title: "Prices people don't have to ask for", body: "New-patient exams, hygiene visits and common treatments shown with plain 'from' prices, plus payment options if you offer them. Cost is the question many patients never ask out loud." },
      { title: "A section for nervous patients", body: "What a first visit looks like, longer appointments, signals to pause, sedation if you offer it: written calmly, in the words patients actually use." },
      { title: "Clear, accessible and fast", body: "Readable type, strong contrast, real headings and alt text, with opening hours, address and emergency information as text that phones, screen readers and search engines can read." },
    ],
    fit: [
      "Independent dental practices, hygiene clinics, orthodontists and cosmetic dentists.",
      "Clinics whose current site hides prices or only says 'call to book'.",
      "Practices adding evening or weekend hours who want new patients to find them.",
    ],
    notIncluded: [
      "Patient portals, medical-history forms or storing patient data (we link to your practice software or booking tool).",
      "Before-and-after treatment photos or clinical claims we can't verify. You confirm that the page meets the advertising rules for dental professionals where you practise.",
      "Multi-location sites, blogs or ongoing SEO work.",
    ],
    samples: { kind: "landing", slugs: ["smilewick-dental"] },
    extras: [
      {
        title: "Dental clinic logo concept",
        note: "Logos are a separate $149 pack, shown here because new clinics often need both. The clinic is fictional.",
        samples: { kind: "logos", ids: ["smilewick"] },
      },
    ],
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Can patients book online from the page?", a: "Yes, through the booking or practice-management tool you already use, as a link or an embed. We don't build a booking system or handle patient records." },
      { q: "Do I have to publish prices?", a: "No, but we recommend at least 'from' prices for check-ups and hygiene visits. If you'd rather not, we write a clear line on how fees are explained before treatment starts." },
      { q: "Can you write about treatments for me?", a: "Yes, short plain-language descriptions from your notes. You review every word before it goes live, because you know the rules on health advertising in your country and we don't give clinical advice." },
      { q: "Is Smilewick Dental a real clinic?", a: "No. It's a concept for a fictional two-chair clinic, made to show the approach: next free slots on the hero, three treatments, prices up front and a booking call to action. You can see the full design and scroll it on any screen." },
    ],
    related: ["local-business-website-design", "website-redesign", "logo-design"],
  },
  {
    slug: "gym-website-design",
    offer: "landing",
    label: "Gym & fitness websites",
    metaTitle: "Gym and fitness studio website design, $390",
    metaDescription:
      "Gym and fitness studio website design: class types, a phone-readable timetable, prices and a free-trial booking on the first screen. $390 fixed, live in 48h.",
    eyebrow: "For gyms, boxes and fitness studios",
    h1: "A gym website that feels like your room and books the first class.",
    h1Accent: "books the first class.",
    intro: [
      "People shopping for a gym want to know what kind of place it is, which classes suit a beginner, when they run, what it costs and how to try it. We design one bold, fast page around exactly that, with your trial offer as the main action.",
      "Strength gyms, CrossFit-style boxes, yoga, pilates, boxing and martial arts studios, anywhere in the world: $390 fixed, live on your domain in 48 hours.",
    ],
    sections: [
      { title: "The trial offer up front", body: "A free class, intro week or first-session offer in the hero and repeated down the page, linked to the booking or membership software you already use." },
      { title: "A timetable you can read on a phone", body: "The weekly schedule as a real, scrollable table rather than a screenshot, so it's sharp on any screen, readable by search engines and easy to update." },
      { title: "Classes explained for beginners", body: "Each class type in two lines: who it's for, what happens and how hard it is. It answers the 'am I fit enough?' worry that stops many first visits." },
      { title: "A look with energy", body: "Type, colour and imagery that match your room, from loud, high-contrast strength gyms to calm, light yoga studios." },
    ],
    fit: [
      "Independent gyms, strength and conditioning clubs, boxes, and yoga, pilates, boxing or martial arts studios.",
      "Personal trainers and small-group coaches with a regular schedule.",
      "Gyms relying on a social profile or a membership-app listing instead of their own website.",
    ],
    notIncluded: [
      "Membership management, class booking or payments of our own (we connect the gym software you already use).",
      "Workout programming, nutrition content or health claims.",
      "Photography or video shoots: we design with your photos or atmospheric imagery until you have them.",
    ],
    samples: { kind: "landing", slugs: ["kettlefin-strength"] },
    extras: [
      {
        title: "Gym logo concept",
        note: "Logos are a separate $149 pack, shown because new gyms often order both. The gym is fictional.",
        samples: { kind: "logos", ids: ["kettlefin"] },
      },
    ],
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Can people book a class from the page?", a: "Yes, by linking or embedding the booking or membership software you already use. We place it on the first screen; we don't build a booking system." },
      { q: "How do timetable changes work?", a: "One round of changes is included within 14 days of delivery. After that, Upkeep ($49 a month, cancel any time) covers timetable, price and photo updates, or you can edit the files yourself." },
      { q: "Should I show membership prices?", a: "We recommend at least a starting price or a 'from' figure next to the trial offer, because it filters enquiries. If prices vary too much, we write a clear line on how memberships work." },
      { q: "Is Kettlefin Strength a real gym?", a: "No. It's a concept for a fictional small-group strength gym, made to show the approach: one free-class offer, three class types and a real timetable table. You can see the full design and scroll it on your phone." },
    ],
    related: ["local-business-website-design", "coach-landing-page-design", "logo-design", "website-upkeep-price"],
  },
  {
    slug: "nonprofit-website-design",
    offer: "landing",
    label: "Nonprofit & charity websites",
    metaTitle: "Nonprofit and charity website design, $390",
    metaDescription:
      "Nonprofit and charity website design: a clear mission, ways to volunteer, a giving block linked to your donation tool and accessible copy. $390 fixed, in 48h.",
    eyebrow: "For nonprofits, charities and community groups",
    h1: "A nonprofit website that turns visitors into volunteers and regular donors.",
    h1Accent: "volunteers and regular donors.",
    intro: [
      "Small charities often have a website that's out of date, hard to update or written for the board rather than the people who could help. We design one warm, clear page that says what you do in a sentence, shows the ways to help, and makes giving and signing up easy.",
      "Food banks, community groups, shelters, clubs and causes in any country: $390 fixed, deployed to your domain within 48 hours.",
    ],
    sections: [
      { title: "Your mission in one line", body: "A headline anyone can repeat, followed by who you help and how. Jargon and acronyms stay out of the first screen." },
      { title: "Ways to help, side by side", body: "Volunteer shifts, giving and spreading the word, each with one button. Volunteering and donating get equal weight, because both keep the doors open." },
      { title: "Giving through your own provider", body: "Suggested amounts and a monthly option, linked to the donation platform or payment page you already use. Donations go straight to you; we never handle the money." },
      { title: "Accessible and honest by default", body: "Plain language, strong contrast, real headings, alt text and keyboard-friendly buttons. Impact figures appear only if they're real and you can back them up." },
    ],
    fit: [
      "Charities, food banks, shelters, community groups, clubs and grassroots causes.",
      "Volunteer-run organisations without a web person, whose site is hard to update.",
      "Campaigns or appeals that need one clear page to share.",
    ],
    notIncluded: [
      "Processing donations, Gift Aid or tax receipts (we link to the donation provider you use).",
      "Volunteer databases, member logins, event ticketing or multi-page sites with news archives.",
      "A formal accessibility audit or compliance certificate. We build to good accessibility practice, but we don't certify it.",
    ],
    samples: { kind: "landing", slugs: ["quernstead-food-share"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Do you offer a nonprofit discount?", a: "The price is the same fixed $390 for everyone, which is already a small fraction of a typical agency quote. There are no extra fees from us after delivery unless you choose Upkeep." },
      { q: "Can people donate on the page?", a: "Yes, through your existing donation platform or payment link, as a button or an embed. We design the giving block with suggested amounts and a monthly option; the money goes straight to you." },
      { q: "We don't have impact numbers yet. Is that a problem?", a: "No. We never invent figures. The page can lead with your mission, what a volunteer shift or a donation actually does, and leave a section ready for real numbers. The Quernstead concept labels its figures as samples for exactly this reason." },
      { q: "Is Quernstead Food Share a real charity?", a: "No. It's a concept for a fictional volunteer-run food share, made to show the approach: a one-line mission, three ways to help and a monthly giving block. You can see the full design and scroll it on any screen." },
    ],
    related: ["local-business-website-design", "landing-page-design", "logo-design"],
  },
  {
    slug: "indie-game-landing-page",
    offer: "landing",
    label: "Indie game landing pages",
    metaTitle: "Indie game landing page, $390 in 48h",
    metaDescription:
      "Landing page for indie games: key art, trailer, wishlist and playtest sign-up, pillars and roadmap on one fast page. $390 fixed, live in 48h, for any engine.",
    eyebrow: "For indie game studios and solo developers",
    h1: "A game landing page that turns trailer views into wishlists.",
    h1Accent: "into wishlists.",
    intro: [
      "Your store page has a fixed layout. Your own site doesn't. We design one page around your key art and trailer, with the wishlist and playtest buttons where players see them first, then three gameplay pillars, a media grid, a roadmap and a press section.",
      "It's a fixed $390, deployed to your domain within 48 hours: a home for your game that you can link from trailers, socials, festival listings and press emails.",
    ],
    sections: [
      { title: "Key art does the selling", body: "The headline sits inside your art, not on top of it, and the composition is reworked for phones so the art isn't cropped away on a small screen." },
      { title: "Wishlist and playtest first", body: "Primary buttons link to your store pages (for example Steam or itch.io) and to your playtest or newsletter sign-up form, repeated down the page." },
      { title: "Pillars, media and roadmap", body: "Three short gameplay pillars, a screenshot and GIF grid, an embedded trailer, and a public roadmap or devlog link so players can follow progress." },
      { title: "A press corner", body: "A short fact block, a contact address and a link to your press kit, so journalists and creators find what they need fast." },
    ],
    fit: [
      "Indie studios and solo developers before early access, a demo festival or launch.",
      "Games that only have a store page and a social account today.",
      "Publishers and small labels that need a quick page for a new title.",
    ],
    notIncluded: [
      "Making key art, trailers, GIFs or capsule art (we design with the assets you send).",
      "Store page setup, capsule images or press kit writing.",
      "Using platform logos or trademarks you don't have permission to use.",
    ],
    samples: { kind: "landing", slugs: ["vesperkeel"] },
    extras: [
      {
        title: "Gaming thumbnail concepts",
        note: "Thumbnails are a separate pack (4 for $79), shown because game teams often need them for devlogs and trailers on YouTube. Every game and channel is fictional.",
        samples: { kind: "thumbnails", ids: ["gaming-a", "gaming-b"] },
      },
      {
        title: "Esports team logo concept",
        note: "Logos are a separate $149 pack. The team is fictional.",
        samples: { kind: "logos", ids: ["vexhound"] },
      },
    ],
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "What should I send?", a: "Your key art (as large as you have), the trailer link, a few screenshots or GIFs, your store and sign-up links, the game's one-line pitch and any press kit. We write the rest of the copy from your notes." },
      { q: "Is the Vesperkeel sample a real game?", a: "No. Vesperkeel and its studio are fictional, made to show the approach. You can see the full design to check how the page works on a phone." },
      { q: "Can the page collect playtest sign-ups?", a: "Yes, by linking or embedding the form or newsletter tool you already use. We don't run a mailing list for you." },
      { q: "Can I update the roadmap later?", a: "Yes. You get the files and can edit them, or Upkeep ($49 a month, cancel any time) covers small updates like new screenshots, dates and roadmap items." },
    ],
    related: ["landing-page-design", "youtube-thumbnail-design", "logo-design", "website-upkeep-price"],
  },
  {
    slug: "youtube-thumbnail-design",
    offer: "thumbnails",
    label: "YouTube thumbnail design",
    metaTitle: "YouTube thumbnail design pack, 4 for $79",
    metaDescription:
      "YouTube thumbnail design: a pack of 4 custom 1280×720 thumbnails with bold, phone-readable titles and source files, delivered in 24h for $79. Any niche.",
    eyebrow: "YouTube thumbnail design",
    h1: "Four YouTube thumbnails, built to be read at phone size, in 24 hours.",
    h1Accent: "in 24 hours.",
    intro: [
      "A thumbnail has a fraction of a second in a crowded feed. We design each one around a single focal point and a three-to-four word hook that adds something the title doesn't, then check it at the size it actually shows on a phone.",
      "The pack is 4 custom thumbnails at 1280×720 for $79, with source files and one revision round, delivered within 24 hours of your brief. First order with us? Your first thumbnail lands within 6 hours, and if you don't like it, you get your money back. That goes for the $79 pack and the $20 single.",
    ],
    sections: [
      { title: "One idea per thumbnail", body: "One subject, one emotion, one short hook. Clutter is the most common reason a thumbnail gets scrolled past." },
      { title: "A/B pairs on request", body: "Want to test? Ask for two different angles on the same video inside your pack of four, like the gaming and finance pairs below." },
      { title: "A consistent channel look", body: "Colours, type and framing that stay recognisable across a series, so returning viewers spot your videos." },
      { title: "Source files included", body: "You get the 1280×720 exports and editable source files, so you can tweak text later without us." },
    ],
    fit: [
      "Gaming, finance, tech, education, travel, documentary and faceless channels, or any other niche.",
      "Creators who want a steady batch: one pack covers four uploads.",
      "Brands and agencies running YouTube for clients.",
    ],
    notIncluded: [
      "Video editing, channel art or animated intros.",
      "Hand-drawn character illustration.",
      "Using copyrighted game art or celebrity images you don't have the rights to.",
    ],
    samples: { kind: "thumbnails", ids: ["gaming-a", "gaming-b", "finance-a", "finance-b", "tech", "edu", "travel", "crime", "space"] },
    moreHref: "/work/thumbnails/",
    faq: [
      { q: "What should I send in the brief?", a: "Your channel link, the four video titles or topics, any face shots or frames you want used, and a few thumbnails you like from other channels." },
      { q: "Can I order packs regularly?", a: "Yes. Each pack is a separate fixed-price order of 4 thumbnails, so you can order one per batch of uploads. If you upload every week, a monthly plan is simpler: Creator Lite is 4 thumbnails a month for $79/mo (at most 1 a week) and the Creator plan is 12 a month for $179/mo (up to 3 a week), cancel any time." },
      { q: "What if I don't like the first one?", a: "On your first order (the $20 single or the $79 pack), tell us within 7 days of getting the first thumbnail and we refund you in full. No back and forth. If it's close, we'll fix it in your revision round instead." },
      { q: "How fast is the first thumbnail?", a: "On a first order it arrives within 6 hours of your complete brief. For a pack, the other three follow within 24 hours, in the same look." },
      { q: "Are the samples from real channels?", a: "No. Every sample on this page is a concept for a fictional channel, made to show the range of styles we design." },
    ],
    related: ["youtube-thumbnail-price", "youtube-thumbnail-subscription", "roblox-thumbnail-design", "youtube-channel-branding", "faceless-youtube-thumbnails", "logo-design", "indie-game-landing-page"],
  },
  {
    slug: "faceless-youtube-thumbnails",
    offer: "thumbnails",
    label: "Faceless channel thumbnails",
    metaTitle: "Faceless YouTube channel thumbnails, 4 for $79",
    metaDescription:
      "Thumbnails for faceless YouTube channels: one strong object or scene, a short hook and a repeatable series look. 4 for $79 in 24h, source files included.",
    eyebrow: "For faceless YouTube channels",
    h1: "Thumbnails that stop the scroll without a face on them.",
    h1Accent: "without a face on them.",
    intro: [
      "Face-led channels lean on an expression. Faceless channels have to do the same job with an object, a scene or a visual question: a cracked piggy bank, a circled cassette tape, a black hole asking 'what's inside?'. Every sample on this page is faceless.",
      "A pack is 4 custom 1280×720 thumbnails for $79, delivered within 24 hours of your brief, with source files and one revision round.",
    ],
    sections: [
      { title: "One object carries the story", body: "We pick a single focal object or scene that makes the video's question visible, then light and frame it so it reads at phone size." },
      { title: "A hook the title doesn't repeat", body: "Two to four words that add tension or curiosity, like 'It saw me first' or 'Your savings are leaking', instead of restating the video title." },
      { title: "A series look you can reuse", body: "Consistent type, colours and a small series label (episode or case number), so returning viewers spot your uploads and new ones look like part of a set." },
      { title: "Built for your niche", body: "Explainers, science and space, history, finance, true crime and documentary, tech, travel compilations, gaming and storytelling channels." },
    ],
    fit: [
      "Faceless and voice-over channels in any niche and language.",
      "Channel operators running several faceless channels who need consistent batches.",
      "Creators starting a new channel who want a recognisable look from the first upload.",
    ],
    notIncluded: [
      "Scripts, voice-over, video editing or channel strategy.",
      "Guaranteed click-through rates or views: we design for clarity at phone size and leave testing to you.",
      "Copyrighted film stills, game art or photos you don't have the rights to use.",
    ],
    samples: { kind: "thumbnails", ids: ["space", "crime", "edu", "finance-b", "finance-a", "tech", "travel", "gaming-a", "gaming-b"] },
    moreHref: "/work/thumbnails/",
    faq: [
      { q: "Where does the imagery come from?", a: "Production runs on an AI-assisted workflow: imagery is generated or composed for each thumbnail, then finished and quality-checked before delivery, with a revision round included. We don't use copyrighted film or game stills, and you can send your own footage frames to use instead." },
      { q: "Can you match an existing channel style?", a: "Yes. Send your channel link and a few current thumbnails, and we keep the fonts, colours and framing consistent, or suggest a cleaner series look if you want a refresh." },
      { q: "Can I test two versions of one video?", a: "Yes. Inside your pack of four, ask for an A/B pair: two different angles on the same video, like the finance and gaming pairs on this page." },
      { q: "Are these from real channels?", a: "No. Every sample is a concept for a fictional channel, made to show the range of faceless styles we design." },
    ],
    related: ["youtube-thumbnail-design", "youtube-thumbnail-price", "youtube-thumbnail-subscription", "logo-design"],
  },
  {
    slug: "youtube-thumbnail-price",
    offer: "thumbnails",
    label: "What $79 thumbnails include",
    metaTitle: "YouTube thumbnail price: what $79 gets you",
    metaDescription:
      "YouTube thumbnail price, explained: $79 fixed for 4 thumbnails at 1280×720, source files and 1 revision, plus what's not included and the 24h turnaround.",
    eyebrow: "Thumbnail price, explained",
    h1: "What's in a $79 YouTube thumbnail pack, line by line.",
    h1Accent: "line by line.",
    intro: [
      "A fixed price only helps if you know exactly what it buys. This page lists everything the $79 thumbnail pack includes, what it leaves out, and what happens between paying and getting your files, so you can compare it fairly with a per-thumbnail quote or a monthly retainer.",
      "Short version: four custom thumbnails at 1280×720, bold titles that read at phone size, the exports plus editable source files, and one revision round. Delivered within 24 hours of a complete brief.",
    ],
    sections: [
      { title: "1. Four custom thumbnails", body: "Four designs at 1280×720, one per video. Want to test? Ask for an A/B pair, two different angles on the same video, inside your four, like the gaming and finance pairs below. Each pack is designed for your videos, not a template with your text swapped in." },
      { title: "2. Titles that read at phone size", body: "Each thumbnail gets one focal point and a bold hook of a few words that adds something the video title doesn't. We check every one at the size it actually shows in a phone feed." },
      { title: "3. Exports and source files", body: "You get the 1280×720 exports ready to upload, plus editable source files, so you can change a word or a number later without coming back to us." },
      { title: "4. A look your viewers recognise", body: "Colours, type and framing that stay consistent across the four, or match your existing channel style if you send a few current thumbnails, so returning viewers spot your uploads." },
      { title: "5. One revision round", body: "After delivery, send one consolidated list of changes within 14 days that stays within the original brief, and we deliver the revised files within the same 24-hour turnaround." },
      { title: "6. How the price stays fixed", body: "Four thumbnails, one scope, no calls, no hourly billing. Production runs on an AI-assisted workflow and every thumbnail is quality-checked before delivery, with a revision round included, which keeps the price and the 24 hours predictable." },
    ],
    fit: [
      "You publish regularly and want four thumbnails at a known price before you commit: one pack covers four uploads.",
      "You want to A/B test a thumbnail and need two genuinely different versions, not one design in two colours.",
      "You'd rather own editable source files than depend on a designer for every text change.",
    ],
    notIncluded: [
      "Video editing, scripts, voice-over, channel art or animated intros.",
      "Hand-drawn character illustration, or copyrighted game art, film stills or celebrity images you don't have the rights to use.",
      "Guaranteed click-through rates or views. We design for clarity at phone size and leave testing to you. More thumbnails mean another pack or a monthly plan; extra rounds or new directions can be quoted separately.",
    ],
    samples: { kind: "thumbnails", ids: ["gaming-a", "gaming-b", "finance-a", "finance-b", "crime", "space"] },
    moreHref: "/work/thumbnails/",
    faq: [
      { q: "Are there any extra costs after the $79?", a: "No. The price is fixed in US dollars, and any taxes or fees that apply are shown on the Stripe checkout page before you pay. Your bank or card provider may charge a currency conversion fee. If you need more than four thumbnails, you order another pack, or pick a monthly plan: Creator Lite is 4 thumbnails a month for $79/mo and the Creator plan is 12 a month for $179/mo." },
      { q: "What exactly happens in the 24 hours?", a: "The clock starts once payment is confirmed and your brief is complete. We design the four thumbnails, check each at phone size, review them and email you the exports and source files. If something is missing from the brief, we ask by email and the clock pauses until you reply." },
      { q: "What do I need to send?", a: "Your channel link, the four video titles or topics, any face shots or frames you want used, and a few thumbnails you like from other channels. Five minutes is plenty." },
      { q: "Can one pack include an A/B test?", a: "Yes. Inside your pack of four, ask for an A/B pair: two different angles on the same video, such as a challenge-led and a curiosity-led version. The other two thumbnails go to other videos." },
      { q: "Do I own the thumbnails?", a: "Yes. Once paid in full, you own the final thumbnails and can use them however you like. Drafts and unused ideas stay with us. Full details are in the terms." },
      { q: "What if I change my mind before you start?", a: "If we haven't started work yet, you can cancel by email for a full refund through Stripe. Once work has started, the revision round is how changes are handled." },
      { q: "Are the samples from real channels?", a: "No. Every sample on this page is a concept for a fictional channel, made to show the range of styles we design. The finance and gaming samples are A/B pairs: two takes on the same video." },
    ],
    related: ["youtube-thumbnail-design", "youtube-thumbnail-subscription", "roblox-thumbnail-design", "faceless-youtube-thumbnails", "logo-design-price"],
  },
  {
    slug: "youtube-thumbnail-subscription",
    offer: "thumbnails",
    plans: ["creator-lite", "creator-plan"],
    label: "Monthly thumbnail plans",
    metaTitle: "YouTube thumbnail subscription, from $79/month",
    metaDescription:
      "YouTube thumbnail subscription for weekly uploads: 4 thumbnails a month for $79/mo or 12 for $179/mo, each within 24h of its brief. Cancel any time. Worldwide.",
    eyebrow: "Thumbnail plans for weekly uploads",
    h1: "A fresh thumbnail for every upload, on one monthly plan.",
    h1Accent: "on one monthly plan.",
    intro: [
      "If you upload every week, ordering thumbnails one at a time gets old. A plan gives you a set number each month: email the video title when you need one, and it's back within 24 hours of the brief.",
      "Two plans, both billed monthly in USD by Stripe. Creator Lite is 4 thumbnails a month for $79/mo, at most 1 a week. The Creator plan is 12 a month for $179/mo, up to 3 a week. Each thumbnail comes with its source file and one revision round. Unused thumbnails don't roll over, and you can cancel any time.",
    ],
    sections: [
      { title: "1. Creator Lite: 4 a month, $79/mo", body: "For channels that upload about once a week. At most 1 thumbnail a week and 4 per billing month, each delivered within 24 hours of its brief." },
      { title: "2. Creator plan: 12 a month, $179/mo", body: "For channels that post two or three times a week, like a weekly gaming or Roblox series. Up to 3 thumbnails a week and 12 per billing month, each delivered within 24 hours of its brief." },
      { title: "3. One email per video", body: "Your first brief covers the channel: the link, the style you want and a few thumbnails you like. After that, each request is one email with the video title or topic and any frames or face shots to use. The 24-hour clock starts once that brief is complete." },
      { title: "4. Files and a revision round", body: "Every thumbnail comes as a 1280×720 export plus its editable source file, with one revision round: one consolidated list of changes that stays within that video's brief." },
      { title: "5. A look viewers recognise", body: "The same fonts, colours and framing from upload to upload, or a match to your current style if you send a few thumbnails, so returning viewers spot your videos in a crowded feed." },
      { title: "6. Billed monthly, cancel any time", body: "Billed monthly in advance in US dollars by Stripe. Thumbnails you don't request within a billing month don't carry over. Cancel any time by email: the plan stops at the end of the month you've paid for, and partial months aren't refunded." },
    ],
    fit: [
      "You upload every week, or several times a week, and want each thumbnail ready within a day of the brief.",
      "You run a series (gaming, Roblox, finance, explainers, faceless) and want every episode to look like part of the set.",
      "You'd rather pay one known amount a month than order and pay for each thumbnail separately.",
    ],
    notIncluded: [
      "Video editing, scripts, voice-over or animated intros.",
      "Channel art beyond thumbnails. Starting a new channel? The Channel Launch Kit ($199) covers a logo, banner, profile picture and 4 thumbnails; it's in the logo card above.",
      "Guaranteed click-through rates or views. We design for clarity at phone size and leave testing to you.",
      "More than your plan's weekly or monthly number, and no rollover of unused thumbnails. Need one extra? A single thumbnail is $20. Copyrighted game art, film stills or celebrity images you don't have the rights to use are out too.",
    ],
    samples: { kind: "thumbnails", ids: ["gaming-a", "gaming-b", "finance-a", "finance-b", "space", "crime", "edu", "tech", "travel"] },
    moreHref: "/work/thumbnails/",
    workHeading: "Thumbnails for channels that upload every week",
    workIntro: "Concepts for fictional channels, not client work. The gaming and finance pairs are A/B versions of the same video; the space and true-crime ones are faceless.",
    monthlyCopy: {
      ticks: ["Secure Stripe checkout", "Each thumbnail in 24h", "Cancel any time by email"],
      howHeading: "Subscribe, email a video title, get the thumbnail. No meetings.",
      emailLabel: "Email your first brief",
      steps: [
        { title: "Pick a plan", body: "Stripe checkout: $79/mo for 4 or $179/mo for 12, in USD, billed monthly in advance. No quote, no call." },
        { title: "Email each video", body: "Send the title or topic to hello@shipdaystudio.com from the email you used at checkout, one email per video." },
        { title: "Get it in 24 hours", body: "The 1280×720 export and source file within 24 hours of a complete brief, with one revision round." },
      ],
      pricingHeading: "Thumbnail plans: $79/month for 4 or $179/month for 12.",
      pricingIntro: "What you see is what you pay: billed monthly in advance by Stripe, cancel any time by email. Unused thumbnails don't roll over. One-off thumbnails are in the same card: 1 for $20, or 4 for $79 total.",
      whatYouGet: "What you get with a thumbnail plan",
      footerNote: "Billed monthly, each thumbnail in 24h, cancel any time by email.",
      ctaHeading: "A thumbnail for every upload, from $79/month.",
      ctaText: "Remote, for creators worldwide, in any niche. Subscribe online, then email your first video to hello@shipdaystudio.com.",
    },
    faq: [
      { q: "Which plan fits my channel?", a: "About one upload a week: Creator Lite, 4 thumbnails a month for $79/mo. Two or three uploads a week: the Creator plan, 12 a month for $179/mo, up to 3 a week. Not ready for a plan? A single thumbnail is $20 and a pack of 4 is $79 total, with no subscription." },
      { q: "How do I request a thumbnail?", a: "Email hello@shipdaystudio.com from the email you used at checkout, one email per video, with the title or topic and any frames or face shots you want used. Each thumbnail is delivered within 24 hours of a complete brief. If something is missing, we ask by email and the clock pauses until you reply." },
      { q: "What counts as a week and a month?", a: "A week runs Monday to Sunday. The billing month runs from the day you subscribed to the same day the next month. Creator Lite covers 1 thumbnail a week and 4 a month; the Creator plan covers up to 3 a week and 12 a month." },
      { q: "What happens to thumbnails I don't use?", a: "They don't carry over. Each billing month starts fresh, so pick the plan that matches how often you actually upload." },
      { q: "Can I get more than my plan covers?", a: "Yes. An extra thumbnail is $20 as a single order. If you're regularly over Creator Lite, move to the Creator plan: cancel Creator Lite by email and it stops at the end of the month you've already paid for." },
      { q: "How do I cancel?", a: "Email hello@shipdaystudio.com any time. The plan stops at the end of the month you've already paid for. Partial months aren't refunded. Full details are in the terms." },
      { q: "Do I own the thumbnails?", a: "Yes. Once paid, you own the final thumbnails and can use them however you like. Drafts and unused ideas stay with us. Full details are in the terms." },
      { q: "Is this made with AI?", a: "Production runs on an AI-assisted workflow: imagery is generated or composed for each thumbnail, then finished and quality-checked before delivery, with one revision round per thumbnail. We don't use copyrighted game art or film stills, and you can send your own footage frames to use instead." },
      { q: "Will a plan get me more views?", a: "Nobody can honestly promise that. We design every thumbnail to read clearly at phone size and stay consistent across your uploads; how it performs is down to your video, title and audience, so test and keep what works." },
      { q: "I'm starting a new channel. Where do I begin?", a: "If you also need a logo, banner and profile picture, the Channel Launch Kit is $199 for all of that plus 4 thumbnails, delivered within 48 hours of a complete brief. A plan can follow once you're uploading regularly." },
      { q: "Are the samples from real channels?", a: "No. Every sample on this page is a concept for a fictional channel, made to show the range of styles we design." },
    ],
    related: ["youtube-thumbnail-design", "youtube-thumbnail-price", "youtube-channel-branding", "faceless-youtube-thumbnails", "logo-design"],
  },
  {
    slug: "roblox-thumbnail-design",
    offer: "thumbnails",
    label: "Roblox thumbnail design",
    metaTitle: "Roblox thumbnail design: 1 for $20, 4 for $79",
    metaDescription:
      "Roblox thumbnails for YouTube videos and experience pages: 16:9 at 1280×720, bold text that reads small, source file. 1 for $20 or 4 for $79 total, in 24h.",
    eyebrow: "Roblox thumbnail design",
    h1: "Roblox thumbnails that read at a glance, back in 24 hours.",
    h1Accent: "back in 24 hours.",
    intro: [
      "Roblox thumbnails get judged at tiny sizes, next to dozens of other bright, blocky ones. We build each one around one moment (the egg cracking, the last jump, the monster in the hallway) and a hook of two or three words, then check it at phone size before it goes out.",
      "One thumbnail is $20 and a pack of 4 is $79 total, each 1280×720 with its editable source file and one revision round, delivered within 24 hours of your brief. Posting a Roblox series every week? Creator Lite ($79/mo for 4) and the Creator plan ($179/mo for 12) cover that.",
    ],
    sections: [
      { title: "For Roblox YouTube channels", body: "Obby runs, pet hatches, tycoon builds, horror nights, 100-day challenges. One focal moment, big readable text and a look that stays the same across your series, so viewers spot the next episode." },
      { title: "For Roblox experience pages", body: "Thumbnails for your game's page, sized 16:9. Roblox recommends 16:9 and ideally 1920×1080; ours are 1280×720, the same shape, so they upload without stretching. We keep the important text away from the bottom edge, where Roblox can show info like the player count." },
      { title: "Built from your game", body: "Send in-game screenshots, your avatar, your map or a few thumbnails you like. Production is AI-assisted: we compose the scene, add the text, then quality-check every thumbnail before delivery." },
      { title: "One idea per thumbnail", body: "One character, one emotion, one short hook. A thumbnail that tries to show the whole game ends up showing nothing at the size people actually see it." },
      { title: "A/B versions on request", body: "Want to test two angles? Ask for an A/B pair inside a pack of 4, for example a challenge-led version and a curiosity-led one for the same video or update." },
      { title: "Files you can edit", body: "You get the 1280×720 export ready to upload and the editable source file, so you can change an update number or a stage count later without coming back to us." },
    ],
    fit: [
      "You run a Roblox YouTube channel (obbies, simulators, horror, tycoons, challenges) and want thumbnails that look like one series.",
      "You're launching or updating a Roblox experience and want a clean 16:9 thumbnail for the game page.",
      "You'd rather pay a fixed $20 or $79 up front than haggle over Robux on Discord.",
    ],
    notIncluded: [
      "Game icons (Roblox uses square 512×512 icons), UI, game assets, scripting or building inside Roblox Studio.",
      "Custom 3D avatar renders or rigged Blender GFX. We work from screenshots and images you send.",
      "Video editing, ads or channel art. A new channel can start with the Channel Launch Kit ($199): logo, banner, profile picture and 4 thumbnails.",
      "Guaranteed clicks, views or Roblox moderation approval. Using game art you don't own, or Roblox logos, is out too.",
    ],
    samples: { kind: "thumbnails", ids: ["roblox-egg", "roblox-obby", "roblox-shark", "roblox-horror", "gaming-a", "gaming-b"] },
    moreHref: "/work/thumbnails/",
    workHeading: "Roblox-style thumbnails we've made",
    workIntro: "Concepts for fictional games, not client work, and not made with any real game's art. The obby one is laid out like an experience-page thumbnail, the others like YouTube video thumbnails. The last two are a gaming A/B pair for the same video.",
    faq: [
      { q: "Which sizes do I get?", a: "Every thumbnail is 1280×720 (16:9) with its editable source file. That's YouTube's recommended size, and it has the same 16:9 shape Roblox uses for experience thumbnails, so it uploads without stretching. Roblox recommends 1920×1080 for the sharpest result; our packages are delivered at 1280×720." },
      { q: "Can you make my game icon too?", a: "Not as part of these packages. Roblox icons are square (512×512) and our thumbnail packages are 16:9 only." },
      { q: "What should I send in the brief?", a: "Your channel or game link, the video titles or the update you're promoting, any screenshots or avatar shots you want used, and a few thumbnails you like. Five minutes is plenty. If something is missing we ask by email, and the 24-hour clock pauses until you reply." },
      { q: "Can I pay in Robux?", a: "No. Payment is in US dollars through Stripe checkout: $20 for one thumbnail, $79 total for a pack of 4, or a monthly plan if you upload every week." },
      { q: "I post a Roblox series every week. Is there a plan?", a: "Yes. About one upload a week: Creator Lite, 4 thumbnails a month for $79/mo. Two or three a week: the Creator plan, 12 a month for $179/mo, up to 3 a week. Each thumbnail is delivered within 24 hours of its brief, and you can cancel any time." },
      { q: "Is this made with AI?", a: "Production is AI-assisted: the scene is generated or composed for each thumbnail, then we add the text, finish it and quality-check it before delivery, with one revision round included. If you need thumbnails made without AI, we're not the right fit." },
      { q: "Will it get my game more players?", a: "Nobody can honestly promise that. We design for clarity at small sizes; how a thumbnail performs depends on your game, title and audience, so test versions and keep what works. Roblox also reviews every image you upload, and that's out of our hands." },
      { q: "Do I own the thumbnails?", a: "Yes. Once paid, you own the final thumbnails and can use them however you like. Drafts and unused ideas stay with us. Full details are in the terms." },
      { q: "Are the samples from real games?", a: "No. Every sample on this page is a concept for a fictional game or channel, made by us. We don't use Roblox logos or other games' art in them." },
    ],
    related: ["youtube-thumbnail-design", "youtube-thumbnail-price", "youtube-thumbnail-subscription", "youtube-channel-branding", "indie-game-landing-page", "logo-design"],
  },
  {
    slug: "youtube-channel-branding",
    offer: "logo",
    buy: "launch-kit",
    label: "YouTube channel branding kit",
    metaTitle: "YouTube channel branding kit, $199 in 48h",
    metaDescription:
      "YouTube channel branding in one kit: a logo (2 concepts), a 2560×1440 banner, an 800×800 profile picture and 4 thumbnails. $199 one-time, in 48h.",
    eyebrow: "YouTube channel branding",
    h1: "Logo, banner, profile picture and 4 thumbnails, in 48 hours.",
    h1Accent: "in 48 hours.",
    intro: [
      "Starting a channel, or relaunching one? The Channel Launch Kit gives it one look from the first upload: a logo, a channel banner, a profile picture and 4 thumbnails, designed together so they match on your channel page, in search and in the subscriptions feed.",
      "It's $199, paid once, and delivered within 48 hours of a complete brief, with one revision round for the whole kit. Bought separately, a logo pack ($149, 3 concepts) and a thumbnail pack ($79) come to $228, without the banner or the profile picture.",
    ],
    sections: [
      { title: "A logo, 2 concepts", body: "Two different directions for your channel name or mark. Pick one and get the final logo as SVG and PNG, in versions for light and dark backgrounds." },
      { title: "Channel banner, 2560×1440", body: "Made at YouTube's 2560×1440 banner size, with your channel name and any text kept inside the centred 1546×423 safe area, the part that stays visible on phones, computers and TVs." },
      { title: "Profile picture, 800×800", body: "Built from your logo and checked as a tiny circle, the size it shows at next to your videos and comments, so it still reads when it's small." },
      { title: "4 thumbnails, 1280×720", body: "For your first uploads, in the same colours and type as the banner and logo, with bold titles that read on a phone. Each comes with its editable source file." },
      { title: "Designed as one set", body: "Logo first, then the banner, profile picture and thumbnails built around it, so the channel looks like one brand instead of four separate orders." },
      { title: "One brief, one round of changes", body: "One email brief starts the 48-hour clock. After delivery, one revision round covers the whole kit: send one list of changes within 14 days." },
    ],
    fit: [
      "You're starting a YouTube channel and need a logo, banner, profile picture and your first thumbnails before you upload.",
      "You're relaunching or renaming a channel and want everything to match again.",
      "You want one fixed price paid once, not a quote, a call or a monthly bill.",
    ],
    notIncluded: [
      "Video editing, intros, outros, animated logos or any other motion or animated assets.",
      "Trademark searches or registration, or checking that a channel name is free to use.",
      "Guaranteed clicks, CTR, views or subscribers. We design for clarity; results depend on your videos and audience.",
      "Rush delivery, extra logo concepts or more than 4 thumbnails. More thumbnails later: 4 for $79 total, or Creator Lite at $79/mo.",
      "Stream overlays, emotes, merch or end screens.",
    ],
    samples: { kind: "kits", ids: ["glitchpaw", "slow-kettle"] },
    extras: [
      { title: "Thumbnails from the kits", note: "One of the 4 thumbnails from each kit at 1280×720, plus a concept from another niche.", samples: { kind: "thumbnails", ids: ["kit-glitchpaw", "kit-slow-kettle", "roblox-egg"] } },
    ],
    moreHref: "/work/thumbnails/",
    workHeading: "Two channel kits we've made",
    workIntro: "Concepts for two fictional channels, not client work: Glitchpaw (gaming) and Slow Kettle (one-pot cooking). Each board shows the banner, profile picture, logo and one of the 4 thumbnails together, the way they'd sit on a channel.",
    faq: [
      { q: "What exactly is in the kit?", a: "A logo (2 concepts; you pick one and get the final SVG and PNG files), a channel banner at 2560×1440, a profile picture at 800×800 and 4 thumbnails at 1280×720 with their source files. One revision round covers the whole kit." },
      { q: "What should I send in the brief?", a: "Your channel name, what the channel is about, the titles of your first 4 videos, colours you like, a few channels whose look you like, and any photos or screenshots you want used. Five minutes is plenty. If something is missing we ask by email, and the 48-hour clock pauses until you reply." },
      { q: "When does the 48 hours start?", a: "Once payment is confirmed and your brief is complete. Everything arrives by email within 48 hours. There's no rush option." },
      { q: "Is this made with AI?", a: "Production is AI-assisted: artwork for the banner and thumbnails is generated or composed for your channel, then we design the layouts and text, finish every file and quality-check it before delivery, with one revision round included. If you need channel art made without AI, we're not the right fit." },
      { q: "Can I get just the logo or just thumbnails?", a: "Yes. The logo pack is $149 for 3 concepts. Thumbnails are $20 for 1 or $79 total for 4. If you upload every week, Creator Lite is 4 thumbnails a month for $79/mo and the Creator plan is 12 a month for $179/mo, cancel any time. They're all in the pricing cards on this page." },
      { q: "Do I own everything?", a: "Yes. Once paid, you own the final logo, banner, profile picture and thumbnails and can use them however you like. The logo concept you don't pick stays with us. Full details are in the terms." },
      { q: "Will this get my channel more subscribers?", a: "Nobody can honestly promise that. A consistent, readable look helps people recognise your channel, but views and subscribers depend on your videos, titles and audience." },
      { q: "Can you check that my channel name or logo is free to use?", a: "Every concept is designed from scratch, but we don't run trademark searches. If you plan to register your channel name or logo, have a search done first." },
      { q: "Do you make animated intros or edit videos?", a: "No. The kit covers still images only: logo, banner, profile picture and thumbnails." },
      { q: "What if I change my mind before you start?", a: "If we haven't started work yet, you can cancel by email for a full refund through Stripe. Once work has started, the revision round is how changes are handled." },
      { q: "Are the samples from real channels?", a: "No. Glitchpaw and Slow Kettle are fictional channels we made up to show what a kit looks like together. No real channel's logo or art is used." },
    ],
    related: ["logo-design", "youtube-thumbnail-design", "youtube-thumbnail-subscription", "roblox-thumbnail-design", "faceless-youtube-thumbnails"],
  },
  {
    slug: "logo-design",
    offer: "logo",
    label: "Logo design pack",
    metaTitle: "Logo design pack, 3 concepts for $149",
    metaDescription:
      "Fixed-price logo design: 3 distinct concepts, pick one, get final SVG and PNG files in light and dark versions in 48h for $149. Any business, worldwide.",
    eyebrow: "Logo design",
    h1: "Three logo concepts. Pick one, get the final files in 48 hours.",
    h1Accent: "the final files in 48 hours.",
    intro: [
      "We design three genuinely different directions for your brand, not three colour swaps of the same idea. You pick one, use your revision round to refine it, and get final files ready for your site, socials, signage and print.",
      "Fixed price: $149, delivered within 48 hours of your brief, with SVG and PNG files in light and dark versions.",
    ],
    sections: [
      { title: "Three real directions", body: "For example a symbol, a wordmark and a monogram, so you can compare approaches rather than shades." },
      { title: "Works small and large", body: "We check each concept at favicon and social-avatar size, as well as on a sign or business card." },
      { title: "Light and dark versions", body: "Final files for light and dark backgrounds, as scalable SVG and high-resolution PNG." },
      { title: "You own it", body: "Once paid in full, the final logo is yours to use anywhere, for any purpose." },
    ],
    fit: [
      "New businesses, side projects, shops, studios, clubs and channels in any industry.",
      "Startups that need a clean mark for a launch page and pitch deck.",
      "Existing businesses ready to replace a dated or home-made logo.",
    ],
    notIncluded: [
      "Full brand guidelines books, packaging or merchandise design.",
      "Trademark searches or registration (we recommend checking before you file).",
      "Hand-drawn mascots or detailed illustration.",
    ],
    samples: { kind: "logos", ids: ["aurivane", "osteria-fennella", "maison-orrevel", "vexhound", "ashcombe-ferrand", "puddlewhistle"] },
    moreHref: "/work/logos/",
    faq: [
      { q: "What files do I get?", a: "The chosen logo as SVG and PNG, in light and dark versions. Unused concepts are not delivered as final files." },
      { q: "Can you design a logo for any industry?", a: "Yes. The samples cover energy tech, restaurants, perfume, esports, professional services and a kids' club, all fictional brands. Tell us your audience and the feeling you want." },
      { q: "Do you check that the logo is unique?", a: "Every concept is designed from scratch, but we can't run legal trademark searches. If you plan to register a trademark, have a quick search done before filing." },
    ],
    related: ["logo-design-price", "youtube-channel-branding", "landing-page-design", "youtube-thumbnail-design"],
  },
  {
    slug: "logo-design-price",
    offer: "logo",
    label: "What a $149 logo includes",
    metaTitle: "Logo design price: what's in the $149 pack",
    metaDescription:
      "Logo design price, explained: what the fixed $149 pack covers (3 concepts, SVG + PNG in light and dark, 1 revision), what it doesn't and the 48h turnaround.",
    eyebrow: "Logo price, explained",
    h1: "What's in a $149 logo design pack, line by line.",
    h1Accent: "line by line.",
    intro: [
      "A fixed price only helps if you know exactly what it buys. This page lists everything the $149 logo pack includes, what it leaves out, and what happens between paying and getting your files, so you can compare it fairly with a design quote or a logo generator.",
      "Short version: three distinct concepts, you pick one, one revision round to refine it, and the final logo as SVG and PNG files in light and dark versions. Delivered within 48 hours of a complete brief.",
    ],
    sections: [
      { title: "1. Three distinct concepts", body: "Three genuinely different directions, for example a symbol, a wordmark and a monogram, so you compare approaches rather than shades of one idea. Each is designed from scratch for your brand." },
      { title: "2. Checked small and large", body: "Every concept is checked at favicon and social-avatar size as well as on a sign or business card, so the one you pick works in a browser tab and on a shopfront." },
      { title: "3. You pick one", body: "Choose the direction that fits. The chosen logo is the one we finish; the other two concepts are not delivered as final files and stay with us." },
      { title: "4. One revision round", body: "Send one consolidated list of changes within 14 days of delivery that stays within the original brief, such as a colour, a weight or the spacing, and we deliver the revised files within the same 48-hour turnaround." },
      { title: "5. The final files", body: "The chosen logo as scalable SVG and high-resolution PNG, in versions for light and dark backgrounds, ready for your site, socials, signage and print. Once paid in full, it's yours to use anywhere, for any purpose." },
      { title: "6. How the price stays fixed", body: "Three concepts, one scope, no calls, no hourly billing. Production runs on an AI-assisted workflow and every concept is quality-checked before delivery, with a revision round included, which keeps the price and the 48 hours predictable." },
    ],
    fit: [
      "You're starting a business, shop, studio, club, channel or side project and want to know the full cost of a logo before you start.",
      "You'd like to compare three real directions instead of paying by the hour for rounds of sketches.",
      "Your current logo is dated or home-made and you want clean files that work from a favicon to a sign.",
    ],
    notIncluded: [
      "Brand guideline books, packaging, merchandise or print layouts such as business cards. The samples show each mark on mockups to prove it works at every size.",
      "Trademark searches or registration (we recommend a check before you file), and hand-drawn mascots or detailed illustration.",
      "Final files for the two concepts you don't pick. Extra rounds or new directions can be quoted separately.",
    ],
    samples: { kind: "logos", ids: ["aurivane", "ashcombe-ferrand", "osteria-fennella", "maison-orrevel", "puddlewhistle", "vexhound"] },
    moreHref: "/work/logos/",
    faq: [
      { q: "Are there any extra costs after the $149?", a: "No. The price is fixed in US dollars, and any taxes or fees that apply are shown on the Stripe checkout page before you pay. Your bank or card provider may charge a currency conversion fee. A landing page to put the logo on is a separate $390 package." },
      { q: "What exactly happens in the 48 hours?", a: "The clock starts once payment is confirmed and your brief is complete. We design three distinct concepts, check each at small and large sizes, and review them before they reach you. If something is missing from the brief, we ask by email and the clock pauses until you reply." },
      { q: "Do I get all three concepts?", a: "You get the concept you choose as final files: SVG and PNG, light and dark versions. Unused concepts are not delivered as final files and remain ours, as set out in the terms." },
      { q: "Do I get the app icon and business card shown in the samples?", a: "The pack delivers the logo itself as SVG and PNG files in light and dark versions. The samples show each mark on an app icon, a social avatar and a business card to prove it holds up at every size; designing your print items or a full brand book isn't part of the pack." },
      { q: "What do I need to send?", a: "Your business name, what you do and who it's for, the feeling you want the logo to give, where it will be used, and any logos you like or dislike. Five minutes is plenty." },
      { q: "What if I change my mind before you start?", a: "If we haven't started work yet, you can cancel by email for a full refund through Stripe. Once work has started, the revision round is how changes are handled." },
      { q: "Are the sample brands real?", a: "No. Every logo on this page is a concept for a fictional brand, made to show the range: energy tech, professional services, a restaurant, a perfume house, a kids' club and an esports team." },
    ],
    related: ["logo-design", "landing-page-price", "youtube-thumbnail-price"],
  },
  {
    slug: "website-upkeep-price",
    offer: "upkeep",
    label: "What $49/month upkeep covers",
    metaTitle: "Website upkeep: what the $49/month plan covers",
    metaDescription:
      "Website upkeep and maintenance for $49/month, explained: text and image swaps, small layout tweaks, dependency updates, what isn't covered and how to cancel.",
    eyebrow: "Upkeep price, explained",
    h1: "What's in the $49/month website upkeep plan, line by line.",
    h1Accent: "line by line.",
    intro: [
      "A monthly plan only helps if you know exactly what it covers. This page lists what the $49 Upkeep plan includes, what it leaves out, and how billing and cancelling work, so you can decide whether you need it at all.",
      "Short version: small edits and updates to your site, handled for you. Text and image swaps, small layout tweaks and dependency updates, requested by email. $49 a month in USD, billed monthly by Stripe, cancel any time.",
    ],
    sections: [
      { title: "1. Text and image swaps", body: "A new price, a changed menu, seasonal opening hours, an updated timetable, event dates, a new photo or a reworded line. Email the change and we update the page for you." },
      { title: "2. Small layout tweaks", body: "Small adjustments to the page you already have, such as reordering sections or changing a button's text or link. Redesigns, extra pages and new features are not part of the plan (see Not included)." },
      { title: "3. Dependency updates", body: "We keep the code and tools your page is built with up to date, so you don't have to track updates yourself." },
      { title: "4. Requests by email", body: "Send changes to hello@shipdaystudio.com from the email you subscribed with. There is no portal, login or ticket system: the plan is your Stripe subscription plus our email exchange." },
      { title: "5. Billed monthly, cancel any time", body: "$49 a month in US dollars, billed monthly in advance by Stripe. Cancel any time by email: Upkeep stops at the end of the month you've already paid for, and partial months aren't refunded." },
      { title: "6. Your site stays yours", body: "Landing pages are deployed to hosting and domain accounts in your name, and you keep the files. Upkeep is optional: stop it whenever you like, or edit the files yourself, without losing anything." },
    ],
    fit: [
      "Your page is live and you'd rather send a quick email than learn the code or a page builder to change a price or a photo.",
      "Your details change often: menus, timetables, seasonal hours, event dates, prices, screenshots or a game roadmap.",
      "Your landing page's revision round (14 days after delivery) is used up and you want small edits handled from then on.",
    ],
    notIncluded: [
      "Redesigns, extra pages or new features such as a shop, logins or anything that needs a back end. Revision rounds belong to the one-off packages; Upkeep has none.",
      "Domain registration, hosting plans and other third-party fees, which you pay to the providers directly.",
      "Paid ads, SEO campaigns, writing ongoing content such as blog posts, or new design work: a logo is the $149 pack and thumbnails are the $79 pack.",
    ],
    samples: { kind: "landing", slugs: ["osteria-fennella", "kettlefin-strength", "vesperkeel"] },
    workHeading: "Pages whose details change often",
    workIntro: "Concept pages for fictional brands, chosen because their menus, timetables and roadmaps change: the kind of small edits Upkeep handles. Not client projects.",
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "What does the $49 a month cover?", a: "Small edits and updates to your site, handled for you: text and image swaps, small layout tweaks and dependency updates. You email the change and we make it. It's billed monthly and you can cancel any time." },
      { q: "Do I need Upkeep after my landing page?", a: "No, it's optional. Every $390 landing page includes one revision round within 14 days of delivery, the page runs on hosting in your name and you keep the files, so you or any developer can edit it. Upkeep is for people who would rather email a change than make it." },
      { q: "How do I send a change?", a: "Email hello@shipdaystudio.com, ideally from the email you used at checkout, with what should change and any new text or images. We don't run customer accounts, a portal or a ticket system." },
      { q: "Are there any extra costs?", a: "No add-ons from us. Upkeep is $49 in US dollars, billed monthly in advance by Stripe, and any taxes or fees that apply are shown on the Stripe checkout page before you pay. Your bank or card provider may charge a currency conversion fee. Domain and hosting fees go to those providers directly." },
      { q: "How do I cancel?", a: "Email hello@shipdaystudio.com any time. Upkeep stops at the end of the month you've already paid for. Partial months aren't refunded. Full details are in the terms." },
      { q: "Does Upkeep include revisions, redesigns or new pages?", a: "No. Upkeep covers small edits as described on this page and has no revision rounds; those belong to the one-off packages. A redesign, extra pages or new features are not part of the plan." },
      { q: "Who makes the changes?", a: "We use AI-assisted tools as part of our production process, and every change is quality-checked before it is sent to you." },
      { q: "Are the sample sites real businesses?", a: "No. Osteria Fennella, Kettlefin Strength and Vesperkeel are concepts for fictional brands, shown because a restaurant menu, a gym timetable and a game roadmap are typical of details that change after launch." },
    ],
    related: ["landing-page-price", "landing-page-design", "local-business-website-design", "restaurant-website-design", "gym-website-design", "indie-game-landing-page"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
