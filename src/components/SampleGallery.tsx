"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { BuyButton } from "@/components/BuyButton";
import { cases, featuredLogos, featuredThumbnails, formatPrice, getOffer, logos, thumbnails, type ServiceId } from "@/lib/site";

type TabId = "landing" | "thumbnails" | "logos";

const tabs: { id: TabId; label: string; offer: ServiceId; meta: string }[] = [
  { id: "landing", label: "Landing pages", offer: "landing", meta: "$390 · 48h" },
  { id: "thumbnails", label: "Thumbnails", offer: "thumbnails", meta: "$79 · 4 per pack" },
  { id: "logos", label: "Logos", offer: "logo", meta: "$149 · 3 concepts" },
];

function ConceptBadge({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
        dark ? "bg-ink/80 text-paper backdrop-blur" : "bg-sun/40 text-ink"
      }`}
    >
      Concept · fictional brand
    </span>
  );
}

function PanelFooter({ offer, cta, note }: { offer: ServiceId; cta: string; note: string }) {
  const o = getOffer(offer);
  return (
    <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:p-6">
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">{o.name} · {formatPrice(o)}</span> · {note}
      </p>
      <BuyButton offer={o} className="btn-primary px-5 py-2.5 text-sm">{cta} · {formatPrice(o)}</BuyButton>
    </div>
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

  const newCases = cases.filter((c) => c.card);
  const olderCases = cases.filter((c) => !c.card);

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
        <div className="grid gap-6 md:grid-cols-3">
          {newCases.map((c) => (
            <Link key={c.slug} href={`/work/${c.slug}/`} className="group block">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <div className="flex items-center gap-1.5 border-b border-line bg-paper px-3 py-2">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-ink/15" />
                  <span className="ml-2 min-w-0 flex-1 truncate text-[11px] text-muted">{c.slug}.example</span>
                  <ConceptBadge />
                </div>
                <img
                  src={c.card}
                  alt={`${c.brand} homepage concept: ${c.style?.toLowerCase()} design for a fictional ${c.kind.toLowerCase()}`}
                  width={960}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.style}</p>
                <p className="mt-1 text-lg font-bold group-hover:text-accent">{c.brand} →</p>
                <p className="text-sm text-muted">{c.kind}</p>
              </div>
            </Link>
          ))}
        </div>

        <h3 className="mt-12 text-sm font-bold uppercase tracking-[0.14em] text-muted">Earlier concepts</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {olderCases.map((c) => (
            <Link key={c.slug} href={`/work/${c.slug}/`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-3 hover:border-ink">
              <img src={c.image} alt="" width={1200} height={2200} loading="lazy" decoding="async" className="h-16 w-16 shrink-0 rounded-lg border border-line object-cover object-top" />
              <span className="min-w-0">
                <span className="block truncate text-sm text-muted">{c.kind} · fictional</span>
                <span className="block font-semibold group-hover:text-accent">{c.brand} →</span>
              </span>
            </Link>
          ))}
        </div>
        <PanelFooter offer="landing" cta="Get a page like this" note="custom design, copy written for you, delivered in 48 hours." />
      </div>

      {/* Thumbnails */}
      <div id="panel-thumbnails" role="tabpanel" aria-labelledby="tab-thumbnails" hidden={active !== "thumbnails"} className="mt-8">
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {featuredThumbnails.map((t, i) => (
            <figure key={t.file} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <div className="relative overflow-hidden rounded-2xl border border-line bg-ink shadow-sm">
                <img
                  src={t.file}
                  srcSet={`${t.small} 640w, ${t.file} 1280w`}
                  sizes={i === 0 ? "(min-width: 1152px) 720px, (min-width: 768px) 66vw, 100vw" : "(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw"}
                  alt={t.alt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 text-sm">
                <span className="font-semibold">{t.niche}</span> <span className="text-muted">· {t.title}</span>
                <span className="block text-xs text-muted">Concept · fictional channel</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <h3 className="mt-12 text-sm font-bold uppercase tracking-[0.14em] text-muted">Earlier concepts</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {thumbnails.map((t) => (
            <img key={t.file} src={t.file} alt={t.alt} width={1280} height={720} loading="lazy" decoding="async" className="w-full rounded-lg border border-line" />
          ))}
        </div>
        <PanelFooter offer="thumbnails" cta="Get a thumbnail pack" note="4 thumbnails at 1280×720, delivered in 24 hours." />
      </div>

      {/* Logos */}
      <div id="panel-logos" role="tabpanel" aria-labelledby="tab-logos" hidden={active !== "logos"} className="mt-8">
        <div className="grid gap-5 md:grid-cols-2">
          {featuredLogos.map((l, i) => (
            <figure key={l.file} className={i === 0 ? "md:col-span-2" : ""}>
              <img
                src={l.file}
                srcSet={`${l.small} 800w, ${l.file} 1600w`}
                sizes={i === 0 ? "(min-width: 1152px) 1088px, 100vw" : "(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"}
                alt={l.alt}
                width={1600}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[2/1] w-full rounded-2xl border border-line object-cover shadow-sm"
              />
              <figcaption className="mt-2 text-sm">
                <span className="font-semibold">{l.name}</span> <span className="text-muted">· {l.note} · light &amp; dark</span>
                <span className="block text-xs text-muted">Concept · fictional brand</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <h3 className="mt-12 text-sm font-bold uppercase tracking-[0.14em] text-muted">Earlier concepts</h3>
        <div className="mt-4 grid max-w-xl grid-cols-3 gap-3">
          {logos.map((l) => (
            <figure key={l.file}>
              <img src={l.file} alt={`${l.name} logo, ${l.note.toLowerCase()} (fictional)`} width={600} height={600} loading="lazy" decoding="async" className="w-full rounded-xl border border-line" />
              <figcaption className="mt-1.5 truncate text-xs text-muted">{l.name} · {l.note}</figcaption>
            </figure>
          ))}
        </div>
        <PanelFooter offer="logo" cta="Get a logo pack" note="3 concepts, final SVG and PNG files, light and dark versions." />
      </div>
    </div>
  );
}
