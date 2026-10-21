import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LegalContact } from "@/components/LegalContact";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/privacy",
  title: "Privacy Policy",
  description: "How Shipday Studio handles your personal data: Stripe payments, email briefs and GitHub Pages hosting. No tracking cookies.",
});

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="21 October 2026">
      <p>
        This policy explains what personal data Shipday Studio collects and why. We follow the Swiss Federal Act on Data
        Protection (FADP) and, where it applies to you, the EU General Data Protection Regulation (GDPR).
      </p>

      <h2>Who is responsible</h2>
      <LegalContact />

      <h2>What we collect</h2>
      <ul>
        <li><strong>Payment and order data:</strong> when you pay, Stripe collects your payment details. We receive your name, email address, billing country, the package you bought, the amount and the payment status. We never see your full card number.</li>
        <li><strong>Your brief and emails:</strong> whatever you email to {site.email}, such as your name, project details, links and files.</li>
        <li><strong>Technical data:</strong> when you visit this website, our hosting provider (GitHub Pages) processes your IP address and browser details to serve the pages and keep them secure. This website has no forms, no accounts, no analytics and stores nothing about you itself.</li>
      </ul>

      <h2>Why we use it</h2>
      <p>To deliver what you ordered and talk to you about it (contract), to take payment and keep required business and accounting records (legal obligation), and to keep the site secure (legitimate interest). We don&apos;t sell your data and we don&apos;t use it for advertising.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>Stripe</strong> (Stripe, Inc. and Stripe Payments Europe, Ltd.): payment processing and subscriptions. Stripe also processes data for its own fraud prevention and legal obligations; see <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.</li>
        <li><strong>GitHub</strong> (GitHub, Inc., USA): website hosting via GitHub Pages; see <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub&apos;s privacy statement</a>.</li>
        <li><strong>Our domain and email providers</strong>: emails to {site.email} are forwarded by our domain registrar to the mailbox we use to answer them.</li>
        <li><strong>AI and design tools</strong> used to produce your work, limited to the parts of your brief needed for your project.</li>
      </ul>
      <p>Some of these providers process data outside Switzerland, including in the EU and the USA. Where that happens we rely on adequacy decisions (such as the Swiss-US Data Privacy Framework, where the provider is certified) or standard contractual clauses.</p>

      <h2>How long we keep it</h2>
      <p>Project data is kept for as long as needed to deliver and support the work, and normally deleted within 24 months of your last order. Payment records and accounting documents are kept for 10 years, as Swiss law requires.</p>

      <h2>Cookies</h2>
      <p>This website sets no cookies and uses no tracking or analytics. Stripe&apos;s checkout pages, which open on stripe.com, may use cookies needed for payment and fraud prevention under Stripe&apos;s own policy.</p>

      <h2>Your rights</h2>
      <p>You can ask to see, correct or delete your personal data, ask for a copy, or object to how we use it. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we&apos;ll answer within 30 days. You may also complain to the Swiss Federal Data Protection and Information Commissioner (FDPIC) or, in the EU, your local data protection authority.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>
    </LegalPage>
  );
}
