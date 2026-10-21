import type { NextConfig } from "next";

// Pure static export (out/), hosted on GitHub Pages. Payments go straight to
// Stripe Payment Links; briefs are emailed to hello@shipdaystudio.com.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
