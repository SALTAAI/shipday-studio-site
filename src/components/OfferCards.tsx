import { offers, formatPrice } from "@/lib/site";
import { BuyButton } from "./BuyButton";

export function turnaroundLabel(t: string) {
  return t === "Ongoing" ? "Monthly, cancel any time" : `Delivered in ${t}`;
}

export function OfferCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {offers.map((o) => (
        <article
          key={o.id}
          className={`relative flex flex-col rounded-3xl border p-6 ${
            o.featured ? "border-ink bg-ink text-paper shadow-xl" : "border-line bg-white"
          }`}
        >
          {o.featured && (
            <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">Most popular</span>
          )}
          <h3 className="text-lg font-bold">{o.name}</h3>
          <p className={`mt-1 text-sm ${o.featured ? "text-paper/75" : "text-muted"}`}>{o.summary}</p>
          <p className="mt-5 text-4xl font-extrabold tracking-tight">{formatPrice(o)}</p>
          <p className={`mt-1 text-sm font-semibold ${o.featured ? "text-sun" : "text-accent"}`}>{turnaroundLabel(o.turnaround)}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {o.includes.map((i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className={o.featured ? "text-sun" : "text-accent"}>✓</span>
                {i}
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          <BuyButton offer={o} className={`mt-6 ${o.featured ? "btn-accent" : "btn-primary"} w-full`} />
        </article>
      ))}
    </div>
  );
}
