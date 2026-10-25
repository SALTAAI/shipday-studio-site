import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { cases, faq, formatPrice, getOffer, logoSamples, site, steps, thumbSamples, type ServiceId } from "@/lib/site";
import { turnaroundLabel } from "@/components/OfferCards";
import { pageOffer, pagePlans } from "@/components/ServicePage";
import { CtaSection, ContentSection, FaqSection, HeroCollage, HeroSection, HowSection, PricingSection, heroTicks, heroTitleClassLong } from "@/components/HomeSections";

export const metadata: Metadata = pageMeta({
  path: "/services",
  title: "Design services with fixed prices",
  description: "Landing pages ($390, 48h), thumbnail packs ($79, 24h), logo packs ($149, 48h) and upkeep ($49/month), fixed prices in USD. Remote, worldwide, any industry.",
});

/** Services grouped by package, in the order of the pricing cards. */
const groups = [
  { offer: "landing" as const, title: "Landing pages" },
  { offer: "thumbnails" as const, title: "YouTube thumbnails" },
  { offer: "logo" as const, title: "Logos" },
  { offer: "upkeep" as const, title: "Website upkeep" },
];

export default function ServicesIndex() {
  const heroCase = cases.find((c) => c.slug === "halvenna-studio") ?? cases[0];
  const [w, h] = heroCase.imageSize ?? [1200, 2200];
  const heroThumb = thumbSamples.find((t) => t.id === "gaming-b") ?? thumbSamples[1];
  const heroLogo = logoSamples.find((l) => l.id === "osteria-fennella") ?? logoSamples[1];
  const listed = new Set<ServiceId>(groups.map((g) => g.offer));
  return (
    <>
      <HeroSection
        pill="Remote · clients worldwide · fixed prices in USD"
        title="Fixed-price design, "
        accent="for any business, anywhere."
        titleClass={heroTitleClassLong}
        body={<>{site.reach} Pick the page closest to what you need to see sample concepts, what is included and what is not.</>}
        actions={
          <>
            <a href="#services" className="btn-accent">Browse services</a>
            <a href="#offers" className="btn-ghost">See all prices</a>
          </>
        }
        ticks={heroTicks}
        stats={[["Landing page", "48h"], ["Thumbnails", "24h"], ["Revision round", "Included"]]}
        visual={
          <HeroCollage
            href={`/work/${heroCase.slug}/`}
            main={{ src: heroCase.image, alt: `${heroCase.brand} sample landing page (concept, fictional brand)`, width: w, height: h }}
            srLabel={` ${heroCase.brand} design notes`}
            secondary={{ src: heroThumb.small ?? heroThumb.file, width: 640, height: 360 }}
            logo={{ src: heroLogo.small ?? heroLogo.file, width: heroLogo.size[0] / 2, height: heroLogo.size[1] / 2 }}
          />
        }
      />

      <ContentSection id="services" band eyebrow="Services" heading="Pick the page closest to what you need.">
        {groups.map((g) => {
          const items = services.filter((s) => s.offer === g.offer || (g.offer === "landing" && !listed.has(s.offer)));
          if (!items.length) return null;
          const o = getOffer(g.offer);
          return (
            <div key={g.offer} className="mt-12">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">{g.title} · {formatPrice(o)} · {turnaroundLabel(o.turnaround)}</h3>
              <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => {
                  const so = pageOffer(s);
                  const from = pagePlans(s).length > 1 ? "From " : "";
                  return (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}/`} className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition hover:border-ink">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{s.eyebrow}</span>
                        <span className="mt-2 text-xl font-bold">{s.label}</span>
                        <span className="mt-2 text-sm text-muted">{s.metaDescription}</span>
                        <span className="mt-auto pt-5 text-sm font-semibold">{from}{formatPrice(so)} · {turnaroundLabel(so.turnaround)} <span aria-hidden="true">→</span></span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </ContentSection>

      <HowSection heading="Pay, send a brief, get your files. No meetings." steps={steps} />

      <PricingSection
        heading="Four packages. Fixed prices in USD."
        intro="What you see is what you pay. Every one-off package includes one revision round, and turnaround starts once we have your payment and brief."
        linksLabel="Browse samples:"
        links={[
          { href: "/work/landing-pages/", label: "Landing page examples" },
          { href: "/work/thumbnails/", label: "Thumbnail examples" },
          { href: "/work/logos/", label: "Logo examples" },
        ]}
      />

      <FaqSection
        intro={<>Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.</>}
        faq={faq}
      />

      <CtaSection
        heading="Ship it this week."
        text={<>Pay online, then email your brief to {site.email}. The clock starts once we have both.</>}
        action={<Link href="/order/" className="btn-accent relative mt-8">Start your order</Link>}
      />
    </>
  );
}
