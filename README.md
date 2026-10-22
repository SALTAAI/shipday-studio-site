# Shipday Studio: shipdaystudio.com

The marketing and order site for **Shipday Studio**, based in Switzerland (operator details: `/imprint`).
It's a fixed-price design studio for creators and founders.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Runtime dependencies: `next`, `react` and `react-dom`, nothing else.

## Commands (keep memory low)
```bash
export NODE_OPTIONS=--max-old-space-size=2048 NEXT_TELEMETRY_DISABLED=1
npm install
npm run build          # one build at a time -> out/
npm run serve          # GitHub-Pages-like static server for out/ on :4310 (404.html, trailing-slash redirects)
npm run assets         # regenerate sample-work SVGs (scripts/gen-assets.mjs)
npm run screens        # 390px + 1440px full-page screenshots into screens/ (server must be running)
npm run check-links    # crawl the served export for broken internal links / anchors
./scripts/backup.sh    # mirror the project to the persistent agent store, plus a git bundle
```

## Structure
- `src/lib/site.ts`: every piece of content: offers, prices and live Stripe Payment Links, steps, FAQ, case studies, sample assets
- `src/app/page.tsx`: home (hero, how it works, offers, sample work, FAQ, CTA)
- `src/app/order/`: lists the 4 services with Stripe "Pay" buttons; briefs are emailed to hello@shipdaystudio.com
- `src/app/work/[slug]`: 6 concept case studies (3 newer v2 + 3 originals), statically generated
- `src/app/terms`, `src/app/privacy`, `src/app/imprint`: legal pages (operator shown as "Shipday Studio, Switzerland, hello@shipdaystudio.com"; no personal name or street address is published anywhere)
- `src/lib/seo.ts`: per-page title/description/canonical/OG/Twitter helper
- `src/app/sitemap.ts`, `robots.ts`, `icon.svg`, `apple-icon.png`, `favicon.ico`, `public/og.png`, `public/site.webmanifest`, `public/icon-*.png`, `public/CNAME`
- `public/work/`: original sample SVGs (3 landing pages, 6 thumbnails, 3 logos). All of the brands are fictional.
- `public/work/v2/`: newer concept samples as optimised WebP (3 landing pages rendered from HTML, 3 photo thumbnails, 3 logo light/dark boards), shown first in the tabbed gallery (`src/components/SampleGallery.tsx`). All brands and channels are fictional.
- `scripts/og.html`: source for `public/og.png` (render it with headless Chrome at 1200×630)

## Static export and hosting
`output: "export"` in `next.config.ts`: `npm run build` writes a fully static site to `out/`. There is no server code.
Hosted on GitHub Pages (custom domain shipdaystudio.com). Payment Links live in `stripe-catalog.json` / `site.ts`.

## Notes
- DNS is on Namecheap with email forwarding (hello@ -> owner). Never replace the MX / forwarding records when changing hosts.
- Branding: marketing copy shows the location as "Switzerland" only; no personal name or city outside the legal pages.
- Legal: `/terms`, `/privacy` and `/imprint` are plain-English drafts, not legal advice; have them reviewed.
