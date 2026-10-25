import Link from "next/link";
import { offers, formatPrice, type ServiceId } from "@/lib/site";
import { BuyButton } from "./BuyButton";

/** Each package's price explainer page under /services/. */
const explainer: Record<ServiceId, { slug: string; label: string }> = {
  landing: { slug: "landing-page-price", label: "What's included" },
  thumbnails: { slug: "youtube-thumbnail-price", label: "What's included" },
  logo: { slug: "logo-design-price", label: "What's included" },
  upkeep: { slug: "website-upkeep-price", label: "What Upkeep covers" },
};

/** Extra explainer links inside a card, e.g. the monthly thumbnail plans page in the thumbnail card. */
const moreExplainers: Partial<Record<ServiceId, { slug: string; label: string }[]>> = {
  thumbnails: [{ slug: "youtube-thumbnail-subscription", label: "Monthly plans explained" }],
  logo: [{ slug: "youtube-channel-branding", label: "Channel Launch Kit explained" }],
};

export function turnaroundLabel(t: string) {
  return t === "Ongoing" ? "Monthly, cancel any time" : `Delivered in ${t}`;
}

/** The homepage pricing cards. `featured` highlights one package (service pages); default is the flagship. */
export function OfferCards({ featured, current }: { featured?: ServiceId; current?: string } = {}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {offers.map((o) => {
        const isFeatured = featured ? o.id === featured : Boolean(o.featured);
        const badge = o.featured ? "Flagship package" : "Best fit for this page";
        return (
        <article
          key={o.id}
          className={`relative flex flex-col rounded-3xl border p-6 ${
            isFeatured ? "border-ink bg-ink text-paper shadow-xl" : "border-line bg-white"
          }`}
        >
          {isFeatured && (
            <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">{badge}</span>
          )}
          <h3 className="text-lg font-bold">{o.name}</h3>
          <p className={`mt-1 text-sm ${isFeatured ? "text-paper/75" : "text-muted"}`}>{o.summary}</p>
          <p className="mt-5 text-4xl font-extrabold tracking-tight">{formatPrice(o)}</p>
          <p className={`mt-1 text-sm font-semibold ${isFeatured ? "text-sun" : "text-accent"}`}>{turnaroundLabel(o.turnaround)}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {o.includes.map((i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className={isFeatured ? "text-sun" : "text-accent"}>✓</span>
                {i}
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          {o.options && (
            <div className={`mt-6 border-t pt-4 text-sm ${isFeatured ? "border-paper/20" : "border-line"}`}>
              {o.packLabel && <p className="font-semibold">{o.packLabel}</p>}
              <ul className="mt-2 space-y-2">
                {o.options.map((x) => (
                  <li key={x.id}>
                    <a
                      href={x.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-offer={x.id}
                      className={`font-semibold underline underline-offset-4 ${isFeatured ? "text-paper/85 hover:text-sun" : "text-ink hover:text-accent"}`}
                    >
                      {x.label}<span className="sr-only"> (opens Stripe checkout in a new tab)</span> <span aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {explainer[o.id].slug !== current && (
            <Link
              href={`/services/${explainer[o.id].slug}/`}
              className={`mt-6 text-sm font-semibold underline underline-offset-4 ${isFeatured ? "text-paper/85 hover:text-sun" : "text-ink hover:text-accent"}`}
            >
              {explainer[o.id].label}<span className="sr-only">: {o.name}</span> <span aria-hidden="true">→</span>
            </Link>
          )}
          {(moreExplainers[o.id] ?? []).filter((x) => x.slug !== current).map((x) => (
            <Link
              key={x.slug}
              href={`/services/${x.slug}/`}
              className={`mt-3 text-sm font-semibold underline underline-offset-4 ${isFeatured ? "text-paper/85 hover:text-sun" : "text-ink hover:text-accent"}`}
            >
              {x.label}<span className="sr-only">: {o.name}</span> <span aria-hidden="true">→</span>
            </Link>
          ))}
          <BuyButton offer={o} className={`mt-6 ${isFeatured ? "btn-accent" : "btn-primary"} w-full`} />
        </article>
        );
      })}
    </div>
  );
}
