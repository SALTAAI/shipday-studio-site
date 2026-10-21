import Link from "next/link";
import { OfferCards } from "@/components/OfferCards";
import type { Metadata } from "next";
import { BuyButton } from "@/components/BuyButton";
import { cases, faq, logos, steps, thumbnails, site, getOffer, formatPrice, briefMailto } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: `${site.name} | Landing pages in 48h, fixed price`,
  description: site.description,
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-flame/15 blur-3xl" />
        <div className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" /> Fixed prices in USD · no calls needed
            </p>
            <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Your landing page, <span className="text-accent">shipped in 48 hours.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Fixed-price design for creators and founders. Pick a package, pay online, email a short brief, and get
              finished work by a clear deadline. No calls, no quotes, no scope creep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BuyButton offer={getOffer("landing")} className="btn-accent">Get a landing page · {formatPrice(getOffer("landing"))}</BuyButton>
              <a href="#offers" className="btn-ghost">See all prices</a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              <div><dt className="text-muted">Landing page</dt><dd className="text-xl font-bold">48h</dd></div>
              <div><dt className="text-muted">Thumbnails</dt><dd className="text-xl font-bold">24h</dd></div>
              <div><dt className="text-muted">Revision round</dt><dd className="text-xl font-bold">Included</dd></div>
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-white shadow-2xl">
              <img src={cases[1].image} alt={`${cases[1].brand} sample landing page (fictional brand)`} className="w-full" width={1200} height={2200} fetchPriority="high" />
            </div>
            <img
              src={thumbnails[0].file}
              alt=""
              width={1280}
              height={720}
              className="absolute -bottom-6 -left-4 w-1/2 rotate-[-4deg] rounded-xl border-4 border-white shadow-xl sm:-left-10"
            />
            <img
              src={logos[2].file}
              alt=""
              width={600}
              height={600}
              className="absolute -right-3 -top-5 w-1/4 rotate-[6deg] rounded-2xl border-4 border-white shadow-xl"
            />
          </div>
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
        </div>
      </section>

      {/* Work */}
      <section id="work" className="border-y border-line bg-white py-20">
        <div className="container-x">
          <p className="eyebrow">Sample work</p>
          <h2 className="h2 mt-3">The kind of thing we ship</h2>
          <p className="mt-3 max-w-2xl text-muted">These are concept pieces for fictional brands, made to show our style and range.</p>

          <h3 className="mt-12 text-lg font-bold">Landing pages</h3>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {cases.map((c) => (
              <Link key={c.slug} href={`/work/${c.slug}/`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-paper">
                  <img src={c.image} alt="" width={1200} height={2200} loading="lazy" decoding="async" className="w-full transition duration-500 group-hover:-translate-y-6 motion-reduce:transition-none" />
                </div>
                <p className="mt-3 text-sm text-muted">{c.kind}</p>
                <p className="font-bold group-hover:text-accent">{c.brand} →</p>
              </Link>
            ))}
          </div>

          <h3 className="mt-14 text-lg font-bold">YouTube thumbnails</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {thumbnails.map((t) => (
              <img key={t.file} src={t.file} alt={t.alt} width={1280} height={720} loading="lazy" decoding="async" className="w-full rounded-xl border border-line" />
            ))}
          </div>

          <h3 className="mt-14 text-lg font-bold">Logos</h3>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {logos.map((l) => (
              <figure key={l.file}>
                <img src={l.file} alt={`${l.name} logo, ${l.note.toLowerCase()} (fictional)`} width={600} height={600} loading="lazy" decoding="async" className="w-full rounded-2xl border border-line" />
                <figcaption className="mt-2 text-sm text-muted">{l.name} · {l.note}</figcaption>
              </figure>
            ))}
          </div>
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
    </>
  );
}
