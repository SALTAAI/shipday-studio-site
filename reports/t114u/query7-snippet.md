## Query 7 — channel banners / YouTube channel art / branding kits (added 27 Oct 2026 t114u)
In scope (Channel Launch Kit $199, logo pack $149). **Out of scope: Twitch overlays, emotes, Discord assets** — do not add those phrases.

**Lead-hunt only** (not fast-scan Read A/B; 1 extra public read when budget ≥4 left):
```
("need a youtube banner" OR "need a channel banner" OR "looking for a channel banner" OR "need channel art" OR "looking for channel art" OR "need a youtube banner designer" OR "channel branding" OR "youtube branding kit" OR "need a banner and logo" OR "logo and banner" OR "banner + logo" OR "banner and pfp") ("looking for" OR need OR hiring OR lf OR "anyone know" OR recommend) -is:retweet -is:reply -"for hire" -"dm for" -commissions -"my portfolio" -overlay -emotes -"twitch overlay"
```

**Measured note:** not volume-tested yet. Drop sellers by bio; drop pure Twitch/Discord asset asks; keep YouTube/Roblox channel banner + logo buyers (map to Launch Kit $199 or logo $149).

**Routine prompt lines to update (parent / lease owner):**
- `routines/live/shipday-studio-lead-hunt.txt` SEARCH step (~line 61): add `e) banners/channel art: run Query 7 from data/fresh-lead-queries.md`.
- `routines/live/shipday-studio-peak-fast-scan.txt` stays Read A + Read B only (budget). Do **not** add Query 7 to the 5-min fast scan.
- Also change the fast-scan contact copy that says "Don't give a price unless they asked" → "Always end with price + Stripe Payment Link (`?client_reference_id=x-dm|x-reply|reddit`) per RULES pay-path (t114u)."

## Reddit / Contra (no-spend sources, 27 Oct t114u)
- Reddit already scanned via multireddit: CreatorServices, DesignJobs, forhire, B2BForHire, HungryArtists, slavelabour, NewTubers, youtubers, startups, SaaS, logodesign, smallbusiness. Keep; prefer `[Hiring]` + thumbnail|logo|banner|website under 60 min.
- **Contra:** account is signed in on the box browser. Parent should open Contra Jobs (design / branding / YouTube) each peak window, filter Paid, and hand qualifying jobs to the same outbound gate + preview path. No Contra query string lives in this file yet — browser-only.
