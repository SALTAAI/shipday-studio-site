import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { cases, formatPrice, getOffer, kitSamples, logoSamples, redesign, thumbSamples, type Buyable, type ServiceId } from "@/lib/site";

/** Sample-work cards shared by the homepage gallery and every service page, so they always look the same. */

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

export function PanelFooter({ offer, items, cta, note, more, moreLabel }: { offer: ServiceId; items?: Buyable[]; cta: string; note: string; more: string; moreLabel: string }) {
  // `items` lists several plans (e.g. Creator Lite and the Creator plan); otherwise the package itself.
  const list: Buyable[] = items?.length ? items : [getOffer(offer)];
  const many = list.length > 1;
  return (
    <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted">
        <span className="font-semibold text-ink">{list.map((o) => `${o.name} · ${formatPrice(o)}`).join(" or ")}</span> · {note}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href={more} className="btn-ghost px-5 py-2.5 text-center text-sm">{moreLabel} →</Link>
        {list.map((o) => (
          <BuyButton key={o.id} offer={o} className="btn-primary px-5 py-2.5 text-center text-sm">{many ? o.name : cta} · {formatPrice(o)}</BuyButton>
        ))}
      </div>
    </div>
  );
}

export function LandingCard({ c, large }: { c: (typeof cases)[number]; large: boolean }) {
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
            src={c.card ?? c.image}
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
        {c.segment && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{c.segment}</p>}
        <h3 className="mt-1 text-lg font-bold">{c.brand}</h3>
        <p className="text-sm text-muted">{c.kind} · {c.style}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {c.demo && (
            <a href={c.demo} target="_blank" rel="noopener" className="underline decoration-2 underline-offset-4 hover:text-accent">
              See the design <span aria-hidden="true">↗</span>
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

export function Thumb({ t, sizes, priority = false }: { t: (typeof thumbSamples)[number]; sizes: string; priority?: boolean }) {
  return (
    <a href={t.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-line bg-ink shadow-sm">
      <img
        src={t.file}

        sizes={t.small ? sizes : undefined}
        alt={t.alt}
        width={1280}
        height={720}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="aspect-video w-full object-cover"
      />
      <span className="sr-only"> (open larger preview)</span>
    </a>
  );
}

/** Pipewren before/after redesign concept (homepage landing tab and the redesign-related service pages). */
export function RedesignBlock() {
  return (
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
              See the design <span aria-hidden="true">↗</span><span className="sr-only"> (Pipewren concept, new tab)</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** One thumbnail with its caption, in the homepage "By niche" style. */
export function ThumbFigure({ t }: { t: (typeof thumbSamples)[number] }) {
  return (
    <figure>
      <Thumb t={t} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
      <figcaption className="mt-2 text-sm">
        <span className="font-semibold">{t.niche}{t.pair ? ` · version ${t.pair.variant}` : ""}</span> <span className="text-muted">· {t.pair ? t.pair.angle : t.title}</span>
        <span className="block text-xs text-muted">{t.concept ?? "Concept · fictional channel"}</span>
      </figcaption>
    </figure>
  );
}

/** One logo board with its caption, in the homepage logo-tab style. */
export function LogoFigure({ l }: { l: (typeof logoSamples)[number] }) {
  return (
    <figure>
      <a href={l.file} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <img
          src={l.file}

          sizes={l.small ? "(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw" : undefined}
          alt={l.alt}
          width={l.size[0]}
          height={l.size[1]}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="sr-only"> (open larger preview)</span>
      </a>
      <figcaption className="mt-2 text-sm">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{l.industry}</span>
        <span className="block"><span className="font-semibold">{l.name}</span> <span className="text-muted">· {l.note}</span></span>
        <span className="block text-xs text-muted">Concept · fictional brand</span>
      </figcaption>
    </figure>
  );
}

/** One Channel Launch Kit board (banner, profile picture, logo and a thumbnail together), in the logo-board style. */
export function KitFigure({ k }: { k: (typeof kitSamples)[number] }) {
  return (
    <figure>
      <a href={k.board} target="_blank" rel="noopener" className="block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <img
          src={k.board}

          sizes="(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"
          alt={k.alt}
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="sr-only"> (open larger preview)</span>
      </a>
      <figcaption className="mt-2 text-sm">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{k.niche}</span>
        <span className="block"><span className="font-semibold">{k.channel}</span> <span className="text-muted">· {k.note}</span></span>
        <span className="block text-xs text-muted">Concept · fictional channel</span>
      </figcaption>
    </figure>
  );
}
