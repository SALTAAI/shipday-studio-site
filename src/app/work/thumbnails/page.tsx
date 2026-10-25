import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = pageMeta({
  path: "/work/thumbnails",
  title: "Thumbnail examples",
  description: "YouTube thumbnail concepts across niches, including A/B pairs, from clean and simple to rich and detailed. All channels are fictional.",
});

export default function ThumbnailsIndex() {
  return (
    <WorkIndex
      kind="thumbnails"
      offer="thumbnails"
      current="/work/thumbnails/"
      title="Thumbnail examples"
      intro="Thumbnail concepts for gaming, finance, tech, education, travel, documentary, faceless channels, Roblox games and more, all at 1280×720. Click any thumbnail to open it full size."
      cta="Get a thumbnail pack"
    />
  );
}
