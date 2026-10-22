"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { BuyButton } from "@/components/BuyButton";
import { featuredCases, formatPrice, getOffer, logoSamples, redesign, thumbSamples, type ServiceId } from "@/lib/site";

type TabId = "landing" | "thumbnails" | "logos";

const tabs: { id: TabId; label: string; offer: ServiceId; meta: string; more: string }[] = [
  { id: "landing", label: "Landing pages", offer: "landing", meta: "$390 · 48h", more: "/work/landing-pages/" },
  { id: "thumbnails", label: "Thumbnails", offer: "thumbnails", meta: "$79 · 4 per pack", more: "/work/thumbnails/" },
  { id: "logos", label: "Logos", offer: "logo", meta: "$149 · 3 concepts", more: "/work/logos/" },
];

export function ConceptBadge({ label = "Concept · fictional brand", dark = false }: { label?: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
        dark ? "bg-ink/80 text-paper backdrop-blur" : "bg-sun/40 text-ink"
      }`}
    >
      {label}
    </span>
  );
}

function PanelFooter({ offer, cta, note, more, moreLabel }: { offer: ServiceId; cta: string; note: string; more: string; moreLabel: string }) {
  const o = getOffer(offer);
  return (
    <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">{o.name} · {formatPrice(o)}</span> · {note}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href={more} className="btn-ghost px-5 py-2.5 text-center text-sm">{moreLabel} →</Link>
        <BuyButton offer={o} className="btn-primary px-5 py-2.5 text-sm">{cta} · {formatPrice(o)}</BuyButton>
      </div>
    </div>
  );
}

function LandingCard({ c, large }: { c: (typeof featuredCases)[number]; large: boolean }) {
  return (
    <article className="flex flex-col">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-line bg-paper px-3 py-2">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
            <span className="ml-2 min-w-0 flex-1 truncate text-[11px] text-muted">{c.slug}.example</span>
            <ConceptBadge />
          </div>
          <img
            src={c.card}
            alt={`${c.brand} homepage concept, desktop view: ${c.style?.toLowerCase()} design for a fictional ${c.kind.toLowerCase()}`}
            width={960}
            height={720}
            loading="lazy"
            decoding="async"
            sizes={large ? "(min-width: 1024px) 540px, 100vw" : "(min-width: 1024px) 360px, 100vw"}
            className="aspect-[4/3] w-full object-cover object-top"
          />
        </div>
        {c.mobile && (
          <img
            src={c.mobile}
            alt={`${c.brand} concept, mobile view`}
            width={360}
            height={779}
            loading="lazy"
            decoding="async"
            className={`absolute -bottom-4 right-3 aspect-[360/779] rounded-[14px] border-[3px] border-ink bg-white object-cover object-top shadow-xl ${large ? "w-[22%]" : "w-[26%]"}`}
          />
        )}
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{c.segment}</p>
        <h3 className="mt-1 text-lg font-bold">{c.brand}</h3>
        <p className="text-sm text-muted">{c.kind} · {c.style}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {c.demo && (
            <a href={c.demo} target="_blank" rel="noopener" className="underline decoration-2 underline-offset-4 hover:text-accent">
              Open live demo <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens the {c.brand} concept page in a new tab)</span>
            </a>
          )}
          <Link href={`/work/${c.slug}/`} className="text-muted hover:text-accent">
            Design notes <span aria-hidden="true">→</span>
            <span className="sr-only"> for {c.brand}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Thumb({ t, sizes, priority = false }: { t: (typeof thumbSamples)[number]; sizes: string; priority?: boolean }) {
  return (
    <a href={t.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-line bg-ink shadow-sm">
      <img
        src={t.file}
        srcSet={t.small ? `${t.small} 640w, ${t.file} 1280w` : undefined}
        sizes={t.small ? sizes : undefined}
        alt={t.alt}
        width={1280}
        height={720}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video w-full object-cover"
      />
      <span className="sr-only"> (open full size, 1280×720)</span>
    </a>
  );
}

export function SampleGallery() {
  const [active, setActive] = useState<TabId>("landing");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const featuredThumbs = thumbSamples.filter((t) => t.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
  const pairs = ["gaming", "finance"].map((id) => featuredThumbs.filter((t) => t.pair?.id === id));
  const singles = featuredThumbs.filter((t) => !t.pair);
  const feed = [pairs[0][0], pairs[1][1], ...singles];
  const systems = logoSamples.filter((l) => l.system).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Sample concepts by service"
        onKeyDown={onKey}
        className="grid grid-cols-3 gap-1 rounded-2xl border border-line bg-paper p-1 sm:inline-flex sm:rounded-full sm:p-1.5"
      >
        {tabs.map((t, i) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={`flex flex-col items-center gap-0.5 whitespace-nowrap rounded-xl px-1 py-2.5 text-[13px] font-semibold transition sm:flex-row sm:items-baseline sm:gap-2 sm:rounded-full sm:px-5 sm:text-sm ${
                selected ? "bg-ink text-paper shadow-sm" : "text-ink hover:bg-white"
              }`}
            >
              {t.label}
              <span className={`text-[11px] font-medium sm:text-xs ${selected ? "text-paper/70" : "text-muted"}`}>{t.meta}</span>
            </button>
          );
        })}
      </div>

      {/* Landing pages */}
      <div id="panel-landing" role="tabpanel" aria-labelledby="tab-landing" hidden={active !== "landing"} className="mt-8">
        <p className="max-w-2xl text-muted">
          One concept per kind of buyer. Each is a real, responsive page you can open and scroll on your phone, not just a picture.
        </p>
        <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-6">
          {featuredCases.map((c, i) => (
            <div key={c.slug} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
              <LandingCard c={c} large={i < 2} />
            </div>
          ))}
        </div>

        <section aria-labelledby="redesign-title" className="mt-16 rounded-3xl border border-line bg-paper p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h3 id="redesign-title" className="text-xl font-bold">Before and after: a redesign concept</h3>
            <ConceptBadge />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {redesign.brand} is a fictional local business. We made the dated "before" page ourselves to show the kind of upgrade we do: from "please call" for every price to booking online with clear prices.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <figure>
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <img src={redesign.before.src} alt="Before (concept): a dated plumbing homepage with a blue gradient header, a scrolling special-offer banner, a sidebar menu, 'please call' prices and a visitor counter" width={960} height={720} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top" />
              </div>
              <figcaption className="mt-2 text-sm"><span className="font-semibold">Before</span> <span className="text-muted">· dated, no booking, no prices (made by us)</span></figcaption>
            </figure>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-line bg-white">
                <img src={redesign.after.src} alt="After (concept): a clean plumbing homepage with a quick-booking form in the hero, a fixed call-out price, services and a bathroom photo" width={960} height={720} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top" />
              </div>
              <figcaption className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                <span><span className="font-semibold">After</span> <span className="text-muted">· booking first, clear prices</span></span>
                <a href={redesign.after.demo} target="_blank" rel="noopener" className="font-semibold underline decoration-2 underline-offset-4 hover:text-accent">
                  Open live demo <span aria-hidden="true">↗</span><span className="sr-only"> (Pipewren concept, new tab)</span>
                </a>
              </figcaption>
            </figure>
          </div>
        </section>
        <PanelFooter offer="landing" cta="Get a page like this" note="custom design, copy written for you, delivered in 48 hours." more="/work/landing-pages/" moreLabel="See more examples" />
      </div>

      {/* Thumbnails */}
      <div id="panel-thumbnails" role="tabpanel" aria-labelledby="tab-thumbnails" hidden={active !== "thumbnails"} className="mt-8">
        <p className="max-w-2xl text-muted">Seven niches, built at 1280×720. Every channel is fictional. Click any thumbnail to open it full size.</p>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-muted">A/B pairs: two concepts for the same video</h3>
        <div className="mt-4 grid gap-6">
          {pairs.map((pair) => (
            <div key={pair[0].pair!.id} className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
              <p className="text-sm"><span className="font-semibold">{pair[0].niche}</span> <span className="text-muted">· "{pair[0].title}"</span></p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {pair.map((t) => (
                  <figure key={t.id}>
                    <Thumb t={t} sizes="(min-width: 1152px) 520px, (min-width: 640px) 45vw, 100vw" />
                    <figcaption className="mt-2 text-xs text-muted">
                      <span className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-paper">{t.pair!.variant}</span>
                      {t.pair!.angle}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Concept · fictional channel</p>
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-sm font-bold uppercase tracking-[0.14em] text-muted">By niche</h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {singles.map((t) => (
            <figure key={t.id}>
              <Thumb t={t} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
              <figcaption className="mt-2 text-sm">
                <span className="font-semibold">{t.niche}</span> <span className="text-muted">· {t.title}</span>
                <span className="block text-xs text-muted">Concept · fictional channel</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <section aria-labelledby="feed-title" className="mt-12 rounded-2xl border border-line bg-white p-4 sm:p-6">
          <h3 id="feed-title" className="text-sm font-bold uppercase tracking-[0.14em] text-muted">At feed size</h3>
          <p className="mt-1 text-sm text-muted">The same thumbnails as they'd appear small in a video grid, where they have to work at a glance. Generic layout, no platform interface.</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-7">
            {feed.map((t) => (
              <li key={t.id}>
                <img src={t.small ?? t.file} alt="" width={640} height={360} loading="lazy" decoding="async" className="aspect-video w-full rounded-lg object-cover" />
                <p className="mt-1.5 line-clamp-2 text-[13px] font-semibold leading-snug">{t.title}</p>
                <p className="text-[11px] text-muted">Fictional channel · {t.niche}</p>
              </li>
            ))}
          </ul>
        </section>
        <PanelFooter offer="thumbnails" cta="Get a thumbnail pack" note="4 thumbnails at 1280×720, delivered in 24 hours." more="/work/thumbnails/" moreLabel="See more examples" />
      </div>

      {/* Logos */}
      <div id="panel-logos" role="tabpanel" aria-labelledby="tab-logos" hidden={active !== "logos"} className="mt-8">
        <p className="max-w-2xl text-muted">
          Six concepts shown as mini brand systems: the mark and wordmark on light and dark, an app icon, a social avatar and a business card.
        </p>
        <div className="mt-8 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {systems.map((l) => (
            <figure key={l.id}>
              <a href={l.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl border border-line shadow-sm">
                <img
                  src={l.file}
                  srcSet={`${l.small} 800w, ${l.file} 1600w`}
                  sizes="(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"
                  alt={l.alt}
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="sr-only"> (open full size)</span>
              </a>
              <figcaption className="mt-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{l.industry}</span>
                <span className="block"><span className="font-semibold">{l.name}</span> <span className="text-muted">· {l.note}</span></span>
                <span className="block text-xs text-muted">Concept · fictional brand</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <PanelFooter offer="logo" cta="Get a logo pack" note="3 concepts, final SVG and PNG files, light and dark versions." more="/work/logos/" moreLabel="See more examples" />
      </div>
    </div>
  );
}
