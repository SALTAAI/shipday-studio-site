#!/usr/bin/env python3
"""Funnel smoke check. Run after every deploy and once a day.

Checks (no secrets, no writes, public reads only):
  1. every sitemap URL returns 200
  2. every buy.stripe.com link on the site returns 200, carries a client_reference_id, and is in stripe-catalog.json
  3. /thanks/?product=<id> exists for every catalog redirect
  4. no banned claims or private strings in any page (human-reviewed, owner name, bot inbox, other studio)
  5. IndexNow key file is live
  6. no free work (RULES.md "No free work"): every local site sample is a tools/protect.py output <= 640px with no
     metadata, no SVG samples in public/, every /work/ and /demos/ image the live pages use is a manifest output
     (sha256 match) <= 640px, and RULES.md has its "No free work" section
  7. optional: --reddit URL... checks each comment permalink is visible logged-out (catches shadow-hidden comments)

Exit 1 on any FAIL so a routine can escalate instead of waiting.
"""
import argparse, hashlib, io, json, re, sys, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://shipdaystudio.com"
UA = {"User-Agent": "Mozilla/5.0 (funnel_check; Shipday Studio)"}
INDEXNOW_KEY = "8fe339e6a4627c52c7ae81cacff09d43"
# Lowercase substrings that must never appear on public pages.
BANNED = ["human-reviewed", "human reviewed", "reviewed by a human", "kerherve", "mail.grokbot.com",
          "saltaai", "acc001ak", "cryptoblockk", "alexandre", "zurich", "zürich"]

fails, warns = [], []

def get(url, timeout=20):
    st = (0, "", url)
    for _ in range(3):  # retry network errors (status 0) so a flaky box link isn't reported as a dead page
        st = _get(url, timeout)
        if st[0] != 0:
            break
    return st

def get_bytes(url, timeout=20):
    for _ in range(3):  # retry network errors like get()
        st, b = _get_bytes(url, timeout)
        if st != 0:
            break
    return st, b

def _get_bytes(url, timeout):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception:
        return 0, b""

def _get(url, timeout):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", "replace"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, "", url
    except Exception as e:
        return 0, str(e), url

def check(ok, msg):
    (print("ok   ", msg) if ok else (fails.append(msg), print("FAIL ", msg)))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reddit", nargs="*", default=[], help="comment permalinks to test logged-out")
    a = ap.parse_args()

    st, xml, _ = get(f"{SITE}/sitemap.xml")
    check(st == 200, f"sitemap.xml {st}")
    urls = re.findall(r"<loc>([^<]+)</loc>", xml)
    check(len(urls) >= 20, f"sitemap has {len(urls)} URLs")

    cat = json.loads((ROOT / "stripe-catalog.json").read_text())
    blob = json.dumps(cat)
    cat_links = set(re.findall(r"https://buy\.stripe\.com/[A-Za-z0-9]+", blob))
    redirects = set(re.findall(r"/thanks/\?product=([a-z0-9-]+)", blob))

    seen_links, live_imgs = set(), set()
    for u in urls:
        st, body, _ = get(u)
        check(st == 200, f"{st} {u}")
        low = body.lower()
        for b in BANNED:
            if b in low:
                check(False, f"banned string '{b}' on {u}")
        for m in re.finditer(r"https://buy\.stripe\.com/[A-Za-z0-9]+(\?[^\"'\s<]*)?", body):
            base, q = m.group(0).split("?")[0], m.group(1) or ""
            if "client_reference_id=" not in q:
                check(False, f"untagged Stripe link {base} on {u}")
            seen_links.add(base)
        live_imgs.update(re.findall(r'(?:src|href)="(/(?:work|demos)/[^"?#]+\.(?:webp|png|jpe?g|gif|avif))"', body))

    for l in sorted(seen_links):
        check(l in cat_links, f"site link in catalog: {l}")
        st, _, _ = get(l)
        check(st == 200, f"Stripe link live {st} {l}")
    for l in sorted(cat_links - seen_links):
        warns.append(f"catalog link not on any page: {l}")

    for p in sorted(redirects):
        st, _, _ = get(f"{SITE}/thanks/?product={p}")
        check(st == 200, f"/thanks/?product={p} {st}")

    st, body, _ = get(f"{SITE}/{INDEXNOW_KEY}.txt")
    check(st == 200 and INDEXNOW_KEY in body, f"IndexNow key file {st}")

    # 5b. DM landing pages (T-0031): the $20 single leads, tagged, with its own OG card.
    single = "https://buy.stripe.com/00w8wQ9G43Ym3cn3c2cjS04?client_reference_id=site"
    for path, title, og in [
        ("/work/thumbnails/", "YouTube thumbnail examples: 1 for $20, 4 for $79", "/og/work-thumbnails.png"),
        ("/services/custom-youtube-thumbnail/", "Custom YouTube thumbnail for $20, in 24h", "/og/services/custom-youtube-thumbnail.png"),
    ]:
        st, body, _ = get(SITE + path)
        check(st == 200 and f"<title>{title} | Shipday Studio</title>" in body, f"DM landing {path} {st} title")
        check(single in body, f"DM landing {path} has tagged $20 single link")
        check(f'property="og:image" content="{SITE}{og}"' in body, f"DM landing {path} og:image {og}")
        ost, _ = get_bytes(SITE + og)
        check(ost == 200, f"DM landing OG image {ost} {og}")

    # 6. No free work: samples protected locally and live.
    sys.path.insert(0, str(ROOT / "tools"))
    import protect
    from PIL import Image
    local = protect.site_images()
    bad = protect.check_files(local)
    for b in bad:
        check(False, f"unprotected site image: {b}")
    svgs = sorted((ROOT / "public").rglob("*.svg"))
    for sv in svgs:
        check(False, f"SVG sample in public/: {sv.relative_to(ROOT)}")
    check(not bad and not svgs, f"{len(local)} local site images protected (<=640px, watermarked, no metadata)")
    outs = protect.load_manifest()["outputs"]
    live_bad = 0
    for path in sorted(live_imgs):
        st, b = get_bytes(SITE + path)
        if st != 200:
            check(False, f"live image {st} {path}"); live_bad += 1; continue
        w, h = Image.open(io.BytesIO(b)).size
        if hashlib.sha256(b).hexdigest() not in outs or max(w, h) > protect.MAX_LONG:
            check(False, f"live image not protected: {path} {w}x{h}"); live_bad += 1
    check(live_bad == 0 and len(live_imgs) > 0, f"{len(live_imgs)} live sample images match protect manifest")
    rules = (ROOT / "RULES.md").read_text()
    check("## No free work" in rules, "RULES.md has the 'No free work' section")

    # 6b. No free work on scheduled social posts (27 Oct 2026, proof post 6ade370a): every image on a
    # scheduled/draft Zernio post must be a protect.py output. Unreadable media or API error = FAIL (fail closed).
    try:
        import zernio_media_audit
        zl, zbad = zernio_media_audit.run()
        for line in zl:
            if not line.startswith("protected"):
                check(False, f"zernio pending media {line}")
        check(zbad == 0, f"{len(zl)} pending Zernio post images protected")
    except Exception as e:
        check(False, f"zernio media audit error: {type(e).__name__}")

    # Reddit: a comment visible to us but not logged-out is invisible to buyers.
    for link in a.reddit:
        j = link.rstrip("/") + ".json"
        st, body, _ = get(j)
        cid = link.rstrip("/").split("/")[-1]
        visible = st == 200 and f'"id": "{cid}"' in body and '"body": "[removed]"' not in body
        check(visible, f"reddit comment visible logged-out: {link} ({st})")

    # Outbound gate audit: any recent reply-log send without gate_id is a FAIL (pm audit S1).
    try:
        sys.path.insert(0, str(ROOT / "tools"))
        import outbound_gate
        for r in outbound_gate.audit_reply_log(hours=24):
            check(False, r)
    except Exception as e:
        check(False, f"outbound_gate audit error: {e}")

    for w in warns:
        print("warn ", w)
    print(f"\n{len(fails)} fail, {len(warns)} warn")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()
