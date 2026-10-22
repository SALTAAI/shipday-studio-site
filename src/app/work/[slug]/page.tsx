import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, getOffer, formatPrice, site, type CaseStudy } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { BuyButton } from "@/components/BuyButton";

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  if (!c) return {};
  const lead = `${c.headline}. Concept landing page for a fictional brand by Shipday Studio`;
  const description = lead.length <= 150 ? `${lead}, with a live demo.` : `${c.kind} concept for a fictional brand: ${c.headline.toLowerCase()}.`;
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

  return (
    <article className="container-x py-14 sm:py-20">
      <Link href="/#work" className="text-sm text-muted hover:text-accent">← All sample concepts</Link>
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="eyebrow">{c.kind}{c.style ? ` · ${c.style}` : ""}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{c.brand}</h1>
          <p className="mt-4 text-lg text-muted">{c.headline}</p>
          <p className="mt-4 inline-block rounded-full bg-sun/40 px-3 py-1 text-xs font-semibold">Sample concept · fictional brand, not a client project</p>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            {c.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="text-2xl font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 font-bold">Concept brief (fictional)</h2>
          <p className="mt-2 text-muted">{c.brief}</p>
          <h2 className="mt-8 font-bold">Design choices</h2>
          <ul className="mt-2 space-y-2 text-muted">
            {c.approach.map((a) => <li key={a} className="flex gap-2"><span aria-hidden="true" className="text-accent">✓</span>{a}</li>)}
          </ul>
          <h2 className="mt-8 font-bold">Palette</h2>
          <div className="mt-3 flex gap-2">
            {c.palette.map((p) => (
              <span key={p} className="flex flex-col items-center gap-1 text-xs text-muted">
                <span aria-hidden="true" className="h-10 w-10 rounded-full border border-line" style={{ background: p }} />{p}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {c.demo && (
              <a href={c.demo} target="_blank" rel="noopener" className="btn-primary">
                Open live demo <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            <BuyButton offer={getOffer("landing")} className="btn-accent">Get a page like this · {formatPrice(getOffer("landing"))}</BuyButton>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
            <span aria-hidden="true" className="ml-3 truncate rounded-md bg-paper px-3 py-1 text-xs text-muted">{c.slug}.example</span>
          </div>
          <img src={c.image} alt={`Full ${c.brand} sample landing page (concept for a fictional brand)`} width={c.imageSize?.[0] ?? 1200} height={c.imageSize?.[1] ?? 2200} fetchPriority="high" className="w-full" />
        </div>
      </div>

      <section className="mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold">More sample concepts</h2>
          <Link href="/work/landing-pages/" className="text-sm font-semibold hover:text-accent">See all landing page examples →</Link>
        </div>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/work/${o.slug}/`} className="group flex gap-4 rounded-2xl border border-line bg-white p-4 hover:border-ink">
              <img src={o.card ?? o.image} alt="" width={o.card ? 960 : 1200} height={o.card ? 720 : 2200} loading="lazy" decoding="async" className="h-28 w-24 rounded-lg object-cover object-top" />
              <span>
                <span className="block text-sm text-muted">{o.kind}</span>
                <span className="block font-bold group-hover:text-accent">{o.brand} →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(c)) }} />
    </article>
  );
}
