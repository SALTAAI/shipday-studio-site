import type { Metadata } from "next";
import { site } from "./site";

export const ogImage = { url: "/og.png", width: 1200, height: 630, alt: "Shipday Studio: YouTube thumbnails, 1 for $20, 4 for $79, back in 24h" };

/** Per-page metadata with a trailing-slash canonical (matches trailingSlash: true), Open Graph and Twitter card. */
export function pageMeta({ path, title, description, absoluteTitle = false, image }: { path: string; title: string; description: string; absoluteTitle?: boolean; image?: { url: string; alt: string } }): Metadata {
  const img = image ? { url: image.url, width: 1200, height: 630, alt: image.alt } : ogImage;
  const url = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, siteName: site.name, locale: "en_US", title: fullTitle, description, images: [img] },
    twitter: { card: "summary_large_image", site: site.x.handle, title: fullTitle, description, images: [img.url] },
  };
}
