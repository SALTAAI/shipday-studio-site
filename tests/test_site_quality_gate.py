"""tools/site_quality_gate.py hard fails (AK t102u/t103u)."""
import os, shutil, sys, tempfile, unittest
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _helpers import TOOLS, ROOT
sys.path.insert(0, TOOLS)
import protect
import site_quality_gate
from PIL import Image


def write_img(path, w, h, color=(40, 100, 180)):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Image.new("RGB", (w, h), color).save(path, "WEBP")


class GateImages(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="sqg-")
        self.pub = Path(self.tmp) / "public"
        self.work = self.pub / "work"
        self.work.mkdir(parents=True)
        # Point protect.PUBLIC at our temp tree
        self._old_pub = protect.PUBLIC
        self._old_man = protect.MANIFEST
        protect.PUBLIC = self.pub
        protect.MANIFEST = Path(self.tmp) / "data" / "protect-manifest.json"
        protect.MANIFEST.parent.mkdir(parents=True)
        protect.MANIFEST.write_text('{"version":2,"label":"x","outputs":{}}')

    def tearDown(self):
        protect.PUBLIC = self._old_pub
        protect.MANIFEST = self._old_man
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_clean_thumb_passes(self):
        write_img(self.work / "thumb-a.webp", 1280, 720)
        fails = []
        site_quality_gate.check_images(fails)
        self.assertEqual(fails, [])

    def test_narrow_thumb_fails(self):
        write_img(self.work / "thumb-a.webp", 560, 315)
        fails = []
        site_quality_gate.check_images(fails)
        self.assertTrue(any("under 1000" in f for f in fails), fails)

    def test_watermarked_manifest_fails(self):
        path = self.work / "thumb-a.webp"
        write_img(path, 1280, 720)
        # Mark current bytes as a protect output
        b = path.read_bytes()
        m = protect.load_manifest()
        m["outputs"][protect.sha(b)] = {"file": "public/work/thumb-a.webp", "purpose": "preview",
                                         "w": 1280, "h": 720, "src": "x", "v": 2, "at": "t"}
        protect.save_manifest(m)
        fails = []
        site_quality_gate.check_images(fails)
        self.assertTrue(any("watermarked" in f for f in fails), fails)

    def test_preview_badge_fails(self):
        # Build a real watermarked preview via protect.make render helpers
        src = Image.new("RGB", (1280, 720), (10, 10, 10))
        import io
        buf = io.BytesIO(); src.save(buf, "PNG"); raw = buf.getvalue()
        data, size = protect.render(raw, None, 640, "webp")
        out = self.work / "thumb-wm.webp"
        out.write_bytes(data)
        # Also record it so either detector trips
        m = protect.load_manifest()
        m["outputs"][protect.sha(data)] = {"file": str(out), "purpose": "preview",
                                            "w": size[0], "h": size[1], "src": "x", "v": 2, "at": "t"}
        protect.save_manifest(m)
        fails = []
        site_quality_gate.check_images(fails)
        self.assertTrue(fails, "expected watermark fail")


if __name__ == "__main__":
    unittest.main()
