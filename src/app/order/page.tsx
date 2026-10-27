import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import type { Metadata } from "next";
import { allOffers, formatPrice, site, briefMailto, cases, faq, getOffer, getOption, logoSamples, thumbSamples } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { CtaSection, FaqSection, HeroCollage, HeroSection, HowSection, PricingSection, heroTicks } from "@/components/HomeSections";

export const metadata: Metadata = pageMeta({
  path: "/order",
  title: "Order a fixed-price design package",
  description: "Pay for YouTube thumbnails from $20, a logo pack, landing page or Creator plan. Fixed prices in USD. First thumbnail order: preview in 6h or a full refund.",
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
            We work remotely with clients in any country and industry. Prices are fixed and in USD. Start with 1 thumbnail for $20 — first order preview in 6 hours, or a full refund.
          </>
        }
        actions={
          <>
            <BuyButton offer={getOption("thumbnail-single")!} className="btn-accent">Try 1 thumbnail · $20</BuyButton>
            <a href={briefMailto()} className="btn-ghost">Email my brief</a>
          </>
        }
        ticks={heroTicks}
        stats={[["1 thumbnail", "$20"], ["4 thumbnails", formatPrice(getOffer("thumbnails"))], ["Logo pack", formatPrice(getOffer("logo"))]]}
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
        heading="Packages. Fixed prices in USD."
        intro="What you see is what you pay. Start with 1 thumbnail for $20 (first order: preview in 6h or a full refund), or pick a pack, logo or landing page. Every one-off package includes one revision round."
        featured="thumbnails"
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
        text={<>Try 1 thumbnail for $20, or pick a pack. Pay online, then email your brief to {site.email}. First thumbnail order: preview in 6h, or a full refund.</>}
        action={<BuyButton offer={getOption("thumbnail-single")!} className="btn-accent relative mt-8">Try 1 thumbnail · $20</BuyButton>}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orderJsonLd) }} />
    </>
  );
}
