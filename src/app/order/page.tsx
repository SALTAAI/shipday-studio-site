import Link from "next/link";
import type { Metadata } from "next";
import { offers, formatPrice, site, briefMailto } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { BuyButton } from "@/components/BuyButton";
import { turnaroundLabel } from "@/components/OfferCards";

export const metadata: Metadata = pageMeta({
  path: "/order",
  title: "Order a fixed-price design package",
  description: "Pay for a landing page ($390, 48h), thumbnail pack ($79, 24h), logo pack ($149, 48h) or monthly upkeep ($49/mo) via Stripe, then email your brief.",
});

const howTo = [
  { title: "Pay with Stripe", body: "Pick a package below. Checkout opens securely on Stripe in a new tab." },
  { title: "Email your brief", body: `Send it to ${site.email} from the email you used at checkout: what you do, who it's for, links and files.` },
  { title: "Get your delivery", body: "We confirm we've started, then deliver by email within the stated turnaround. One revision round is included on one-off packages." },
];

export default function OrderPage() {
  return (
    <div className="container-x py-14 sm:py-20">
      <p className="eyebrow">Order</p>
      <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Pick a package and pay</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Prices are fixed and in USD. Turnaround starts once we have both your payment and your brief.
      </p>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {howTo.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
            <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-paper">{i + 1}</span>
            <span><span className="block font-semibold">{s.title}</span><span className="mt-1 block text-muted">{s.body}</span></span>
          </li>
        ))}
      </ol>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {offers.map((o) => (
          <li key={o.id} className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{o.name}</h2>
                <p className="text-sm font-semibold text-accent">{turnaroundLabel(o.turnaround)}</p>
              </div>
              <span className="text-2xl font-extrabold">{formatPrice(o)}</span>
            </div>
            <p className="text-sm text-muted">{o.summary}</p>
            <ul className="space-y-1 text-sm">
              {o.includes.map((i) => (
                <li key={i} className="flex gap-2"><span aria-hidden="true" className="text-accent">✓</span>{i}</li>
              ))}
            </ul>
            <BuyButton offer={o} className={`${o.featured ? "btn-accent" : "btn-primary"} mt-auto w-full`} />
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold">After paying: send your brief</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Email <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto()}>{site.email}</a> with what you do, who
          it&apos;s for, any links and the files you want included. If anything is missing we&apos;ll ask, and the clock pauses until you reply.
        </p>
        <a href={briefMailto()} className="btn-primary mt-5">Email my brief</a>
        <p className="mt-6 text-sm text-muted">
          One revision round included on one-off packages. Full refund if we haven&apos;t started work. Upkeep can be cancelled any time by email.
          See the <Link className="underline hover:text-accent" href="/terms/">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}
