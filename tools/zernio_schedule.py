#!/usr/bin/env python3
"""Schedule an ORIGINAL @ShipdayStudio X post (own timeline only) through Zernio, optionally with images.
Usage: zernio_schedule.py [--dry-run] [--image FILE ...] --at 2026-10-25T18:00:00Z "text"
Reuses tools/zernio_reply.py (key loading, presign upload). Never for replies/outreach (RULES). Key never printed.
Outbound gate (fail closed): a real post needs --gate-id from
  outbound_gate.py check --channel x-post --text <same text> [--media <same image> ...]
and the pass is verified (bound to text+media) and consumed before the API call."""
import argparse, json, os, sys, urllib.request, urllib.error
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zernio_reply as z
p = argparse.ArgumentParser()
p.add_argument("text"); p.add_argument("--at", required=True)
p.add_argument("--image", action="append", default=[]); p.add_argument("--dry-run", action="store_true")
p.add_argument("--gate-id", default="", help="outbound_gate x-post PASS id (required unless --dry-run)")
a = p.parse_args()
text = (sys.stdin.read() if a.text == "-" else a.text).strip()
if not a.dry_run:
    import outbound_gate
    ok, msg = outbound_gate.verify_gate_id(a.gate_id, text=text, media=a.image or [],
                                           lead="", channel="x-post", consume=True)
    if not ok:
        sys.exit(f"REFUSED, outbound_gate: {msg}")
body = {"content": text, "platforms": [{"platform": "twitter", "accountId": z.SHIPDAY_X_ACCOUNT_ID}],
        "scheduledFor": a.at, "timezone": "UTC"}
key = z.load_key()
if a.image:
    body["mediaItems"] = [{"type": "image", "url": z.upload_image(f, key)} for f in a.image]
if a.dry_run:
    print(json.dumps(body, ensure_ascii=False, indent=2)); sys.exit(0)
req = urllib.request.Request(z.API, data=json.dumps(body).encode(), method="POST", headers={
    "Authorization": "Bearer " + key, "Content-Type": "application/json", "Accept": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=60) as r: st, raw = r.status, r.read().decode()
except urllib.error.HTTPError as e: st, raw = e.code, e.read().decode()
try: resp = json.loads(raw)
except ValueError: resp = {"raw": raw[:1500]}
post = resp.get("post") or {}
print(json.dumps({"http": st, "postId": post.get("_id"), "status": post.get("status"),
                  "scheduledFor": post.get("scheduledFor"), "media": [m.get("url") for m in post.get("mediaItems") or []],
                  "error": resp.get("error") or resp.get("message")}, indent=2))
sys.exit(0 if st in (200, 201) and post.get("status") == "scheduled" else 1)
