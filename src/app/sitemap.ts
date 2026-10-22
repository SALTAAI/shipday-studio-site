import type { MetadataRoute } from "next";
import { cases, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Trailing slashes match the exported URLs (next.config trailingSlash: true), so no redirect hop.
  const paths = ["/", "/order/", "/work/landing-pages/", "/work/thumbnails/", "/work/logos/", ...cases.map((c) => `/work/${c.slug}/`), "/terms/", "/privacy/", "/imprint/"];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : p === "/order/" ? 0.8 : 0.5 }));
}
