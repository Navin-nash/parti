#!/usr/bin/env python3
"""
measure.py — run the parti instruments over both arms of the example build.

Measurement is PER ARM, not per surface. The design system of a build lives in
its shared stylesheet, so auditing one surface's HTML folder in isolation sees
almost nothing and reports a meaningless number. Each arm is staged into a temp
directory containing all four of its HTML files plus its stylesheet, and the
instruments are run over that — which is what "audit a codebase" means.

`lint.py` runs WITHOUT --tokens on both arms. The baseline has no token spec,
and drift against a spec that does not exist is not a number. Token drift is
reported separately for the parti arm and labeled as a capability with no
baseline equivalent, not as a score the baseline lost.

Usage:
    python examples/shared/measure.py
    python examples/shared/measure.py --json examples/results/comparison.json

Stdlib only. Run from the repository root.
"""

import argparse
import glob
import json
import os
import shutil
import subprocess
import sys
import tempfile

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
EXAMPLES = os.path.dirname(HERE)
ROOT = os.path.dirname(EXAMPLES)
SCRIPTS = os.path.join(ROOT, "scripts")
RESULTS = os.path.join(EXAMPLES, "results")
ARMS = ("baseline", "parti")


def run(script, *args):
    cmd = [sys.executable, os.path.join(SCRIPTS, script)] + list(args)
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def stage(arm, dest):
    """Collect every file belonging to one arm into dest. Returns file count."""
    n = 0
    for html in sorted(glob.glob(os.path.join(EXAMPLES, "*", arm, "*.html"))):
        surface = os.path.basename(os.path.dirname(os.path.dirname(html)))
        shutil.copy(html, os.path.join(dest, f"{surface}__{os.path.basename(html)}"))
        n += 1
    for css in sorted(glob.glob(os.path.join(EXAMPLES, "*", arm, "*.css"))):
        surface = os.path.basename(os.path.dirname(os.path.dirname(css)))
        shutil.copy(css, os.path.join(dest, f"{surface}__{os.path.basename(css)}"))
        n += 1
    shared_css = os.path.join(EXAMPLES, "shared", f"{arm}.css")
    if os.path.exists(shared_css):
        shutil.copy(shared_css, os.path.join(dest, f"{arm}.css"))
        n += 1
    return n


def _write(path, text):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def measure(arm):
    tmp = tempfile.mkdtemp(prefix=f"parti_{arm}_")
    try:
        count = stage(arm, tmp)
        if not count:
            return None
        os.makedirs(RESULTS, exist_ok=True)
        out = {"arm": arm, "files_staged": count}

        aj = os.path.join(RESULTS, f"{arm}.audit.json")
        _, txt = run("audit.py", tmp, "--json", aj)
        _write(os.path.join(RESULTS, f"{arm}.audit.txt"), txt)
        a = json.load(open(aj, encoding="utf-8"))
        out["tells"] = len(a.get("tells", []))
        out["tell_names"] = [t.get("name") if isinstance(t, dict) else t for t in a.get("tells", [])]

        sj = os.path.join(RESULTS, f"{arm}.score.json")
        _, txt = run("score.py", aj, "--json", sj)
        _write(os.path.join(RESULTS, f"{arm}.score.txt"), txt)
        s = json.load(open(sj, encoding="utf-8"))
        out["score"] = s.get("measured_score")
        out["band"] = s.get("band")
        out["dimensions"] = s.get("dimensions")

        lj = os.path.join(RESULTS, f"{arm}.lint.json")
        rc, txt = run("lint.py", tmp, "--json", lj)
        _write(os.path.join(RESULTS, f"{arm}.lint.txt"), txt)
        l = json.load(open(lj, encoding="utf-8"))
        out["lint_rc"] = rc
        out["lint_counts"] = l.get("counts", {})
        out["lint_findings"] = [f.get("id") for f in l.get("findings", [])]

        mj = os.path.join(RESULTS, f"{arm}.motion.json")
        rc, txt = run("motion.py", tmp, "--json", mj)
        _write(os.path.join(RESULTS, f"{arm}.motion.txt"), txt)
        m = json.load(open(mj, encoding="utf-8"))
        out["motion_rc"] = rc
        out["motion_counts"] = m.get("counts", {})
        out["motion_rules"] = sorted({f.get("rule") for f in m.get("findings", []) if f.get("rule")})
        out["motion_census"] = m.get("census")

        tokens = os.path.join(EXAMPLES, "shared", "tokens.json")
        if arm == "parti" and os.path.exists(tokens):
            rc, txt = run("lint.py", tmp, "--tokens", tokens)
            _write(os.path.join(RESULTS, "parti.drift.txt"), txt)
            out["drift_rc"] = rc
            out["drift_flagged"] = "token_drift" in txt
        return out
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def bar(v, mx, width=14):
    filled = int(round((v / mx) * width)) if mx else 0
    return "█" * filled + "·" * (width - filled)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", dest="out")
    args = ap.parse_args()

    res = {}
    for arm in ARMS:
        m = measure(arm)
        if m:
            res[arm] = m

    if not res:
        print("no arms found — nothing built yet under examples/*/{baseline,parti}/")
        return 1

    print()
    print("  MEASURED COMPARISON — per arm, whole build")
    print("  " + "=" * 68)
    print(f"  {'':<22}{'baseline':>14}{'parti':>14}{'delta':>14}")
    print("  " + "-" * 68)

    def row(label, key, fmt=str):
        b = res.get("baseline", {}).get(key)
        p = res.get("parti", {}).get(key)
        d = ""
        if isinstance(b, (int, float)) and isinstance(p, (int, float)):
            diff = p - b
            d = f"{diff:+g}"
        print(f"  {label:<22}{fmt(b) if b is not None else '—':>14}{fmt(p) if p is not None else '—':>14}{d:>14}")

    row("files staged", "files_staged")
    row("measured score", "score")
    row("band", "band")
    row("tells detected", "tells")
    print("  " + "-" * 68)

    for arm in ARMS:
        if arm not in res:
            continue
        m = res[arm]
        p0 = m.get("lint_counts", {}).get("P0", 0)
        print(f"  {arm:<22}lint rc={m.get('lint_rc')}  P0={p0}  "
              f"counts={m.get('lint_counts')}")
        print(f"  {'':<22}motion rc={m.get('motion_rc')}  counts={m.get('motion_counts')}")
        if m.get("motion_rules"):
            print(f"  {'':<22}rules: {', '.join(m['motion_rules'])}")
        if "drift_flagged" in m:
            print(f"  {'':<22}token drift: {'FLAGGED' if m['drift_flagged'] else 'none'} "
                  f"(rc={m.get('drift_rc')})")
    print("  " + "-" * 68)

    if "baseline" in res and "parti" in res:
        print()
        print("  DIMENSION BREAKDOWN")
        print("  " + "-" * 68)
        bd = res["baseline"].get("dimensions") or {}
        pd = res["parti"].get("dimensions") or {}
        for k in bd:
            bv = bd[k] if not isinstance(bd[k], dict) else bd[k].get("score")
            pv = (pd.get(k) if not isinstance(pd.get(k), dict) else pd[k].get("score")) or 0
            print(f"  {k:<22}{bv:>7}  {bar(bv, 20)}   {pv:>7}  {bar(pv, 20)}")

    print()
    print("  These are REGRESSION GUARDS, not design-quality verdicts. A clean run")
    print("  means nothing on the known tell list is present — not that the design")
    print("  is good. See evals/README.md on the circularity trap before quoting")
    print("  any of these numbers as evidence one build is better than the other.")
    print()

    if args.out:
        os.makedirs(os.path.dirname(args.out), exist_ok=True)
        with open(args.out, "w", encoding="utf-8", newline="\n") as f:
            json.dump(res, f, indent=2)
        print(f"  wrote {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
