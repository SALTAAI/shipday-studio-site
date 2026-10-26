import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { TextHero } from "@/components/HomeSections";

// GitHub Pages can't do server redirects, so /work/ (linked from older drafts) forwards
// visitors to the canonical samples page with a meta refresh + location.replace, and a plain link fallback.
// Not in the sitemap; noindex so only /work/thumbnails/ is indexed.
const target = "/work/thumbnails/";

export const metadata: Metadata = {
  ...pageMeta({
    path: target,
    title: "Sample work",
    description: "Shipday Studio sample work: YouTube thumbnail concepts across niches. Redirecting to the thumbnail examples.",
  }),
  robots: { index: false, follow: true },
};

export default function WorkRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(target)});` }} />
      <TextHero
        pill="Sample work"
        title={<>Taking you to our <span className="text-accent">samples.</span></>}
        body={<>If nothing happens, open the thumbnail examples below.</>}
        actions={
          <>
            <Link href={target} className="btn-accent">See thumbnail examples</Link>
            <Link href="/work/logos/" className="btn-ghost">Logos</Link>
            <Link href="/work/landing-pages/" className="btn-ghost">Landing pages</Link>
          </>
        }
      />
    </>
  );
}
