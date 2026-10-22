import type { ServiceId } from "./site";

/**
 * Search-targeted service pages (/services/<slug>/). Copy is honest: every sample is a concept for a
 * fictional brand, there are no client names, reviews or results, and marketing copy stays remote and worldwide.
 */
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
  samples:
    | { kind: "landing"; slugs: string[] }
    | { kind: "thumbnails"; ids: string[] }
    | { kind: "logos"; ids: string[] };
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
    related: ["saas-landing-page-design", "coach-landing-page-design", "local-business-website-design"],
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
    samples: { kind: "landing", slugs: ["osteria-fennella", "pipewren", "smilewick-dental", "kettlefin-strength", "quernstead-food-share", "halvenna-studio"] },
    moreHref: "/work/landing-pages/",
    faq: [
      { q: "Can you add my menu or price list?", a: "Yes. Send it as a PDF, photo or text and we set it as real text on the page. With Upkeep, we update it whenever it changes." },
      { q: "Do I need a domain already?", a: "No. If you don't have one, we tell you how to register one in your own name (usually a small yearly fee to the registrar), then deploy the page to it." },
      { q: "Will it show up on Google?", a: "The page is built with proper titles, descriptions, headings and structured text, which is what search engines read. Rankings depend on many things we don't control, so we don't promise positions." },
    ],
    related: ["landing-page-design", "logo-design", "coach-landing-page-design"],
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
    related: ["logo-design", "landing-page-design"],
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
