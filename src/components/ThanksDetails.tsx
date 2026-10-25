"use client";

import { useEffect, useState } from "react";
import { allOffers, site, briefMailto } from "@/lib/site";

type Purchase = ReturnType<typeof allOffers>[number];
const all = allOffers();

function briefLine(o: Purchase | null) {
  const id = o?.id;
  if (id === "thumbnails") return "Tell us your channel and the 4 videos (a working title each is enough). Exact words, a look to match and any photos help, but we can pick sensible defaults. The delivery clock starts once the brief is in.";
  if (id === "thumbnail-single" || id === "creator-lite" || id === "creator-plan") return "Tell us your channel and the video (a working title is enough). Exact words, a look to match and any photos help, but we can pick sensible defaults. The delivery clock starts once the brief is in.";
  if (id === "launch-kit") return "Tell us the exact channel name, what it's about and your first 4 videos (a working title each). Looks you like and any photos help. The delivery clock starts once the brief is in.";
  if (id === "logo") return "Tell us the exact name, what the business does and who it's for. Styles you like or want to avoid help too. The delivery clock starts once the brief is in.";
  if (id === "upkeep") return "Send your site URL, how we get access and the first change you'd like.";
  return "Reply with what you do, who it's for, any links and the files you want included. The delivery clock starts once the brief is in.";
}

function deliveryLine(o: Purchase | null) {
  if (!o) return "Your delivery clock starts once your brief is in, and finished files arrive by email within your package's turnaround.";
  if (o.id === "creator-lite") return "Your Creator Lite plan is active. Send a brief for each thumbnail (up to 1 a week, 4 a month) and each one is delivered by email within 24h of its brief being complete, with one revision round included.";
  if (o.id === "launch-kit") return "Your Channel Launch Kit (logo, channel banner, profile picture and 4 thumbnails) is delivered by email within 48h of your brief being complete, with one revision round included.";
  if (o.id === "creator-plan") return "Your Creator plan is active. Send a brief for each thumbnail (up to 3 a week, 12 a month) and each one is delivered by email within 24h of its brief being complete, with one revision round included.";
  if (o.id === "upkeep") return "Your Upkeep plan is active. Once we have your site details, send change requests any time and we handle them for you each month.";
  return `Your ${o.name.toLowerCase()} is delivered by email within ${o.turnaround} of your brief being complete, with one revision round included.`;
}

/** Reads ?product= on the client (static export) and tailors the confirmation copy. Falls back to generic copy. */
export function ThanksDetails() {
  const [offer, setOffer] = useState<Purchase | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product");
    if (p) setOffer(all.find((o) => o.id === p) ?? null);
  }, []);

  const steps = [
    {
      title: "We email you",
      body: (
        <>Usually within the hour you&apos;ll get an email from <span className="font-semibold text-ink">{site.email}</span> to collect your brief. Check your spam folder if it doesn&apos;t show up.</>
      ),
    },
    {
      title: "Send your brief",
      body: <>{briefLine(offer)}</>,
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
            {offer.unit === "/month" ? "Monthly, cancel any time" : `Delivered in ${offer.turnaround}`}
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
          <a className="font-semibold text-ink underline hover:text-accent" href={briefMailto(offer?.name, offer?.id)}>{site.email}</a> now, from the email
          you used at checkout, and we&apos;ll start as soon as we&apos;ve read it.
        </p>
        <a href={briefMailto(offer?.name, offer?.id)} className="btn-primary mt-5">Email my brief</a>
      </div>
    </>
  );
}
