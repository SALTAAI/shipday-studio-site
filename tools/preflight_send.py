#!/usr/bin/env python3
"""Single entry point for Shipday outbound sends (AK t113u).

Runs the full fail-closed stack in one call:
  account + outbound_gate check (+ bind pass) + dm_count (via gate) + media expand.

Prints exactly one line:
  PASS <gate_id>
  REFUSE <reason> | <reason> | ...

Usage (same flags as outbound_gate check/preflight):
  python3 tools/preflight_send.py --channel x-dm --lead HANDLE \\
    --post-created ISO --reply-count N --text FILE --media a.jpg,b.jpg

  python3 tools/preflight_send.py verify --gate-id ID --channel … --lead … \\
    --text FILE --media … [--consume]

Exit 0 on PASS, 1 on REFUSE.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import outbound_gate as og  # noqa: E402


def main(argv=None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv:
        print("REFUSE missing args (need check flags or verify …)", file=sys.stderr)
        return 1
    if argv[0] in {"verify", "audit", "check", "preflight"}:
        cmd = argv[0]
        rest = argv[1:]
    else:
        cmd = "preflight"
        rest = argv
    return og.main([cmd, *rest])


if __name__ == "__main__":
    sys.exit(main())
