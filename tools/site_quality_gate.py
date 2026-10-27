#!/usr/bin/env python3
"""Hard site-quality gate for shipdaystudio.com (AK t102u / t103u).

Fails the deploy if any of:
  - a public/work or public/demos image carries a PREVIEW watermark or is in
    data/protect-manifest.json (buyer-preview protect outputs never ship on the site)
  - a hero or thumbnail slot image is under 1000px wide
  - any site image is unreadable / broken
  - any internal page link or image src is broken (local static export)
  - any page has horizontal overflow at 390px viewport

Also writes a full desktop (1280) + mobile (390) screenshot set under
  out/site-review/<YYYY-MM-DD>/gate/
for the visual review that must happen before a deploy counts as done.

Usage:
  python3 tools/site_quality_gate.py [--skip-screens] [--base URL] [--out DIR]
  Exit 0 on pass, 1 on any fail. Wired into tools/funnel_check.py and the local
  pre-push deploy path (tools/pre_deploy.py).
"""
from __future__ import annotations
import argparse, datetime as dt, json, os, re, subprocess, sys, time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import protect  # noqa: E402
from PIL import Image  # noqa: E402

SITE_DEFAULT = "https://shipdaystudio.com"
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
VIEWPORTS = (("desktop", 1280, 800), ("mobile", 390, 844))
# Core pages always reviewed; extras discovered from local out/ or live sitemap.
CORE_PAGES = [
    ("home", "/"),
    ("work", "/work/"),
    ("work-thumbnails", "/work/thumbnails/"),
    ("work-logos", "/work/logos/"),
    ("work-landing-pages", "/work/landing-pages/"),
    ("services", "/services/"),
    ("order", "/order/"),
    ("terms", "/terms/"),
    ("privacy", "/privacy/"),
    ("imprint", "/imprint/"),
]


def today() -> str:
    return dt.date.today().isoformat()


def fail(msg: str, fails: list[str]) -> None:
    fails.append(msg)
    print("FAIL", msg)


def ok(msg: str) -> None:
    print("ok  ", msg)


def check_images(fails: list[str]) -> None:
    imgs = protect.site_images()
    if not imgs:
        fail("no site images under public/work or public/demos", fails)
        return
    man = protect.load_manifest()["outputs"]
    n_wm = n_narrow = n_broken = 0
    for p in imgs:
        rel = p.relative_to(protect.PUBLIC)
        try:
            im = Image.open(p)
            im.load()
            w, h = im.size
        except Exception as e:
            fail(f"broken image {rel}: {e}", fails)
            n_broken += 1
            continue
        b = p.read_bytes()
        if protect.sha(b) in man:
            fail(f"watermarked protect output on site: {rel}", fails)
            n_wm += 1
        elif protect.has_preview_watermark(p):
            fail(f"PREVIEW watermark badge on site: {rel}", fails)
            n_wm += 1
        if protect.is_hero_or_thumb(rel) and w < 1000:
            fail(f"hero/thumb under 1000px wide: {rel} {w}x{h}", fails)
            n_narrow += 1
    if n_wm == 0 and n_narrow == 0 and n_broken == 0:
        ok(f"{len(imgs)} site images clean (no watermark, hero/thumb ≥1000px)")


def _get(url: str, timeout: int = 20) -> tuple[int, bytes, str]:
    try:
        with urlopen(Request(url, headers={"User-Agent": "site_quality_gate"}), timeout=timeout) as r:
            return r.status, r.read(), r.geturl()
    except Exception as e:
        code = getattr(e, "code", 0) or 0
        return code, b"", url


def discover_pages(base: str) -> list[tuple[str, str]]:
    pages = list(CORE_PAGES)
    seen = {p for _, p in pages}
    st, body, _ = _get(base.rstrip("/") + "/sitemap.xml")
    if st == 200:
        for loc in re.findall(rb"<loc>([^<]+)</loc>", body):
            u = loc.decode()
            path = urlparse(u).path or "/"
            if path not in seen and urlparse(u).netloc in ("", urlparse(base).netloc):
                name = path.strip("/").replace("/", "-") or "home"
                pages.append((name, path if path.endswith("/") or path == "/" else path + "/"))
                seen.add(pages[-1][1])
    return pages


def check_links_and_images(base: str, pages: list[tuple[str, str]], fails: list[str]) -> None:
    """Crawl listed pages; fail on non-200 internal links and image srcs."""
    checked: set[str] = set()
    broken = 0
    for name, path in pages:
        url = base.rstrip("/") + path
        st, body, _ = _get(url)
        if st != 200:
            fail(f"page {st} {path}", fails)
            broken += 1
            continue
        html = body.decode("utf-8", "replace")
        # img src
        for src in re.findall(r'<img\b[^>]*\bsrc=["\']([^"\']+)["\']', html, flags=re.I):
            if src.startswith("data:"):
                continue
            full = urljoin(url, src)
            if urlparse(full).netloc != urlparse(base).netloc and not full.startswith(base):
                continue  # external
            if full in checked:
                continue
            checked.add(full)
            ist, _, _ = _get(full)
            if ist != 200:
                fail(f"broken image {ist} {src} on {path}", fails)
                broken += 1
        # internal <a href>
        for href in re.findall(r'<a\b[^>]*\bhref=["\']([^"\']+)["\']', html, flags=re.I):
            if href.startswith(("mailto:", "tel:", "#", "https://buy.stripe.com")):
                continue
            full = urljoin(url, href)
            pu = urlparse(full)
            bu = urlparse(base)
            if pu.scheme in ("http", "https") and pu.netloc and pu.netloc != bu.netloc:
                continue
            # strip hash
            target = f"{pu.scheme}://{pu.netloc}{pu.path}" if pu.netloc else urljoin(base, pu.path)
            if not target.startswith(base.rstrip("/") ):
                # relative resolved
                target = urljoin(base.rstrip("/") + "/", pu.path.lstrip("/"))
            if target in checked:
                continue
            checked.add(target)
            # only check same-host paths we care about
            if urlparse(target).netloc not in ("", bu.netloc):
                continue
            ist, _, _ = _get(target)
            if ist not in (200, 301, 302):
                fail(f"broken link {ist} {href} on {path}", fails)
                broken += 1
    if broken == 0:
        ok(f"links/images ok across {len(pages)} pages ({len(checked)} assets checked)")


def _playwright_python() -> str:
    venv = ROOT / "diag" / "vis" / ".venv" / "bin" / "python"
    if venv.exists():
        return str(venv)
    return sys.executable


def check_overflow_and_screens(
    base: str,
    pages: list[tuple[str, str]],
    out_dir: Path,
    fails: list[str],
    *,
    skip_screens: bool = False,
) -> None:
    """Use Playwright + Chrome: fail on horizontal overflow at 390px; always write screenshots."""
    out_dir.mkdir(parents=True, exist_ok=True)
    script = f"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
base = {base!r}
pages = {pages!r}
out = Path({str(out_dir)!r})
chrome = {CHROME!r}
fails = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome, headless=True,
                                args=["--no-sandbox","--disable-dev-shm-usage"])
    try:
        for vp_name, w, h in (("desktop", 1280, 800), ("mobile", 390, 844)):
            ctx = browser.new_context(viewport={{"width": w, "height": h}},
                                      device_scale_factor=1,
                                      is_mobile=(vp_name=="mobile"),
                                      has_touch=(vp_name=="mobile"))
            page = ctx.new_page()
            for name, path in pages:
                url = base.rstrip("/") + path
                try:
                    page.goto(url, wait_until="networkidle", timeout=60000)
                except Exception as e:
                    fails.append(f"nav {{path}} {{vp_name}}: {{e}}")
                    continue
                page.evaluate('''async () => {{
                    for (let y = 0; y < document.body.scrollHeight; y += 600) {{
                        window.scrollTo({{top: y, behavior: "instant"}});
                        await new Promise(r => setTimeout(r, 40));
                    }}
                    window.scrollTo({{top: 0, behavior: "instant"}});
                }}''')
                page.wait_for_timeout(200)
                overflow = page.evaluate(
                    "() => document.documentElement.scrollWidth - window.innerWidth"
                )
                if vp_name == "mobile" and overflow > 1:
                    fails.append(f"horizontal overflow {{overflow}}px at 390 on {{path}}")
                if not {skip_screens!r}:
                    dest = out / f"{{name}}-{{vp_name}}.png"
                    page.screenshot(path=str(dest), full_page=True)
                    print(f"shot {{dest.name}} overflow={{overflow}}")
            ctx.close()
    finally:
        browser.close()
for f in fails:
    print("FAIL", f)
print(f"OVERFLOW_FAILS={{len(fails)}}")
sys.exit(1 if fails else 0)
"""
    r = subprocess.run(
        [_playwright_python(), "-c", script],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        timeout=600,
    )
    sys.stdout.write(r.stdout)
    if r.stderr:
        # filter noise
        for line in r.stderr.splitlines():
            if "DeprecationWarning" in line or "UserWarning" in line:
                continue
            print(line, file=sys.stderr)
    for line in r.stdout.splitlines():
        if line.startswith("FAIL "):
            fails.append(line[5:])
    if r.returncode == 0 and not skip_screens:
        n = len(list(out_dir.glob("*.png")))
        ok(f"screenshots written to {out_dir} ({n} files); no mobile overflow")
    elif r.returncode == 0:
        ok("no mobile horizontal overflow")
    elif not any("overflow" in f or "nav " in f for f in fails):
        fail(f"screenshot/overflow runner exited {r.returncode}", fails)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default=os.environ.get("SITE_BASE", SITE_DEFAULT))
    ap.add_argument("--out", default=None, help="screenshot dir (default out/site-review/<date>/gate)")
    ap.add_argument("--skip-screens", action="store_true")
    ap.add_argument("--skip-live", action="store_true", help="only check local files (no HTTP)")
    ap.add_argument("--pages-limit", type=int, default=30, help="max pages to crawl/screenshot")
    a = ap.parse_args()

    fails: list[str] = []
    print(f"site_quality_gate base={a.base}")
    check_images(fails)

    pages = discover_pages(a.base)[: a.pages_limit]
    # Prefer CORE order, then extras
    if not a.skip_live:
        check_links_and_images(a.base, pages, fails)
        out = Path(a.out) if a.out else ROOT / "out" / "site-review" / today() / "gate"
        check_overflow_and_screens(a.base, pages[:16], out, fails, skip_screens=a.skip_screens)
    else:
        ok("skipped live link/overflow checks (--skip-live)")

    print(f"\n{len(fails)} fail(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
