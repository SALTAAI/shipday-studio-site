import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { WorkFilter } from "@/components/WorkFilter";
import { faq, featuredCases, formatPrice, getOffer, logoSamples, site, thumbSamples, type ServiceId } from "@/lib/site";
import { services, type SampleSet } from "@/lib/services";
import { turnaroundLabel } from "@/components/OfferCards";
import { SampleCollage } from "@/components/ServicePage";
import { Breadcrumb, CtaSection, FaqSection, HeroSection, PricingSection, heroTicks } from "@/components/HomeSections";

const nav = [
  { href: "/work/landing-pages/", label: "Landing pages" },
  { href: "/work/thumbnails/", label: "Thumbnails" },
  { href: "/work/logos/", label: "Logos" },
];

export function WorkIndex({
  kind,
  offer,
  current,
  title,
  intro,
  cta,
}: {
  kind: "landing" | "thumbnails" | "logos";
  offer: ServiceId;
  current: string;
  title: string;
  intro: string;
  cta: string;
}) {
  const o = getOffer(offer);
  const url = `${site.url}${current}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        name: title,
        description: `${intro} All brands shown are fictional concepts by Shipday Studio.`,
        url,
        isPartOf: { "@id": `${site.url}/#website` },
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
    ],
  };
  const price = formatPrice(o);
  const noun = kind === "landing" ? "landing page" : kind === "thumbnails" ? "thumbnail" : "logo";
  // Hero collage: the featured samples of this category, in the homepage geometry.
  const sets: SampleSet[] =
    kind === "landing"
      ? [{ kind: "landing", slugs: featuredCases.map((c) => c.slug) }, { kind: "logos", ids: logoSamples.filter((l) => featuredCases.some((c) => c.slug.startsWith(l.id))).map((l) => l.id).slice(0, 1) }]
      : kind === "thumbnails"
        ? [{ kind: "thumbnails", ids: thumbSamples.filter((t) => t.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0)).map((t) => t.id) }]
        : [{ kind: "logos", ids: logoSamples.map((l) => l.id) }];
  const related = services.filter((s) => s.offer === offer);
  const lastSpace = title.lastIndexOf(" ");
  return (
    <>
      <HeroSection
        above={<Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/#work", label: "Samples" }, { label: title }]} />}
        pill="More examples"
        title={title.slice(0, lastSpace + 1)}
        accent={title.slice(lastSpace + 1)}
        body={intro}
        actions={
          <>
            <BuyButton offer={o} className="btn-accent">{cta} · {price}</BuyButton>
            <a href="#work" className="btn-ghost">Browse the examples</a>
          </>
        }
        ticks={heroTicks}
        stats={[["Turnaround", o.turnaround], ["Fixed price", price], ["Revision round", "Included"]]}
        visual={<SampleCollage sets={sets} moreHref="#work" />}
      />

      <section id="work" className="border-y border-line bg-white py-20">
        <div className="container-x">
          <nav aria-label="Sample categories" className="flex flex-wrap gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.href === current ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${n.href === current ? "bg-ink text-paper" : "border border-line bg-white hover:border-ink"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="eyebrow mt-10">Sample concepts</p>
          <h2 className="h2 mt-3">Every {noun} concept, filtered your way.</h2>
          <p className="mt-3 max-w-2xl text-muted">
            The looks range from clean and simple to rich and detailed. That is a style choice to fit your audience, not a quality level: every package is
            the same fixed price and gets the same care. All brands, channels and products shown are fictional concepts, not client work.
          </p>
          <div className="mt-8">
            <WorkFilter kind={kind} />
          </div>
        </div>
      </section>

      <PricingSection
        heading={`${o.name}: ${price}, fixed price in USD.`}
        intro="What you see is what you pay. Every one-off package includes one revision round, and turnaround starts once we have your payment and brief."
        featured={offer}
        linksLabel="Details and samples by need:"
        links={[...related.map((s) => ({ href: `/services/${s.slug}/`, label: s.label })), { href: "/services/", label: "All services" }]}
      />

      <FaqSection
        intro={<>Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.</>}
        faq={faq}
      />

      <CtaSection
        heading={`${o.name}, ${price}. ${turnaroundLabel(o.turnaround)}.`}
        text={<>{o.summary} Pay online, then email your brief to {site.email}.</>}
        action={<BuyButton offer={o} className="btn-accent relative mt-8">{cta} · {price}</BuyButton>}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
