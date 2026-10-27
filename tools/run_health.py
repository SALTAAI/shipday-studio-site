#!/usr/bin/env python3
"""Missed-run / outage detector for the Shipday routines (added 26 Oct 2026 after the box outage
~02:27-19:00 Zurich that left 'daily funnel gap audit' (07:01) and 'weekly revenue and growth report'
(Mon 09:03) FAILED: the box was frozen, not the routines broken).

  python3 tools/run_health.py stamp <routine-key> [--status ok|fail] [--note TEXT]   # last step of a routine
  python3 tools/run_health.py check [--json] [--gap-min 60] [--hours 48]
  python3 tools/run_health.py --selftest
  python3 tools/run_health.py still-missing [list|open|ak|close ...]  # Mac-off gaps (tools/still_missing.py)

check prints one line per routine that is OVERDUE (no stamp and no reply-log line within its period + grace),
plus every silence gap > --gap-min minutes in data/reply-log.jsonl during the last --hours (an outage signal:
the 5-15 minute routines write there around the clock). Exit 0 = healthy, 1 = something overdue or a gap.
The watchdog runs `check` every sweep; for each OVERDUE line it does the catch-up named in the CATCHUP column
(FULFILLMENT.md §16.9) once, then stamps it. Works the same on pm-primary and hello-standby (box only, no Mac).
State: data/run-stamps.json (part of data/, so it is backed up and travels with the kit).
"""
import json, os, sys, argparse
from datetime import datetime, timezone, timedelta

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.environ.get("SHIPDAY_DATA_DIR", os.path.join(ROOT, "data"))
STAMPS = os.path.join(DATA, "run-stamps.json")
LOG = os.path.join(DATA, "reply-log.jsonl")

# key: (period_hours, grace_hours, reply-log types that also count as a run, catch-up action)
ROUTINES = {
    "funnel-audit":   (24, 3, (), "run tools/funnel_check.py now and do the daily funnel gap audit (routines/live/shipday-daily-funnel-gap-audit.txt)"),
    "weekly-report":  (24 * 7, 6, (), "run the weekly revenue and growth report now (routines/live/shipday-weekly-revenue-and-growth-report.txt)"),
    "lead-calibration": (24 * 7, 6, (), "run the weekly lead calibration now"),
    "watchdog":       (0.5, 0.75, ("watchdog",), "none (this is the watchdog)"),
    "replies":        (0.25, 0.75, ("sweep",), "run the 24/7 replies sweep now (mentions, DMs, hello@, Stripe)"),
    "fast-scan":      (5 / 60, 1.0, ("fast-scan", "fast_scan"), "none: the next 5-min run catches up; report if still silent"),
    "backlog-driver": (1, 10, ("backlog-driver", "backlog_driver", "backlog-driver-executor"), "run one backlog-driver pass (24/7 since 27 Oct pm audit)"),
    "channel-check":  (12, 4, ("channel-check",), "run the channel check now"),
    "lead-hunt":      (6, 3, ("lead-hunt", "lead_hunt", "lead-search"), "run one lead hunt now"),
}


def now():
    return datetime.now(timezone.utc)


def parse(ts):
    try:
        d = datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:
        return None


def load_stamps():
    try:
        return json.load(open(STAMPS))
    except Exception:
        return {}


def log_times():
    out = []
    try:
        for line in open(LOG, encoding="utf-8", errors="replace"):
            try:
                d = json.loads(line)
            except Exception:
                continue
            t = parse(d.get("at") or d.get("ts") or "")
            if t:
                out.append((t, d.get("type", "")))
    except OSError:
        pass
    return out


def check(gap_min=60, hours=48, t_now=None, stamps=None, logs=None):
    t_now = t_now or now()
    stamps = load_stamps() if stamps is None else stamps
    logs = log_times() if logs is None else logs
    issues = []
    for key, (period, grace, types, catchup) in ROUTINES.items():
        last = parse(stamps.get(key, {}).get("at", "")) if stamps.get(key) else None
        for t, ty in logs:
            if ty in types and (last is None or t > last):
                last = t
        if last is None:
            if not types:  # never stamped and no log type: only known once the routine stamps itself
                issues.append(("UNKNOWN", key, "never stamped yet", catchup))
            continue
        age_h = (t_now - last).total_seconds() / 3600
        if age_h > period + grace:
            issues.append(("OVERDUE", key, f"last run {last.isoformat(timespec='minutes')} ({age_h:.1f}h ago, period {period}h)", catchup))
    recent = sorted(t for t, _ in logs if t >= t_now - timedelta(hours=hours))
    prev = t_now - timedelta(hours=hours) if not recent else None
    for a, b in zip(recent, recent[1:] + [t_now]):
        if (b - a).total_seconds() / 60 > gap_min:
            issues.append(("GAP", "reply-log", f"silent {a.isoformat(timespec='minutes')} -> {b.isoformat(timespec='minutes')} ({(b - a).total_seconds() / 3600:.1f}h): box outage or every routine down", "check each OVERDUE routine above; tell AK once per gap"))
    return issues


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", nargs="?", default="check")
    ap.add_argument("key", nargs="?")
    ap.add_argument("--status", default="ok")
    ap.add_argument("--note", default="")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--gap-min", type=int, default=60)
    ap.add_argument("--hours", type=int, default=48)
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.cmd in ("still-missing", "still_missing"):
        import still_missing as sm
        # re-invoke with remaining args after the subcommand name
        rest = [x for x in sys.argv[1:] if x not in ("still-missing", "still_missing")]
        return sm.main(rest or ["open"])
    if a.selftest or a.cmd == "selftest":
        t0 = datetime(2026, 10, 26, 18, 0, tzinfo=timezone.utc)
        logs = [(t0 - timedelta(hours=17, minutes=m), "sweep") for m in range(0, 60, 15)] + [(t0 - timedelta(minutes=10), "sweep"), (t0 - timedelta(minutes=5), "watchdog")]
        st = {"funnel-audit": {"at": (t0 - timedelta(hours=35)).isoformat()}, "weekly-report": {"at": (t0 - timedelta(days=2)).isoformat()}}
        iss = check(60, 48, t0, st, logs)
        kinds = {(i[0], i[1]) for i in iss}
        assert ("OVERDUE", "funnel-audit") in kinds, iss
        assert ("OVERDUE", "weekly-report") not in kinds, iss
        assert any(i[0] == "GAP" for i in iss), iss
        assert ("OVERDUE", "replies") not in kinds, iss
        print("selftest OK")
        return 0
    if a.cmd == "stamp":
        if not a.key:
            sys.exit("stamp needs a routine key: " + ", ".join(ROUTINES))
        st = load_stamps()
        st[a.key] = {"at": now().isoformat(timespec="seconds"), "status": a.status, "note": a.note[:200]}
        tmp = STAMPS + ".tmp"
        json.dump(st, open(tmp, "w"), indent=1, sort_keys=True)
        os.replace(tmp, STAMPS)
        print(f"stamped {a.key} {a.status}")
        return 0
    iss = check(a.gap_min, a.hours)
    if a.json:
        print(json.dumps([dict(zip(("kind", "what", "detail", "catchup"), i)) for i in iss], indent=1))
    else:
        for k, w, d, c in iss:
            print(f"{k:8} {w:16} {d} | CATCHUP: {c}")
        if not iss:
            print("run-health OK: no overdue routine, no reply-log gap")
    return 1 if any(i[0] in ("OVERDUE", "GAP") for i in iss) else 0


if __name__ == "__main__":
    sys.exit(main())
