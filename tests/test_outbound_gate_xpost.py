"""x-post channel (own-timeline @ShipdayStudio posts via zernio_schedule.py): fail-closed gate."""
from __future__ import annotations
import hashlib, json, sys, tempfile, unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import outbound_gate as og  # noqa: E402


def jpeg(path: Path, size=(320, 400)) -> Path:
    from PIL import Image
    Image.new("RGB", size, (200, 120, 40)).save(path, "JPEG")
    return path


class XPostGate(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); td = Path(self.tmp.name)
        self.passes = td / "passes.jsonl"; self.reply = td / "reply.jsonl"; self.man = td / "man.json"
        self.reply.write_text("")
        self.patches = [mock.patch.object(og, "PASSES", self.passes), mock.patch.object(og, "REPLY_LOG", self.reply),
                        mock.patch.object(og, "MANIFEST", self.man)]
        for p in self.patches: p.start()
        self.img = jpeg(td / "proof.jpg")
        self.raw = jpeg(td / "raw.jpg", (1280, 720))
        d = hashlib.sha256(self.img.read_bytes()).hexdigest()
        self.man.write_text(json.dumps({"outputs": {d: {"purpose": "proof post 2026-10-28", "path": str(self.img)}}}))
        self.now = datetime(2026, 10, 27, 11, 0, tzinfo=timezone.utc)
        self.text = "Contrast does most of the work on a small thumbnail. Dark cake, bright plate, one word."

    def tearDown(self):
        for p in self.patches: p.stop()
        self.tmp.cleanup()

    def chk(self, **kw):
        base = dict(channel="x-post", text=self.text, media=[str(self.img)], now=self.now)
        base.update(kw)
        return og.check(**base)

    def test_pass_no_lead_no_freshness(self):
        ok, r, gid = self.chk()
        self.assertTrue(ok, r); self.assertTrue(gid)

    def test_text_only_pass(self):
        ok, r, _ = self.chk(media=[])
        self.assertTrue(ok, r)

    def test_unprotected_media_fails(self):
        ok, r, _ = self.chk(media=[str(self.raw)])
        self.assertFalse(ok); self.assertTrue(any("protect" in x or "640" in x for x in r), r)

    def test_mention_or_lead_fails(self):
        self.assertFalse(self.chk(text=self.text + " @somebuyer")[0])
        self.assertFalse(self.chk(lead="somebuyer")[0])

    def test_banned_phrase_em_dash_price(self):
        self.assertFalse(self.chk(text="We elevate thumbnails.")[0])
        self.assertFalse(self.chk(text="Bright plate \u2014 dark cake.")[0])
        self.assertFalse(self.chk(text="Thumbnails $55 each.")[0])

    def test_cli_pass_bind_and_single_use(self):
        rc = og.main(["check", "--channel", "x-post", "--text", self.text, "--media", str(self.img),
                      "--now", "2026-10-27T11:00:00Z"])
        self.assertEqual(rc, 0)
        row = json.loads(self.passes.read_text().strip().splitlines()[-1])
        self.assertEqual(row["kind"], "own-post")
        gid = row["gate_id"]
        bad, _ = og.verify_gate_id(gid, text=self.text + " x", media=[str(self.img)], lead="", channel="x-post", now=self.now)
        self.assertFalse(bad)
        ok, msg = og.verify_gate_id(gid, text=self.text, media=[str(self.img)], lead="", channel="x-post",
                                    now=self.now, consume=True)
        self.assertTrue(ok, msg)
        again, _ = og.verify_gate_id(gid, text=self.text, media=[str(self.img)], lead="", channel="x-post",
                                     now=self.now, consume=True)
        self.assertFalse(again)

    def test_zernio_schedule_refuses_without_gate(self):
        import subprocess
        r = subprocess.run([sys.executable, str(ROOT / "tools" / "zernio_schedule.py"), "--at",
                            "2026-10-28T14:00:00Z", self.text], capture_output=True, text=True, timeout=60)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("REFUSED, outbound_gate", r.stderr)


if __name__ == "__main__":
    unittest.main()
