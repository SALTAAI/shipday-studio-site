"""AK t101u: stale *-browser-pending rows flag BUYER HANDOFF NOT SENT."""
from __future__ import annotations

import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import run_health as rh  # noqa: E402


def at(iso: str) -> datetime:
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(timezone.utc)


class BuyerHandoffHealth(unittest.TestCase):
    def test_stale_pending_flags(self):
        t0 = at("2026-10-27T12:00:00Z")
        rows = [(
            at("2026-10-27T11:30:00Z"),
            {
                "type": "lead",
                "at": "2026-10-27T11:30:00Z",
                "handle": "plays_teamer",
                "lead": "https://x.com/plays_teamer/status/2115042045966659986",
                "channel": "x-dm-browser-pending",
            },
        )]
        iss = rh.buyer_handoff_issues(t_now=t0, rows=rows)
        self.assertTrue(any(i[0] == "BUYER HANDOFF NOT SENT" for i in iss), iss)
        self.assertTrue(any("plays_teamer" in i[1] for i in iss), iss)

    def test_lapsed_clears(self):
        t0 = at("2026-10-27T12:00:00Z")
        rows = [
            (
                at("2026-10-27T11:30:00Z"),
                {
                    "type": "lead",
                    "at": "2026-10-27T11:30:00Z",
                    "handle": "plays_teamer",
                    "lead": "https://x.com/plays_teamer/status/2115042045966659986",
                    "channel": "x-dm-browser-pending",
                },
            ),
            (
                at("2026-10-27T11:50:00Z"),
                {
                    "type": "lapsed-not-sent",
                    "at": "2026-10-27T11:50:00Z",
                    "handle": "plays_teamer",
                    "lead": "https://x.com/plays_teamer/status/2115042045966659986",
                    "status": "lapsed-not-sent",
                },
            ),
        ]
        iss = rh.buyer_handoff_issues(t_now=t0, rows=rows)
        self.assertFalse(any(i[0] == "BUYER HANDOFF NOT SENT" for i in iss), iss)

    def test_sent_clears(self):
        t0 = at("2026-10-27T12:00:00Z")
        rows = [
            (
                at("2026-10-27T11:30:00Z"),
                {
                    "type": "lead",
                    "at": "2026-10-27T11:30:00Z",
                    "handle": "vibingmelvin",
                    "lead": "https://x.com/VibingMelvin/status/2115002326801101265",
                    "channel": "x-reply-browser-pending",
                },
            ),
            (
                at("2026-10-27T11:35:00Z"),
                {
                    "type": "x-reply-browser",
                    "at": "2026-10-27T11:35:00Z",
                    "handle": "VibingMelvin",
                    "lead": "https://x.com/VibingMelvin/status/2115002326801101265",
                    "status": "posted",
                    "channel": "x-reply",
                },
            ),
        ]
        iss = rh.buyer_handoff_issues(t_now=t0, rows=rows)
        self.assertFalse(any(i[0] == "BUYER HANDOFF NOT SENT" for i in iss), iss)

    def test_fresh_pending_ok(self):
        t0 = at("2026-10-27T12:00:00Z")
        rows = [(
            at("2026-10-27T11:55:00Z"),
            {
                "type": "lead",
                "at": "2026-10-27T11:55:00Z",
                "handle": "newbuyer",
                "lead": "https://x.com/newbuyer/status/9",
                "channel": "x-dm-browser-pending",
            },
        )]
        iss = rh.buyer_handoff_issues(t_now=t0, rows=rows)
        self.assertEqual(iss, [])

    def test_check_includes_handoff_kind(self):
        t0 = at("2026-10-27T12:00:00Z")
        rows = [(
            at("2026-10-27T11:20:00Z"),
            {
                "type": "lead",
                "at": "2026-10-27T11:20:00Z",
                "handle": "stalebuyer",
                "lead": "https://x.com/stalebuyer/status/3",
                "channel": "x-dm-browser-pending",
            },
        )]
        # quiet logs so we do not trip GAP/OVERDUE noise for this assertion
        logs = [(t0 - timedelta(minutes=m), "sweep") for m in (40, 30, 20, 10, 5)]
        stamps = {"funnel-audit": {"at": (t0 - timedelta(hours=2)).isoformat()},
                  "weekly-report": {"at": (t0 - timedelta(days=1)).isoformat()},
                  "lead-calibration": {"at": (t0 - timedelta(days=1)).isoformat()},
                  "watchdog": {"at": (t0 - timedelta(minutes=5)).isoformat()},
                  "replies": {"at": (t0 - timedelta(minutes=5)).isoformat()},
                  "fast-scan": {"at": (t0 - timedelta(minutes=5)).isoformat()},
                  "backlog-driver": {"at": (t0 - timedelta(minutes=20)).isoformat()},
                  "channel-check": {"at": (t0 - timedelta(hours=2)).isoformat()},
                  "lead-hunt": {"at": (t0 - timedelta(hours=2)).isoformat()}}
        iss = rh.check(gap_min=60, hours=48, t_now=t0, stamps=stamps, logs=logs, rows=rows)
        self.assertTrue(any(i[0] == "BUYER HANDOFF NOT SENT" for i in iss), iss)


if __name__ == "__main__":
    unittest.main()
