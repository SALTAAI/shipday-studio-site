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
the 5-15 minute routines write there around the clock), plus BUYER HANDOFF NOT SENT when a *-browser-pending
row is older than 10 minutes with no matching sent or lapsed-not-sent row (AK t101u). Exit 0 = healthy,
1 = something overdue, a gap, or a stale buyer handoff. The watchdog runs `check` every sweep; for each
OVERDUE line it does the catch-up named in the CATCHUP column (FULFILLMENT.md §16.9) once, then stamps it.
Works the same on pm-primary and hello-standby (box only, no Mac).
State: data/run-stamps.json (part of data/, so it is backed up and travels with the kit).
"""
import json, os, sys, argparse, re
from datetime import datetime, timezone, timedelta
from pathlib import Path as _Path

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

BUYER_HANDOFF_MAX_MIN = 10
PENDING_CHANNEL_SUFFIX = "-browser-pending"
LAPSED_TYPES = {
    "lead-dm-not-sent", "lead-dm-skip", "lead-skip", "lapsed-not-sent",
    "lead-reply-not-posted", "reply-not-attempted",
}
SENT_TYPES = {"dm", "x-reply", "x-reply-browser", "reddit-comment", "reddit-dm", "email", "zernio-reply", "reply"}
SENT_STATUSES = {"posted", "sent", "delivered"}


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


def log_times(log_path=None):
    out = []
    path = log_path or LOG
    try:
        for line in open(path, encoding="utf-8", errors="replace"):
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


def _norm_handle(obj):
    for key in ("handle", "author", "lead", "to", "target", "user", "who"):
        raw = obj.get(key)
        if not raw:
            continue
        h = str(raw).strip()
        if "://" in h or "/status/" in h:
            # URL: take last path segment that looks like a handle when possible
            m = re.search(r"(?:x|twitter)\.com/([^/]+)/status/", h, re.I)
            if m:
                return m.group(1).lstrip("@").lower()
            continue
        h = h.lstrip("@").removeprefix("u/").lower()
        if h:
            return h
    return ""


def _lead_key(obj):
    """Stable key for matching pending → sent/lapsed for the same buyer post."""
    for key in ("lead", "lead_url", "url", "target"):
        raw = obj.get(key)
        if raw and "/status/" in str(raw):
            return str(raw).split("?")[0].rstrip("/").lower()
    h = _norm_handle(obj)
    return f"handle:{h}" if h else ""


def load_log_rows(log_path=None):
    rows = []
    path = log_path or LOG
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                t = parse(obj.get("at") or obj.get("ts") or "")
                if t is None:
                    continue
                rows.append((t, obj))
    except OSError:
        pass
    return rows


def is_browser_pending(obj):
    ch = str(obj.get("channel") or "").lower()
    typ = str(obj.get("type") or "").lower()
    status = str(obj.get("status") or "").lower()
    if ch.endswith(PENDING_CHANNEL_SUFFIX) or "browser-pending" in ch:
        return True
    if typ in {"lead-browser-pending"} or typ.endswith("browser-pending"):
        return True
    if status.endswith("browser-pending"):
        return True
    return False


def is_lapsed_row(obj):
    typ = str(obj.get("type") or "").lower()
    status = str(obj.get("status") or "").lower()
    if typ in LAPSED_TYPES or status in {"lapsed-not-sent", "lapsed", "blocked-not-sent"}:
        return True
    if obj.get("lapsed") is True or obj.get("outcome") == "lapsed-not-sent":
        return True
    return False


def is_sent_row(obj):
    typ = str(obj.get("type") or "").lower()
    ch = str(obj.get("channel") or "").lower()
    status = str(obj.get("status") or "").lower()
    if is_browser_pending(obj) or is_lapsed_row(obj):
        return False
    if typ in SENT_TYPES or status in SENT_STATUSES:
        return True
    if ch in {"x-dm", "x-chat", "x-reply", "x-reply-browser", "reddit-comment", "reddit-dm", "email", "zernio-reply"}:
        if status in SENT_STATUSES or typ in SENT_TYPES:
            return True
    return False


def buyer_handoff_issues(log_path=None, t_now=None, max_pending_min=BUYER_HANDOFF_MAX_MIN, rows=None):
    """Flag *-browser-pending rows older than max_pending_min with no later sent/lapsed match (AK t101u)."""
    t_now = t_now or now()
    rows = load_log_rows(log_path) if rows is None else rows
    issues = []
    # Group resolutions by lead key
    resolutions = {}  # key -> list of (t, kind) where kind in {sent, lapsed}
    pendings = []  # (t, obj, key)
    for t, obj in rows:
        key = _lead_key(obj)
        if not key:
            continue
        if is_lapsed_row(obj):
            resolutions.setdefault(key, []).append((t, "lapsed"))
        elif is_sent_row(obj):
            resolutions.setdefault(key, []).append((t, "sent"))
        if is_browser_pending(obj):
            pendings.append((t, obj, key))

    # For each pending, if age > max and no resolution at/after pending time, flag once per key
    seen_keys = set()
    for t, obj, key in sorted(pendings, key=lambda r: r[0]):
        age_min = (t_now - t).total_seconds() / 60.0
        if age_min <= max_pending_min:
            continue
        resolved = False
        for rt, kind in resolutions.get(key, []):
            if rt >= t:
                resolved = True
                break
        if resolved:
            continue
        if key in seen_keys:
            continue
        seen_keys.add(key)
        handle = _norm_handle(obj) or key
        ch = obj.get("channel") or obj.get("type") or "browser-pending"
        issues.append((
            "BUYER HANDOFF NOT SENT",
            handle,
            f"pending since {t.strftime('%Y-%m-%dT%H:%M:%SZ')} ({age_min:.0f} min, channel={ch})",
            "parent bot: dispatch the browser send now per RULES t98u/t101u (or append lapsed-not-sent if the post is >1h old); never ask AK for a go",
        ))
    return issues


def check(gap_min=60, hours=48, t_now=None, stamps=None, logs=None, log_path=None, rows=None):
    t_now = t_now or now()
    stamps = load_stamps() if stamps is None else stamps
    logs = log_times(log_path) if logs is None else logs
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
    for a, b in zip(recent, recent[1:] + [t_now]):
        if (b - a).total_seconds() / 60 > gap_min:
            issues.append(("GAP", "reply-log", f"silent {a.isoformat(timespec='minutes')} -> {b.isoformat(timespec='minutes')} ({(b - a).total_seconds() / 3600:.1f}h): box outage or every routine down", "check each OVERDUE routine above; tell AK once per gap"))
    issues.extend(buyer_handoff_issues(log_path=log_path, t_now=t_now, rows=rows))
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
        rest = [x for x in sys.argv[1:] if x not in ("still-missing", "still_missing")]
        return sm.main(rest or ["open"])
    if a.selftest or a.cmd == "selftest":
        t0 = datetime(2026, 10, 26, 18, 0, tzinfo=timezone.utc)
        logs = [(t0 - timedelta(hours=17, minutes=m), "sweep") for m in range(0, 60, 15)] + [(t0 - timedelta(minutes=10), "sweep"), (t0 - timedelta(minutes=5), "watchdog")]
        st = {"funnel-audit": {"at": (t0 - timedelta(hours=35)).isoformat()}, "weekly-report": {"at": (t0 - timedelta(days=2)).isoformat()}}
        iss = check(60, 48, t0, st, logs, rows=[])  # empty rows: no handoff noise in base selftest
        kinds = {(i[0], i[1]) for i in iss}
        assert ("OVERDUE", "funnel-audit") in kinds, iss
        assert ("OVERDUE", "weekly-report") not in kinds, iss
        assert any(i[0] == "GAP" for i in iss), iss
        assert ("OVERDUE", "replies") not in kinds, iss
        # t101u buyer handoff: pending >10 min, no sent/lapsed → flag; with lapsed → clear
        pend_t = t0 - timedelta(minutes=25)
        rows_stale = [(
            pend_t,
            {
                "type": "lead",
                "at": pend_t.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "handle": "buyerone",
                "lead": "https://x.com/buyerone/status/1",
                "channel": "x-dm-browser-pending",
            },
        )]
        hi = buyer_handoff_issues(t_now=t0, rows=rows_stale)
        assert any(i[0] == "BUYER HANDOFF NOT SENT" for i in hi), hi
        rows_ok = rows_stale + [(
            t0 - timedelta(minutes=5),
            {
                "type": "lapsed-not-sent",
                "at": (t0 - timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "handle": "buyerone",
                "lead": "https://x.com/buyerone/status/1",
                "status": "lapsed-not-sent",
            },
        )]
        hi2 = buyer_handoff_issues(t_now=t0, rows=rows_ok)
        assert not any(i[0] == "BUYER HANDOFF NOT SENT" for i in hi2), hi2
        # fresh pending (<10 min) must not flag
        rows_fresh = [(
            t0 - timedelta(minutes=3),
            {
                "type": "lead",
                "at": (t0 - timedelta(minutes=3)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                "handle": "buyertwo",
                "lead": "https://x.com/buyertwo/status/2",
                "channel": "x-reply-browser-pending",
            },
        )]
        hi3 = buyer_handoff_issues(t_now=t0, rows=rows_fresh)
        assert not any(i[0] == "BUYER HANDOFF NOT SENT" for i in hi3), hi3
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
            print("run-health OK: no overdue routine, no reply-log gap, no stale buyer handoff")
    bad = {"OVERDUE", "GAP", "BUYER HANDOFF NOT SENT"}
    return 1 if any(i[0] in bad for i in iss) else 0


if __name__ == "__main__":
    sys.exit(main())
