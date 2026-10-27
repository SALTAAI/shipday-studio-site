#!/usr/bin/env python3
"""Format and gate the routine→browser handoff for closed-DM / public buyer replies (AK t52u/t54u).

Routines that cannot drive the browser print one line; a later worker posts it from the
box browser signed in as @ShipdayStudio. Format (pipe-separated, no newlines in fields):

  BROWSER REPLY NEEDED: <url> | <text> | <image paths comma-separated> | gate:<gate_id>

Hard gate (FAIL CLOSED):
  - Every handoff (first contact AND follow-up) MUST carry a valid outbound_gate PASS id.
  - First contact (no prior reply-log row for this lead on x-reply/x-dm) requires 1–2
    protect.py-verified JPEG/PNG previews. --follow-up alone cannot skip that; the gate
    derives first-contact from reply-log.
  - Parent MUST run `outbound_gate.py verify --gate-id … --channel … --lead … --text … --media … --consume`
    before posting. This tool also verifies (without consume) so a bad handoff never prints.

DM preview workaround (t54u, X Chat cannot attach images):
  Public reply with 1–2 watermarked previews from the box browser, THEN DM the buyer with
  the preview-post link (and short pitch). Never a link-only first contact. Documented in RULES.md.

  python3 tools/browser_reply_plan.py --url URL --text "..." --image PATH --gate-id ID --lead HANDLE
  python3 tools/browser_reply_plan.py --url URL --text "..." --gate-id ID --lead HANDLE --follow-up

Exit 0 prints the handoff line. Exit 1 prints REFUSE: … on stderr.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import outbound_gate

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "data" / "protect-manifest.json"
PREFIX = "BROWSER REPLY NEEDED:"
OWN_X_HANDLE = "shipdaystudio"
_X_STATUS_RE = re.compile(r"^https?://(?:www\.|mobile\.)?(?:x|twitter)\.com/([A-Za-z0-9_]{1,15})/status/(\d+)", re.I)


def status_author(url: str) -> str:
    """Lower-cased handle from an x.com/twitter.com status URL, or '' if not a status URL."""
    m = _X_STATUS_RE.match((url or "").strip())
    return m.group(1).lower() if m else ""


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_manifest() -> dict:
    if MANIFEST.exists():
        return json.loads(MANIFEST.read_text())
    return {"outputs": {}}


def is_protected(path: Path, manifest: dict | None = None) -> bool:
    m = manifest if manifest is not None else load_manifest()
    try:
        return sha(path) in m.get("outputs", {})
    except OSError:
        return False


def verify_images(paths: list[str]) -> tuple[list[str], list[str]]:
    # Use outbound_gate.is_protected so tests can patch MANIFEST in one place.
    ok, bad = [], []
    for raw in paths:
        p = Path(raw)
        if not p.is_file():
            bad.append(f"missing: {raw}")
            continue
        if not outbound_gate.is_protected(p):
            bad.append(f"not protect.py-verified: {raw}")
            continue
        ok.append(str(p))
    return ok, bad


def format_handoff(
    url: str,
    text: str,
    images: list[str] | None = None,
    follow_up: bool = False,
    gate_id: str = "",
    lead: str = "",
    channel: str = "x-reply",
) -> str:
    """Build the handoff line or raise ValueError with a REFUSE reason."""
    url = (url or "").strip()
    text = (text or "").replace("\n", " ").strip()
    if not url:
        raise ValueError("REFUSE: missing url")
    if not text:
        raise ValueError("REFUSE: missing text")
    if "|" in url or "|" in text:
        raise ValueError("REFUSE: url/text must not contain '|'")
    if not gate_id:
        raise ValueError(
            "REFUSE: missing --gate-id (run outbound_gate.py check first; "
            "parent verifies+consumes before posting)"
        )
    imgs = list(images or [])
    # Previews go in the reply directly under the buyer's post, never as a self-reply
    # under our own reply (measured 27 Oct 2026, data/x-test-2026-10-27.md:
    # self-thread previews 1 view vs 7 for the top-level reply, n=1).
    if channel == "x-reply" and imgs and status_author(url) == OWN_X_HANDLE:
        raise ValueError(
            "REFUSE: previews must reply directly under the buyer's post, not under our own "
            "@ShipdayStudio reply (self-thread previews got 1 view vs 7; x-test-2026-10-27.md)"
        )
    lead_h = outbound_gate.normalize_handle(lead) if lead else ""
    # Derive first-contact from reply-log; --follow-up is a hint only.
    prior = outbound_gate.already_contacted(lead_h, channel) if lead_h else False
    is_first = not prior
    if follow_up and is_first and lead_h:
        raise ValueError(
            f"REFUSE: first contact with @{lead_h} on {channel}: "
            "--follow-up refused (no prior logged contact)"
        )
    if is_first or not follow_up:
        if not imgs:
            raise ValueError(
                "REFUSE: first buyer reply needs ≥1 protect.py-verified image "
                "(AK t52u); for closed DMs post the previews publicly then DM the link (t54u)"
            )
        ok, bad = verify_images(imgs)
        if bad:
            raise ValueError("REFUSE: " + "; ".join(bad))
        if not ok:
            raise ValueError("REFUSE: no protect.py-verified images")
        imgs = ok
    else:
        if imgs:
            ok, bad = verify_images(imgs)
            if bad:
                raise ValueError("REFUSE: " + "; ".join(bad))
            imgs = ok

    ok, msg = outbound_gate.verify_gate_id(
        gate_id,
        text=text,
        media=imgs or None,
        lead=lead_h or None,
        channel=channel,
        consume=False,  # parent consumes at post time
    )
    if not ok:
        raise ValueError(f"REFUSE: outbound_gate: {msg}")

    img_field = ",".join(imgs) if imgs else ""
    return f"{PREFIX} {url} | {text} | {img_field} | gate:{gate_id}"


def parse_handoff(line: str) -> dict:
    """Parse a handoff line into {url, text, images, gate_id}."""
    s = line.strip()
    if not s.startswith(PREFIX):
        raise ValueError("not a BROWSER REPLY NEEDED line")
    body = s[len(PREFIX):].strip()
    parts = [p.strip() for p in body.split("|")]
    if len(parts) < 2:
        raise ValueError("need url | text [| images] [| gate:ID]")
    url, text = parts[0], parts[1]
    images: list[str] = []
    gate_id = ""
    for part in parts[2:]:
        if part.lower().startswith("gate:"):
            gate_id = part.split(":", 1)[1].strip()
        elif part:
            images = [x.strip() for x in part.split(",") if x.strip()]
    return {"url": url, "text": text, "images": images, "gate_id": gate_id}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--image", action="append", default=[], dest="images",
                    help="protect.py-verified preview path; repeat for 1–2 images")
    ap.add_argument("--follow-up", action="store_true",
                    help="existing conversation; still requires --gate-id; images optional only if prior contact logged")
    ap.add_argument("--gate-id", required=True, help="outbound_gate PASS id (always required)")
    ap.add_argument("--lead", default="", help="buyer handle (used to derive first-contact)")
    ap.add_argument("--channel", default="x-reply",
                    choices=["x-reply", "x-dm", "reddit-comment", "reddit-dm"])
    a = ap.parse_args(argv)
    try:
        line = format_handoff(
            a.url, a.text, a.images,
            follow_up=a.follow_up, gate_id=a.gate_id,
            lead=a.lead, channel=a.channel,
        )
    except ValueError as e:
        print(str(e), file=sys.stderr)
        return 1
    print(line)
    return 0


if __name__ == "__main__":
    sys.exit(main())
