import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { CtaSection, TextHero } from "@/components/HomeSections";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head back to Shipday Studio's fixed-price design packages.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <TextHero
        pill="Error 404"
        title={<>This page <span className="text-accent">didn&apos;t ship.</span></>}
        body={
          <>
            The link may be old or mistyped. Try one of these instead, or email{" "}
            <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.
          </>
        }
        actions={
          <>
            <Link href="/" className="btn-accent">Back home</Link>
            <Link href="/#offers" className="btn-ghost">See prices</Link>
            <Link href="/order/" className="btn-ghost">Order</Link>
          </>
        }
      />
      <CtaSection
        heading="Ship it this week."
        text={<>Pay online, then email your brief to {site.email}. The clock starts once we have both.</>}
        action={<Link href="/order/" className="btn-accent relative mt-8">Start your order</Link>}
      />
    </>
  );
}
