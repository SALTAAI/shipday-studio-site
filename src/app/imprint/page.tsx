import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LegalContact } from "@/components/LegalContact";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/imprint",
  title: "Imprint",
  description: "Legal notice (Impressum) for Shipday Studio: operator and contact.",
});

export default function Imprint() {
  return (
    <LegalPage title="Imprint" updated="21 October 2026">
      <h2>Operator of this website</h2>
      <LegalContact />

      <h2>Contact</h2>
      <p>
        Please contact us by email at <a href={`mailto:${site.email}`}>{site.email}</a>. Orders, briefs, questions and data protection
        requests all go to this address.
      </p>

      <h2>Business details</h2>
      <p>
        {site.legal.operator} is based in {site.legal.country}. Prices are stated in US
        dollars (USD); payments are processed by Stripe.
      </p>

      <h2>Responsible for content</h2>
      <p>{site.legal.operator}, contact as above.</p>

      <h2>Sample work</h2>
      <p>
        All brands shown as sample work on this site (Northdrift Ceramics, Quillbyte, Fennel &amp; Fig, Tidewell, Brightloom, Cobalt Owl and
        the thumbnail channels) are fictional and were created to illustrate our style. Any resemblance to real businesses is unintended.
      </p>

      <h2>Links to other websites</h2>
      <p>This site links to third-party websites such as Stripe and X. We have no control over their content and are not responsible for it.</p>
    </LegalPage>
  );
}
