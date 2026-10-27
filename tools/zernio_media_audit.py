#!/usr/bin/env python3
"""Read-only audit: every image on a not-yet-published Zernio post must be a tools/protect.py output
(RULES.md "No free work", AK 25 Oct 2026). Catches posts scheduled before the protect gate existed
(27 Oct 2026: proof post 6ade370a carried an unprotected 640x829 image; fixed by media swap).
  zernio_media_audit.py            -> one line per scheduled/draft post; exit 1 if any media is unprotected
Never prints the API key. Never changes a post."""
import hashlib, json, pathlib, sys, urllib.request
ROOT = pathlib.Path(__file__).resolve().parent.parent
PENDING = {"scheduled", "draft", "pending"}

def protected_hashes(manifest=ROOT / "data" / "protect-manifest.json"):
    return set(json.loads(pathlib.Path(manifest).read_text())["outputs"])

def audit(posts, fetch_bytes, hashes):
    """posts: list of post dicts; fetch_bytes(url)->bytes. Returns (lines, bad_count)."""
    lines, bad = [], 0
    for p in posts:
        if p.get("status") not in PENDING:
            continue
        for m in p.get("mediaItems") or []:
            url = m.get("url", "")
            try:
                ok = hashlib.sha256(fetch_bytes(url)).hexdigest() in hashes
                verdict = "protected" if ok else "UNPROTECTED"
            except Exception as e:  # fail closed: unreadable media counts as bad
                ok, verdict = False, f"UNREADABLE ({type(e).__name__})"
            bad += not ok
            lines.append(f"{verdict} post={p.get('_id')} at={p.get('scheduledFor')} media={url.rsplit('/',1)[-1]}")
    return lines, bad

def fetch_posts(get, api, max_pages=10):
    """Page through the Zernio posts list; get(url)->bytes."""
    posts, page = [], 1
    while page <= max_pages:
        batch = json.loads(get(f"{api}?page={page}&limit=100")).get("posts") or []
        posts += batch
        if len(batch) < 100:
            break
        page += 1
    return posts

def run(get=None, fetch_bytes=None, hashes=None):
    """Live audit used by main() and tools/funnel_check.py. Returns (lines, bad). Injectable for tests."""
    sys.path.insert(0, str(ROOT / "tools"))
    import zernio_reply as z
    if get is None:
        key = z.load_key()
        def get(url):
            return urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": "Bearer " + key,
                                          "Accept": "application/json"}), timeout=30).read()
    if fetch_bytes is None:
        fetch_bytes = lambda u: urllib.request.urlopen(u, timeout=30).read()
    return audit(fetch_posts(get, z.API), fetch_bytes, protected_hashes() if hashes is None else hashes)

def main():
    lines, bad = run()
    print("\n".join(lines) or "no pending posts with media")
    print(f"RESULT {'FAIL' if bad else 'CLEAN'} pending_media={len(lines)} unprotected={bad}")
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main())
