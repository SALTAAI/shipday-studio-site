# Funnel diagnosis — Shipday Studio t114u 27 Oct 2026 (Europe/Zurich)

## Numbers
- **Stripe acct_1UT2zlITWxIMUnKV:** 24 Checkout Sessions; **0 real paid charges**. One `complete` was $0 (promo to hello@). Rest expired/open unpaid.
- **Site-tagged abandons (`client_reference_id=site`):** most unpaid sessions. Top clicked offer = **thumbnail-single $20**, then creator / launch kit / landing / logo / pack. Almost no `customer_email` → drop **before email** on Stripe Checkout.
- **Outreach 27 Oct:** ~7 buyers queued; **5/7 lapsed-not-sent** (browser-dispatch latency). 1 public reply sent (@drairfn). **0 buyer replies → 0 outreach checkouts.**
- **Vercel:** no shipdaystudio.com project on connected team (site is **GitHub Pages**). No Vercel analytics here.
- **Homepage before patch:** hero sold landing $390; $20 buried as a text option. Demand (Stripe + X) is thumbnails $20/$79.

## Single biggest leak
**Buyers open the $20 Stripe Checkout and abandon before email, while the homepage still featured the $390 landing as flagship.**

Secondary: 5/7 ready buyers tonight never got the message; sent outreach often lacked a pay link.

## Shipped this turn
Site conversion elevating Try 1 thumbnail · $20 (homepage + /order + OfferCards dual Buy + FAQ/heroTicks). Quality gate PASS on local build. Templates + follow-ups + Query 7 in this folder / data/fresh-lead-queries.md (data/ is gitignored in the site repo — parent must sync via standby kit).
