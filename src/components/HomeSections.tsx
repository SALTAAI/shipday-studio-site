import Link from "next/link";
import type { ReactNode } from "react";
import { OfferCards } from "@/components/OfferCards";
import { ConceptBadge } from "@/components/SampleCards";
import { briefMailto, type ServiceId } from "@/lib/site";

/**
 * The homepage layout, split into section partials. The homepage and every service / niche page are built from
 * these same blocks (hero, who, how it works, pricing, samples, FAQ, CTA), so the pages can't drift apart.
 * Change a section here and it changes everywhere.
 */

type Img = { src: string; width: number; height: number };

export function HeroCollage({
  href,
  external,
  srLabel,
  main,
  stack,
  secondary,
  phone,
  logo,
  badge,
}: {
  href: string;
  external?: boolean;
  srLabel: string;
  /** One tall image filling the 4:5 frame (homepage: a full landing page screenshot). */
  main?: Img & { alt: string };
  /** Alternative to `main`: a few landscape images stacked inside the frame (thumbnails, logo boards). */
  stack?: (Img & { alt: string })[];
  /** Landscape image overlapping the bottom-left corner. */
  secondary?: Img;
  /** Phone screenshot overlapping the bottom-left corner, when there is no landscape image. */
  phone?: Img;
  /** Square image overlapping the top-right corner. */
  logo?: Img;
  /** Concept badge label (defaults to "Concept · fictional brand"). */
  badge?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener" : undefined}
        className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-ink shadow-2xl"
      >
        {main && <img src={main.src} alt={main.alt} className="w-full transition duration-500 group-hover:scale-[1.015]" width={main.width} height={main.height} fetchPriority="high" />}
        {stack && (
          <span className="flex h-full flex-col justify-center gap-4 p-5 pb-14 sm:p-7 sm:pb-16">
            {stack.map((s, i) => (
              <img key={s.src} src={s.src} alt={s.alt} width={s.width} height={s.height} fetchPriority={i === 0 ? "high" : undefined} className="min-h-0 w-full flex-1 rounded-xl object-cover transition duration-500 group-hover:scale-[1.015]" />
            ))}
          </span>
        )}
        <span className="absolute bottom-4 right-4"><ConceptBadge dark label={badge} /></span>
        <span className="sr-only">{srLabel}</span>
      </a>
      {secondary && (
        <img
          src={secondary.src}
          alt=""
          width={secondary.width}
          height={secondary.height}
          className="pointer-events-none absolute -bottom-6 -left-4 w-1/2 rotate-[-4deg] rounded-xl border-4 border-white shadow-xl sm:-left-10"
        />
      )}
      {!secondary && phone && (
        <img
          src={phone.src}
          alt=""
          width={phone.width}
          height={phone.height}
          className="pointer-events-none absolute -bottom-6 -left-4 aspect-[360/779] w-[28%] rotate-[-4deg] rounded-[18px] border-4 border-white bg-white object-cover object-top shadow-xl sm:-left-10"
        />
      )}
      {logo && (
        <img
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          className="pointer-events-none absolute -right-3 -top-5 aspect-square w-1/5 rotate-[6deg] sm:w-1/4 lg:-top-12 rounded-2xl border-4 border-white object-cover object-left shadow-xl"
        />
      )}
    </div>
  );
}

export const heroTitleClass = "mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl";
/** Same title style for longer service headlines, one step smaller so the hero keeps the homepage proportions. */
export const heroTitleClassLong = "mt-6 text-balance text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl";
/** For the longest headlines (70+ characters). */
export const heroTitleClassXLong = "mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]";

export function HeroSection({
  above,
  pill,
  title,
  accent,
  after,
  titleClass = heroTitleClass,
  body,
  note,
  actions,
  ticks,
  stats,
  visual,
}: {
  above?: ReactNode;
  pill: string;
  title: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  titleClass?: string;
  body: ReactNode;
  /** Optional line under the body (e.g. the "sample concept" notice on design-notes pages). */
  note?: ReactNode;
  actions: ReactNode;
  ticks: string[];
  stats: [string, string][];
  visual: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-flame/15 blur-3xl" />
      <div className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {above}
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />{" " + pill}
          </p>
          <h1 className={titleClass}>
            {title}{accent ? <span className="text-accent">{accent}</span> : null}{after || null}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{body}</p>
          {note}
          <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted" aria-label="Order guarantees">
            {ticks.map((t) => (
              <li key={t}><span aria-hidden="true" className="text-accent">✓</span>{" " + t}</li>
            ))}
          </ul>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
            {stats.map(([dt, dd]) => (
              <div key={dt}><dt className="text-muted">{dt}</dt><dd className="text-xl font-bold">{dd}</dd></div>
            ))}
          </dl>
        </div>
        {visual}
      </div>
    </section>
  );
}

export const heroTicks = ["Secure Stripe checkout", "First thumbnail order: 6h preview or full refund", "You own the final files"];

export function WhoSection({
  eyebrow,
  heading,
  text,
  chips,
  chipsLabel,
  lastChip,
  sentences = false,
}: {
  eyebrow: string;
  heading: string;
  text: ReactNode;
  chips: string[];
  chipsLabel: string;
  lastChip: string;
  /** Chips that hold full sentences get a softer radius so multi-line chips still read as cards. */
  sentences?: boolean;
}) {
  const shape = sentences ? "rounded-2xl" : "rounded-full";
  return (
    <section aria-labelledby="who-heading" className="pb-16 sm:pb-20">
      <div className="container-x grid gap-6 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-10">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="who-heading" className="mt-3 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}</h2>
          <p className="mt-2 text-muted">{text}</p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label={chipsLabel}>
          {chips.map((i) => (
            <li key={i} className={`${shape} border border-line bg-white px-3.5 py-1.5 text-sm font-medium`}>{i}</li>
          ))}
          <li className={`${shape} border border-accent/30 bg-accent/5 px-3.5 py-1.5 text-sm font-semibold text-accent`}>{lastChip}</li>
        </ul>
      </div>
    </section>
  );
}

export function HowSection({ heading, steps, emailLabel = "Email your brief" }: { heading: string; steps: { title: string; body: string }[]; emailLabel?: string }) {
  return (
    <section id="how" className="border-y border-line bg-white py-20">
      <div className="container-x">
        <p className="eyebrow">How it works</p>
        <h2 className="h2 mt-3">{heading}</h2>
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
          <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto()}>{emailLabel}</a>{" "}
          from the address you used at checkout.
        </p>
      </div>
    </section>
  );
}

export function PricingSection({
  heading,
  intro,
  featured,
  current,
  children,
  linksLabel,
  links,
}: {
  heading: string;
  intro: ReactNode;
  featured?: ServiceId;
  /** Slug of the /services/ page being rendered, so its own card doesn't link to itself. */
  current?: string;
  children?: ReactNode;
  linksLabel: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section id="offers" className="py-20">
      <div className="container-x">
        <p className="eyebrow">Pricing</p>
        <h2 className="h2 mt-3">{heading}</h2>
        <p className="mt-3 max-w-2xl text-muted">{intro}</p>
        <div className="mt-12"><OfferCards featured={featured} current={current} /></div>
        {children}
        <p className="mt-8 text-sm text-muted">
          {linksLabel}{" "}
          {links.map((s, i) => (
            <span key={s.href}>
              {i > 0 && " · "}
              <Link href={s.href} className="font-semibold text-ink underline decoration-line underline-offset-4 hover:text-accent">{s.label}</Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export function WorkSection({ heading, intro, children }: { heading: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section id="work" className="border-y border-line bg-white py-20">
      <div className="container-x">
        <p className="eyebrow">Sample concepts</p>
        <h2 className="h2 mt-3">{heading}</h2>
        <p className="mt-3 max-w-2xl text-muted">{intro}</p>
        {children}
      </div>
    </section>
  );
}

export function FaqSection({ intro, faq }: { intro: ReactNode; faq: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-3">Questions, answered</h2>
          <p className="mt-3 text-muted">{intro}</p>
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
  );
}

export function CtaSection({ heading, text, action }: { heading: string; text: ReactNode; action: ReactNode }) {
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-paper sm:px-12 sm:py-20">
        <div aria-hidden="true" className="absolute -bottom-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-flame/40 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-5xl">{heading}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-paper/80">{text}</p>
        {action}
      </div>
    </section>
  );
}

/** Breadcrumb trail shown above the hero pill on deeper pages (service pages, sample design notes). */
export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      {items.map((it, i) => (
        <span key={it.label}>
          {i > 0 && <> <span aria-hidden="true">/</span>{" "}</>}
          {it.href ? <Link href={it.href} className="hover:text-accent">{it.label}</Link> : <span aria-current="page">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Generic content section in the homepage rhythm: eyebrow, h2, intro, then the page's own content. `band` = white full-width band like "How it works" and "Samples". */
export function ContentSection({
  id,
  eyebrow,
  heading,
  intro,
  band = false,
  children,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  intro?: ReactNode;
  band?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={band ? "border-y border-line bg-white py-20" : "py-20"}>
      <div className="container-x">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2 mt-3">{heading}</h2>
        {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Text-only hero for legal pages: same pill, title typography, glow and spacing as the homepage hero, without the collage. */
export function TextHero({ pill, title, body, actions }: { pill: string; title: ReactNode; body: ReactNode; actions?: ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-flame/15 blur-3xl" />
      <div className="container-x py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" /> {pill}
          </p>
          <h1 className={heroTitleClass}>{title}</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{body}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
