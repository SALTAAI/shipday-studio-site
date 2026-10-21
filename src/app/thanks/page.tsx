import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { ThanksDetails } from "@/components/ThanksDetails";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/thanks",
    title: "Thank you, your order is confirmed",
    description: "Your Shipday Studio order is confirmed. Here's what happens next.",
  }),
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <div className="container-x py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </div>
        <p className="eyebrow mt-6">Order confirmed</p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Thank you. You&apos;re in the queue.</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Your payment went through and Stripe has emailed you a receipt. Nothing else to do right now: we&apos;ll be in touch shortly.
        </p>

        <ThanksDetails />

        <div className="mt-10 rounded-3xl border border-line p-6 sm:p-8">
          <h2 className="text-xl font-bold">Questions?</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Reply to your Stripe receipt or email{" "}
            <a className="font-semibold text-ink underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>. A human reads every message.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-ghost">Back home</Link>
            <Link href="/#work" className="btn-ghost">See sample work</Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            Full refund if we haven&apos;t started work. See the <Link className="underline hover:text-accent" href="/terms/">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
