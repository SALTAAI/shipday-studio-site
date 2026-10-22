"use client";

import { useEffect, useState } from "react";
import { offers, site, briefMailto, type Offer, type ServiceId } from "@/lib/site";

const ids = offers.map((o) => o.id) as string[];

function deliveryLine(o: Offer | null) {
  if (!o) return "Your delivery clock starts once your brief is in, and finished files arrive by email within your package's turnaround.";
  if (o.id === "upkeep") return "Your Upkeep plan is active. Once we have your site details, send change requests any time and we handle them for you each month.";
  return `Your ${o.name.toLowerCase()} is delivered by email within ${o.turnaround} of your brief being complete, with one revision round included.`;
}

/** Reads ?product= on the client (static export) and tailors the confirmation copy. Falls back to generic copy. */
export function ThanksDetails() {
  const [offer, setOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product");
    if (p && ids.includes(p)) setOffer(offers.find((o) => o.id === (p as ServiceId)) ?? null);
  }, []);

  const steps = [
    {
      title: "We email you",
      body: (
        <>Within a few hours you&apos;ll get an email from <span className="font-semibold text-ink">{site.email}</span> to collect your brief. Check your spam folder if it doesn&apos;t show up.</>
      ),
    },
    {
      title: "Send your brief",
      body: <>Reply with what you do, who it&apos;s for, any links and the files you want included. The delivery clock starts once the brief is in.</>,
    },
    {
      title: offer?.id === "upkeep" ? "We keep it running" : "Get it shipped",
      body: <>{deliveryLine(offer)}</>,
    },
  ];

  return (
    <>
      {offer && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-line bg-white p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Your package</p>
            <p className="mt-0.5 text-lg font-bold">{offer.name}</p>
          </div>
          <p className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            {offer.id === "upkeep" ? "Monthly, cancel any time" : `Delivered in ${offer.turnaround}`}
          </p>
        </div>
      )}

      <p className="eyebrow mt-12">How it works</p>
      <h2 className="h2 mt-3">What happens next</h2>
      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="rounded-3xl border border-line bg-white p-6">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-bold text-paper">{i + 1}</span>
            <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold">Want to get ahead?</h2>
        <p className="mt-2 max-w-2xl text-muted">
          You don&apos;t have to wait for our email. Send your brief to{" "}
          <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto(offer?.name)}>{site.email}</a> now, from the email
          you used at checkout, and we&apos;ll start as soon as we&apos;ve read it.
        </p>
        <a href={briefMailto(offer?.name)} className="btn-primary mt-5">Email my brief</a>
      </div>
    </>
  );
}
