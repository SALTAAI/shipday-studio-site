import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = pageMeta({
  path: "/work/thumbnails",
  title: "YouTube thumbnail examples: 1 for $20, 4 for $79",
  description: "YouTube thumbnail concepts across niches, including A/B pairs. Order 1 for $20 or 4 for $79 total, in 24h. First order: preview in 6h or a full refund.",
  image: { url: "/og/work-thumbnails.png", alt: "Shipday Studio thumbnail examples: 1 for $20, 4 for $79 total, first preview in 6h" },
});

// Thumbnail-specific answers (the generic site FAQ talks about hosting and Upkeep). Same wording as the thumbnail service pages.
const thumbFaq = [
  { q: "What if I don't like the first one?", a: "On your first order (the $20 single or the $79 pack), the first thumbnail comes as a watermarked preview. Tell us within 7 days that it's not for you and we refund you in full. No back and forth. Say it works and you get the clean files. If it's close, we'll fix it in your revision round instead." },
  { q: "How fast is the first thumbnail?", a: "On a first order the preview arrives within 6 hours of your complete brief. For a pack, once you say it works, the other three follow within 24 hours, in the same look." },
  { q: "What should I send in the brief?", a: "Your channel link, the video titles or topics, any face shots or frames you want used, and a few thumbnails you like from other channels. Five minutes is plenty. If something is missing we ask by email, and the clock pauses until you reply." },
  { q: "One thumbnail, a pack or a plan?", a: "Trying us out: 1 thumbnail for $20. A batch of uploads: 4 thumbnails for $79 total. About one upload a week: Creator Lite, 4 a month for $79/mo. Two or three a week: the Creator plan, 12 a month for $179/mo. Monthly plans cancel any time. Starting a channel: the Channel Launch Kit is a logo, banner, profile picture and 4 thumbnails for $199." },
  { q: "Is this made with AI?", a: "Production is AI-assisted: the scene is generated or composed for each thumbnail, then we add the text, finish it and quality-check it before delivery, with one revision round included. If you need thumbnails made without AI, we're not the right fit." },
  { q: "What size are the thumbnails?", a: "1280×720 (16:9), YouTube's recommended size, with the editable source file. We check every title at the size it shows on a phone. Roblox experience thumbnails use the same 16:9 size." },
  { q: "Do I own the thumbnails?", a: "Yes. Once paid, you own the final thumbnails and can use them however you like. Previews on this site are watermarked; clients get clean files." },
  { q: "Are the samples from real channels?", a: "No. Every sample on this page is a concept for a fictional channel, made to show the range of styles we design." },
  { q: "What currency do you charge in?", a: "All prices are in US dollars (USD), paid up front through Stripe checkout. Your bank may convert at its own rate." },
];

export default function ThumbnailsIndex() {
  return (
    <WorkIndex
      kind="thumbnails"
      offer="thumbnails"
      current="/work/thumbnails/"
      title="Thumbnail examples"
      intro="Thumbnail concepts for gaming, finance, tech, education, travel, documentary, faceless channels, Roblox games and more, all at 1280×720. Click any thumbnail for a larger preview. Previews on this site are watermarked; clients get clean files."
      cta="Get a thumbnail pack"
      entry={{ id: "thumbnail-single", label: "Try 1 thumbnail" }}
      ticks={["First order: preview in 6h, or a full refund", "Secure Stripe checkout", "You own the final files"]}
      stats={[["First preview", "6h"], ["1 thumbnail", "$20"], ["4 thumbnails", "$79"]]}
      pricingHeading="Thumbnails: 1 for $20, 4 for $79 total, or monthly."
      pricingIntro="What you see is what you pay, in USD. First order with us (the $20 single or the $79 pack)? Your first thumbnail lands within 6 hours as a watermarked preview, and if it's not for you, you get a full refund. Every one-off order includes one revision round."
      ctaHeading="Try 1 thumbnail for $20. Delivered in 24h."
      ctaText="First order: your preview lands within 6 hours, or you get a full refund. Like it? 4 thumbnails are $79 total."
      faq={thumbFaq}
    />
  );
}
