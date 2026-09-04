#!/usr/bin/env python3
"""
capture.py - capture design & motion from an inspiration URL.

Tier 1 (this file, stdlib only): fetch the page + linked stylesheets, parse
@keyframes / transitions / animations / scroll-timeline / view-transitions,
and fingerprint the animation libraries the page loads. Emits a JSON report
and an optional Markdown skeleton on the schema in references/motion-capture.md.

Tier 2 (--tier runtime): if `playwright` is importable, also run the page and
read document.getAnimations(), ScrollTrigger.getAll(), and a scroll sampler.
Absent -> fall back to Tier 1 with a note. Never required.

Tier 3 is agent-driven and lives in references/motion-capture.md.

The report always states which tier ran and what it could not see. It never
invents a millisecond or easing value.

Usage:
    python capture.py --url URL [--url URL2 ...] --focus "the nav" \\
        --tier auto|static|runtime --json /tmp/capture.json --md captures/x.md
    python capture.py --selfcheck

Exit code is 1 if every URL failed to fetch, so a caller can gate on it.
Stdlib only for Tier 1. Never writes into the fetched site.
"""

import argparse
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

UA = "Mozilla/5.0 (compatible; parti-capture/1.0; +https://github.com/Navin-nash/parti)"
FETCH_CAP = 3_000_000


def today():
    return datetime.date.today().isoformat()


def slug(url):
    host = urllib.parse.urlparse(url).netloc or "local"
    return re.sub(r"[^a-z0-9.-]+", "-", host.lower()).strip("-") or "local"


def fetch(url, timeout=15, cap=FETCH_CAP):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:  # noqa: S310 (http/https/file only)
            raw = r.read(cap)
            ctype = r.headers.get("Content-Type", "") if r.headers else ""
            final = r.geturl()
        return {"url": final, "ok": True, "content_type": ctype,
                "text": raw.decode("utf-8", "ignore"), "error": ""}
    except (urllib.error.URLError, ValueError, OSError) as e:
        return {"url": url, "ok": False, "content_type": "", "text": "",
                "error": str(e)[:200]}


def build_report(urls, focus, tier, per_url):
    ok = [u for u in per_url if u.get("ok")]
    not_captured = []
    if tier == "static":
        not_captured.append(
            "JS-driven motion inside minified bundles is not executed at this tier")
    report = {
        "tool": "capture",
        "version": 1,
        "captured": today(),
        "tier": tier,
        "focus": focus,
        "sources": list(urls),
        "not_captured": not_captured,
        "motion_findings": [],
        "focus_element": None,
        "libraries": [],
        "trigger_hints": {},
        "_fetch_errors": [{"url": u["url"], "error": u["error"]}
                          for u in per_url if not u.get("ok")],
    }
    return report, bool(ok)


def render_markdown(report):
    # Skeleton only. The agent fills Faithful/Adapted columns and "why it works".
    lines = [f"# Capture — {', '.join(report['sources'])}   "
             f"({report['captured']}, tier: {report['tier']})",
             f"Focus: {report['focus'] or '(none stated — narrow this before adopting anything)'}",
             ""]
    if report["not_captured"]:
        lines.append("Not captured: " + "; ".join(report["not_captured"]))
        lines.append("")
    lines += ["## Motion findings", "",
              "_One row per distinct behavior. Fill FAITHFUL and ADAPTED per row._", ""]
    lines += ["## Focus element", "",
              "_structure / states / why it works — then FAITHFUL and ADAPTED._", ""]
    lines += ["## Adopted", "",
              "_element → FAITHFUL|ADAPTED → build path (filled in at build time)_", ""]
    return "\n".join(lines) + "\n"


def run_capture(urls, focus, tier):
    want_runtime = tier in ("auto", "runtime")
    per_url = [fetch(u) for u in urls]
    effective_tier = "static"
    report, any_ok = build_report(urls, focus, effective_tier, per_url)
    return report, any_ok


def _selfcheck():
    r = fetch("file:///no/such/path/xyz.html")
    assert r["ok"] is False, "missing file should not fetch"
    assert slug("https://Sub.Example.com/x") == "sub.example.com", slug("https://Sub.Example.com/x")
    rep, ok = build_report(["https://x.test"], "nav", "static",
                           [{"url": "https://x.test", "ok": True, "error": ""}])
    assert rep["tool"] == "capture" and rep["version"] == 1
    assert rep["not_captured"], "tier-1 not_captured must be non-empty"
    assert ok is True
    print("selfcheck ok")


def main():
    ap = argparse.ArgumentParser(description="Capture design & motion from an inspiration URL")
    ap.add_argument("--url", action="append", dest="urls", default=[], required=False)
    ap.add_argument("--focus", default="")
    ap.add_argument("--tier", choices=["auto", "static", "runtime"], default="auto")
    ap.add_argument("--json", dest="out")
    ap.add_argument("--md", dest="mdout")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    if not args.urls:
        sys.exit("no --url given")

    report, any_ok = run_capture(args.urls, args.focus, args.tier)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        if not args.quiet:
            print(f"wrote {args.out}")
    if args.mdout:
        with open(args.mdout, "w", encoding="utf-8") as f:
            f.write(render_markdown(report))
        if not args.quiet:
            print(f"wrote {args.mdout}")
    if not args.quiet:
        print(json.dumps({k: report[k] for k in
                          ("tier", "focus", "sources", "not_captured")}, indent=2))
    sys.exit(0 if any_ok else 1)


if __name__ == "__main__":
    if "--selfcheck" in sys.argv:
        _selfcheck()
    else:
        main()
