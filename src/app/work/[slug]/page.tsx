import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, faq, getOffer, formatPrice, logoSamples, site, type CaseStudy } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { BuyButton } from "@/components/BuyButton";
import { turnaroundLabel } from "@/components/OfferCards";
import { LandingCard } from "@/components/SampleCards";
import { Breadcrumb, CtaSection, FaqSection, HeroCollage, HeroSection, PricingSection, heroTicks } from "@/components/HomeSections";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) return {};
  const lead = `${c.headline}. Concept landing page for a fictional brand by Shipday Studio`;
  // Only promise a live demo when the concept actually has one.
  const description = lead.length <= 150 ? `${lead}, with ${c.demo ? "a live demo" : "design notes"}.` : `${c.kind} concept for a fictional brand: ${c.headline.toLowerCase()}.`;
  return pageMeta({ path: `/work/${c.slug}`, title: `${c.brand}: ${c.kind.toLowerCase()} concept`, description });
}

/** CreativeWork (labelled as a concept for a fictional brand, never a client project) + BreadcrumbList. */
function caseJsonLd(c: CaseStudy) {
  const url = `${site.url}/work/${c.slug}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: `${c.brand}: ${c.kind} concept (fictional brand)`,
        headline: c.headline,
        description: `Sample concept for a fictional brand, not a client project. ${c.summary}`,
        url,
        image: `${site.url}${c.image}`,
        genre: c.kind,
        about: c.industry,
        creator: { "@id": `${site.url}/#organization` },
        publisher: { "@id": `${site.url}/#organization` },
        isPartOf: { "@id": `${site.url}/#website` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Landing page examples", item: `${site.url}/work/landing-pages/` },
          { "@type": "ListItem", position: 3, name: c.brand, item: url },
        ],
      },
    ],
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) notFound();
  const others = cases.filter((x) => x.slug !== c.slug && x.card).slice(0, 6);
  // Service pages that show this concept as a primary sample (internal links from the case to the offer).
  const usedOn = services.filter((s) => s.samples.kind === "landing" && s.samples.slugs.includes(c.slug)).slice(0, 3);

  const o = getOffer("landing");
  const price = formatPrice(o);
  const [w, h] = c.imageSize ?? [1200, 2200];
  const logo = logoSamples.find((l) => c.slug.startsWith(l.id));
  return (
    <>
      <HeroSection
        above={<Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/work/landing-pages/", label: "Landing page examples" }, { label: c.brand }]} />}
        pill={`${c.kind}${c.style ? ` · ${c.style}` : ""}`}
        title={c.brand}
        body={c.headline}
        note={<p className="mt-4 inline-block rounded-full bg-sun/40 px-3 py-1 text-xs font-semibold">Sample concept · fictional brand, not a client project</p>}
        actions={
          <>
            <BuyButton offer={o} className="btn-accent">Get a page like this · {price}</BuyButton>
            {c.demo ? (
              <a href={c.demo} target="_blank" rel="noopener" className="btn-ghost">
                See the design <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <a href="#notes" className="btn-ghost">Read the design notes</a>
            )}
          </>
        }
        ticks={heroTicks}
        stats={c.stats.map((st) => [st.label, st.value] as [string, string])}
        visual={
          <HeroCollage
            href={c.demo ?? "#notes"}
            external={Boolean(c.demo)}
            main={{ src: c.image, alt: `${c.brand} sample landing page (concept, fictional brand)`, width: w, height: h }}
            srLabel={c.demo ? ` See the ${c.brand} design (new tab)` : ` ${c.brand} design notes`}
            phone={c.mobile ? { src: c.mobile, width: 360, height: 779 } : undefined}
            logo={logo ? { src: logo.small ?? logo.file, width: logo.size[0] / 2, height: logo.size[1] / 2 } : undefined}
          />
        }
      />

      <section id="notes" className="border-y border-line bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <p className="eyebrow">Design notes</p>
            <h2 className="h2 mt-3">Concept brief (fictional)</h2>
            <p className="mt-3 text-muted">{c.brief}</p>
            <h3 className="mt-10 text-xl font-bold">Design choices</h3>
            <ul className="mt-3 space-y-2 text-muted">
              {c.approach.map((a) => <li key={a} className="flex gap-2"><span aria-hidden="true" className="text-accent">✓</span>{a}</li>)}
            </ul>
            <h3 className="mt-10 text-xl font-bold">Palette</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.palette.map((p) => (
                <span key={p} className="flex flex-col items-center gap-1 text-xs text-muted">
                  <span aria-hidden="true" className="h-10 w-10 rounded-full border border-line" style={{ background: p }} />{p}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {c.demo && (
                <a href={c.demo} target="_blank" rel="noopener" className="btn-primary">
                  See the design <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              <BuyButton offer={o} className="btn-accent">Get a page like this · {price}</BuyButton>
            </div>
            {usedOn.length > 0 && (
              <p className="mt-6 text-sm text-muted">
                Featured on:{" "}
                {usedOn.map((s, i) => (
                  <span key={s.slug}>
                    {i > 0 && " · "}
                    <Link href={`/services/${s.slug}/`} className="font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent">{s.label}</Link>
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl">
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
              <span aria-hidden="true" className="ml-3 truncate rounded-md bg-paper px-3 py-1 text-xs text-muted">{c.slug}.example</span>
            </div>
            <img src={c.image} alt={`Full ${c.brand} sample landing page (concept for a fictional brand)`} width={w} height={h} loading="lazy" decoding="async" className="w-full" />
          </div>
        </div>
      </section>

      <PricingSection
        heading={`${o.name}: ${price}, fixed price in USD.`}
        intro="What you see is what you pay. Every one-off package includes one revision round, and turnaround starts once we have your payment and brief."
        featured="landing"
        linksLabel="Details and samples by need:"
        links={[...usedOn.map((s) => ({ href: `/services/${s.slug}/`, label: s.label })), { href: "/services/", label: "All services" }]}
      />

      <section id="work" className="border-y border-line bg-white py-20">
        <div className="container-x">
          <p className="eyebrow">Sample concepts</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="h2">More sample concepts</h2>
            <Link href="/work/landing-pages/" className="text-sm font-semibold hover:text-accent">See all landing page examples →</Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => <LandingCard key={x.slug} c={x} large={false} />)}
          </div>
        </div>
      </section>

      <FaqSection
        intro={<>Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.</>}
        faq={faq}
      />

      <CtaSection
        heading={`${o.name}, ${price}. ${turnaroundLabel(o.turnaround)}.`}
        text={<>Want a page like {c.brand} for your own business? Pay online, then email your brief to {site.email}.</>}
        action={<BuyButton offer={o} className="btn-accent relative mt-8">Get a page like this · {price}</BuyButton>}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(c)) }} />
    </>
  );
}
