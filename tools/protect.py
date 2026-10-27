#!/usr/bin/env python3
"""Image protection for pre-payment buyer previews, and clean web export for the public site.

AK t102u (27 Oct 2026): website images are NEVER watermarked. The watermark recipe
(`make` / `is-protected`) applies only to lead-specific buyer previews sent before payment
(X DM, public reply, Reddit, email, first-order concept, Zernio outreach media).

Site samples (`protect.py site`) rebuild every image under public/work and public/demos
from private masters in samples/site-masters/ as clean, web-sized, metadata-stripped
WebP/JPEG. They must NOT appear in data/protect-manifest.json (that file lists watermarked
outputs only). funnel_check / site_quality_gate FAIL if a site image's sha256 is in the
manifest or a PREVIEW badge is detected.

Usage:
  protect.py make IN [OUT] [--crop …] [--max 640] [--format jpg|webp] [--purpose …]
  protect.py site [--force]       clean web rebuild of public/work + public/demos
  protect.py check [FILE …]       site default: FAIL if watermarked / PREVIEW / metadata / SVG
                                  explicit FILE: buyer-preview rules (<=640, in manifest, no meta)
  protect.py is-protected FILE    exit 0 if FILE's sha256 is a watermarked manifest output
"""
from __future__ import annotations
import argparse, hashlib, io, json, os, shutil, sys, time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
MASTERS = ROOT / "samples" / "site-masters"          # private, gitignored
MANIFEST = ROOT / "data" / "protect-manifest.json"   # private, gitignored; watermarked outputs ONLY
SITE_DIRS = ("work", "demos")
BRAND_EXEMPT = ("icon-192.png", "icon-512.png", "icon-maskable-512.png", "og.png", "og/")
RASTER = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif")
LABEL = "SHIPDAY STUDIO · PREVIEW"
VERSION = 2
MAX_LONG = 640          # buyer-preview long-side cap
MAX_169_W = 560         # buyer-preview 16:9 width (below YouTube's 640 min)
SITE_MAX = 1280         # clean site image long-side / 16:9 width
FONTS = [
    "/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def load_manifest() -> dict:
    if MANIFEST.exists():
        return json.loads(MANIFEST.read_text())
    return {"version": VERSION, "label": LABEL, "outputs": {}}


def save_manifest(m: dict) -> None:
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    tmp = MANIFEST.with_suffix(".tmp")
    tmp.write_text(json.dumps(m, indent=1, sort_keys=True))
    os.replace(tmp, MANIFEST)


def font(size: int):
    for p in FONTS:
        if os.path.exists(p):
            try:
                f = ImageFont.truetype(p, size)
                try:
                    f.set_variation_by_axes([14, 800])
                except Exception:
                    pass
                return f
            except Exception:
                pass
    return ImageFont.load_default()


def crop(im: Image.Image, spec: str | None) -> Image.Image:
    w, h = im.size
    if not spec:
        if h > w * 1.3 and w >= 900:
            spec = "tall"
        else:
            return im
    if spec == "tall":
        return im.crop((0, 0, w, min(h, round(w * 5 / 4))))
    if spec == "left":
        return im.crop((0, 0, w // 2, h))
    if spec == "right":
        return im.crop((w // 2, 0, w, h))
    if spec == "top":
        return im.crop((0, 0, w, h // 2))
    if spec == "hero":
        return im.crop((0, 0, w, int(h * 0.56)))
    x, y, cw, ch = (int(v) for v in spec.split(","))
    return im.crop((x, y, x + cw, y + ch))


def target_size(w: int, h: int, cap: int, *, preview: bool = True) -> tuple[int, int]:
    """Scale so long side <= cap. For buyer previews, 16:9 also capped at MAX_169_W."""
    if preview:
        cap = min(cap, MAX_LONG)
        if h and 1.7 <= w / h <= 1.8:
            cap = min(cap, MAX_169_W)
    s = min(1.0, cap / max(w, h))
    return max(1, round(w * s)), max(1, round(h * s))


def watermark(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    fs = max(11, round(max(w, h) / 24))
    f = font(fs)
    big = int((w * w + h * h) ** 0.5) + 2 * fs
    tile = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    tw = d.textlength(LABEL, font=f)
    step_x, step_y = int(tw + fs * 1.6), int(fs * 3.2)
    for row, y in enumerate(range(0, big, step_y)):
        off = (row % 2) * step_x // 2
        for x in range(-step_x, big, step_x):
            d.text((x + off + 1, y + 1), LABEL, font=f, fill=(0, 0, 0, 70))
            d.text((x + off, y), LABEL, font=f, fill=(255, 255, 255, 88))
    tile = tile.rotate(28, resample=Image.BICUBIC)
    l, t = (big - w) // 2, (big - h) // 2
    im.alpha_composite(tile.crop((l, t, l + w, t + h)))
    bf = font(max(10, round(min(w, 2 * h) / 34)))
    d = ImageDraw.Draw(im)
    bw = d.textlength(LABEL, font=bf)
    pad = max(4, w // 110)
    bh = bf.size + pad * 2
    x0, y0 = w - int(bw) - pad * 3, h - bh - pad
    d.rounded_rectangle((x0, y0, w - pad, h - pad), radius=pad, fill=(14, 14, 18, 225))
    d.text((x0 + pad, y0 + pad - 1), LABEL, font=bf, fill=(255, 107, 44, 255))
    return im


def render(src: bytes, crop_spec: str | None, cap: int, fmt: str) -> tuple[bytes, tuple[int, int]]:
    """Buyer-preview render: crop, downscale, watermark, strip metadata."""
    im = Image.open(io.BytesIO(src))
    im.load()
    if im.mode in ("P", "LA", "L", "RGBA"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    im = crop(im.convert("RGB"), crop_spec)
    im = im.resize(target_size(*im.size, cap, preview=True), Image.LANCZOS)
    im = watermark(im).convert("RGB")
    out = io.BytesIO()
    if fmt == "webp":
        im.save(out, "WEBP", quality=72, method=6)
    else:
        im.save(out, "JPEG", quality=72, optimize=True, progressive=True)
    return out.getvalue(), im.size


def render_clean(src: bytes, fmt: str, cap: int = SITE_MAX,
                 *, min_width: int | None = None) -> tuple[bytes, tuple[int, int]]:
    """Public-site render: no watermark, web-sized, metadata stripped (AK t102u).
    When min_width is set (hero/thumb slots), never shrink below that width if the master is wider."""
    im = Image.open(io.BytesIO(src))
    im.load()
    if im.mode in ("P", "LA", "L", "RGBA"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")
    tw, th = target_size(*im.size, cap, preview=False)
    if min_width and im.size[0] >= min_width and tw < min_width:
        # Portrait (or oversized) master: keep width at least min_width
        s = min_width / im.size[0]
        tw, th = min_width, max(1, round(im.size[1] * s))
    if (tw, th) != im.size:
        im = im.resize((tw, th), Image.LANCZOS)
    out = io.BytesIO()
    if fmt == "webp":
        im.save(out, "WEBP", quality=85, method=6)
    else:
        im.save(out, "JPEG", quality=85, optimize=True, progressive=True)
    return out.getvalue(), im.size


def is_hero_or_thumb(rel: Path) -> bool:
    n = rel.name.lower()
    return n.startswith("thumb-") or "thumb-" in n or n.startswith("hero") or n == "hero.webp" or n.endswith("-hero.webp")


def record(m: dict, out_rel: str, data: bytes, size, src_sha: str, purpose: str) -> None:
    m["outputs"][sha(data)] = {"file": out_rel, "w": size[0], "h": size[1], "src": src_sha,
                               "purpose": purpose, "v": VERSION, "at": time.strftime("%Y-%m-%dT%H:%M:%S%z")}


def rel(p: Path) -> str:
    try:
        return str(p.resolve().relative_to(ROOT))
    except ValueError:
        return str(p.resolve())


def has_metadata(path: Path) -> bool:
    im = Image.open(path)
    keys = {k for k in im.info if k not in ("dpi", "jfif", "jfif_version", "jfif_unit", "jfif_density",
                                             "progressive", "progression", "background", "loop", "duration",
                                             "adobe", "adobe_transform")}
    try:
        ex = len(im.getexif()) > 0
    except Exception:
        ex = False
    return bool(keys) or ex


def has_preview_watermark(path: Path | bytes) -> bool:
    """Detect the protect.py corner badge (dark bar + orange label) used on buyer previews.
    Site images must never match. Manifest membership is the primary gate; this catches
    leftovers that somehow aren't recorded."""
    if isinstance(path, (bytes, bytearray)):
        im = Image.open(io.BytesIO(path)).convert("RGB")
    else:
        im = Image.open(path).convert("RGB")
    w, h = im.size
    if w < 40 or h < 20:
        return False
    # Bottom-right corner where the solid badge lives
    cw, ch = min(220, w // 2), min(56, h // 4)
    crop_im = im.crop((w - cw, h - ch, w, h))
    try:
        pixels = list(crop_im.get_flattened_data())
    except Exception:
        pixels = list(crop_im.getdata())
    n = len(pixels)
    if n == 0:
        return False
    dark = orange = 0
    for pix in pixels:
        r, g, b = pix[0], pix[1], pix[2]
        if r < 40 and g < 40 and b < 55:
            dark += 1
        # badge text fill (255, 107, 44)
        if r > 200 and 60 < g < 150 and b < 90:
            orange += 1
    return (dark / n) > 0.18 and (orange / n) > 0.01


def site_images() -> list[Path]:
    out = []
    for d in SITE_DIRS:
        for p in sorted((PUBLIC / d).rglob("*")):
            if p.is_file() and p.suffix.lower() in RASTER:
                out.append(p)
    return out


def resolve_master(rel_under_public: Path) -> Path | None:
    """Pick the private master for a public site path. Prefer a full-size sibling when the
    path is a *-640 thumbnail variant whose own master is only 640px."""
    master = MASTERS / rel_under_public
    if not master.exists():
        return None
    name = rel_under_public.name
    if "-640" in name:
        sibling = MASTERS / rel_under_public.with_name(name.replace("-640", "", 1))
        if sibling.exists():
            try:
                mw, _ = Image.open(master).size
                sw, _ = Image.open(sibling).size
                if sw > mw:
                    return sibling
            except Exception:
                pass
    return master


def cmd_make(a) -> int:
    m = load_manifest()
    src = Path(a.inp).read_bytes()
    fmt = a.format or ("webp" if (a.out or "").endswith(".webp") else "jpg")
    out = Path(a.out) if a.out else ROOT / "samples" / "previews" / (Path(a.inp).stem + "-preview." + fmt)
    out.parent.mkdir(parents=True, exist_ok=True)
    if sha(src) in m["outputs"]:  # already protected: never stack a second watermark
        if out.resolve() != Path(a.inp).resolve():
            shutil.copyfile(a.inp, out)
        print(f"already protected, copied as-is: {out}")
        return 0
    data, size = render(src, a.crop, a.max, fmt)
    out.write_bytes(data)
    record(m, rel(out), data, size, sha(src), a.purpose or "preview")
    save_manifest(m)
    assert max(size) <= MAX_LONG and not has_metadata(out)
    print(out, size)
    return 0


def cmd_site(a) -> int:
    """Rebuild public/work + public/demos as CLEAN web images (AK t102u). Never watermark."""
    m = load_manifest()
    done = skipped = 0
    # Drop prior "site sample" watermarked records so funnel_check treats them as forbidden.
    drop = [k for k, v in m["outputs"].items() if v.get("purpose") == "site sample"]
    for k in drop:
        del m["outputs"][k]
    for p in site_images():
        r = p.relative_to(PUBLIC)
        master = resolve_master(r)
        cur = p.read_bytes()
        if master is None:
            if sha(cur) in m["outputs"] or has_preview_watermark(p):
                print(f"FAIL no clean master for watermarked {r}; refusing to leave it")
                return 1
            # Unwatermarked public file with no master: seed a private master, then re-export clean.
            master = MASTERS / r
            master.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(p, master)
        msha = sha(master.read_bytes())
        fmt = "webp" if p.suffix.lower() == ".webp" else "jpg"
        min_w = 1000 if is_hero_or_thumb(r) else None
        data, size = render_clean(master.read_bytes(), fmt, SITE_MAX, min_width=min_w)
        # Idempotent skip when already a clean export of this master (same pixels + not watermarked)
        if (not a.force and sha(cur) == sha(data)
                and sha(cur) not in m["outputs"] and not has_preview_watermark(data)):
            skipped += 1
            continue
        p.write_bytes(data)
        assert sha(data) not in m["outputs"], "clean site image must not be a watermarked output"
        assert not has_preview_watermark(p), f"watermark detected after clean export: {r}"
        assert not has_metadata(p)
        done += 1
        print(f"site-clean {r} {size}")
    # Also scrub any leftover outputs whose file path still points under public/work|demos
    drop2 = [k for k, v in m["outputs"].items()
             if str(v.get("file", "")).startswith(("public/work/", "public/demos/"))]
    for k in drop2:
        del m["outputs"][k]
    save_manifest(m)
    print(f"site: {done} cleaned, {skipped} already clean, removed {len(drop)+len(drop2)} watermarked site records")
    return 0


def check_preview_files(files: list[Path]) -> list[str]:
    """Buyer-preview rules: <=640, in watermark manifest, no metadata."""
    m = load_manifest()
    bad = []
    for p in files:
        r = rel(p)
        b = p.read_bytes()
        try:
            im = Image.open(io.BytesIO(b))
            w, h = im.size
        except Exception as e:
            bad.append(f"{r}: unreadable ({e})")
            continue
        if max(w, h) > MAX_LONG:
            bad.append(f"{r}: {w}x{h} > {MAX_LONG}px")
        if sha(b) not in m["outputs"]:
            bad.append(f"{r}: not a protect.py output (no watermark record)")
        if has_metadata(p):
            bad.append(f"{r}: metadata present")
    return bad


def check_site_files(files: list[Path]) -> list[str]:
    """Public-site rules (AK t102u): must NOT be watermarked / in protect manifest."""
    m = load_manifest()
    bad = []
    for p in files:
        r = rel(p)
        b = p.read_bytes()
        try:
            Image.open(io.BytesIO(b)).size
        except Exception as e:
            bad.append(f"{r}: unreadable ({e})")
            continue
        if sha(b) in m["outputs"]:
            bad.append(f"{r}: watermarked protect.py output on the public site (AK t102u)")
        if has_preview_watermark(p):
            bad.append(f"{r}: PREVIEW watermark badge detected (AK t102u)")
        if has_metadata(p):
            bad.append(f"{r}: metadata present")
    return bad


def check_files(files: list[Path]) -> list[str]:
    """Back-compat: when called on site_images() use site rules; else preview rules.
    Explicit callers that pass buyer files get preview rules."""
    site_set = {p.resolve() for p in site_images()}
    if files and all(p.resolve() in site_set for p in files):
        return check_site_files(files)
    # Mixed or non-site: if every path is under public/work|demos treat as site
    if files and all(
        ("/public/work/" in str(p.resolve()) or "/public/demos/" in str(p.resolve())
         or str(p.resolve()).endswith("/public/work") is False and (
             (PUBLIC / "work") in p.resolve().parents or (PUBLIC / "demos") in p.resolve().parents))
        for p in files
    ):
        return check_site_files(files)
    return check_preview_files(files)


def cmd_check(a) -> int:
    if a.files:
        files = [Path(f) for f in a.files]
        # Heuristic: paths under public/work|demos → site rules; else buyer-preview rules
        under_site = []
        under_other = []
        for p in files:
            rp = p.resolve()
            if (PUBLIC / "work") in rp.parents or (PUBLIC / "demos") in rp.parents or (
                rp.parent == PUBLIC / "work" or rp.parent == PUBLIC / "demos"
            ):
                under_site.append(p)
            else:
                under_other.append(p)
        bad = check_site_files(under_site) + check_preview_files(under_other)
        other = []
    else:
        files = site_images()
        bad = check_site_files(files)
        other = []
        for p in sorted(PUBLIC.rglob("*")):
            if p.is_file() and p.suffix.lower() in RASTER and p not in files:
                r = str(p.relative_to(PUBLIC))
                if r.startswith("previews/"):
                    continue  # buyer-preview archive mistakenly tracked; not a site sample
                if not any(r == e or (e.endswith("/") and r.startswith(e)) for e in BRAND_EXEMPT):
                    other.append(f"public/{r}: raster outside work/ and demos/ and not brand-exempt")
        for p in sorted(PUBLIC.rglob("*.svg")):
            other.append(f"public/{p.relative_to(PUBLIC)}: SVG sample in public/ (vector = usable file)")
        # Brand/OG cards that embed sample art must not carry the preview watermark either
        for p in sorted(PUBLIC.rglob("*")):
            if not (p.is_file() and p.suffix.lower() in RASTER):
                continue
            r = str(p.relative_to(PUBLIC))
            if r == "og.png" or r.startswith("og/"):
                if has_preview_watermark(p) or sha(p.read_bytes()) in load_manifest()["outputs"]:
                    other.append(f"public/{r}: PREVIEW watermark on OG/social card (AK t102u)")
    bad = bad + other
    for b in bad:
        print("FAIL", b)
    print(f"{len(files)} checked, {len(bad)} problem(s)")
    return 1 if bad else 0


def cmd_is(a) -> int:
    ok = sha(Path(a.file).read_bytes()) in load_manifest()["outputs"]
    print("protected" if ok else "NOT protected")
    return 0 if ok else 1


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)
    mk = sp.add_parser("make"); mk.add_argument("inp"); mk.add_argument("out", nargs="?")
    mk.add_argument("--crop"); mk.add_argument("--max", type=int, default=MAX_LONG)
    mk.add_argument("--format", choices=["jpg", "webp"]); mk.add_argument("--purpose")
    st = sp.add_parser("site"); st.add_argument("--force", action="store_true")
    ck = sp.add_parser("check"); ck.add_argument("files", nargs="*")
    ip = sp.add_parser("is-protected"); ip.add_argument("file")
    a = ap.parse_args()
    return {"make": cmd_make, "site": cmd_site, "check": cmd_check, "is-protected": cmd_is}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
