import type { ServiceId } from "./site";

/**
 * Search-targeted service pages (/services/<slug>/). Copy is honest: every sample is a concept for a
 * fictional brand, there are no client names, reviews or results, and marketing copy stays remote and worldwide.
 */
export type SampleSet =
  | { kind: "landing"; slugs: string[] }
  | { kind: "thumbnails"; ids: string[] }
  | { kind: "logos"; ids: string[] };

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
    related: ["landing-page-price", "saas-landing-page-design", "local-business-website-design", "indie-game-landing-page"],
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
      { title: "6. How the price stays fixed", body: "One page, one scope, no calls, no hourly billing. Production runs on an AI-assisted workflow and every page is reviewed by a human before delivery, which is what keeps the price and the 48 hours predictable." },
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
      { q: "Why is it cheaper than an agency?", a: "Because the scope is deliberately small and fixed: one page, no meetings, an AI-assisted workflow with human review, and one revision round. If you need a multi-page site, strategy workshops or a long-term partner, an agency is the better fit." },
    ],
    related: ["landing-page-design", "website-redesign", "saas-landing-page-design"],
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
    slug: "local-business-website-design",
    offer: "landing",
    label: "Local business websites",
    metaTitle: "Local business website design, $390",
    metaDescription:
      "One-page websites for restaurants, trades, clinics, gyms and shops: services, prices, hours, area and online booking up front. $390 fixed, live in 48h.",
    eyebrow: "For restaurants, trades, clinics, gyms and shops",
    h1: "A one-page website that gets local customers to book, call or visit.",
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
    related: ["website-redesign", "restaurant-website-design", "landing-page-design"],
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
      { q: "Is the Osteria Fennella sample a real restaurant?", a: "No. It's a concept for a fictional restaurant, made to show the approach: booking first, menu as text, hours and group dining. You can open the live demo to try it on your phone." },
    ],
    related: ["local-business-website-design", "logo-design", "website-redesign"],
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
      { q: "Is the Vesperkeel sample a real game?", a: "No. Vesperkeel and its studio are fictional, made to show the approach. You can open the live demo to see how the page works on a phone." },
      { q: "Can the page collect playtest sign-ups?", a: "Yes, by linking or embedding the form or newsletter tool you already use. We don't run a mailing list for you." },
      { q: "Can I update the roadmap later?", a: "Yes. You get the files and can edit them, or Upkeep ($49 a month, cancel any time) covers small updates like new screenshots, dates and roadmap items." },
    ],
    related: ["landing-page-design", "youtube-thumbnail-design", "logo-design"],
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
    intro: [
      "A thumbnail has a fraction of a second in a crowded feed. We design each one around a single focal point and a three-to-four word hook that adds something the title doesn't, then check it at the size it actually shows on a phone.",
      "The pack is 4 custom thumbnails at 1280×720 for $79, with source files and one revision round, delivered within 24 hours of your brief.",
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
      { q: "Can I order packs regularly?", a: "Yes. Each pack is a separate fixed-price order of 4 thumbnails, so you can order one per batch of uploads." },
      { q: "Are the samples from real channels?", a: "No. Every sample on this page is a concept for a fictional channel, made to show the range of styles we design." },
    ],
    related: ["faceless-youtube-thumbnails", "logo-design", "indie-game-landing-page"],
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
      { q: "Where does the imagery come from?", a: "Production runs on an AI-assisted workflow: imagery is generated or composed for each thumbnail, then finished and reviewed by a human before delivery. We don't use copyrighted film or game stills, and you can send your own footage frames to use instead." },
      { q: "Can you match an existing channel style?", a: "Yes. Send your channel link and a few current thumbnails, and we keep the fonts, colours and framing consistent, or suggest a cleaner series look if you want a refresh." },
      { q: "Can I test two versions of one video?", a: "Yes. Inside your pack of four, ask for an A/B pair: two different angles on the same video, like the finance and gaming pairs on this page." },
      { q: "Are these from real channels?", a: "No. Every sample is a concept for a fictional channel, made to show the range of faceless styles we design." },
    ],
    related: ["youtube-thumbnail-design", "logo-design"],
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
    related: ["landing-page-design", "youtube-thumbnail-design"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
