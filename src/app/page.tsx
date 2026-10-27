import Link from "next/link";
import type { Metadata } from "next";
import { BuyButton } from "@/components/BuyButton";
import { cases, faq, industries, logoSamples, steps, thumbSamples, site, getOffer, getOption, formatPrice } from "@/lib/site";
import { SampleGallery } from "@/components/SampleGallery";
import { CtaSection, FaqSection, HeroCollage, HeroSection, HowSection, PricingSection, WhoSection, WorkSection, heroTicks } from "@/components/HomeSections";
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
  title: `${site.name} | Thumbnails from $20, logos & pages`,
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
      <HeroSection
        pill="Remote · clients worldwide · fixed prices in USD"
        title="Thumbnails, logos and pages, "
        accent="shipped in days."
        body={
          <>
              Fixed-price design for businesses, creators and brands anywhere in the world. Try one YouTube thumbnail
              for $20 — first order preview in 6 hours, or a full refund. Or pick a pack, logo or landing page. No
              calls, no quotes, no scope creep.
          </>
        }
        actions={
          <>
            <BuyButton offer={getOption("thumbnail-single")!} className="btn-accent">Try 1 thumbnail · $20</BuyButton>
            <a href="#offers" className="btn-ghost">See all prices</a>
          </>
        }
        ticks={heroTicks}
        stats={[["1 thumbnail", "$20"], ["4 thumbnails", "$79"], ["Landing page", "48h"]]}
        visual={
          <HeroCollage
            href={heroCase.demo ?? `/work/${heroCase.slug}/`}
            external={Boolean(heroCase.demo)}
            main={{ src: heroCase.image, alt: `${heroCase.brand} sample landing page (concept, fictional brand)`, width: heroW, height: heroH }}
            srLabel={heroCase.demo ? ` See the ${heroCase.brand} design (new tab)` : ` ${heroCase.brand} design notes`}
            secondary={{ src: heroThumb.small ?? heroThumb.file, width: 640, height: 360 }}
            logo={{ src: heroLogo.small ?? heroLogo.file, width: heroLogo.size[0] / 2, height: heroLogo.size[1] / 2 }}
          />
        }
      />

      <WhoSection
        eyebrow="Who we work with"
        heading="Any business, any industry, anywhere."
        text={site.reach}
        chips={industries}
        chipsLabel="Industries we design for"
        lastChip="…and whatever you sell"
      />

      <HowSection heading="Pay, send a brief, get your files. No meetings." steps={steps} />

      <PricingSection
        heading="Packages. Fixed prices in USD."
        intro="What you see is what you pay. Start with 1 thumbnail for $20 (first order: preview in 6h or a full refund), or pick a pack, logo or landing page. Every one-off package includes one revision round."
        featured="thumbnails"
        linksLabel="Details and samples by need:"
        links={services.map((s) => ({ href: `/services/${s.slug}/`, label: s.label }))}
      />

      <WorkSection
        heading="The kind of thing we ship"
        intro="These are concept pieces made to show our style, not client projects. Every brand, channel and product shown is fictional."
      >
        <SampleGallery />
      </WorkSection>

      <FaqSection
        intro={<>Something else? Email <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.</>}
        faq={faq}
      />

      <CtaSection
        heading="Ship it this week."
        text={<>Try 1 thumbnail for $20, or pick a pack. Pay online, then email your brief to {site.email}. First thumbnail order: preview in 6h, or a full refund.</>}
        action={<BuyButton offer={getOption("thumbnail-single")!} className="btn-accent relative mt-8">Try 1 thumbnail · $20</BuyButton>}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
