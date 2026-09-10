#!/usr/bin/env python3
"""Assemble the blind A/B and run the measurable half of it.

Two things happen here, and they must not be confused:

1. **The measured comparison.** `lint.py`, `motion.py` and `color.py` run over both arms
   of every pair. These are real numbers and they are publishable, but they measure
   compliance, not quality — the doctrine in ../README.md applies with full force.
   A clean lint says nothing on the known list is wrong. It does not say the design
   is better, and this script must never be read as if it did.

2. **The blind rating page.** Pairs are shuffled per brief and written into rate.html
   with neutral labels, so a rater cannot tell which arm they are looking at. The key is
   written separately to key.json, which the page never loads.

The preference number — the one that answers "is the design better" — requires human
raters and is NOT produced here. Running this script produces an empty tally on purpose.

    python evals/ab/run_ab.py
    python evals/ab/run_ab.py --seed 7      # reproducible shuffle
"""
from __future__ import annotations

import argparse
import json
import random
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SCRIPTS = ROOT / "skills" / "parti" / "scripts"
PAIRS = HERE / "pairs"
ARMS = ("baseline", "parti")


def run_json(script: str, target: Path) -> dict:
    out = Path(tempfile.mkdtemp()) / "out.json"
    subprocess.run(
        [sys.executable, str(SCRIPTS / script), str(target), "--json", str(out), "--quiet"],
        capture_output=True, text=True, check=False,
    )
    if not out.exists():
        return {"findings": []}
    data = json.loads(out.read_text(encoding="utf-8"))
    return data if isinstance(data, dict) else {"findings": data}


def measure(arm_file: Path) -> dict:
    """Scripted findings for one arm. The file is copied alone into a temp dir so the
    other arm cannot leak into the scan."""
    with tempfile.TemporaryDirectory() as tmp:
        target = Path(tmp)
        (target / arm_file.name).write_text(arm_file.read_text(encoding="utf-8"), encoding="utf-8")
        lint = run_json("lint.py", target)
        motion = run_json("motion.py", target)

    # lint.py names the rule "id", motion.py names it "rule". Reading only one of them
    # reports half the findings as "?" and quietly understates whichever arm is worse.
    findings = list(lint.get("findings", [])) + list(motion.get("findings", []))
    for f in findings:
        f["_rule"] = f.get("id") or f.get("rule") or "?"
    by_sev: dict[str, int] = {}
    for f in findings:
        by_sev[f.get("severity", "?")] = by_sev.get(f.get("severity", "?"), 0) + 1
    return {
        "findings": len(findings),
        "P0": by_sev.get("P0", 0),
        "P1": by_sev.get("P1", 0),
        "P2": by_sev.get("P2", 0),
        "ids": sorted({f["_rule"] for f in findings}),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=None,
                    help="fix the shuffle so a run is reproducible")
    args = ap.parse_args()

    briefs = json.loads((HERE / "briefs.json").read_text(encoding="utf-8"))["briefs"]
    # Presentation order, not a secret. Seeded on purpose so a run is reproducible.
    rng = random.Random(args.seed)  # noqa: S311

    results, key, cards = [], {}, []
    start_side = rng.randint(0, 1)

    for brief in briefs:
        d = PAIRS / brief["id"]
        files = {a: d / f"arm-{a}.html" for a in ARMS}
        missing = [a for a, p in files.items() if not p.exists()]
        if missing:
            print(f"  ! {brief['id']}: missing arm(s) {missing}", file=sys.stderr)
            continue

        measured = {a: measure(p) for a, p in files.items()}
        results.append({"brief": brief["id"], "archetype": brief["archetype"], "measured": measured})

        # Counterbalance rather than shuffle freely. With a handful of pairs a fair coin
        # lands the same way often - seed 11 originally put the baseline on the left in
        # all three - and a rater's side preference then rides straight into the result.
        # Each arm gets the left slot an equal number of times; the coin only decides
        # which arm starts.
        flip = (len(cards) + start_side) % 2
        order = [ARMS[flip], ARMS[1 - flip]]
        key[brief["id"]] = {"left": order[0], "right": order[1]}

        # Copy to neutral filenames. The iframe src is visible in the DOM, so
        # `arm-parti.html` in the URL tells any curious rater exactly which is which
        # and un-blinds the test for the people most likely to look closely.
        opts = []
        for n, arm in enumerate(order, start=1):
            dest = d / f"opt-{n}.html"
            dest.write_text(files[arm].read_text(encoding="utf-8"), encoding="utf-8")
            opts.append(f"pairs/{brief['id']}/opt-{n}.html")

        cards.append({
            "id": brief["id"],
            "prompt": brief["prompt"],
            "left": opts[0],
            "right": opts[1],
        })

    (HERE / "key.json").write_text(json.dumps(key, indent=2), encoding="utf-8")
    (HERE / "measured.json").write_text(json.dumps(results, indent=2), encoding="utf-8")

    tpl = (HERE / "rate.template.html").read_text(encoding="utf-8")
    page = tpl.replace("/*__CARDS__*/", json.dumps(cards, indent=2))
    (HERE / "rate.html").write_text(page, encoding="utf-8")

    # Report. Deliberately does not compute a winner.
    print(f"pairs assembled: {len(cards)}")
    print(f"shuffle seed   : {args.seed if args.seed is not None else 'random (not reproducible)'}")
    print()
    print(f"{'brief':<16}{'arm':<10}{'findings':>9}{'P0':>4}{'P1':>4}{'P2':>4}   ids")
    for r in results:
        for arm in ARMS:
            m = r["measured"][arm]
            print(f"{r['brief']:<16}{arm:<10}{m['findings']:>9}{m['P0']:>4}{m['P1']:>4}{m['P2']:>4}   "
                  + ", ".join(m["ids"][:5]))
    print()
    print("Preference tally: 0 raters. This script cannot produce it.")
    print("Open evals/ab/rate.html, collect 5+ people, then record results in ab-results.md.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
