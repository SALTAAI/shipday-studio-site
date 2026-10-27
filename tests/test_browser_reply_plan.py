"""tools/browser_reply_plan.py: handoff format + protect.py image gate (AK t52u)."""
import hashlib, json, os, sys, tempfile, unittest
from pathlib import Path
from PIL import Image
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "tools"))
import browser_reply_plan as brp  # noqa: E402
import protect  # noqa: E402
import outbound_gate  # noqa: E402


def _png(path, w=560, h=315):
    Image.new("RGB", (w, h), (40, 80, 160)).save(path)
    return path


class Format(unittest.TestCase):
    def test_refuses_without_gate_id(self):
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff("https://x.com/a/status/1", "hi there", images=None, follow_up=True)
        self.assertIn("gate-id", str(cm.exception).lower())

    def test_refuses_first_reply_without_images(self):
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff("https://x.com/a/status/1", "hi", images=[], gate_id="x")
        self.assertIn("REFUSE", str(cm.exception))
        self.assertTrue("t52u" in str(cm.exception) or "image" in str(cm.exception).lower())

    def test_refuses_pipe_in_fields(self):
        with self.assertRaises(ValueError):
            brp.format_handoff("https://x.com/a|b", "hi", follow_up=True, gate_id="x")
        with self.assertRaises(ValueError):
            brp.format_handoff("https://x.com/a", "hi | there", follow_up=True, gate_id="x")

    def test_refuses_empty(self):
        with self.assertRaises(ValueError):
            brp.format_handoff("", "hi", follow_up=True, gate_id="x")
        with self.assertRaises(ValueError):
            brp.format_handoff("https://x.com/a", "  ", follow_up=True, gate_id="x")

    def test_parse_includes_gate(self):
        line = "BROWSER REPLY NEEDED: https://x.com/a/status/1 | hi | /tmp/a.jpg | gate:abc123"
        parsed = brp.parse_handoff(line)
        self.assertEqual(parsed["gate_id"], "abc123")
        self.assertEqual(parsed["images"], ["/tmp/a.jpg"])


class Gate(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="brp-")
        self.root = Path(self.tmp) / "proj"
        (self.root / "data").mkdir(parents=True)
        (self.root / "tools").mkdir()
        self._old_brp_root = brp.ROOT
        self._old_brp_man = brp.MANIFEST
        self._old_prot_root = protect.ROOT
        self._old_prot_man = protect.MANIFEST
        self._old_og_man = outbound_gate.MANIFEST
        self._old_og_reply = outbound_gate.REPLY_LOG
        brp.ROOT = self.root
        brp.MANIFEST = self.root / "data" / "protect-manifest.json"
        protect.ROOT = self.root
        protect.MANIFEST = self.root / "data" / "protect-manifest.json"
        outbound_gate.MANIFEST = self.root / "data" / "protect-manifest.json"
        outbound_gate.REPLY_LOG = self.root / "data" / "reply-log.jsonl"
        outbound_gate.REPLY_LOG.write_text("")

    def tearDown(self):
        brp.ROOT = self._old_brp_root
        brp.MANIFEST = self._old_brp_man
        protect.ROOT = self._old_prot_root
        protect.MANIFEST = self._old_prot_man
        outbound_gate.MANIFEST = self._old_og_man
        outbound_gate.REPLY_LOG = self._old_og_reply
        import shutil
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _protect(self, name="preview.jpg"):
        src = _png(os.path.join(self.tmp, "src.png"))
        out = str(self.root / "data" / name)
        class A: pass
        a = A()
        a.inp = src
        a.out = out
        a.crop = None
        a.max = 640
        a.format = "jpg"
        a.purpose = "test"
        self.assertEqual(protect.cmd_make(a), 0)
        return out

    def test_accepts_protected_image(self):
        img = self._protect()
        with mock.patch.object(outbound_gate, "verify_gate_id", return_value=(True, "ok")):
            line = brp.format_handoff(
                "https://x.com/buyer/status/9",
                "Pokemon GO video sounds fun",
                images=[img],
                gate_id="testhappy",
            )
        self.assertIn(img, line)
        self.assertIn("gate:testhappy", line)
        parsed = brp.parse_handoff(line)
        self.assertEqual(parsed["images"], [img])
        self.assertEqual(parsed["gate_id"], "testhappy")

    def test_refuses_unprotected_file(self):
        raw = _png(os.path.join(self.tmp, "raw.png"))
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff(
                "https://x.com/a/status/1", "hi", images=[raw], gate_id="x",
            )
        self.assertIn("not protect.py-verified", str(cm.exception))

    def test_refuses_missing_file(self):
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff(
                "https://x.com/a/status/1", "hi",
                images=[os.path.join(self.tmp, "nope.jpg")], gate_id="x")
        self.assertIn("missing", str(cm.exception))

    def test_two_images_comma_joined(self):
        a = self._protect("a.jpg")
        b = self._protect("b.jpg")
        with mock.patch.object(outbound_gate, "verify_gate_id", return_value=(True, "ok")):
            line = brp.format_handoff(
                "https://x.com/a/status/1", "hi", images=[a, b], gate_id="testhappy",
            )
        parsed = brp.parse_handoff(line)
        self.assertEqual(parsed["images"], [a, b])

    def test_cli_requires_gate_id(self):
        with self.assertRaises(SystemExit) as cm:
            brp.main(["--url", "https://x.com/a/status/1", "--text", "thanks", "--follow-up"])
        self.assertNotEqual(cm.exception.code, 0)

    def test_refuses_without_gate_id_even_with_image(self):
        img = self._protect("nogate.jpg")
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff("https://x.com/a/status/1", "hi", images=[img], gate_id="")
        self.assertIn("gate-id", str(cm.exception).lower())




class OwnThreadGuard(unittest.TestCase):
    """Previews must sit directly under the buyer's post (x-test-2026-10-27.md)."""

    def test_status_author(self):
        self.assertEqual(brp.status_author("https://x.com/ShipdayStudio/status/123"), "shipdaystudio")
        self.assertEqual(brp.status_author("https://twitter.com/Foo_1/status/9?s=20"), "foo_1")
        self.assertEqual(brp.status_author("https://example.com/x"), "")

    def test_refuses_previews_under_own_reply(self):
        with self.assertRaises(ValueError) as cm:
            brp.format_handoff("https://x.com/ShipdayStudio/status/2114999", "here you go",
                               images=["/nonexistent.jpg"], gate_id="x", lead="somebuyer")
        self.assertIn("directly under the buyer", str(cm.exception))

    def test_own_thread_text_only_followup_not_blocked_by_guard(self):
        with mock.patch.object(outbound_gate, "already_contacted", return_value=True), \
             mock.patch.object(outbound_gate, "verify_gate_id", return_value=(True, "ok")):
            line = brp.format_handoff("https://x.com/ShipdayStudio/status/2114999", "thanks",
                                      images=[], follow_up=True, gate_id="g1", lead="somebuyer")
        self.assertTrue(line.startswith(brp.PREFIX))

if __name__ == "__main__":
    unittest.main()
