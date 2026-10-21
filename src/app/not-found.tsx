import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head back to Shipday Studio's fixed-price design packages.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center sm:py-32">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">This page didn&apos;t ship.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        The link may be old or mistyped. Try one of these instead, or email{" "}
        <a className="underline hover:text-accent" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/#offers" className="btn-ghost">See prices</Link>
        <Link href="/order/" className="btn-ghost">Order</Link>
      </div>
    </div>
  );
}
