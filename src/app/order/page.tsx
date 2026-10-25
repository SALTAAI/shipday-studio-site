import Link from "next/link";
import type { Metadata } from "next";
import { allOffers, formatPrice, site, briefMailto, cases, faq, getOffer, logoSamples, thumbSamples } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { CtaSection, FaqSection, HeroCollage, HeroSection, HowSection, PricingSection, heroTicks } from "@/components/HomeSections";

export const metadata: Metadata = pageMeta({
  path: "/order",
  title: "Order a fixed-price design package",
  description: "Pay for a landing page ($390, 48h), thumbnail pack ($79, 24h), logo pack ($149, 48h) or monthly upkeep ($49/mo) via Stripe, then email your brief.",
});

const howTo = [
  { title: "Pay with Stripe", body: "Pick a package below. Checkout opens securely on Stripe in a new tab." },
  { title: "Email your brief", body: `Send it to ${site.email} from the email you used at checkout: what you do, who it's for, links and files.` },
  { title: "Get your delivery", body: "We confirm we've started, then deliver by email within the stated turnaround. One revision round is included on one-off packages." },
];

/** OfferCatalog with each fixed-price package, its USD price and its Stripe checkout link. */
const orderJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OfferCatalog",
      "@id": `${site.url}/order/#catalog`,
      name: "Shipday Studio fixed-price design packages",
      url: `${site.url}/order/`,
      itemListElement: allOffers().map((o) => ({
        "@type": "Offer",
        name: o.name,
        description: o.summary,
        price: o.price,
        priceCurrency: "USD",
        ...(o.unit === "/month"
          ? { priceSpecification: { "@type": "UnitPriceSpecification", price: o.price, priceCurrency: "USD", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } } }
          : {}),
        availability: "https://schema.org/InStock",
        url: o.stripeLink,
        areaServed: { "@type": "Place", name: "Worldwide" },
        seller: { "@id": `${site.url}/#organization` },
        itemOffered: { "@type": "Service", name: o.name, description: o.summary, provider: { "@id": `${site.url}/#organization` } },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: "Order", item: `${site.url}/order/` },
      ],
    },
  ],
};

export default function OrderPage() {
  const heroCase = cases.find((c) => c.slug === "maison-orrevel") ?? cases[0];
  const [w, h] = heroCase.imageSize ?? [1200, 2200];
  const heroThumb = thumbSamples.find((t) => t.id === "finance-a") ?? thumbSamples[0];
  const heroLogo = logoSamples.find((l) => l.id === "maison-orrevel") ?? logoSamples[0];
  return (
    <>
      <HeroSection
        pill="Remote · clients worldwide · fixed prices in USD"
        title="Pick a package "
        accent="and pay"
        body={
          <>
            We work remotely with clients in any country and industry. Prices are fixed and in USD. Turnaround starts once we have both your payment and your brief.
          </>
        }
        actions={
          <>
            <a href="#offers" className="btn-accent">See the packages</a>
            <a href={briefMailto()} className="btn-ghost">Email my brief</a>
          </>
        }
        ticks={heroTicks}
        stats={[["Landing page", formatPrice(getOffer("landing"))], ["Thumbnails", formatPrice(getOffer("thumbnails"))], ["Logo pack", formatPrice(getOffer("logo"))]]}
        visual={
          <HeroCollage
            href={`/work/${heroCase.slug}/`}
            main={{ src: heroCase.image, alt: `${heroCase.brand} sample landing page (concept, fictional brand)`, width: w, height: h }}
            srLabel={` ${heroCase.brand} design notes`}
            secondary={{ src: heroThumb.small ?? heroThumb.file, width: 640, height: 360 }}
            logo={{ src: heroLogo.small ?? heroLogo.file, width: heroLogo.size[0] / 2, height: heroLogo.size[1] / 2 }}
          />
        }
      />

      <HowSection heading="Pay, send a brief, get your files. No meetings." steps={howTo} />

      <PricingSection
        heading="Four packages. Fixed prices in USD."
        intro="What you see is what you pay. Every one-off package includes one revision round, and turnaround starts once we have your payment and brief."
        linksLabel="Details and samples by need:"
        links={services.map((s) => ({ href: `/services/${s.slug}/`, label: s.label }))}
      >
        <div id="brief" className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h3 className="text-xl font-bold">After paying: send your brief</h3>
          <p className="mt-2 max-w-2xl text-muted">
            Email <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto()}>{site.email}</a> with what you do, who
            it&apos;s for, any links and the files you want included. If anything is missing we&apos;ll ask, and the clock pauses until you reply.
          </p>
          <a href={briefMailto()} className="btn-primary mt-5">Email my brief</a>
          <p className="mt-6 text-sm text-muted">
            One revision round included on one-off packages. Full refund if we haven&apos;t started work. Upkeep can be cancelled any time by email.
            See the <Link className="underline hover:text-accent" href="/terms/">Terms of Service</Link>.
          </p>
        </div>
      </PricingSection>

      <FaqSection
        intro={<>Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.</>}
        faq={faq}
      />

      <CtaSection
        heading="Ship it this week."
        text={<>Pay online, then email your brief to {site.email}. The clock starts once we have both.</>}
        action={<a href="#offers" className="btn-accent relative mt-8">Pick a package</a>}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orderJsonLd) }} />
    </>
  );
}
