import hashlib, sys, pathlib, unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "tools"))
import zernio_media_audit as a
GOOD, BAD = b"good", b"bad"
H = {hashlib.sha256(GOOD).hexdigest()}
def fetch(u):
    if u == "x/err": raise OSError("down")
    return GOOD if u == "x/good" else BAD
class T(unittest.TestCase):
    def test_protected_clean(self):
        l, b = a.audit([{"_id": "1", "status": "scheduled", "mediaItems": [{"url": "x/good"}]}], fetch, H)
        self.assertEqual(b, 0); self.assertTrue(l[0].startswith("protected"))
    def test_unprotected_flagged(self):
        l, b = a.audit([{"_id": "2", "status": "scheduled", "mediaItems": [{"url": "x/bad"}]}], fetch, H)
        self.assertEqual(b, 1); self.assertTrue(l[0].startswith("UNPROTECTED"))
    def test_unreadable_fails_closed(self):
        _, b = a.audit([{"_id": "3", "status": "draft", "mediaItems": [{"url": "x/err"}]}], fetch, H)
        self.assertEqual(b, 1)
    def test_published_ignored(self):
        l, b = a.audit([{"_id": "4", "status": "published", "mediaItems": [{"url": "x/bad"}]}], fetch, H)
        self.assertEqual((l, b), ([], 0))
    def test_run_pages_and_audits(self):
        import json
        calls = []
        def get(url):
            calls.append(url)
            if "page=1" in url:
                return json.dumps({"posts": [{"_id": str(i), "status": "published"} for i in range(99)] +
                                  [{"_id": "s", "status": "scheduled", "mediaItems": [{"url": "x/bad"}]}]}).encode()
            return json.dumps({"posts": [{"_id": "d", "status": "draft", "mediaItems": [{"url": "x/good"}]}]}).encode()
        l, b = a.run(get=get, fetch_bytes=fetch, hashes=H)
        self.assertEqual(len(calls), 2); self.assertEqual(b, 1); self.assertEqual(len(l), 2)
    def test_funnel_check_wires_audit(self):
        src = (pathlib.Path(__file__).resolve().parent.parent / "tools" / "funnel_check.py").read_text()
        self.assertIn("zernio_media_audit.run()", src); self.assertIn("zernio media audit error", src)
if __name__ == "__main__":
    unittest.main()
