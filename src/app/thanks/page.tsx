import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { ThanksDetails } from "@/components/ThanksDetails";
import { TextHero } from "@/components/HomeSections";

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
    <>
      <TextHero
        pill="Order confirmed"
        title={<>Thank you. <span className="text-accent">You&apos;re in the queue.</span></>}
        body={<>Your payment went through and Stripe has emailed you a receipt. Nothing else to do right now: we&apos;ll be in touch shortly.</>}
      />
      <section className="border-y border-line bg-white py-20">
        <div className="container-x">
          <ThanksDetails />
        </div>
      </section>
      <section className="py-20">
        <div className="container-x">
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold">Questions?</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Reply to your Stripe receipt or email{" "}
              <a className="font-semibold text-ink underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>. We read and answer every message.
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
      </section>
    </>
  );
}
