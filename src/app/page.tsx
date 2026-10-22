import Link from "next/link";
import { OfferCards } from "@/components/OfferCards";
import type { Metadata } from "next";
import { BuyButton } from "@/components/BuyButton";
import { cases, faq, industries, logoSamples, steps, thumbSamples, site, getOffer, formatPrice, briefMailto } from "@/lib/site";
import { ConceptBadge, SampleGallery } from "@/components/SampleGallery";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}/#faq`,
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const metadata: Metadata = pageMeta({
  path: "/",
  title: `${site.name} | Landing pages in 48h, fixed price`,
  description: site.description,
  absoluteTitle: true,
});

export default function Home() {
  // Hero collage: flagship landing-page concept plus one v3 thumbnail and one v3 logo (all fictional brands).
  const heroCase = cases.find((c) => c.slug === "vantorel") ?? cases[0];
  const [heroW, heroH] = heroCase.imageSize ?? [1200, 2200];
  const heroThumb = thumbSamples.find((t) => t.id === "finance-b") ?? thumbSamples[0];
  const heroLogo = logoSamples.find((l) => l.id === "kettlefin") ?? logoSamples[0];
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-flame/15 blur-3xl" />
        <div className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" /> Remote · clients worldwide · fixed prices in USD
            </p>
            <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Your landing page, <span className="text-accent">shipped in 48 hours.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Fixed-price design for businesses, creators and brands anywhere in the world, in any industry. Pick a
              package, pay online, email a short brief, and get finished work by a clear deadline. No calls, no quotes,
              no scope creep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BuyButton offer={getOffer("landing")} className="btn-accent">Get a landing page · {formatPrice(getOffer("landing"))}</BuyButton>
              <a href="#offers" className="btn-ghost">See all prices</a>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted" aria-label="Order guarantees">
              <li><span aria-hidden="true" className="text-accent">✓</span> Secure Stripe checkout</li>
              <li><span aria-hidden="true" className="text-accent">✓</span> Full refund if work hasn&apos;t started</li>
              <li><span aria-hidden="true" className="text-accent">✓</span> You own the final files</li>
            </ul>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div><dt className="text-muted">Landing page</dt><dd className="text-xl font-bold">48h</dd></div>
              <div><dt className="text-muted">Thumbnails</dt><dd className="text-xl font-bold">24h</dd></div>
              <div><dt className="text-muted">Revision round</dt><dd className="text-xl font-bold">Included</dd></div>
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <a
              href={heroCase.demo ?? `/work/${heroCase.slug}/`}
              target={heroCase.demo ? "_blank" : undefined}
              rel={heroCase.demo ? "noopener" : undefined}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-ink shadow-2xl"
            >
              <img src={heroCase.image} alt={`${heroCase.brand} sample landing page (concept, fictional brand)`} className="w-full transition duration-500 group-hover:scale-[1.015]" width={heroW} height={heroH} fetchPriority="high" />
              <span className="absolute bottom-4 right-4"><ConceptBadge dark /></span>
              <span className="sr-only">{heroCase.demo ? ` Open the live ${heroCase.brand} concept demo (new tab)` : ` ${heroCase.brand} design notes`}</span>
            </a>
            <img
              src={heroThumb.small ?? heroThumb.file}
              alt=""
              width={640}
              height={360}
              className="pointer-events-none absolute -bottom-6 -left-4 w-1/2 rotate-[-4deg] rounded-xl border-4 border-white shadow-xl sm:-left-10"
            />
            <img
              src={heroLogo.small ?? heroLogo.file}
              alt=""
              width={heroLogo.size[0] / 2}
              height={heroLogo.size[1] / 2}
              className="pointer-events-none absolute -right-3 -top-5 aspect-square w-1/5 rotate-[6deg] sm:w-1/4 lg:-top-12 rounded-2xl border-4 border-white object-cover object-left shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Who we work with */}
      <section aria-labelledby="who-heading" className="pb-16 sm:pb-20">
        <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-10">
          <div>
            <p className="eyebrow">Who we work with</p>
            <h2 id="who-heading" className="mt-3 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">Any business, any industry, anywhere.</h2>
            <p className="mt-2 text-muted">{site.reach}</p>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Industries we design for">
            {industries.map((i) => (
              <li key={i} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium">{i}</li>
            ))}
            <li className="rounded-full border border-accent/30 bg-accent/5 px-3.5 py-1.5 text-sm font-semibold text-accent">…and whatever you sell</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-line bg-white py-20">
        <div className="container-x">
          <p className="eyebrow">How it works</p>
          <h2 className="h2 mt-3">Pay, send a brief, get your files. No meetings.</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-3xl border border-line p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-bold text-paper">{i + 1}</span>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted">
            Already paid?{" "}
            <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto()}>Email your brief</a>{" "}
            from the address you used at checkout.
          </p>
        </div>
      </section>

      {/* Offers */}
      <section id="offers" className="py-20">
        <div className="container-x">
          <p className="eyebrow">Pricing</p>
          <h2 className="h2 mt-3">Four packages. Fixed prices in USD.</h2>
          <p className="mt-3 max-w-2xl text-muted">What you see is what you pay. Every one-off package includes one revision round, and turnaround starts once we have your payment and brief.</p>
          <div className="mt-12"><OfferCards /></div>
          <p className="mt-8 text-sm text-muted">
            Details and samples by need:{" "}
            {services.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && " · "}
                <Link href={`/services/${s.slug}/`} className="font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent">{s.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-y border-line bg-white py-20">
        <div className="container-x">
          <p className="eyebrow">Sample concepts</p>
          <h2 className="h2 mt-3">The kind of thing we ship</h2>
          <p className="mt-3 max-w-2xl text-muted">These are concept pieces made to show our style, not client projects. Every brand, channel and product shown is fictional.</p>

          <SampleGallery />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="h2 mt-3">Questions, answered</h2>
            <p className="mt-3 text-muted">
              Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
          <div className="divide-y divide-line rounded-3xl border border-line bg-white">
            {faq.map((f) => (
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

      {/* CTA */}
      <section className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-paper sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute -bottom-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-flame/40 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">Ship it this week.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-paper/80">Pay online, then email your brief to {site.email}. The clock starts once we have both.</p>
          <Link href="/order/" className="btn-accent relative mt-8">Start your order</Link>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
