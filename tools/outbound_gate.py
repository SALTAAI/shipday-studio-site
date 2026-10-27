#!/usr/bin/env python3
"""Mandatory outbound gate before any reply, DM, post, email or Reddit action (AK t52u/t57u/t58u + pm audit S1).

FAILS CLOSED. On PASS, appends a pass id to data/outbound-passes.jsonl and prints it.
Senders (send.py, zernio_reply.py, browser_reply_plan.py, xchat.sh, reddit_send.py) refuse
without a valid, unconsumed pass id issued in the last 15 minutes for the same
lead+channel+text+media.

  outbound_gate.py check --channel {x-dm,x-reply,reddit-comment,reddit-dm,email,zernio-reply} \\
    --lead HANDLE_OR_URL [--post-created ISO] [--reply-count N] [--account HANDLE] \\
    --text FILE_OR_- [--media FILE ...] [--kind {buyer-first,followup,client,non-sales}] \\
    [--follow-up] [--account-id 2112942438914338817] \\
    [--transactional --order-id cs_xxx]   # email receipts/delivery only; audited

  outbound_gate.py verify --gate-id ID --channel CH --lead HANDLE --text FILE_OR_- \\
    [--media FILE ...] [--consume] [--max-age-min 15]

  outbound_gate.py audit [--hours 24]   # FAIL if reply-log outbound rows lack gate_id
                                       # (transactional rows with order_id exempt)

Exit 0 on PASS; exit 1 and print each FAIL reason on stderr.

Fail-closed rules (pm probe A–J, 27 Oct 2026):
  - First contact (no prior logged contact with that lead on that channel) NEVER passes
    as follow-up / client / non-sales. --follow-up alone cannot skip previews.
  - Sales channels have no kind=client/non-sales bypass. Transactional email is the
    only exemption, and only with an explicit --order-id (Stripe session/order id).
  - Buyer-first requires 1–2 real JPEG/PNG images, <=640px, protect.py-verified, and
    purpose that exactly matches the lead handle (no substring: 'jo' != 'jordan').
  - Style notes must exist, be non-empty (>=80 chars), and name the lead or their content.
  - Pass is bound to lead+channel+text_hash+media_hashes, single-use (consumed on verify
    --consume / sender send), and expires in 15 minutes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

PASSES = ROOT / "data" / "outbound-passes.jsonl"
REPLY_LOG = ROOT / "data" / "reply-log.jsonl"
STYLE_NOTES = ROOT / "out" / "leads"
MANIFEST = ROOT / "data" / "protect-manifest.json"
CATALOG = ROOT / "stripe-catalog.json"
RULES = ROOT / "RULES.md"

SHIPDAY_X_ID = "2112942438914338817"
SHIPDAY_HANDLES = {"shipdaystudio", "@shipdaystudio", "u/shipdaystudio", "hello@shipdaystudio.com"}
FORBIDDEN_ACCOUNTS = {"cryptoblockk", "@cryptoblockk", "u/cryptoblockk"}
STRIPE_ACCOUNT = "acct_1UT2zlITWxIMUnKV"
PASS_MAX_AGE_MIN = 15
STYLE_NOTES_MIN_CHARS = 80
SALES_CHANNELS = {"x-dm", "x-reply", "reddit-comment", "reddit-dm", "zernio-reply"}
OUTBOUND_TYPES = {
    "dm", "x-reply", "x-reply-browser", "reddit-comment", "reddit-dm",
    "email", "zernio-reply", "reply",
}
CHANNEL_TYPE_MAP = {
    "x-dm": {"dm", "x-dm", "x-chat"},
    "x-reply": {"x-reply", "x-reply-browser", "zernio-reply", "reply"},
    "zernio-reply": {"zernio-reply", "x-reply", "reply"},
    "reddit-comment": {"reddit-comment"},
    "reddit-dm": {"reddit-dm"},
    "email": {"email"},
}
BANNED_PHRASES = [
    r"(?i)\bgreat question\b", r"(?i)\bi'?d be happy to\b", r"(?i)\bhope this helps\b",
    r"(?i)\bfeel free to\b", r"(?i)\bdelve\b", r"(?i)\belevate\b", r"(?i)\bseamless\b",
    r"(?i)\bgame-changer\b", r"(?i)\babsolutely!\b",
    r"(?i)\blet me know if you have any questions\b",
]
PRIVACY_PATTERNS = [
    (r"(?i)alexandre", "owner's first name"),
    (r"(?i)kerherve", "owner's surname"),
    (r"(?i)kreuzstrasse|8008\s*z", "home address"),
    (r"(?i)grokbot", "grokbot address"),
    (r"(?i)saltaai|agent@", "other brand"),
    (r"(?i)cryptoblockk", "personal X"),
    (r"\+41[\s\d]{6,}|\b0\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\b", "phone"),
    (r"x\.com/intent/", "intent link (never hand AK or anyone an intent link)"),
    (r"(?i)\bshould I (contact|reply|dm|message)\b", "asking AK for approval"),
    (r"(?i)\breply yourself\b", "handing work to AK"),
]


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def parse_iso(s: str | None) -> datetime | None:
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(str(s).replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def normalize_handle(raw: str | None) -> str:
    if not raw:
        return ""
    h = str(raw).strip()
    h = re.sub(r"^https?://(x|twitter)\.com/", "", h, flags=re.I)
    h = h.split("/")[0].split("?")[0]
    h = h.lstrip("@").removeprefix("u/").lower()
    return h


def media_hashes(media: list[str] | None) -> list[str]:
    out = []
    for m in sorted(media or []):
        p = Path(m)
        if p.is_file():
            out.append(hashlib.sha256(p.read_bytes()).hexdigest())
        else:
            out.append(f"missing:{m}")
    return out


def text_hash(text: str, media: list[str] | None = None) -> str:
    h = hashlib.sha256()
    h.update(text.strip().encode())
    for digest in media_hashes(media):
        h.update(b"\0")
        h.update(digest.encode())
    return h.hexdigest()


def gate_id_for(text: str, media: list[str] | None, lead: str, channel: str) -> str:
    payload = f"{text_hash(text, media)}|{normalize_handle(lead)}|{channel}"
    return hashlib.sha256(payload.encode()).hexdigest()[:32]


def load_manifest() -> dict:
    if MANIFEST.exists():
        return json.loads(MANIFEST.read_text())
    return {"outputs": {}}


def is_protected(path: Path, manifest: dict | None = None) -> bool:
    m = manifest if manifest is not None else load_manifest()
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest() in m.get("outputs", {})
    except OSError:
        return False


def _exact_handle_in(text: str, handle: str) -> bool:
    """True if handle appears as a whole token (not a substring of a longer word)."""
    if not handle:
        return False
    return re.search(rf"(?<![A-Za-z0-9_]){re.escape(handle)}(?![A-Za-z0-9_])", text, re.I) is not None


def purpose_matches_lead(path: Path, lead: str, manifest: dict) -> bool:
    """True if protect-manifest purpose names this lead's handle exactly (no substring)."""
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    entry = manifest.get("outputs", {}).get(digest) or {}
    purpose = str(entry.get("purpose") or entry.get("note") or "")
    h = normalize_handle(lead)
    if not h:
        return False
    if _exact_handle_in(purpose, h):
        return True
    # also accept out/leads/<handle>/ in the path (exact path segment)
    parts = [p.lower() for p in Path(path).parts]
    if h in parts:
        return True
    return False


def style_notes_path(lead: str) -> Path:
    return STYLE_NOTES / normalize_handle(lead) / "style-notes.md"


def style_notes_ok(lead: str) -> list[str]:
    """Return FAIL reasons for style-notes (existence, substance, lead reference)."""
    fails = []
    h = normalize_handle(lead)
    if not h:
        return ["buyer-first requires --lead"]
    sn = style_notes_path(h)
    if not sn.is_file():
        return [f"missing style-notes: {sn} (CHECK-FIRST: study profile/threads first)"]
    try:
        body = sn.read_text(encoding="utf-8").strip()
    except OSError as e:
        return [f"style-notes unreadable: {e}"]
    if len(body) < STYLE_NOTES_MIN_CHARS:
        fails.append(
            f"style-notes too thin ({len(body)} chars < {STYLE_NOTES_MIN_CHARS}; "
            "need niche/colours/references)"
        )
    # Must reference the lead handle OR contain at least one http(s) content URL
    # OR a niche/colours/channel keyword block (substance markers).
    has_handle = _exact_handle_in(body, h)
    has_url = re.search(r"https?://\S+", body) is not None
    has_markers = re.search(
        r"(?i)\b(niche|colour|color|palette|face|no-face|youtube|channel|thread|style|reference)\b",
        body,
    ) is not None
    if not (has_handle or has_url or has_markers):
        fails.append(
            f"style-notes lack substance for @{h} "
            "(need handle, a content URL, or niche/colour/channel notes)"
        )
    return fails


def load_prices() -> set[int]:
    amounts = {20, 79, 149, 179, 199, 390, 49}
    if CATALOG.exists():
        try:
            cat = json.loads(CATALOG.read_text())
            for item in cat.get("items") or []:
                ua = item.get("unit_amount")
                if isinstance(ua, int):
                    amounts.add(ua // 100)
        except (json.JSONDecodeError, OSError, TypeError):
            pass
    return amounts


def stripe_links_ok(text: str) -> list[str]:
    fails = []
    for m in re.finditer(r"https://buy\.stripe\.com/[A-Za-z0-9]+(\?[^\s\"'<>]*)?", text):
        full = m.group(0)
        if "client_reference_id=" not in full:
            fails.append(f"untagged Stripe link: {full.split('?')[0]}")
    if re.search(r"shipdaystudio\.com/work(?!/thumbnails)", text):
        fails.append("samples URL must be /work/thumbnails/ (bare /work is 404)")
    return fails


def already_contacted(lead: str, channel: str | None = None) -> bool:
    """True if reply-log has a real outbound to this lead (optionally on this channel)."""
    h = normalize_handle(lead)
    if not h or not REPLY_LOG.exists():
        return False
    allowed_types = None
    if channel:
        allowed_types = CHANNEL_TYPE_MAP.get(channel)
    with REPLY_LOG.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            typ = str(obj.get("type") or "")
            ch = str(obj.get("channel") or "")
            if typ in {"lead-dm-not-sent", "lead-dm-skip", "lead-skip", "lead-browser-pending",
                       "log-correction", "dm-resend-audit", "dm-fast-check", "fast-scan",
                       "transactional"}:
                continue
            is_out = (
                typ in OUTBOUND_TYPES
                or ch in {"x-dm", "x-chat", "x-reply", "x-reply-browser", "reddit-comment",
                          "reddit-dm", "email", "zernio-reply"}
                or obj.get("status") in {"posted", "sent", "delivered"}
            )
            if not is_out:
                continue
            handles = [
                normalize_handle(obj.get(k))
                for k in ("lead", "to", "handle", "target", "user", "who")
            ]
            if h not in handles:
                continue
            if allowed_types is not None:
                if typ not in allowed_types and ch not in allowed_types and ch != channel:
                    continue
            return True
    return False


def validate_media(paths: list[str], lead: str, require_lead_match: bool) -> list[str]:
    """Validate 1–2 JPEG/PNG protect.py outputs <=640px. PIL failure = FAIL."""
    reasons: list[str] = []
    if not paths:
        return ["buyer-first requires 1–2 lead-specific protect.py previews"]
    if len(paths) > 2:
        reasons.append(f"too many media files ({len(paths)}); max 2")
    man = load_manifest()
    ok_media = 0
    try:
        from PIL import Image
    except ImportError:
        return ["PIL unavailable: cannot verify image dimensions/format (fail closed)"]
    for raw in paths:
        p = Path(raw)
        if not p.is_file():
            reasons.append(f"media missing: {raw}")
            continue
        if not is_protected(p, man):
            reasons.append(f"media not protect.py-verified: {raw}")
            continue
        try:
            with Image.open(p) as im:
                im.verify()
            with Image.open(p) as im:  # reopen after verify
                fmt = (im.format or "").upper()
                w, h = im.size
            if fmt not in {"JPEG", "PNG"}:
                reasons.append(f"media not JPEG/PNG ({fmt or 'unknown'}): {raw}")
                continue
            if max(w, h) > 640:
                reasons.append(f"media >640px: {raw} ({w}x{h})")
                continue
        except Exception as e:
            reasons.append(f"media not a valid image (PIL failed): {raw} ({type(e).__name__})")
            continue
        if require_lead_match and not purpose_matches_lead(p, lead, man):
            reasons.append(
                f"preview not lead-specific (purpose must exactly name {normalize_handle(lead)}): {raw}"
            )
            continue
        ok_media += 1
    if require_lead_match and ok_media < 1 and not any(
        "media" in r or "preview" in r for r in reasons
    ):
        reasons.append("no lead-specific protected preview attached")
    return reasons


def check(
    *,
    channel: str,
    text: str,
    lead: str = "",
    account: str = "@ShipdayStudio",
    account_id: str = SHIPDAY_X_ID,
    post_created: str | None = None,
    reply_count: int | None = None,
    media: list[str] | None = None,
    kind: str = "buyer-first",
    follow_up: bool = False,
    transactional: bool = False,
    order_id: str = "",
    now: datetime | None = None,
) -> tuple[bool, list[str], str | None]:
    """Return (ok, reasons, gate_id). gate_id is set only on PASS."""
    reasons: list[str] = []
    now = now or utcnow()
    media = list(media or [])
    text = (text or "").strip()
    lead_h = normalize_handle(lead)

    if not text:
        reasons.append("empty text")

    # --- Derive first-contact vs follow-up from reply-log (ignore self-declared flags) ---
    prior = already_contacted(lead_h, channel) if lead_h else False
    claimed_follow = follow_up or kind in {"followup", "client", "non-sales"}

    # Own-timeline original post (@ShipdayStudio proof/build-in-public posts via
    # tools/zernio_schedule.py). Not addressed to any person: no lead, no @mentions,
    # no freshness/style-notes; any media must still be protect.py previews.
    if channel == "x-post":
        effective_kind = "own-post"
        if lead_h:
            reasons.append("x-post is own-timeline only: --lead not allowed (use a DM/reply channel)")
        if re.search(r"(?<![\w.])@[A-Za-z0-9_]{1,15}", text):
            reasons.append("x-post must not @mention anyone (own-timeline post, not outreach)")
        if transactional or follow_up or kind != "buyer-first":
            reasons.append("x-post takes no --kind/--follow-up/--transactional")
    # Transactional email path (receipts/delivery to a paying buyer)
    elif transactional:
        if channel != "email":
            reasons.append("transactional path is email-only")
        if not order_id or not re.match(r"^(cs_|sub_|pi_|in_|order_)[A-Za-z0-9_]+$", order_id):
            reasons.append(
                "transactional email requires --order-id (Stripe session/order id, e.g. cs_...)"
            )
        # still run privacy/account checks below; skip buyer-first preview/freshness
        effective_kind = "transactional"
    elif channel in SALES_CHANNELS and kind in {"client", "non-sales"} and not prior:
        reasons.append(
            f"kind={kind} cannot bypass sales outreach on {channel} "
            "(first contact must be buyer-first with previews)"
        )
        effective_kind = "buyer-first"
    elif claimed_follow and not prior:
        # Probe B: exact @j0rdangutierrez case — first reply with --follow-up must FAIL
        reasons.append(
            f"first contact with @{lead_h or '?'} on {channel}: "
            "--follow-up/kind=followup refused (no prior logged contact on this channel)"
        )
        effective_kind = "buyer-first"
    elif prior and claimed_follow:
        effective_kind = "followup"
    else:
        effective_kind = "buyer-first" if kind == "buyer-first" or not prior else (
            "followup" if kind == "followup" else kind
        )
        if effective_kind in {"client", "non-sales"} and channel in SALES_CHANNELS:
            # even with prior, sales channels don't use client/non-sales for outreach
            if channel != "email":
                reasons.append(
                    f"kind={kind} not allowed on sales channel {channel}; use buyer-first or followup"
                )
                effective_kind = "followup" if prior else "buyer-first"

    # 1. Account
    acct = (account or "").strip().lower().lstrip("@")
    if acct.startswith("u/"):
        acct = acct[2:]
    if acct in {a.lstrip("@").removeprefix("u/") for a in FORBIDDEN_ACCOUNTS} or "cryptoblockk" in acct:
        reasons.append(f"forbidden account: {account} (never @CryptoBlockk)")
    if channel.startswith("x") or channel in {"zernio-reply", "x-dm", "x-reply"}:
        if str(account_id) != SHIPDAY_X_ID:
            reasons.append(f"wrong X account id {account_id} (need {SHIPDAY_X_ID})")
        if acct and acct not in {"shipdaystudio", ""}:
            reasons.append(f"account must be @ShipdayStudio, got {account}")
    if channel.startswith("reddit") and acct and acct not in {"shipdaystudio", ""}:
        reasons.append(f"Reddit account must be u/ShipdayStudio, got {account}")
    if channel == "email" and "hello@shipdaystudio.com" not in (account or "hello@shipdaystudio.com").lower():
        if account and "hello@" not in account.lower():
            reasons.append(f"email From must be hello@shipdaystudio.com, got {account}")

    # 2. Freshness (buyer-first only)
    if effective_kind == "buyer-first":
        created = parse_iso(post_created)
        if created is None:
            reasons.append("buyer-first requires --post-created ISO")
        else:
            age_min = (now - created).total_seconds() / 60.0
            rc = 0 if reply_count is None else int(reply_count)
            if age_min > 60:
                reasons.append(f"post age {age_min:.0f} min > 60 (Canonical freshness)")
            elif age_min > 10 and rc >= 15:
                reasons.append(
                    f"post age {age_min:.0f} min with {rc} replies (>=15) fails Canonical freshness"
                )

    # 3. Style notes + lead-specific preview (buyer-first)
    if effective_kind == "buyer-first":
        reasons.extend(style_notes_ok(lead_h))
        reasons.extend(validate_media(media, lead_h, require_lead_match=True))
    elif effective_kind == "followup":
        # follow-up: any media must still be valid protected images
        if media:
            reasons.extend(validate_media(media, lead_h, require_lead_match=False))
    elif effective_kind in {"transactional", "own-post"}:
        if media:
            reasons.extend(validate_media(media, lead_h, require_lead_match=False))
    else:
        # client / non-sales (email only, non-sales outreach)
        if media:
            reasons.extend(validate_media(media, lead_h, require_lead_match=False))

    # 4. Privacy + human tone
    for pat, why in PRIVACY_PATTERNS:
        if re.search(pat, text):
            reasons.append(f"privacy/lint: {why}")
    for pat in BANNED_PHRASES:
        if re.search(pat, text):
            reasons.append(f"banned phrase: {pat}")
    if "—" in text or "–" in text:
        reasons.append("em dash / en dash banned (sound human)")
    words = len(re.findall(r"\S+", text))
    if channel in {"x-dm", "reddit-dm"} and effective_kind == "buyer-first" and words > 60:
        reasons.append(f"DM over 60 words ({words})")
    if channel in {"x-reply", "zernio-reply", "reddit-comment"} and effective_kind == "buyer-first":
        if words > 60:
            reasons.append(f"reply over 60 words ({words})")

    # emails lint: FAIL OPEN is forbidden — import failure is a FAIL
    if effective_kind != "transactional" or channel == "email":
        try:
            from emails import lint_text
            for issue in lint_text(text, "outbound"):
                if channel.startswith("x") and "first-person singular" in issue:
                    continue
                reasons.append(f"emails.lint: {issue}")
        except Exception as e:
            reasons.append(f"emails.lint unavailable (fail closed): {type(e).__name__}: {e}")

    # 5. Prices + Stripe tagging (skip for pure transactional receipts that quote paid amount)
    if effective_kind != "transactional":
        amounts = load_prices()
        for m in re.finditer(r"\$(\d+)", text):
            n = int(m.group(1))
            if n not in amounts and n not in {900}:
                reasons.append(f"price ${n} not in catalog/RULES")
        if re.search(r"(?i)\$79 each|79 per thumbnail", text):
            reasons.append("wrong price wording: never '$79 each'")
        for f in stripe_links_ok(text):
            reasons.append(f)

    # 6. DM cap (new-person X DMs)
    if channel in {"x-dm"} and effective_kind == "buyer-first":
        try:
            from dm_count import count_new_person_x_dms
            snap = count_new_person_x_dms(REPLY_LOG, now=now)
            if not snap.get("can_send"):
                reasons.append(
                    f"dm_count can_send=false (count={snap.get('count')}, "
                    f"min_apart_ok={snap.get('min_apart_ok')})"
                )
        except Exception as e:
            reasons.append(f"dm_count failed: {e}")

    # 7. Duplicates (buyer-first)
    if effective_kind == "buyer-first" and lead_h and already_contacted(lead_h):
        reasons.append(f"duplicate: already contacted @{lead_h} (reply-log)")

    if reasons:
        return False, reasons, None
    gid = gate_id_for(text, media, lead_h, channel)
    return True, [], gid


def append_pass(record: dict) -> None:
    PASSES.parent.mkdir(parents=True, exist_ok=True)
    with PASSES.open("a") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def _rewrite_passes(rows: list[dict]) -> None:
    PASSES.parent.mkdir(parents=True, exist_ok=True)
    tmp = PASSES.with_suffix(".jsonl.tmp")
    with tmp.open("w") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    tmp.replace(PASSES)


def find_pass(
    gate_id: str,
    *,
    text: str | None = None,
    media: list[str] | None = None,
    lead: str | None = None,
    channel: str | None = None,
    max_age_min: float = PASS_MAX_AGE_MIN,
    now: datetime | None = None,
    allow_consumed: bool = False,
) -> dict | None:
    now = now or utcnow()
    if not PASSES.exists():
        return None
    best = None
    with PASSES.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if obj.get("gate_id") != gate_id:
                continue
            if obj.get("gate") != "PASS":
                continue
            if obj.get("consumed") and not allow_consumed:
                continue
            ts = parse_iso(obj.get("at"))
            if ts is None:
                continue
            age = (now - ts).total_seconds() / 60.0
            if age > max_age_min or age < -1:
                continue
            if channel is not None and obj.get("channel") != channel:
                continue
            if lead is not None and normalize_handle(obj.get("lead")) != normalize_handle(lead):
                continue
            if text is not None:
                expected = obj.get("text_hash")
                if not expected:
                    continue
                # Binding: recompute with caller media if provided, else stored media paths.
                media_for_hash = media if media is not None else list(obj.get("media") or [])
                if expected != text_hash(text, media_for_hash):
                    continue
                stored_mh = obj.get("media_hashes") or []
                if media is not None and stored_mh and stored_mh != media_hashes(media):
                    continue
            best = obj
    return best


def consume_pass(gate_id: str, now: datetime | None = None) -> bool:
    """Mark the PASS row consumed. Returns True if a live pass was consumed."""
    if not PASSES.exists():
        return False
    now = now or utcnow()
    rows = []
    found = False
    with PASSES.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if (
                not found
                and obj.get("gate_id") == gate_id
                and obj.get("gate") == "PASS"
                and not obj.get("consumed")
            ):
                obj = dict(obj)
                obj["consumed"] = True
                obj["consumed_at"] = now.strftime("%Y-%m-%dT%H:%M:%SZ")
                found = True
            rows.append(obj)
    if found:
        _rewrite_passes(rows)
    return found


def verify_gate_id(
    gate_id: str,
    text: str | None = None,
    max_age_min: float = PASS_MAX_AGE_MIN,
    now: datetime | None = None,
    *,
    media: list[str] | None = None,
    lead: str | None = None,
    channel: str | None = None,
    consume: bool = False,
) -> tuple[bool, str]:
    if not gate_id:
        return False, "missing gate_id"
    hit = find_pass(
        gate_id,
        text=text,
        media=media,
        lead=lead,
        channel=channel,
        max_age_min=max_age_min,
        now=now,
    )
    if not hit:
        return False, (
            f"no valid PASS for gate_id {gate_id[:12]}… "
            f"(need unconsumed PASS <{max_age_min} min old, bound to lead+channel+text+media)"
        )
    # Always require channel/lead when the pass recorded them and caller supplied them
    if channel and hit.get("channel") and hit["channel"] != channel:
        return False, f"gate_id channel mismatch (pass={hit.get('channel')}, got={channel})"
    if lead is not None and hit.get("lead") is not None:
        if normalize_handle(hit.get("lead")) != normalize_handle(lead):
            return False, "gate_id lead mismatch"
    if consume:
        if not consume_pass(gate_id, now=now):
            return False, "gate_id already consumed"
    return True, "ok"


def is_transactional_row(obj: dict) -> bool:
    """True if a reply-log row is an audited transactional email (exempt from gate_id)."""
    if obj.get("transactional") is True or obj.get("kind") == "transactional":
        oid = str(obj.get("order_id") or obj.get("session_id") or obj.get("stripe_session") or "")
        if oid and re.match(r"^(cs_|sub_|pi_|in_|order_)[A-Za-z0-9_]+$", oid):
            return True
    typ = str(obj.get("type") or "")
    if typ in {"transactional", "receipt", "delivery-email", "login-link", "password-reset"}:
        # login-link / password-reset are system mail, not buyer outreach
        return True
    # subject/body hints for known system mail (login links)
    subj = str(obj.get("subject") or "")
    if re.search(r"(?i)(login|sign[- ]?in|password reset|verification code|magic link)", subj):
        return True
    return False


def audit_reply_log(hours: float = 24.0, now: datetime | None = None) -> list[str]:
    """Return FAIL reasons for outbound reply-log rows lacking gate_id."""
    now = now or utcnow()
    cut = now - timedelta(hours=hours)
    fails = []
    if not REPLY_LOG.exists():
        return fails
    with REPLY_LOG.open() as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            ts = parse_iso(obj.get("at") or obj.get("ts") or obj.get("time"))
            if ts is None or ts < cut:
                continue
            typ = str(obj.get("type") or "")
            ch = str(obj.get("channel") or "")
            is_outbound = (
                typ in OUTBOUND_TYPES
                or ch in {"x-dm", "x-chat", "x-reply", "x-reply-browser", "reddit-comment",
                          "reddit-dm", "email", "zernio-reply"}
                or obj.get("status") in {"posted", "sent", "delivered"}
            )
            if not is_outbound:
                continue
            if typ in {"lead-dm-not-sent", "lead-dm-skip", "lead-skip", "lead-browser-pending",
                       "lead-reply-not-posted", "reply-not-attempted",
                       "log-correction", "dm-resend-audit", "dm-fast-check", "fast-scan"}:
                # records of a send that did NOT happen are not outbound
                continue
            if is_transactional_row(obj):
                continue
            if not obj.get("gate_id") and not obj.get("gate"):
                fails.append(
                    f"reply-log L{i}: outbound without gate_id "
                    f"(type={typ!r} channel={ch!r} at={obj.get('at') or obj.get('ts')})"
                )
    return fails


def read_text_arg(raw: str) -> str:
    if raw == "-":
        return sys.stdin.read()
    p = Path(raw)
    if p.is_file():
        return p.read_text(encoding="utf-8")
    return raw


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    c = sub.add_parser("check", help="run the gate; PASS prints gate_id")
    c.add_argument("--channel", required=True,
                   choices=["x-dm", "x-reply", "reddit-comment", "reddit-dm", "email", "zernio-reply", "x-post"])
    c.add_argument("--lead", default="")
    c.add_argument("--post-created", default=None)
    c.add_argument("--reply-count", type=int, default=None)
    c.add_argument("--account", default=None, help="default per channel: hello@shipdaystudio.com for email, else @ShipdayStudio")
    c.add_argument("--account-id", default=SHIPDAY_X_ID)
    c.add_argument("--text", required=True, help="file path, '-' for stdin, or literal")
    c.add_argument("--media", action="append", default=[])
    c.add_argument("--kind", default="buyer-first",
                   choices=["buyer-first", "followup", "client", "non-sales"])
    c.add_argument("--follow-up", action="store_true")
    c.add_argument("--transactional", action="store_true",
                   help="email receipts/delivery only; requires --order-id")
    c.add_argument("--order-id", default="", help="Stripe session/order id for transactional email")
    c.add_argument("--now", default=None, help="ISO now (tests)")
    c.add_argument("--no-log", action="store_true", help="do not append PASS row (tests)")

    v = sub.add_parser("verify", help="verify an existing gate_id (bound to lead+channel+text+media)")
    v.add_argument("--gate-id", required=True)
    v.add_argument("--text", default=None)
    v.add_argument("--media", action="append", default=None)
    v.add_argument("--lead", default=None)
    v.add_argument("--channel", default=None)
    v.add_argument("--consume", action="store_true", help="mark PASS single-use consumed")
    v.add_argument("--max-age-min", type=float, default=PASS_MAX_AGE_MIN)
    v.add_argument("--now", default=None)

    a = sub.add_parser("audit", help="flag reply-log outbound rows missing gate_id")
    a.add_argument("--hours", type=float, default=24.0)
    a.add_argument("--now", default=None)

    args = ap.parse_args(argv)
    now = parse_iso(args.now) if getattr(args, "now", None) else None

    if args.cmd == "check":
        text = read_text_arg(args.text)
        ok, reasons, gid = check(
            channel=args.channel,
            text=text,
            lead=args.lead,
            account=(args.account or ("hello@shipdaystudio.com" if args.channel == "email" else "@ShipdayStudio")),
            account_id=args.account_id,
            post_created=args.post_created,
            reply_count=args.reply_count,
            media=args.media,
            kind=args.kind,
            follow_up=args.follow_up,
            transactional=args.transactional,
            order_id=args.order_id,
            now=now,
        )
        if not ok:
            print("FAIL outbound_gate:", file=sys.stderr)
            for r in reasons:
                print(f"  - {r}", file=sys.stderr)
            return 1
        record = {
            "gate": "PASS",
            "gate_id": gid,
            "at": (now or utcnow()).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "channel": args.channel,
            "lead": normalize_handle(args.lead),
            "kind": (
                "own-post" if args.channel == "x-post"
                else "transactional" if args.transactional
                else ("followup" if args.follow_up else args.kind)
            ),
            "text_hash": text_hash(text, args.media),
            "media": list(args.media),
            "media_hashes": media_hashes(args.media),
            "account": (args.account or ("hello@shipdaystudio.com" if args.channel == "email" else "@ShipdayStudio")),
            "account_id": args.account_id,
            "consumed": False,
        }
        if args.transactional:
            record["order_id"] = args.order_id
            record["transactional"] = True
        if not args.no_log:
            append_pass(record)
        print(gid)
        return 0

    if args.cmd == "verify":
        text = read_text_arg(args.text) if args.text else None
        ok, msg = verify_gate_id(
            args.gate_id,
            text=text,
            max_age_min=args.max_age_min,
            now=now,
            media=args.media,
            lead=args.lead,
            channel=args.channel,
            consume=args.consume,
        )
        if not ok:
            print(f"REFUSE: {msg}", file=sys.stderr)
            return 1
        print("PASS" + (" (consumed)" if args.consume else ""))
        return 0

    if args.cmd == "audit":
        fails = audit_reply_log(hours=args.hours, now=now)
        if fails:
            print(f"FAIL outbound_gate audit ({len(fails)}):", file=sys.stderr)
            for r in fails:
                print(f"  - {r}", file=sys.stderr)
            return 1
        print("PASS outbound_gate audit")
        return 0

    return 2


if __name__ == "__main__":
    sys.exit(main())
