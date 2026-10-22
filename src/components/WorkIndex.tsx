import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { WorkFilter } from "@/components/WorkFilter";
import { formatPrice, getOffer, site, type ServiceId } from "@/lib/site";

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
  return (
    <div className="container-x py-14 sm:py-20">
      <Link href="/#work" className="text-sm text-muted hover:text-accent">← Back to featured samples</Link>
      <nav aria-label="Sample categories" className="mt-6 flex flex-wrap gap-2">
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
      <p className="eyebrow mt-8">More examples</p>
      <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{intro}</p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        The looks range from clean and simple to rich and detailed. That is a style choice to fit your audience, not a quality level: every package is
        the same fixed price and gets the same care. All brands, channels and products shown are fictional concepts, not client work.
      </p>
      <div className="mt-8">
        <WorkFilter kind={kind} />
      </div>
      <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{o.name} · {formatPrice(o)}</span> · {o.summary}
        </p>
        <BuyButton offer={o} className="btn-primary px-5 py-2.5 text-sm">{cta} · {formatPrice(o)}</BuyButton>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
