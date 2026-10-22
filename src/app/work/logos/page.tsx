import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = pageMeta({
  path: "/work/logos",
  title: "Logo examples",
  description: "Logo concepts and mini brand systems across industries, shown on light and dark, from clean and simple to rich and detailed. All brands are fictional.",
});

export default function LogosIndex() {
  return (
    <WorkIndex
      kind="logos"
      offer="logo"
      current="/work/logos/"
      title="Logo examples"
      intro="Logo concepts for startups, restaurants, fashion, esports, firms, kids' clubs and local businesses, each shown on light and dark. Six include a full mini brand system."
      cta="Get a logo pack"
    />
  );
}
