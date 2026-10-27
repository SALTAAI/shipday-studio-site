#!/usr/bin/env python3
"""Local pre-push deploy gate for shipday-studio-site (AK t102u/t103u).

Runs, in order:
  1. tools/protect.py check          (site images must be clean)
  2. tools/site_quality_gate.py --skip-live   (local image rules; screenshots need live/base)
  3. npm run typecheck && npm run build
  4. tools/kit_scan.py <repo>
  5. tools/site_quality_gate.py --base http://127.0.0.1:<port> against the static export
     (starts scripts/serve-out.mjs, screenshots + overflow + link check)

Exit 1 on any failure. Does NOT push; the operator pushes after this passes and after
a visual pass of out/site-review/<date>/gate/.
"""
from __future__ import annotations
import os, signal, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd, **kw):
    print("+", " ".join(cmd) if isinstance(cmd, list) else cmd)
    r = subprocess.run(cmd, cwd=str(ROOT), **kw)
    if r.returncode != 0:
        sys.exit(r.returncode)
    return r


def main() -> int:
    py = sys.executable
    run([py, "tools/protect.py", "check"])
    run([py, "tools/site_quality_gate.py", "--skip-live"])
    run(["npm", "run", "typecheck"])
    run(["npm", "run", "build"], env={**os.environ, "NEXT_TELEMETRY_DISABLED": "1"})
    run([py, "tools/kit_scan.py", str(ROOT)])
    # serve export and run full gate against it
    port = 4317
    srv = subprocess.Popen(
        ["node", "scripts/serve-out.mjs", "out", str(port)],
        cwd=str(ROOT),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        time.sleep(1.5)
        run([py, "tools/site_quality_gate.py", "--base", f"http://127.0.0.1:{port}"])
    finally:
        srv.send_signal(signal.SIGTERM)
        try:
            srv.wait(timeout=5)
        except Exception:
            srv.kill()
    print("pre_deploy: PASS — review out/site-review/*/gate/ screenshots, then push")
    return 0


if __name__ == "__main__":
    sys.exit(main())
