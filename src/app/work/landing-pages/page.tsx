import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = pageMeta({
  path: "/work/landing-pages",
  title: "Landing page examples",
  description: "Landing page concepts across industries, from clean and simple to rich and detailed, with design notes and full designs. All brands are fictional.",
});

export default function LandingPagesIndex() {
  return (
    <WorkIndex
      kind="landing"
      offer="landing"
      current="/work/landing-pages/"
      title="Landing page examples"
      intro="Concept pages for SaaS, courses, restaurants, clinics, games, trades and more. Most let you see the full design and scroll it on any screen size. Filter by industry or by look."
      cta="Get a landing page"
    />
  );
}
