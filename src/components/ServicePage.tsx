import Link from "next/link";
import { BuyButton } from "@/components/BuyButton";
import { turnaroundLabel } from "@/components/OfferCards";
import { LandingCard, LogoFigure, PanelFooter, RedesignBlock, ThumbFigure } from "@/components/SampleCards";
import {
  Breadcrumb,
  CtaSection,
  FaqSection,
  HeroCollage,
  HeroSection,
  HowSection,
  PricingSection,
  WhoSection,
  WorkSection,
  heroTicks,
  heroTitleClass,
  heroTitleClassLong,
  heroTitleClassXLong,
} from "@/components/HomeSections";
import { cases, formatPrice, getOffer, getOption, logoSamples, site, thumbSamples, type Buyable, type OfferOption } from "@/lib/site";
import { getService, type SampleSet, type ServicePage as Service } from "@/lib/services";

/**
 * Every /services/<slug>/ page (service, price and niche pages) is built from the homepage section partials in
 * HomeSections.tsx, in the homepage order: hero, who it's for, how it works, pricing, samples, FAQ, CTA.
 * Only the copy and samples come from src/lib/services.ts. Don't add one-off layouts here.
 */

const pickCases = (slugs: string[]) => slugs.map((slug) => cases.find((c) => c.slug === slug)).filter((c): c is (typeof cases)[number] => Boolean(c));
const pickThumbs = (ids: string[]) => ids.map((id) => thumbSamples.find((t) => t.id === id)).filter((t): t is (typeof thumbSamples)[number] => Boolean(t));
const pickLogos = (ids: string[]) => ids.map((id) => logoSamples.find((l) => l.id === id)).filter((l): l is (typeof logoSamples)[number] => Boolean(l));

/** Homepage gallery proportions: 2 large + 3 small per 5, or rows of 3 / 2 depending on the count. */
function landingSpan(n: number, i: number) {
  if (n % 3 === 0) return { cls: "lg:col-span-2", large: false };
  if (n === 5 && i >= 2) return { cls: "lg:col-span-2", large: false };
  if (n % 3 === 1 && n > 4 && i >= 4) return { cls: "lg:col-span-2", large: false };
  return { cls: "lg:col-span-3", large: true };
}

function Samples({ sm }: { sm: SampleSet }) {
  if (sm.kind === "landing") {
    const list = pickCases(sm.slugs);
    return (
      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-6">
        {list.map((c, i) => {
          const span = landingSpan(list.length, i);
          return (
            <div key={c.slug} className={span.cls}>
              <LandingCard c={c} large={span.large} />
            </div>
          );
        })}
      </div>
    );
  }
  if (sm.kind === "thumbnails") {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pickThumbs(sm.ids).map((t) => <ThumbFigure key={t.id} t={t} />)}
      </div>
    );
  }
  const list = pickLogos(sm.ids);
  return (
    <div className={`mt-8 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 ${list.length <= 3 ? "lg:grid-cols-3" : ""}`}>
      {list.map((l) => <LogoFigure key={l.id} l={l} />)}
    </div>
  );
}

function splitTitle(h1: string, accent?: string) {
  const i = accent ? h1.lastIndexOf(accent) : -1;
  if (!accent || i < 0) return { title: h1, accent: undefined, after: undefined };
  return { title: h1.slice(0, i), accent, after: h1.slice(i + accent.length) || undefined };
}

/** Hero collage in the homepage geometry, filled with this page's own samples. */
function ServiceCollage({ s }: { s: Service }) {
  return <SampleCollage sets={[s.samples, ...(s.extras?.map((x) => x.samples) ?? [])]} moreHref={s.moreHref} />;
}

/** Hero collage in the homepage geometry from any sample sets (landing pages, thumbnails or logos). Used by service, order and portfolio pages. */
export function SampleCollage({ sets, moreHref }: { sets: SampleSet[]; moreHref: string }) {
  const lcases = sets.flatMap((x) => (x.kind === "landing" ? pickCases(x.slugs) : []));
  const thumbs = sets.flatMap((x) => (x.kind === "thumbnails" ? pickThumbs(x.ids) : []));
  const logos = sets.flatMap((x) => (x.kind === "logos" ? pickLogos(x.ids) : []));
  const logoImg = (l?: (typeof logoSamples)[number]) => (l ? { src: l.small ?? l.file, width: l.size[0] / 2, height: l.size[1] / 2 } : undefined);

  if (lcases.length) {
    const c = lcases[0];
    const [w, h] = c.imageSize ?? [1200, 2200];
    const second = lcases[1];
    const logo = logos[0] ?? logoSamples.find((l) => lcases.some((x) => x.slug.startsWith(l.id)));
    return (
      <HeroCollage
        href={c.demo ?? `/work/${c.slug}/`}
        external={Boolean(c.demo)}
        main={{ src: c.image, alt: `${c.brand} sample landing page (concept, fictional brand)`, width: w, height: h }}
        srLabel={c.demo ? ` Open the ${c.brand} concept page (new tab)` : ` ${c.brand} design notes`}
        secondary={second ? { src: second.card ?? second.image, width: 960, height: 720 } : thumbs[0] ? { src: thumbs[0].small ?? thumbs[0].file, width: 640, height: 360 } : undefined}
        phone={c.mobile ? { src: c.mobile, width: 360, height: 779 } : undefined}
        logo={logoImg(logo)}
      />
    );
  }
  if (thumbs.length) {
    return (
      <HeroCollage
        href={moreHref}
        srLabel=" See more thumbnail concepts"
        stack={thumbs.slice(0, 2).map((t) => ({ src: t.file, alt: t.alt, width: 1280, height: 720 }))}
        secondary={thumbs[2] ? { src: thumbs[2].small ?? thumbs[2].file, width: 640, height: 360 } : undefined}
      />
    );
  }
  return (
    <HeroCollage
      href={moreHref}
      srLabel=" See more logo concepts"
      stack={logos.slice(0, 2).map((l) => ({ src: l.small ?? l.file, alt: l.alt, width: l.size[0] / 2, height: l.size[1] / 2 }))}
      secondary={logos[2] ? { src: logos[2].small ?? logos[2].file, width: logos[2].size[0] / 2, height: logos[2].size[1] / 2 } : undefined}
    />
  );
}

/** The monthly plans a page sells (e.g. Creator Lite and the Creator plan), in call-to-action order. */
export function pagePlans(s: Service): OfferOption[] {
  return (s.plans ?? []).map(getOption).filter((x): x is OfferOption => Boolean(x));
}

/** What a page's main call to action buys: its first plan, or else its package. */
export function pageOffer(s: Service): Buyable {
  return pagePlans(s)[0] ?? getOffer(s.offer);
}

export function serviceJsonLd(s: Service) {
  const o = getOffer(s.offer);
  const plans = pagePlans(s);
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
        offers: (plans.length ? plans : [o, ...(o.options ?? [])]).map((x) => ({
          "@type": "Offer",
          name: x.name,
          price: x.price,
          priceCurrency: "USD",
          ...(x.unit === "/month"
            ? { priceSpecification: { "@type": "UnitPriceSpecification", price: x.price, priceCurrency: "USD", unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } } }
            : {}),
          availability: "https://schema.org/InStock",
          url: x.stripeLink,
          seller: { "@id": `${site.url}/#organization` },
        })),
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
  const plans = pagePlans(s);
  const o = pageOffer(s);
  const price = formatPrice(o);
  const m = s.monthlyCopy;
  const turnaround = turnaroundLabel(o.turnaround);
  const related = s.related.map(getService).filter((r): r is Service => Boolean(r));
  const t = splitTitle(s.h1, s.h1Accent);
  // Upkeep is a monthly subscription: no turnaround clock, no revision round (Terms §5), so its copy differs; the layout doesn't.
  const monthly = o.unit === "/month";
  const cta = monthly ? "Subscribe" : "Order now";
  // Pages that sell several plans show one button per plan (same button styles and places as everywhere else).
  const planButtons = (first: string, rest: string, extra = "") =>
    plans.map((p, i) => (
      <BuyButton key={p.id} offer={p} className={`${i === 0 ? first : rest} ${extra}`.trim()}>{p.name} · {formatPrice(p)}</BuyButton>
    ));
  return (
    <>
      <HeroSection
        above={<Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/services/", label: "Services" }, { label: s.label }]} />}
        pill={s.eyebrow}
        title={t.title}
        accent={t.accent}
        after={t.after}
        titleClass={s.h1.length > 70 ? heroTitleClassXLong : s.h1.length > 48 ? heroTitleClassLong : heroTitleClass}
        body={s.intro[0]}
        actions={
          plans.length > 1 ? (
            <>{planButtons("btn-accent", "btn-ghost")}</>
          ) : (
            <>
              <BuyButton offer={o} className="btn-accent">{cta} · {price}</BuyButton>
              <a href="#work" className="btn-ghost">See sample concepts</a>
            </>
          )
        }
        ticks={m ? m.ticks : monthly ? ["Secure Stripe checkout", "Cancel any time by email", "Your site and accounts stay yours"] : heroTicks}
        stats={monthly ? [["Billing", "Monthly"], [plans.length > 1 ? "From" : "Price", price], ["Cancel", "Any time"]] : [["Turnaround", o.turnaround], ["Fixed price", price], ["Revision round", "Included"]]}
        visual={<ServiceCollage s={s} />}
      />

      <WhoSection
        eyebrow="Who it's for"
        heading="A good fit if…"
        text={s.intro[1] ?? site.reach}
        chips={s.fit}
        chipsLabel="Who this is a good fit for"
        lastChip="Remote · clients worldwide"
        sentences
      />

      <HowSection
        heading={m ? m.howHeading : monthly ? "Subscribe, email a change, it's handled. No meetings." : "Pay, send a brief, get your files. No meetings."}
        emailLabel={m ? m.emailLabel : monthly ? "Email your changes" : undefined}
        steps={
          m
            ? m.steps
            : monthly
            ? [
                { title: "Subscribe securely", body: `Stripe checkout: ${price} in USD, billed monthly in advance. No quote, no call.` },
                { title: "Email your changes", body: `Send them to ${site.email} from the email you used at checkout.` },
                { title: "We handle the edits", body: "Text and image swaps, small layout tweaks and dependency updates. Cancel any time by email." },
              ]
            : [
                { title: "Pay securely", body: `Order through Stripe checkout: ${price}, fixed. No quote, no call.` },
                { title: "Email your brief", body: `Send it to ${site.email} from the email you used at checkout.` },
                { title: "Get it delivered", body: `${turnaround} after a complete brief, with one revision round included.` },
              ]
        }
      />

      <PricingSection
        heading={m ? m.pricingHeading : `${o.name}: ${price}, fixed price in USD.`}
        intro={
          m
            ? m.pricingIntro
            : monthly
            ? "What you see is what you pay: billed monthly in advance by Stripe, cancel any time by email. Upkeep covers small edits and has no revision rounds. The one-off packages are here too, at the same fixed prices."
            : "What you see is what you pay. One revision round is included, and turnaround starts once we have your payment and brief. The other packages are here too, at the same fixed prices."
        }
        featured={s.offer}
        current={s.slug}
        linksLabel="Related services:"
        links={[...related.map((r) => ({ href: `/services/${r.slug}/`, label: r.label })), { href: "/services/", label: "All services" }]}
      >
        <div className="mt-14 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <h3 className="text-xl font-bold">{m ? m.whatYouGet : <>What you get with {monthly ? o.name : `the ${o.name.toLowerCase()}`}</>}</h3>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {s.sections.map((x) => (
                <li key={x.title} className="rounded-3xl border border-line bg-white p-6">
                  <h4 className="text-lg font-bold">{x.title}</h4>
                  <p className="mt-2 text-muted">{x.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-fit rounded-3xl border border-line bg-white p-6 lg:mt-[3.25rem]">
            <h3 className="text-lg font-bold">Not included</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {s.notIncluded.map((f) => <li key={f} className="flex gap-2"><span aria-hidden="true">–</span>{f}</li>)}
            </ul>
          </div>
        </div>
      </PricingSection>

      <WorkSection
        heading={s.workHeading ?? "The kind of work you get"}
        intro={s.workIntro ?? "Concept pieces made to show our range of styles, not client projects. Every brand, channel and product shown is fictional."}
      >
        <div className="mt-10">
          <Samples sm={s.samples} />
          {s.extras?.map((x) => (
            <div key={x.title} className="mt-16">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted">{x.title}</h3>
              {x.note && <p className="mt-2 max-w-2xl text-sm text-muted">{x.note}</p>}
              <Samples sm={x.samples} />
            </div>
          ))}
          {s.beforeAfter && <RedesignBlock />}
          <PanelFooter offer={s.offer} items={plans.length > 1 ? plans : undefined} cta={cta} note={m ? m.footerNote : monthly ? "Billed monthly, cancel any time by email." : `${turnaround} after your brief, one revision round included.`} more={s.moreHref} moreLabel="See more examples" />
        </div>
      </WorkSection>

      <FaqSection
        intro={
          <>
            More in the <Link href="/#faq" className="underline hover:text-accent">main FAQ</Link> and the <Link href="/terms/" className="underline hover:text-accent">terms</Link>. Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.
          </>
        }
        faq={s.faq}
      />

      <CtaSection
        heading={m ? m.ctaHeading : `${o.name}, ${price}. ${turnaround}.`}
        text={m ? <>{m.ctaText}</> : monthly ? <>Remote, for clients worldwide, in any industry. Subscribe online, then email your changes to {site.email}.</> : <>Remote, for clients worldwide, in any industry. Pay online, then email your brief to {site.email}.</>}
        action={
          plans.length > 1 ? (
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">{planButtons("btn-accent", "btn-ghost", "")}</div>
          ) : (
            <BuyButton offer={o} className="btn-accent relative mt-8">{cta} · {price}</BuyButton>
          )
        }
      />
    </>
  );
}
