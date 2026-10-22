import type { MetadataRoute } from "next";
import { cases, site } from "@/lib/site";
import { services } from "@/lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Trailing slashes match the exported URLs (next.config trailingSlash: true), so no redirect hop.
  const paths = ["/", "/order/", "/services/", ...services.map((s) => `/services/${s.slug}/`), "/work/landing-pages/", "/work/thumbnails/", "/work/logos/", ...cases.map((c) => `/work/${c.slug}/`), "/terms/", "/privacy/", "/imprint/"];
  const lastModified = new Date();
  const priority = (p: string) => (p === "/" ? 1 : p === "/order/" || p.startsWith("/services/") ? 0.8 : ["/terms/", "/privacy/", "/imprint/"].includes(p) ? 0.3 : 0.5);
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified, changeFrequency: "monthly", priority: priority(p) }));
}
