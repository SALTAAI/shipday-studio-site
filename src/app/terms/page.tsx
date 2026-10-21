import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site, offers, formatPrice } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  path: "/terms",
  title: "Terms of Service",
  description: "Plain-English terms for Shipday Studio orders: prices, turnaround, revisions, refunds and ownership.",
});

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="21 October 2026">
      <p>
        These terms apply to every order placed with Shipday Studio, Switzerland (&quot;we&quot;, &quot;us&quot;;
        operator details in the <Link href="/imprint/">Imprint</Link>). By paying for a package you (&quot;you&quot;, the client) agree
        to these terms.
      </p>

      <h2>1. What we offer</h2>
      <p>We sell fixed-price design packages. What each package includes is described on our website at the time you order:</p>
      <ul>
        {offers.map((o) => (
          <li key={o.id}>
            <strong>{o.name}</strong>: {formatPrice(o)}
            {o.turnaround === "Ongoing" ? ", billed monthly" : `, delivered within ${o.turnaround}`}. Includes: {o.includes.map((i) => i.charAt(0).toLowerCase() + i.slice(1)).join(", ")}.
          </li>
        ))}
      </ul>

      <h2>2. How ordering works</h2>
      <ol>
        <li>You pay for a package through a Stripe checkout page linked from our website. Stripe sends you a receipt.</li>
        <li>You email your brief (what you need, links and files) to <a href={`mailto:${site.email}`}>{site.email}</a>, ideally from the email you used at checkout.</li>
        <li>We confirm by email when we start work, and deliver the finished files (or, for landing pages, the live site) by email.</li>
      </ol>
      <p>We don&apos;t run customer accounts or an order system of our own; your order is the Stripe payment plus our email exchange.</p>

      <h2>3. Prices and payment</h2>
      <ul>
        <li>All prices are in US dollars (USD) and are fixed for the package described.</li>
        <li>One-off packages are paid in full upfront. Upkeep is a subscription billed monthly in advance by Stripe.</li>
        <li>Any taxes or fees that apply are shown on the Stripe checkout page before you pay. Your bank or card provider may charge currency conversion fees.</li>
      </ul>

      <h2>4. Turnaround</h2>
      <p>
        Turnaround (24h or 48h, depending on the package) starts once we have both your payment and a complete brief. If we need more
        information we&apos;ll ask by email, and the clock pauses until you answer. If we miss the stated turnaround, tell us and
        we&apos;ll prioritise your order; if we can&apos;t deliver at all, you get a full refund.
      </p>

      <h2>5. Revisions</h2>
      <p>
        Each one-off package (landing page, thumbnail pack, logo pack) includes <strong>one revision round</strong>: one consolidated list
        of changes, sent within 14 days of delivery, that stays within the original brief. We deliver revisions within the same
        turnaround as the original package. New features, new directions or extra rounds can be quoted separately. Upkeep covers small
        edits as described in the plan and has no revision rounds.
      </p>

      <h2>6. Refunds and cancellation</h2>
      <ul>
        <li><strong>Before work starts:</strong> cancel by email for a full refund, no questions asked. Work starts when we email you to confirm we&apos;ve begun.</li>
        <li><strong>After work starts:</strong> because the work is custom, we don&apos;t refund it, but we&apos;ll use your revision round to put things right.</li>
        <li><strong>If we can&apos;t deliver:</strong> full refund.</li>
        <li><strong>Upkeep:</strong> cancel any time by emailing {site.email}. It stops at the end of the month you&apos;ve already paid for; partial months aren&apos;t refunded.</li>
      </ul>
      <p>Refunds go back to the original payment method through Stripe.</p>

      <h2>7. Your responsibilities</h2>
      <p>
        You confirm that any text, images, logos or other material you send us is yours or that you have permission to use it,
        and that your content is lawful. You are responsible for checking the final work (including facts, prices and legal
        statements on your own site) before you publish it.
      </p>

      <h2>8. Ownership</h2>
      <p>
        Once you&apos;ve paid in full, you own the final deliverables and may use them for any purpose. Unused concepts and
        drafts remain ours. We may show the work in our portfolio only with your permission. Third-party items (such as fonts,
        stock images or hosting services) stay subject to their own licences.
      </p>

      <h2>9. How we work</h2>
      <p>
        We use AI-assisted tools as part of our production process. Every deliverable is reviewed by a person before it is sent.
        We don&apos;t knowingly copy third-party work, and we&apos;ll fix any problem you report with material we created.
      </p>

      <h2>10. Hosting and accounts</h2>
      <p>For landing pages, we deploy to hosting and domain accounts in your name. You keep control of those accounts and pay any fees charged by the providers.</p>

      <h2>11. Liability</h2>
      <p>
        To the extent permitted by Swiss law, our total liability for any order is limited to the amount you paid for it, and we
        are not liable for indirect losses such as lost profits or data. Nothing in these terms limits liability for intent or
        gross negligence.
      </p>

      <h2>12. Governing law</h2>
      <p>These terms are governed by Swiss law. The courts at the operator&apos;s registered place of business in Switzerland have jurisdiction, unless mandatory consumer law gives you the right to sue where you live.</p>

      <h2>13. Contact</h2>
      <p>
        Shipday Studio, <a href={`mailto:${site.email}`}>{site.email}</a>, operator details in the <Link href="/imprint/">Imprint</Link>.
      </p>
    </LegalPage>
  );
}
