import type { Offer } from "@/lib/site";
import { formatPrice } from "@/lib/site";

/** Link to the offer's live Stripe Payment Link. Opens checkout in a new tab so the brief instructions stay visible. */
export function BuyButton({ offer, className = "", children }: { offer: Offer; className?: string; children?: React.ReactNode }) {
  return (
    <a href={offer.stripeLink} target="_blank" rel="noopener noreferrer" className={`whitespace-nowrap ${className}`} data-offer={offer.id}>
      {children ?? (offer.unit ? <>Subscribe · ${offer.price}/mo</> : <>Buy now · {formatPrice(offer)}</>)}
      <span className="sr-only"> ({offer.name}, opens Stripe checkout in a new tab)</span>
    </a>
  );
}
