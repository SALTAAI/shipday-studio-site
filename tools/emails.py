#!/usr/bin/env python3
"""Render client email templates (templates/emails/*.txt) and lint any client-facing text.

  emails.py render TEMPLATE --project ID [--var key=value ...] [--test] [--out FILE]
      Fills {first_name}, {package_name}, {turnaround}, {due_utc}, {window_end_utc}, {project_label},
      {subject_base}, {deliverable_summary} from data/projects.json; anything else via --var.
      Appends the signature, refuses to render if a {placeholder} is left, then runs the lint.
      --test prefixes the subject with [INTERNAL TEST].
  emails.py lint FILE [FILE...]       Exit 1 if any client-facing text breaks RULES.md (personal info,
                                       grokbot/other-brand addresses, "Switzerland" outside the legal line,
                                       placeholders, wrong prices).
Output format: first line "Subject: ...", blank line, body. FULFILLMENT.md §6 shows how to send it.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from shipday_common import DATA, PACKAGES, REVISION_WINDOW_DAYS, ROOT, load, parse_time  # noqa: E402
from datetime import datetime, timedelta, timezone  # noqa: E402

TPL = ROOT / "templates" / "emails"
LEDGER = DATA / "projects.json"

# RULES.md "Positioning and identity": never in client-facing text.
FORBIDDEN = [
    (r"(?i)alexandre", "owner's first name"), (r"(?i)kerherve", "owner's surname/personal domain"),
    (r"(?i)kreuzstrasse|8008\s*z", "owner's home address"), (r"(?i)grokbot", "internal grokbot address"),
    (r"(?i)saltaai|agent@", "other brand / internal address"),
    (r"(?i)\bfindful\b", "other brand (Findful)"),
    (r"(?i)cryptoblockk", "personal X account"),
    (r"\+41[\s\d]{6,}|\b0\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\b", "phone number"),
    (r"(?i)z(ü|u)rich", "city (privacy; remote worldwide studio)"),
    (r"(?i)\bI\b(?!nternal)", "first-person singular: always the studio voice ('we')"),
    (r"(?i)\bfreelancer\b", "never pose as a solo freelancer"),
    (r"\{[a-z_]+\}", "unfilled template placeholder"),
    (r"(?i)\$79 each|79 per thumbnail", "wrong price: thumbnails are 4 for $79"),
    (r"(?i)op_service_account_token|(sk_live_|sk_test_|rk_live_|whsec_)[A-Za-z0-9]+", "secret/credential"),
    (r"(?i)\b(password|passwd|passcode|otp|totp)\s*[:=]\s*\S+", "password/OTP value"),
    (r"(?i)(magic|reset|signin|sign-in|login)\s+link", "magic/reset link wording"),
]
ALLOWED_SWISS = "Shipday Studio, Switzerland, hello@shipdaystudio.com"


def lint_text(text: str, name: str = "text") -> list[str]:
    issues = []
    for pat, why in FORBIDDEN:
        for m in re.finditer(pat, text):
            issues.append(f"{name}: '{m.group(0)}' -> {why}")
    if "Switzerland" in text.replace(ALLOWED_SWISS, ""):
        issues.append(f"{name}: 'Switzerland' outside the legal identity line")
    if re.search(r"\(-\)|: -$|\bNone\b", text, re.M):
        issues.append(f"{name}: an empty value ('-' or None) was filled in; a date or field is missing")
    for m in re.finditer(r"\$(\d+)", text):
        if int(m.group(1)) not in {p["amount_usd"] for p in PACKAGES.values()} | {900}:
            issues.append(f"{name}: price ${m.group(1)} is not a published price (check it's not a price claim)")
    return issues


def utc(ts: str | None) -> str:
    dt = parse_time(ts)
    return dt.astimezone(timezone.utc).strftime("%a %d %b, %H:%M UTC") if dt else "-"


def project_vars(pid: str) -> dict:
    data = load(LEDGER)
    hits = [p for p in data["projects"] if p["id"] == pid or p["id"].endswith(pid)]
    if len(hits) != 1:
        raise SystemExit(f"project {pid!r} not found / ambiguous")
    p = hits[0]
    pk = PACKAGES[p["package"]]
    name = (p["buyer"].get("name") or "").strip()
    summary = {"thumbnails": "your 4 thumbnails (1280x720, with source files)",
               "thumbnail_single": "your thumbnail (1280x720, with the source file)",
               "creator_plan": "this thumbnail (1280x720, with the source file)",
               "creator_lite": "this thumbnail (1280x720, with the source file)",
               "launch_kit": "your channel launch kit (logo, banner, profile picture and 4 thumbnails)",
               "logo": "your 3 logo concepts", "landing": "your landing page",
               "upkeep": "your update"}[p["package"]]
    first = is_first_order(data, p)
    return {
        "first_order": "yes" if first else "no",
        "first_name": name.split()[0] if name else "there",
        "package_name": {"thumbnails": "thumbnail pack", "thumbnail_single": "single thumbnail", "creator_plan": "creator plan",
                         "creator_lite": "Creator Lite plan", "launch_kit": "Channel Launch Kit",
                         "logo": "logo pack", "landing": "landing page", "upkeep": "upkeep plan"}[p["package"]],
        "turnaround": f"{pk['turnaround_h']}h" if pk["turnaround_h"] else (f"{pk['ticket_target_h']}h" if pk.get("monthly_quota") else ""),
        # creator plan: deadlines live on tickets; use the newest open ticket (or pass --var due_utc=...)
        "due_utc": utc(p.get("due_at") or next((t["due_at"] for t in reversed(p.get("tickets", [])) if t["status"] == "open"), None)),
        # before `projects.py deliver` runs (i.e. while drafting the delivery email) the window
        # ends 14 days from now, which is what deliver will record a minute later
        "window_end_utc": utc(p["revisions"].get("window_ends_at")
                              or (datetime.now(timezone.utc) + timedelta(days=REVISION_WINDOW_DAYS)).isoformat()),
        "project_label": p.get("label") or pk["name"].split(" (")[0],
        "subject_base": f"Your Shipday Studio {pk['name'].split(' (')[0].lower()} order",
        "deliverable_summary": summary,
        "first_order_line": first_order_line(p) if first else "",
        "extra_line": "", "link_clause": "", "upsell_line": UPSELL.get(p["package"], ""),
        "welcome_ask": WELCOME_ASK[p["package"]],
        "welcome_timing": WELCOME_TIMING[p["package"]] + ((" " + FIRST_ORDER_FAST[p["package"]]) if first else ""),
        "welcome_clock": ("Each thumbnail's 24-hour clock starts when its brief arrives, and we'll confirm each one as work begins."
                          if pk.get("monthly_quota") else "The clock starts once we have your brief, and we'll email you as soon as work begins."),
        "welcome_refund": ("You can cancel any time by email; the plan stops at the end of the month you've paid for."
                           if pk["recurring"] else "If you'd rather cancel before we start, just reply and you get a full refund.")
                          + ((" " + FIRST_ORDER_REFUND) if first else ""),
    }


# First-order offers (decided 25 Oct 2026, RULES.md "Offer: first order"): only the $20 single and the $79 four-pack,
# only on the buyer's first real (non-test) order. Terms §4/§6, FULFILLMENT.md §0/§5.1/§9.
FIRST_ORDER_PACKAGES = ("thumbnail_single", "thumbnails")
FIRST_ORDER_FAST = {
    "thumbnail_single": "As it's your first order with us, a preview arrives within 6 hours of your complete brief. Say it works and we send the clean file.",
    "thumbnails": "As it's your first order with us, a preview of the first one arrives within 6 hours of your complete brief. Say it works and the clean set follows within the 24 hours.",
}
FIRST_ORDER_REFUND = ("And on a first order, if you don't like the preview, reply within 7 days and you get a full refund."
                      " Once you've said yes, or 7 days pass, we send the clean files and the refund option ends.")


def first_order_line(p: dict) -> str:
    """brief_started bullet for first orders: the 6-hour first thumbnail and the first-concept refund."""
    b = p.get("brief_received_at")
    when = f", by {utc((parse_time(b) + timedelta(hours=FIRST_ORDER_FAST_H)).isoformat())} at the latest" if b else ""
    what = "A preview of your thumbnail" if p["package"] == "thumbnail_single" else "A preview of the first of your 4 thumbnails"
    return (f"\n- {what} reaches you within {FIRST_ORDER_FAST_H} hours of your brief{when}, as this is your first order."
            " Say it works and we send the clean files. If it's not for you, reply within 7 days and you get a full refund.")


FIRST_ORDER_FAST_H = 6


def is_first_order(data: dict, p: dict) -> bool:
    """True when p is a single/pack order and this buyer has no earlier order of any kind (tests are ignored, except
    that a test project counts as its own first order so dry runs show the first-order wording)."""
    if p["package"] not in FIRST_ORDER_PACKAGES:
        return False
    email = (p["buyer"].get("email") or "").strip().lower()
    for q in data["projects"]:
        if q["id"] == p["id"] or q.get("test"):
            continue
        if (q["buyer"].get("email") or "").strip().lower() == email and q["created_at"] < p["created_at"]:
            return False
    return True


# welcome.txt: what the buyer sends us, and when the clock starts (Terms §4). Keep in line with tools/intake.py CHECKS.
WELCOME_ASK = {
    "thumbnails": "- your channel (link or name) and what it is about\n- the 4 videos: a working title or one-line topic for each\n- optional: exact words for each thumbnail, a look to match, photos of a face or product to use, the language",
    "thumbnail_single": "- your channel (link or name) and what it is about\n- the video: a working title or one-line topic\n- optional: exact words for the thumbnail, a look to match, photos of a face or product to use, the language",
    "creator_plan": "- your channel (link or name) and what it is about\n- your first video: a working title or one-line topic\n- optional: exact words, a look to match, photos of a face or product to use, the language\n\nAfter that, send one email per video whenever it's ready (you can reply in this thread).",
    "creator_lite": "- your channel (link or name) and what it is about\n- your first video: a working title or one-line topic\n- optional: exact words, a look to match, photos of a face or product to use, the language\n\nAfter that, send one email per video whenever it's ready, up to one a week (you can reply in this thread).",
    "launch_kit": "- the exact channel name (spelling and capitals) and what the channel is about\n- the first 4 videos: a working title or one-line topic for each\n- optional: styles, channels or colours you like or want to avoid, anything for the banner (schedule, tagline, handle), photos of a face or product to use, the language",
    "logo": "- the exact brand name (spelling and capitals)\n- what the business does and who it is for\n- optional: a tagline, styles or colours you like or want to avoid, where the logo will be used most",
    "landing": "- what you do or sell, in a couple of sentences\n- who the page is for\n- the one action a visitor should take, and where it goes\n- key facts we must get right, plus any logo, colours, photos or sites you like\n- where it should go live (your domain and host)",
    "upkeep": "- the site URL\n- how we reach the site files (repo, host or CMS): please invite hello@shipdaystudio.com and never send passwords by email\n- your first change, if you have one",
}
WELCOME_TIMING = {
    "thumbnails": "Your 4 thumbnails (1280x720, with source files) arrive within 24 hours of your complete brief, with one revision round.",
    "thumbnail_single": "Your thumbnail (1280x720, with the source file) arrives within 24 hours of your complete brief, with one revision round.",
    "creator_plan": "Your plan covers 12 thumbnails a month, up to 3 a week. Each one (1280x720, with the source file) arrives within 24 hours of its brief, with one revision round. Unused thumbnails don't carry over to the next month, and you can cancel any time.",
    "creator_lite": "Your plan covers 4 thumbnails a month, up to 1 a week. Each one (1280x720, with the source file) arrives within 24 hours of its brief, with one revision round. Unused thumbnails don't carry over to the next month.",
    "launch_kit": "Your logo (2 concepts, then final SVG + PNG files), channel banner (2560x1440), profile picture (800x800) and 4 thumbnails (1280x720, with source files) arrive within 48 hours of your complete brief, with one revision round covering the whole kit.",
    "logo": "Your 3 logo concepts arrive within 48 hours of your complete brief, with one revision round.",
    "landing": "Your landing page is ready within 48 hours of your complete brief, with one revision round.",
    "upkeep": "Each request is handled as its own ticket, and you can cancel any time.",
}


# Close-out upsell (FULFILLMENT.md §8). Every thumbnail delivery offers a recurring plan (RULES.md, 25 Oct 2026).
# Links carry no client_reference_id: email follow-ups are tracked by the project record instead.
UPSELL = {
    "thumbnails": "If you upload every week, Creator Lite keeps it going: 4 thumbnails a month for $79/mo, up to 1 a week, each in 24h, cancel any time: https://buy.stripe.com/8x2eVedWkamKbIT5kacjS06 . Uploading 2 or more a week? The Creator plan covers 12 a month for $179/mo: https://buy.stripe.com/cNi28s9G4gL88wH7sicjS05",
    "thumbnail_single": "If you upload every week, Creator Lite keeps it going: 4 thumbnails a month for $79/mo, up to 1 a week, each in 24h, cancel any time: https://buy.stripe.com/8x2eVedWkamKbIT5kacjS06",
    "launch_kit": "Once the channel is rolling, Creator Lite keeps the thumbnails coming: 4 a month for $79/mo, up to 1 a week, each in 24h, cancel any time: https://buy.stripe.com/8x2eVedWkamKbIT5kacjS06",
    "creator_lite": "If you start uploading more often, the Creator plan covers 12 thumbnails a month (up to 3 a week) for $179/mo: https://buy.stripe.com/cNi28s9G4gL88wH7sicjS05 . Reply first and we'll cancel Creator Lite at the end of your paid month, so you're never billed for both.",
    "logo": "Starting a YouTube channel too? The Channel Launch Kit adds a banner, profile picture and 4 thumbnails around a new logo for $199: https://buy.stripe.com/cNi28s8C0gL814f9AqcjS07 . Or want a landing page that uses it? https://buy.stripe.com/3cIeVebOc8eCaEPbIycjS00",
    "landing": "Want us to keep it updated? Upkeep is $49/month, cancel any time: https://buy.stripe.com/6oUeVedWk9iG8wHdQGcjS03",
}


def render(template: str, variables: dict, test: bool) -> str:
    raw = (TPL / f"{template}.txt").read_text(encoding="utf-8")
    sig = (TPL / "_signature.txt").read_text(encoding="utf-8")
    text = raw.format_map(variables)
    if template != "escalation_ak":
        text = text.rstrip() + "\n" + sig
    text = re.sub(r"\n{3,}", "\n\n", text)
    if test:
        text = re.sub(r"^Subject: ", "Subject: [INTERNAL TEST] ", text, count=1)
    return text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("render"); r.add_argument("template"); r.add_argument("--project"); r.add_argument("--var", action="append", default=[])
    r.add_argument("--test", action="store_true"); r.add_argument("--out")
    li = sub.add_parser("lint"); li.add_argument("files", nargs="+")
    a = ap.parse_args()
    if a.cmd == "render":
        v = project_vars(a.project) if a.project else {}
        for kv in a.var:
            k, _, val = kv.partition("=")
            v[k] = val.replace("\\n", "\n")
        try:
            text = render(a.template, v, a.test)
        except KeyError as e:
            sys.exit(f"missing variable {e} for template {a.template}")
        issues = [] if a.template == "escalation_ak" else lint_text(text, a.template)
        if a.out:
            Path(a.out).write_text(text, encoding="utf-8")
        print(text)
        if issues:
            print("\nLINT FAILED:\n" + "\n".join(issues), file=sys.stderr)
            sys.exit(1)
    else:
        bad = []
        for f in a.files:
            bad += lint_text(Path(f).read_text(encoding="utf-8", errors="replace"), f)
        print("\n".join(bad) if bad else "lint OK: no personal info, no grokbot/other-brand addresses, no placeholders")
        sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
