"use client";

import Link from "next/link";
import { useState } from "react";
import { cases, logoSamples, looks, thumbSamples, type Look } from "@/lib/site";

type Kind = "landing" | "thumbnails" | "logos";

type Item = {
  industry: string;
  look: Look;
};

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-full text-xs font-semibold uppercase tracking-[0.14em] text-muted sm:w-auto">{label}</span>
      {["All", ...options].map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
            value === o ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink hover:border-ink"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">{children}</span>;
}

export function WorkFilter({ kind }: { kind: Kind }) {
  const items: Item[] = kind === "landing" ? cases : kind === "thumbnails" ? thumbSamples.map((t) => ({ ...t, industry: t.niche })) : logoSamples;
  const industries = [...new Set(items.map((i) => i.industry))].sort();
  const [industry, setIndustry] = useState("All");
  const [look, setLook] = useState("All");
  const visible = (i: Item) => (industry === "All" || i.industry === industry) && (look === "All" || i.look === look);
  const count = items.filter(visible).length;
  const noun = kind === "landing" ? "landing pages" : kind === "thumbnails" ? "thumbnails" : "logos";

  return (
    <div>
      <div className="space-y-3 rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <FilterGroup label={kind === "thumbnails" ? "Niche" : "Industry"} options={industries} value={industry} onChange={setIndustry} />
        <FilterGroup label="Look" options={looks} value={look} onChange={setLook} />
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Showing {count} of {items.length} {noun}
        {count === 0 && (
          <>
            {" "}·{" "}
            <button type="button" className="font-semibold text-ink underline" onClick={() => { setIndustry("All"); setLook("All"); }}>
              Clear filters
            </button>
          </>
        )}
      </p>

      {kind === "landing" && (
        <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <li key={c.slug} hidden={!visible(c)}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <img
                  src={c.card ?? c.image}
                  alt={`${c.brand} homepage concept: ${(c.style ?? c.kind).toLowerCase()} for a fictional ${c.kind.toLowerCase()}`}
                  width={c.card ? 960 : (c.imageSize?.[0] ?? 1200)}
                  height={c.card ? 720 : (c.imageSize?.[1] ?? 2200)}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5"><Tag>{c.industry}</Tag><Tag>{c.look}</Tag></div>
              <h2 className="mt-2 text-lg font-bold">{c.brand}</h2>
              <p className="text-sm text-muted">{c.kind} · Concept, fictional brand</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
                {c.demo && (
                  <a href={c.demo} target="_blank" rel="noopener" className="underline decoration-2 underline-offset-4 hover:text-accent">
                    See the design <span aria-hidden="true">↗</span><span className="sr-only"> ({c.brand}, new tab)</span>
                  </a>
                )}
                <Link href={`/work/${c.slug}/`} className="text-muted hover:text-accent">
                  Design notes <span aria-hidden="true">→</span><span className="sr-only"> for {c.brand}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {kind === "thumbnails" && (
        <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {thumbSamples.map((t) => (
            <li key={t.id} hidden={!visible({ ...t, industry: t.niche })}>
              <a href={t.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-line bg-ink shadow-sm">
                <img
                  src={t.file}
                  srcSet={t.small ? `${t.small} 640w, ${t.file} 1280w` : undefined}
                  sizes={t.small ? "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" : undefined}
                  alt={t.alt}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover"
                />
                <span className="sr-only"> (open full size)</span>
              </a>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag>{t.niche}</Tag><Tag>{t.look}</Tag>{t.pair && <Tag>A/B pair · {t.pair.variant}</Tag>}
              </div>
              <p className="mt-2 font-semibold">{t.title}</p>
              <p className="text-xs text-muted">{t.concept ?? "Concept · fictional channel"}</p>
            </li>
          ))}
        </ul>
      )}

      {kind === "logos" && (
        <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {logoSamples.map((l) => (
            <li key={l.id} hidden={!visible(l)}>
              <a href={l.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <img
                  src={l.small ?? l.file}
                  alt={l.alt}
                  width={l.small ? l.size[0] / 2 : l.size[0]}
                  height={l.small ? l.size[1] / 2 : l.size[1]}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: `${l.size[0]} / ${l.size[1]}` }}
                  className="w-full object-cover"
                />
                <span className="sr-only"> (open full size)</span>
              </a>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag>{l.industry}</Tag><Tag>{l.look}</Tag>{l.system && <Tag>Brand system</Tag>}
              </div>
              <p className="mt-2 font-semibold">{l.name} <span className="font-normal text-muted">· {l.note}</span></p>
              <p className="text-xs text-muted">Concept · fictional brand</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
