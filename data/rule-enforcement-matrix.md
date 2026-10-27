# Rule enforcement matrix (AK t113u, 27 Oct 2026)

Fail-closed inventory of standing rules vs code gates. Status: ENFORCED | PARTIAL | NONE | SOFT (judgment / platform).
Updated with the t113u strengthen pass (outbound_gate + preflight_send + emails + run_health audit).

| # | rule | source | enforced by | test | status |
|---|------|--------|-------------|------|--------|
| 1 | Contact only real buyers; posts under 1h / Canonical freshness (≤10 min, or ≤60 min with <15 replies); re-check at verify | AK t98u / RULES Canonical freshness / t113u | `outbound_gate.check` freshness + `recheck_pass_conditions` age at verify | `test_verify_rechecks_age`, existing freshness probes | ENFORCED |
| 2 | Max 10 new-person X DMs / rolling 24h, ≥10 min apart | AK t98u / RULES X public replies paused | `dm_count.count_new_person_x_dms` via check + verify recheck | `tests/test_dm_count.py` + verify path | ENFORCED |
| 3 | Send only as X @ShipdayStudio (id 2112942438914338817), Reddit u/ShipdayStudio, hello@shipdaystudio.com; never @CryptoBlockk | AK t98u / RULES Accounts | `outbound_gate.check` account + account_id; verify recheck | `test_probe_j_wrong_account_id_fails`, `EmailFromDefault` | ENFORCED |
| 4 | Buyer previews: lead-specific, ≤640px, `SHIPDAY STUDIO · PREVIEW` watermark (`is-protected`), under `out/leads/<lead>/` | AK t98u / RULES Samples | `validate_media` + `protect.is_protected` + path segment + purpose match | `test_pil_oversized_image_fails`, probe A/F/G, path check | ENFORCED |
| 5 | Website images must NOT be watermarked or size-capped; deploy needs `site_quality_gate` + desktop+mobile screenshots | AK t102u/t103u / RULES Site quality bar | `site_quality_gate.py` (separate from outbound); `protect.py site` | site_quality_gate tests | ENFORCED (site path) |
| 6 | Stripe acct_1UT2zlITWxIMUnKV only; never post payment link for another account; no Stripe test writes as live | AK t98u / RULES Accounts and money | `STRIPE_ACCOUNT_RE` in check + catalog/link helpers; ops discipline for writes | `test_wrong_stripe_acct_in_text_fails` | ENFORCED (text); PARTIAL (API write ban = ops) |
| 7 | No private details/secrets in outbound (AK PII, tokens, keys, passwords, OTPs, magic/reset links, saltaai, Findful, AK name unless public); no fake claims | AK t98u / RULES Positioning + t113u | `PRIVACY_PATTERNS` + `FAKE_CLAIM_PATTERNS` + `emails.FORBIDDEN` | `test_findful_privacy_fails`, `test_fake_claim_fails`, privacy tests | ENFORCED |
| 8 | No Fortnite/Roblox/brand logos or copyrighted skins in previews (flag known names; style-notes declare none) | AK / RULES + t113u | `style_notes_ok` + `IP_CLEAR_RE`; filename heuristics soft | `test_ip_clear_missing_fails` | ENFORCED (declaration); PARTIAL (pixel/IP vision) |
| 9 | Never send twice: one consumed pass per lead+channel+text; duplicate first-contact across channels in 24h; follow-ups only as follow-up | AK / Outbound gate / t113u | `consume_pass`, `already_contacted`, pass binding | `test_probe_h_…`, probe B | ENFORCED |
| 10 | Follow-ups: at most one scheduled follow-up without their reply; don't chase after it lapses | AK / RULES One reply per lead / t113u | `count_followups_without_reply` in check | `test_followup_chase_limit` | ENFORCED |
| 11 | Gate passes expire after 15 min; verify rechecks age, cap, account, media hashes/existence, protect | AK Outbound gate / t113u | `find_pass` max_age + `recheck_pass_conditions` | `test_verify_rechecks_age`, `test_verify_rechecks_media_missing` | ENFORCED |
| 12 | Public reply fallback only when DMs are closed (record reason) | AK t98u closed-DM / t113u | `--dm-closed-reason` required for buyer-first x-reply; stored on PASS; recheck | `test_x_reply_requires_dm_closed_reason` | ENFORCED |
| 13 | Reddit: no retry loops on login; respect subreddit self-promo where recorded | AK / RULES Mistake prevention | ops + `reddit_send` / login SOP; self-promo not fully coded | — | PARTIAL (login SOP); SOFT (sub rules) |
| 14 | Parent sends buyer handoffs immediately; never ask AK for go; log + tell after | AK t101u / t98u | `run_health` BUYER HANDOFF NOT SENT + ops; not a send-time code gate | run_health buyer-handoff tests | PARTIAL (watchdog) |
| 15 | `--media` accepts repeated flags AND comma-separated lists | AK t113u (tonight silent fail) | `expand_media` in check/verify/CLI/preflight | `test_expand_media_comma_and_repeat`, `test_comma_media_cli_check_passes` | ENFORCED |
| 16 | Single entry: check+verify+dm_count+account → `PASS <id>` / `REFUSE <reasons>` | AK t113u | `tools/preflight_send.py` + `outbound_gate preflight` | `test_preflight_prints_pass_or_refuse` | ENFORCED |
| 17 | Audit reply-log outbound rows without gate_id / unconsumed sent gate | AK t113u | `outbound_gate.audit` + `run_health.check` GATE AUDIT FAIL | `test_audit_flags_outbound_without_gate` | ENFORCED |
| 18 | Untagged Stripe buy links / wrong /work URL / wrong price wording | RULES Thumbnail offers + emails lint | `stripe_links_ok` + `emails.FORBIDDEN` | EmailPriceLint | ENFORCED |
| 19 | Transactional email requires order_id; no buyer-first bypass | Outbound gate | `check` transactional path | `test_transactional_email_requires_order_id` | ENFORCED |
| 20 | x-post own-timeline only (no lead, no @mention outreach) | RULES / gate | `check` x-post branch | existing x-post coverage in suite | ENFORCED |
| 21 | No intent links / magic links in chat or outbound | AK standing | privacy patterns + ops (chat) | privacy tests | ENFORCED (outbound text) |
| 22 | CHECK-FIRST: style-notes before preview; substance ≥80 chars | AK t57u/t58u | `style_notes_ok` | `test_style_notes_too_thin_fail`, probe F | ENFORCED |
| 23 | Sound human / no bot template feel / read whole thread | AK t178u / Leads | soft judgment; not regex-safe | — | SOFT |
| 24 | Auto-review / Grok Bot platform safety cards | AK t108u–t112u | platform setting; not in kit code | — | NONE (platform) |
| 25 | No force-push; no lease/handover-secrets branch edits; no spend without AK | standing kit ops | git/ops discipline | — | NONE (ops) |
| 26 | Reddit never press Send twice; verify chat thread before retry | RULES Mistake prevention | ops SOP | — | SOFT |
| 27 | First-order watermarked concept + refund window (fulfillment) | FULFILLMENT §5.1a | fulfillment scripts / protect on first_concept | fulfillment tests | ENFORCED (protect path) |
| 28 | Deliver clean files only after payment | RULES No free work | protect + fulfillment; outbound gate blocks unprotected buyer media | protect + gate media tests | ENFORCED |

## Counts (t113u)

- Rules listed: **28**
- ENFORCED before t113u (approx): **17** (freshness-at-check, dm_cap, account, protect/640, style substance, privacy base, expire 15, consume, audit gate_id presence, cross-channel dedupe, stripe links, transactional, x-post, site_quality, emails price, CHECK-FIRST length, handoff watchdog)
- Unenforced / weak before: **~11** (verify age recheck, IP-clear declaration, fake claims, Findful/secrets expand, dm-closed-reason, chase limit, comma media, preflight entry, audit consumed, wrong acct_ in text, media path under out/leads)
- After t113u: **24 ENFORCED**, **2 PARTIAL**, **2 SOFT**, **2 NONE (platform/ops)**

## Entry point for routines

```bash
python3 tools/preflight_send.py --channel x-dm --lead HANDLE \
  --post-created ISO --reply-count N --text FILE_OR_STRING \
  --media a.jpg,b.jpg [--dm-closed-reason "…"]
# → PASS <gate_id> | REFUSE <reasons>
python3 tools/preflight_send.py verify --gate-id ID --channel … --lead … \
  --text … --media … --consume
```

## Routine prompt lines to add (do not edit prompts from this pass — report only)

1. Fast-scan / 24/7 replies / lead-hunt send steps: replace raw `outbound_gate.py check` + separate `verify` with:
   `python3 tools/preflight_send.py --channel … --lead … --post-created … --reply-count … --text … --media …`
   then on PASS: send, then `python3 tools/preflight_send.py verify --gate-id … --consume …`.
2. Watchdog health line (already wired in code): ensure the watchdog prompt still runs `python3 tools/run_health.py check` every sweep — GATE AUDIT FAIL is now part of exit 1.
3. Closed-DM public reply: require `--dm-closed-reason "DMs closed: <why>"` on every buyer-first `x-reply` preflight.
4. Style-notes templates: add `ip-clear: yes — no logos, brand marks, or copyrighted skins` to every `out/leads/*/style-notes.md` scaffold.

## Cannot enforce fully in code (why)

- **Auto-review / Grok Bot safety cards**: account/platform setting; kit has no API to disable.
- **Pixel-level copyrighted skins/logos**: needs vision model; we require style-notes IP-clear declaration + filename heuristics only.
- **“Sound human” / “read whole thread”**: soft quality; no reliable fail-closed regex without false positives.
- **Reddit subreddit self-promo nuance**: per-sub policy text changes; keep recorded notes + human judgment.
- **Stripe API write ban / no spend**: connector permissions + ops; text gate catches wrong `acct_` in copy only.
