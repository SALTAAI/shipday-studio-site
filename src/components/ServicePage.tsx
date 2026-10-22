import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { ConceptBadge } from "@/components/SampleGallery";
import { turnaroundLabel } from "@/components/OfferCards";
import { cases, formatPrice, getOffer, logoSamples, site, thumbSamples } from "@/lib/site";
import { getService, type ServicePage as Service } from "@/lib/services";

function Samples({ s }: { s: Service }) {
  const sm = s.samples;
  if (sm.kind === "landing") {
    const list = sm.slugs.map((slug) => cases.find((c) => c.slug === slug)).filter((c): c is (typeof cases)[number] => Boolean(c));
    return (
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <li key={c.slug} className="flex flex-col">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-line bg-paper px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-[11px] text-muted">{c.slug}.example</span>
                <ConceptBadge />
              </div>
              <img
                src={c.card ?? c.image}
                alt={`${c.brand} landing page concept for a fictional ${c.kind.toLowerCase()}`}
                width={960}
                height={720}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover object-top"
              />
            </div>
            <h3 className="mt-4 font-bold">{c.brand}</h3>
            <p className="text-sm text-muted">{c.kind}{c.style ? ` · ${c.style}` : ""}</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
              {c.demo && (
                <a href={c.demo} target="_blank" rel="noopener" className="underline decoration-2 underline-offset-4 hover:text-accent">
                  Live demo <span aria-hidden="true">↗</span><span className="sr-only"> (opens the {c.brand} concept in a new tab)</span>
                </a>
              )}
              <Link href={`/work/${c.slug}/`} className="text-muted hover:text-accent">
                Design notes <span aria-hidden="true">→</span><span className="sr-only"> for {c.brand}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  if (sm.kind === "thumbnails") {
    const list = sm.ids.map((id) => thumbSamples.find((t) => t.id === id)).filter((t): t is (typeof thumbSamples)[number] => Boolean(t));
    return (
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <li key={t.id}>
            <div className="overflow-hidden rounded-xl border border-line bg-ink shadow-sm">
              <img src={t.small ?? t.file} alt={t.alt} width={640} height={360} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold">{t.niche}{t.pair ? ` · version ${t.pair.variant}` : ""}</p>
            <p className="text-sm text-muted">{t.pair ? t.pair.angle : t.title}</p>
          </li>
        ))}
      </ul>
    );
  }
  const list = sm.ids.map((id) => logoSamples.find((l) => l.id === id)).filter((l): l is (typeof logoSamples)[number] => Boolean(l));
  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((l) => (
        <li key={l.id}>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <img src={l.small ?? l.file} alt={l.alt} width={800} height={600} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
          </div>
          <p className="mt-3 font-bold">{l.name}</p>
          <p className="text-sm text-muted">{l.industry} · {l.note} (fictional brand)</p>
        </li>
      ))}
    </ul>
  );
}

export function serviceJsonLd(s: Service) {
  const o = getOffer(s.offer);
  const url = `${site.url}/services/${s.slug}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.label,
        serviceType: s.label,
        description: s.metaDescription,
        url,
        provider: { "@id": `${site.url}/#organization` },
        areaServed: { "@type": "Place", name: "Worldwide" },
        offers: {
          "@type": "Offer",
          name: o.name,
          price: o.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: o.stripeLink,
          seller: { "@id": `${site.url}/#organization` },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services/` },
          { "@type": "ListItem", position: 3, name: s.label, item: url },
        ],
      },
    ],
  };
}

export function ServicePageView({ s }: { s: Service }) {
  const o = getOffer(s.offer);
  const related = s.related.map(getService).filter((r): r is Service => Boolean(r));
  return (
    <article>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-flame/15 blur-3xl" />
        <div className="container-x relative py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/" className="hover:text-accent">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/services/" className="hover:text-accent">Services</Link> <span aria-hidden="true">/</span>{" "}
            <span aria-current="page">{s.label}</span>
          </nav>
          <p className="eyebrow mt-8">{s.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">{s.h1}</h1>
          {s.intro.map((p) => (
            <p key={p} className="mt-5 max-w-2xl text-lg text-muted">{p}</p>
          ))}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BuyButton offer={o} className="btn-accent">Order now · {formatPrice(o)}</BuyButton>
            <a href="#samples" className="btn-ghost">See sample concepts</a>
          </div>
          <p className="mt-4 text-sm text-muted">Secure Stripe checkout · {turnaroundLabel(o.turnaround)} after your brief · Full refund if we haven&apos;t started</p>
        </div>
      </section>

      <section aria-labelledby="included-heading" className="border-y border-line bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl border border-ink bg-ink p-6 text-paper shadow-xl sm:p-8 lg:sticky lg:top-24 lg:h-fit">
            <h2 id="included-heading" className="text-lg font-bold">{o.name}</h2>
            <p className="mt-1 text-sm text-paper/75">{o.summary}</p>
            <p className="mt-5 text-5xl font-extrabold tracking-tight">{formatPrice(o)}</p>
            <p className="mt-1 text-sm font-semibold text-sun">{turnaroundLabel(o.turnaround)}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {o.includes.map((i) => (
                <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-sun">✓</span>{i}</li>
              ))}
            </ul>
            <BuyButton offer={o} className="btn-accent mt-6 w-full" />
            <p className="mt-4 text-xs text-paper/70">Fixed price in USD. After paying, email your brief to {site.email}.</p>
          </div>
          <div>
            <p className="eyebrow">What you get</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {s.sections.map((x) => (
                <li key={x.title}>
                  <h3 className="text-lg font-bold">{x.title}</h3>
                  <p className="mt-2 text-muted">{x.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="font-bold">A good fit if</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {s.fit.map((f) => <li key={f} className="flex gap-2"><span aria-hidden="true" className="text-accent">✓</span>{f}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="font-bold">Not included</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {s.notIncluded.map((f) => <li key={f} className="flex gap-2"><span aria-hidden="true">–</span>{f}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="samples" aria-labelledby="samples-heading" className="py-16 sm:py-20">
        <div className="container-x">
          <p className="eyebrow">Sample concepts</p>
          <h2 id="samples-heading" className="h2 mt-3">The kind of work you get</h2>
          <p className="mt-3 max-w-2xl text-muted">Concept pieces made to show our range of styles, not client projects. Every brand, channel and product shown is fictional.</p>
          <Samples s={s} />
          <Link href={s.moreHref} className="btn-ghost mt-10">See more examples <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="border-y border-line bg-white py-16 sm:py-20">
        <div className="container-x">
          <p className="eyebrow">How it works</p>
          <h2 id="how-heading" className="h2 mt-3">Pay, send a brief, get your files.</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              ["Pay securely", `Order through Stripe checkout: ${formatPrice(o)}, fixed. No quote, no call.`],
              ["Email your brief", `Send it to ${site.email} from the email you used at checkout.`],
              ["Get it delivered", `${turnaroundLabel(o.turnaround)} after a complete brief, with one revision round included.`],
            ].map(([t, b], i) => (
              <li key={t} className="rounded-3xl border border-line p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper">{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-heading" className="h2 mt-3">Questions, answered</h2>
            <p className="mt-3 text-muted">More in the <Link href="/#faq" className="underline hover:text-accent">main FAQ</Link> and the <Link href="/terms/" className="underline hover:text-accent">terms</Link>.</p>
          </div>
          <div className="divide-y divide-line rounded-3xl border border-line bg-white">
            {s.faq.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="text-xl text-accent transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="container-x pb-4">
          <h2 id="related-heading" className="text-xl font-bold">Related services</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/services/${r.slug}/`} className="inline-block rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-ink">
                  {r.label} · {formatPrice(getOffer(r.offer))}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-x mt-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-paper sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute -bottom-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-flame/40 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">{o.name}, {formatPrice(o)}. {turnaroundLabel(o.turnaround)}.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-paper/80">Remote, for clients worldwide, in any industry. Pay online, then email your brief to {site.email}.</p>
          <BuyButton offer={o} className="btn-accent relative mt-8">Order now · {formatPrice(o)}</BuyButton>
        </div>
      </section>
    </article>
  );
}
