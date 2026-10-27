"""tools/protect.py: buyer-preview watermark + clean site export (AK t102u)."""
import json, os, shutil, sys, unittest
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _helpers import TOOLS, mktmp, run
from PIL import Image

sys.path.insert(0, TOOLS)
import protect  # noqa: E402


def png(path, w, h, color=(30, 120, 200), exif=False):
    im = Image.new("RGB", (w, h), color)
    for x in range(0, w, 7):
        im.putpixel((x, h // 2), (255, 255, 255))
    kw = {}
    if exif:
        ex = Image.Exif(); ex[0x010F] = "FakeCam"; kw["exif"] = ex.tobytes()
    im.save(path, **kw)
    return path


class Pure(unittest.TestCase):
    def test_target_size_preview(self):
        self.assertEqual(protect.target_size(1920, 1080, 640), (560, 315))
        self.assertEqual(protect.target_size(2000, 1000, 640), (640, 320))
        self.assertEqual(protect.target_size(300, 200, 640), (300, 200))
        self.assertEqual(protect.target_size(1000, 3000, 9999), (213, 640))
        self.assertEqual(protect.MAX_LONG, 640)

    def test_target_size_site_no_preview_cap(self):
        self.assertEqual(protect.target_size(1920, 1080, 1280, preview=False), (1280, 720))
        self.assertEqual(protect.target_size(800, 600, 1280, preview=False), (800, 600))

    def test_is_hero_or_thumb(self):
        self.assertTrue(protect.is_hero_or_thumb(Path("work/v3/thumb-gaming-a.webp")))
        self.assertTrue(protect.is_hero_or_thumb(Path("demos/x/hero.webp")))
        self.assertFalse(protect.is_hero_or_thumb(Path("work/v3/lp-vantorel-mobile.webp")))


class Cli(unittest.TestCase):
    def setUp(self):
        self.t = mktmp("protect-test-")
        self.r = os.path.join(self.t, "proj")
        os.makedirs(os.path.join(self.r, "tools"))
        shutil.copy(os.path.join(TOOLS, "protect.py"), os.path.join(self.r, "tools"))
        self.tool = os.path.join(self.r, "tools", "protect.py")
        self.man = os.path.join(self.r, "data", "protect-manifest.json")

    def tearDown(self):
        shutil.rmtree(self.t, ignore_errors=True)

    def p(self, *a):
        return run([sys.executable, self.tool, *a], self.t)

    def test_make_watermarks_downscales_strips_and_records(self):
        src = png(os.path.join(self.t, "big.jpg"), 1600, 1200, exif=True)
        self.assertTrue(protect.has_metadata(Path(src)))
        out = os.path.join(self.t, "out.jpg")
        r = self.p("make", src, out); self.assertEqual(r.returncode, 0, r.stderr)
        im = Image.open(out); self.assertLessEqual(max(im.size), 640)
        self.assertFalse(protect.has_metadata(Path(out)))
        m = json.load(open(self.man)); self.assertEqual(len(m["outputs"]), 1)
        self.assertEqual(self.p("is-protected", out).stdout.strip(), "protected")
        r = self.p("is-protected", src); self.assertEqual(r.returncode, 1); self.assertIn("NOT protected", r.stdout)
        self.assertEqual(self.p("check", out).returncode, 0)

    def test_idempotent_no_second_watermark(self):
        src = png(os.path.join(self.t, "a.png"), 800, 600)
        o1, o2 = os.path.join(self.t, "o1.jpg"), os.path.join(self.t, "o2.jpg")
        self.assertEqual(self.p("make", src, o1).returncode, 0)
        r = self.p("make", o1, o2); self.assertEqual(r.returncode, 0); self.assertIn("already protected", r.stdout)
        self.assertEqual(open(o1, "rb").read(), open(o2, "rb").read())
        self.assertEqual(len(json.load(open(self.man))["outputs"]), 1)

    def test_watermark_changes_pixels(self):
        src = png(os.path.join(self.t, "flat.png"), 600, 400, color=(10, 10, 10))
        out = os.path.join(self.t, "flat.webp")
        self.assertEqual(self.p("make", src, out).returncode, 0)
        raw = Image.open(out); self.assertEqual(raw.format, "WEBP"); im = raw.convert("RGB")
        colors = im.getcolors(maxcolors=1 << 20)
        self.assertGreater(len(colors), 2, "a visible label must be drawn on the preview")
        self.assertTrue(protect.has_preview_watermark(Path(out)))

    def test_check_fails_unprotected_buyer_preview(self):
        raw = png(os.path.join(self.t, "raw.png"), 1000, 700)
        r = self.p("check", raw); self.assertEqual(r.returncode, 1)
        self.assertIn("> 640px", r.stdout); self.assertIn("not a protect.py output", r.stdout)

    def test_site_exports_clean_not_watermarked(self):
        pub = os.path.join(self.r, "public", "work")
        masters = os.path.join(self.r, "samples", "site-masters", "work")
        os.makedirs(pub); os.makedirs(masters)
        png(os.path.join(masters, "thumb-a.webp"), 1280, 720, color=(20, 80, 160))
        # Seed a watermarked-looking public file that site --force must replace
        png(os.path.join(pub, "thumb-a.webp"), 560, 315, color=(20, 80, 160))
        # Record a fake site-sample watermark entry pointing at the old file
        os.makedirs(os.path.join(self.r, "data"))
        fake = {"version": 2, "label": "x", "outputs": {
            protect.sha(open(os.path.join(pub, "thumb-a.webp"), "rb").read()): {
                "file": "public/work/thumb-a.webp", "w": 560, "h": 315,
                "src": "x", "purpose": "site sample", "v": 2, "at": "t"
            }
        }}
        json.dump(fake, open(self.man, "w"))
        r = self.p("site", "--force"); self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        out = Path(pub) / "thumb-a.webp"
        im = Image.open(out)
        self.assertEqual(im.size, (1280, 720))
        self.assertFalse(protect.has_preview_watermark(out))
        m = json.load(open(self.man))
        self.assertEqual(m["outputs"], {}, "site sample records must be removed")
        self.assertNotIn(protect.sha(out.read_bytes()), m["outputs"])
        # check (no args) must PASS for clean site
        r = self.p("check"); self.assertEqual(r.returncode, 0, r.stdout)

    def test_check_site_fails_if_watermarked(self):
        pub = os.path.join(self.r, "public", "work")
        os.makedirs(pub)
        src = png(os.path.join(self.t, "big.png"), 1200, 800)
        out = os.path.join(pub, "thumb-b.webp")
        self.assertEqual(self.p("make", src, out).returncode, 0)
        r = self.p("check"); self.assertEqual(r.returncode, 1)
        self.assertTrue(
            "watermarked" in r.stdout or "PREVIEW" in r.stdout,
            r.stdout,
        )

    def test_check_site_public_rules_clean_ok_outside_fails(self):
        os.makedirs(os.path.join(self.r, "public", "work"))
        os.makedirs(os.path.join(self.r, "public", "misc"))
        os.makedirs(os.path.join(self.r, "samples", "site-masters", "work"))
        # Clean site image with matching master
        png(os.path.join(self.r, "samples", "site-masters", "work", "s.webp"), 1280, 720)
        shutil.copy(
            os.path.join(self.r, "samples", "site-masters", "work", "s.webp"),
            os.path.join(self.r, "public", "work", "s.webp"),
        )
        png(os.path.join(self.r, "public", "misc", "x.png"), 50, 50)
        open(os.path.join(self.r, "public", "logo.svg"), "w").write("<svg/>")
        png(os.path.join(self.r, "public", "og.png"), 50, 50)
        r = self.p("check"); self.assertEqual(r.returncode, 1)
        self.assertIn("public/misc/x.png: raster outside", r.stdout)
        self.assertIn("SVG sample", r.stdout)
        self.assertNotIn("og.png", r.stdout)
        self.assertNotIn("work/s.webp: watermarked", r.stdout)


if __name__ == "__main__":
    unittest.main()
