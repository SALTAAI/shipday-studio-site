import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site, offers } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const home = pageMeta({ path: "/", title: `${site.name} | Landing pages in 48h, fixed price`, description: site.description, absoluteTitle: true });

export const metadata: Metadata = {
  ...home,
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Landing pages in 48h, fixed price`, template: `%s | ${site.name}` },
  applicationName: site.name,
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0E0E12", width: "device-width", initialScale: 1 };

const org = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: `${site.url}/`,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}/og.png`,
  email: site.email,
  description: site.description,
  areaServed: { "@type": "Place", name: "Worldwide" },
  currenciesAccepted: "USD",
  paymentAccepted: "Credit card (Stripe)",
  address: { "@type": "PostalAddress", addressCountry: "CH" },
  sameAs: [site.x.url],
  knowsLanguage: "en",
  makesOffer: offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    description: o.summary,
    url: `${site.url}/order/`,
    availability: "https://schema.org/InStock",
    areaServed: { "@type": "Place", name: "Worldwide" },
    itemOffered: { "@type": "Service", name: o.name, description: o.summary },
    priceSpecification: {
      "@type": o.unit ? "UnitPriceSpecification" : "PriceSpecification",
      price: o.price,
      priceCurrency: "USD",
      ...(o.unit ? { unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } } : {}),
    },
  })),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    org,
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
