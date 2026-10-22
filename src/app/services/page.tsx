import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { formatPrice, getOffer, site } from "@/lib/site";
import { turnaroundLabel } from "@/components/OfferCards";

export const metadata: Metadata = pageMeta({
  path: "/services",
  title: "Design services with fixed prices",
  description: "Landing pages ($390, 48h), YouTube thumbnail packs ($79, 24h) and logo packs ($149, 48h) at fixed prices in USD. Remote, for clients worldwide, any industry.",
});

export default function ServicesIndex() {
  return (
    <div className="container-x py-14 sm:py-20">
      <p className="eyebrow">Services</p>
      <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Fixed-price design, for any business, anywhere.</h1>
      <p className="mt-4 max-w-2xl text-muted">{site.reach} Pick the page closest to what you need to see sample concepts, what is included and what is not.</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const o = getOffer(s.offer);
          return (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}/`} className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition hover:border-ink">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{s.eyebrow}</span>
                <span className="mt-2 text-xl font-bold">{s.label}</span>
                <span className="mt-2 text-sm text-muted">{s.metaDescription}</span>
                <span className="mt-auto pt-5 text-sm font-semibold">{formatPrice(o)} · {turnaroundLabel(o.turnaround)} <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
