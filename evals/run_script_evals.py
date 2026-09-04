#!/usr/bin/env python3
"""
run_script_evals.py — deterministic correctness tests for the parti scripts
(audit.py, color.py, score.py, lint.py, motion.py).

This is the layer of the skill that has real ground truth. Contrast ratios are
arithmetic with published reference values. Fixtures are seeded with a known
number of known tells, so detection recall and false-positive rate are countable.

What this does NOT test: whether the design advice is good. That is not
benchmarkable by a script, and any number claiming otherwise is a rubric in a
lab coat. See evals/README.md.

Usage:
    python evals/run_script_evals.py             # run all, exit 1 on any failure
    python evals/run_script_evals.py --verbose
    python evals/run_script_evals.py --keep      # leave fixtures on disk to inspect

Stdlib only.
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(os.path.dirname(HERE), "scripts")

# ─────────────────────────────────────────────────────────── fixtures

# SLOP fixture: 11 tells deliberately planted. Ground truth is the id list below.
SLOP_TELLS = [
    "ai_cream", "terracotta", "purple_blue_gradient", "inter_only",
    "glass_card", "icon_tile", "numbering", "gray_on_color",
    "fade_up_all", "nested_cards", "three_word_heading",
]

SLOP_FILES = {
    "package.json": json.dumps({
        "dependencies": {"framer-motion": "^11.0.0", "tailwindcss": "^3.4.0",
                         "lucide-react": "^0.400.0",
                         "class-variance-authority": "^0.7.0"}
    }, indent=2),
    "src/app.css": """
:root { --bg: #F4F1EA; --accent: #D97757; }
body { font-family: Inter, sans-serif; background: #F4F1EA; color: #6B7280; }
.hero { background: linear-gradient(to right, #8b5cf6, #3b82f6); }
.glass { backdrop-filter: blur(12px); background: rgba(255,255,255,0.6); }
.card  { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
         transition: all 0.3s ease; padding: 17px; }
.btn   { border-radius: 12px; transition: all 500ms ease-in-out; outline: none; }
.a{border-radius:3px}.b{border-radius:5px}.c{border-radius:7px}.d{border-radius:9px}
.e{border-radius:11px}.f{border-radius:13px}.g{border-radius:17px}.h{border-radius:19px}
.i{border-radius:21px}.j{border-radius:23px}
""",
    "src/Hero.tsx": """
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
export function Hero() {
  return (
    <motion.section whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}>
      <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 w-12 h-12">
        <Zap />
      </div>
      <h1>Powerful. Simple. Fast.</h1>
      <p className="text-gray-400">Everything you need, nothing you don't.</p>
      <span>01</span><span>02</span><span>03</span>
      <div className="rounded-lg border shadow-md p-6">
        <div className="rounded-lg border shadow-sm p-4">
          <div className="rounded-md border shadow-sm p-2">nested</div>
        </div>
      </div>
    </motion.section>
  );
}
""",
}
for _i in range(1, 7):
    SLOP_FILES[f"src/Sec{_i}.jsx"] = """
import { motion } from "framer-motion";
export default () => (
  <motion.div whileInView={{ opacity: 1 }} className="text-gray-400
    bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
    <h2>Powerful. Simple. Fast.</h2>
  </motion.div>
);
"""

# CLEAN fixture: a disciplined system. Should fire at most 1 tell.
CLEAN_FILES = {
    "package.json": json.dumps({
        "dependencies": {"motion": "^11.0.0", "gsap": "^3.12.0"}
    }, indent=2),
    "src/tokens.css": """
:root {
  --bg: oklch(98.5% 0.004 95); --surface: oklch(100% 0 0);
  --border: oklch(88% 0.006 95); --text: oklch(22% 0.012 60);
  --text-muted: oklch(48% 0.010 60); --accent: oklch(48% 0.17 25);
  --accent-fg: oklch(99% 0 0); --success: oklch(52% 0.11 150);
  --warning: oklch(70% 0.14 75); --danger: oklch(48% 0.17 25);
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-6: 24px; --s-8: 32px; --s-12: 48px; --s-16: 64px;
  --r-sm: 3px; --r-md: 5px; --r-lg: 8px; --r-full: 999px;
  --e-1: 0 1px 2px oklch(22% 0.012 60 / 0.06);
  --e-2: 0 8px 24px oklch(22% 0.012 60 / 0.10);
  --d-instant: 100ms; --d-fast: 150ms; --d-base: 200ms; --d-slow: 280ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --z-sticky: 100; --z-overlay: 200; --z-toast: 300;
}
""",
    "src/base.css": """
body { font-family: "Instrument Serif", Georgia, serif; background: var(--bg);
       color: var(--text); }
.ui { font-family: "Söhne", system-ui, sans-serif; }
.data { font-family: "JetBrains Mono", monospace; font-size: 13px; }
h1 { font-size: 44px; } h2 { font-size: 29px; } h3 { font-size: 23px; }
p  { font-size: 15px; } small { font-size: 13px; }
.card { border-radius: var(--r-md); box-shadow: var(--e-1);
        padding: var(--s-6); background: var(--surface); }
.pop  { border-radius: var(--r-md); box-shadow: var(--e-2); }
.row  { border-radius: var(--r-sm); padding: var(--s-2) var(--s-3); }
.avatar { border-radius: var(--r-full); }
.btn  { border-radius: var(--r-md); transition: background-color var(--d-fast) var(--ease-out),
        transform var(--d-fast) var(--ease-out); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important;
                           animation-duration: 0.01ms !important; }
}
""",
    "src/Table.tsx": """
import { motion } from "motion/react";
export function Table({ rows }) {
  return (
    <table className="data">
      {rows.map((r) => (
        <motion.tr key={r.id} layout
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <td>{r.deadline}</td><td>{r.agency}</td><td>{r.amount}</td>
        </motion.tr>
      ))}
    </table>
  );
}
""",
}

# SPARSE fixture: almost nothing. Must not crash or claim confidence.
SPARSE_FILES = {
    "index.html": "<html><body><h1>hello</h1></body></html>",
}

# DRIFT fixture: one component using an accent that's a near-miss for the
# spec'd one (0xB23A2E vs 0xB23A2F) plus one clearly unspec'd color.
DRIFT_TOKENS = {"--bg": "#FAF9F6", "--text": "#2B2620", "--accent": "#B23A2E"}
DRIFT_FILES = {
    "Card.tsx": """
export function Card() {
  return <div style={{ background: '#FAF9F6', color: '#2B2620' }}>
    <span style={{ color: '#8A8F98' }}>unspecced gray</span>
  </div>;
}
""",
}


def write_fixture(root, files):
    for rel, content in files.items():
        p = os.path.join(root, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            f.write(content)
    return root


# ─────────────────────────────────────────────────────────── runner

class Results:
    def __init__(self, verbose=False):
        self.rows = []
        self.verbose = verbose

    def check(self, group, name, passed, detail=""):
        self.rows.append((group, name, bool(passed), detail))
        if self.verbose:
            print(f"  {'PASS' if passed else 'FAIL'}  {name}  {detail}")

    def summary(self):
        groups = {}
        for g, n, p, d in self.rows:
            groups.setdefault(g, []).append((n, p, d))
        total = len(self.rows)
        passed = sum(1 for *_, p, _ in [(0, r[2], r[3]) for r in self.rows] if p)
        passed = sum(1 for r in self.rows if r[2])
        print("\n" + "=" * 66)
        for g, items in groups.items():
            ok = sum(1 for _, p, _ in items if p)
            print(f"\n{g}  —  {ok}/{len(items)}")
            for n, p, d in items:
                mark = "✓" if p else "✗"
                print(f"  {mark} {n}" + (f"   {d}" if d and not p else
                                          (f"   {d}" if d else "")))
        print("\n" + "=" * 66)
        print(f"TOTAL  {passed}/{total} passed")
        return passed == total


def run(cmd):
    # Child scripts force UTF-8 stdout (see their own reconfigure guard); decode
    # the same way here so a Windows parent locale doesn't mangle it back.
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.returncode, r.stdout, r.stderr


def audit(path):
    out = os.path.join(tempfile.gettempdir(), f"audit_{os.path.basename(path)}.json")
    rc, so, se = run([sys.executable, os.path.join(SCRIPTS, "audit.py"),
                      path, "--json", out, "--quiet"])
    if rc != 0:
        raise RuntimeError(f"audit.py failed: {se[:400]}")
    with open(out) as f:
        return json.load(f)


def score(audit_json_path):
    rc, so, se = run([sys.executable, os.path.join(SCRIPTS, "score.py"),
                      audit_json_path, "--json", "-"])
    return rc, so, se


def motion(path):
    out = os.path.join(tempfile.gettempdir(), f"motion_{os.path.basename(path)}.json")
    cmd = [sys.executable, os.path.join(SCRIPTS, "motion.py"), path, "--json", out, "--quiet"]
    rc, so, se = run(cmd)
    with open(out) as f:
        return rc, json.load(f)


def lint(path, tokens_path=None):
    out = os.path.join(tempfile.gettempdir(), f"lint_{os.path.basename(path)}.json")
    cmd = [sys.executable, os.path.join(SCRIPTS, "lint.py"), path, "--json", out, "--quiet"]
    if tokens_path:
        cmd += ["--tokens", tokens_path]
    rc, so, se = run(cmd)
    with open(out) as f:
        return rc, json.load(f)


# ─────────────────────────────────────────────────────────── tests

# Published WCAG reference values. External ground truth, not self-consistency.
CONTRAST_REFS = [
    ("#000000", "#FFFFFF", 21.00),
    ("#FFFFFF", "#FFFFFF", 1.00),
    ("#767676", "#FFFFFF", 4.54),   # canonical AA-body boundary
    ("#949494", "#FFFFFF", 3.03),   # canonical AA-large boundary
    ("#595959", "#FFFFFF", 7.00),   # canonical AAA boundary
    ("#0000FF", "#FFFFFF", 8.59),
]


def test_contrast(R):
    for fg, bg, expected in CONTRAST_REFS:
        rc, so, _ = run([sys.executable, os.path.join(SCRIPTS, "color.py"),
                         "contrast", fg, bg])
        m = re.search(r"([\d.]+):1", so)
        got = float(m.group(1)) if m else -1
        R.check("Contrast math (WCAG reference values)",
                f"{fg} on {bg} = {expected}",
                abs(got - expected) <= 0.02, f"got {got}")


def test_color_fix(R):
    rc, so, _ = run([sys.executable, os.path.join(SCRIPTS, "color.py"),
                     "fix", "#8A8F98", "--on", "#F7F7F8", "--target", "4.5"])
    m = re.findall(r"([\d.]+):1", so)
    reached = float(m[-1]) if m else 0
    R.check("Color repair", "fix reaches the 4.5 target", reached >= 4.5,
            f"reached {reached}")
    R.check("Color repair", "fix does not overshoot wildly", reached <= 5.5,
            f"reached {reached}")
    hexes = re.findall(r"#[0-9A-Fa-f]{6}", so)
    R.check("Color repair", "fix returns a new hex", len(set(hexes)) >= 2,
            f"hexes {hexes[:3]}")


def test_ramp(R):
    rc, so, _ = run([sys.executable, os.path.join(SCRIPTS, "color.py"),
                     "ramp", "#B23A2E", "--steps", "7"])
    table = so.split("--------")[-1] if "--------" in so else so
    ls = [float(x) for x in re.findall(r"oklch\(([\d.]+)%", table)]
    R.check("Ramp", "produces the requested number of steps", len(ls) >= 7,
            f"{len(ls)} steps")
    R.check("Ramp", "lightness is monotonically decreasing",
            all(a > b for a, b in zip(ls, ls[1:])) if len(ls) > 1 else False,
            f"L values {[round(x) for x in ls]}")


def test_slop_fixture(R, path):
    a = audit(path)
    found = {t["id"] for t in a["tells"]}
    expected = set(SLOP_TELLS)
    hits = found & expected
    recall = len(hits) / len(expected)
    R.check("Slop fixture (11 planted tells)",
            f"detection recall >= 0.80", recall >= 0.80,
            f"{len(hits)}/{len(expected)} = {recall:.0%}; missed {sorted(expected - found)}")
    R.check("Slop fixture (11 planted tells)", "every tell cites a file path",
            all(t.get("files") for t in a["tells"]),
            "some tells have no file evidence")
    R.check("Slop fixture (11 planted tells)", "detects transition: all",
            a["motion"]["default_easing_uses"] > 0)
    R.check("Slop fixture (11 planted tells)", "detects missing reduced-motion",
            a["a11y"]["reduced_motion_handled"] is False)
    R.check("Slop fixture (11 planted tells)", "detects radius entropy (>8 variants)",
            a["shape"]["radius_variants"] > 8, f"{a['shape']['radius_variants']} variants")
    R.check("Slop fixture (11 planted tells)", "detects durations over 400ms",
            len(a["motion"]["durations_over_400ms"]) > 0)

    out = os.path.join(tempfile.gettempdir(), "audit_slop.json")
    with open(out, "w") as f:
        json.dump(a, f)
    rc, so, _ = score(out)
    s = json.loads(so) if so.strip().startswith("{") else {}
    total = s.get("measured_score", 100)
    distinct = s.get("dimensions", {}).get("distinctiveness", {}).get("score", 15)
    R.check("Slop fixture (11 planted tells)", "measured score < 60", total < 60,
            f"scored {total}")
    R.check("Slop fixture (11 planted tells)", "distinctiveness <= 3/15", distinct <= 3,
            f"scored {distinct}")


def test_clean_fixture(R, path):
    a = audit(path)
    tells = [t["id"] for t in a["tells"]]
    R.check("Clean fixture (false-positive guard)", "fires at most 1 tell",
            len(tells) <= 1, f"fired {tells}")
    R.check("Clean fixture (false-positive guard)", "recognises the token layer",
            a["system"]["css_vars_defined"] >= 20,
            f"{a['system']['css_vars_defined']} vars")
    R.check("Clean fixture (false-positive guard)", "detects reduced-motion handling",
            a["a11y"]["reduced_motion_handled"] is True)
    R.check("Clean fixture (false-positive guard)", "detects custom easing curves",
            a["motion"]["custom_easing_uses"] > 0)
    R.check("Clean fixture (false-positive guard)", "detects base spacing unit of 4",
            a["space"]["base_unit"] in (4, 8), f"base {a['space']['base_unit']}")
    R.check("Clean fixture (false-positive guard)", "detects 3+ typefaces",
            a["type"]["family_count"] >= 3, f"{a['type']['family_count']} families")

    out = os.path.join(tempfile.gettempdir(), "audit_clean.json")
    with open(out, "w") as f:
        json.dump(a, f)
    rc, so, _ = score(out)
    s = json.loads(so) if so.strip().startswith("{") else {}
    total = s.get("measured_score", 0)
    R.check("Clean fixture (false-positive guard)", "measured score >= 70",
            total >= 70, f"scored {total}")


def test_sparse_fixture(R, path):
    try:
        a = audit(path)
        ok = True
    except Exception as e:
        a, ok = {}, False
    R.check("Sparse fixture (graceful degradation)", "does not crash on a thin repo", ok)
    if ok:
        R.check("Sparse fixture (graceful degradation)", "reports zero tells rather than guessing",
                len(a.get("tells", [])) == 0, f"{len(a.get('tells', []))} tells")


def test_lint_slop(R, path):
    rc, r = lint(path)
    ids = {f["id"] for f in r["findings"]}
    R.check("Lint — build-time tells (slop fixture)", "exits 1 (P0 present)", rc == 1, f"rc={rc}")
    R.check("Lint — build-time tells (slop fixture)", "catches the purple-to-blue gradient",
            "purple_blue_gradient" in ids)
    R.check("Lint — build-time tells (slop fixture)", "catches focus killed with no replacement",
            "focus_killed" in ids)
    R.check("Lint — build-time tells (slop fixture)", "catches the nested icon tile",
            "icon_tile" in ids)
    R.check("Lint — build-time tells (slop fixture)", "catches nested cards",
            "nested_cards" in ids)
    R.check("Lint — build-time tells (slop fixture)", "P0 count matches the 8 gradient sites + 1 focus kill",
            r["counts"].get("P0") == 9, f"got {r['counts']}")


def test_lint_clean(R, path):
    rc, r = lint(path)
    R.check("Lint — false-positive guard (clean fixture)", "exits 0", rc == 0, f"rc={rc}")
    R.check("Lint — false-positive guard (clean fixture)", "zero findings",
            len(r["findings"]) == 0, f"found {[f['id'] for f in r['findings']]}")


def test_lint_drift(R, tmp):
    tokens_path = os.path.join(tmp, "tokens.json")
    with open(tokens_path, "w") as f:
        json.dump(DRIFT_TOKENS, f)
    drift_dir = write_fixture(os.path.join(tmp, "drift"), DRIFT_FILES)

    rc, r = lint(drift_dir, tokens_path)
    ids = {f["id"]: f for f in r["findings"]}
    R.check("Lint — token drift", "exits 1 with an unspec'd color present", rc == 1, f"rc={rc}")
    R.check("Lint — token drift", "flags the unspec'd gray as drift",
            "token_drift" in ids and "#8a8f98" in ids["token_drift"]["label"].lower(),
            f"findings: {list(ids)}")

    # False-positive guard. Without this, a bug that empties the allowed set
    # passes all three checks above — every color reads as drift, including the
    # spec'd ones, and "flags the unspec'd gray" is still technically true.
    drift_labels = " ".join(f["label"].lower() for f in r["findings"]
                            if f["id"] == "token_drift")
    R.check("Lint — token drift", "colors that ARE in the spec are not flagged",
            "#faf9f6" not in drift_labels and "#2b2620" not in drift_labels,
            f"drift labels: {drift_labels}")

    rc2, r2 = lint(drift_dir, None)  # same code, no --tokens
    R.check("Lint — token drift", "without --tokens, drift isn't checked (no false claim)",
            not any(f["id"] == "token_drift" for f in r2["findings"]))


MOTION_BAD_FILES = {
    "components/dropdown.css": """
.menu {
  transform-origin: center;
  transition: all 420ms ease-in;
}
.menu:hover { transform: scale(1.05); }
""",
    "components/toast.css": """
@keyframes toast-in { from { transform: scale(0); } to { transform: scale(1); } }
.toast { animation: toast-in 200ms ease-out; }
""",
    "components/panel.css": """
.panel { transition: height 250ms ease-out, box-shadow 250ms ease-out; }
.panel { will-change: transform, opacity; }
""",
    "components/hero.tsx": """
export const Hero = () => (
  <motion.div animate={{ x: 100 }} transition={{ staggerChildren: 0.15 }} />
);
""",
}

MOTION_GOOD_FILES = {
    "tokens.css": """
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --dur-press: 160ms;
  --dur-2: 200ms;
}
""",
    "components/button.css": """
.button { transition: transform var(--dur-press) var(--ease-out); }
.button:active { transform: scale(0.97); }
@media (hover: hover) and (pointer: fine) {
  .button:hover { transform: scale(1.02); }
}
@media (prefers-reduced-motion: reduce) {
  .button { transition: none; }
}
""",
    "components/popover.css": """
.popover {
  transform-origin: var(--transform-origin);
  transition: transform var(--dur-2) var(--ease-out), opacity var(--dur-2) var(--ease-out);
}
.popover[data-closed] { opacity: 0; transform: scale(0.95); }
@media (prefers-reduced-motion: reduce) {
  .popover { transition: opacity 150ms var(--ease-out); }
}
""",
}

MOTION_EXPECTED = {
    "easing-transition-all", "easing-ease-in-on-ui", "timing-over-300ms",
    "physics-scale-zero", "perf-layout-property", "physics-origin-center",
    "interrupt-keyframes-on-rapid", "perf-motion-shorthand", "perf-shadow-animation",
    "perf-will-change-permanent", "cohesion-stagger-excessive",
    "a11y-no-reduced-motion", "a11y-ungated-hover",
}


def test_motion_bad(R, path):
    rc, r = motion(path)
    ids = {f["rule"] for f in r["findings"]}
    G = "Motion — rule detection (bad fixture)"
    R.check(G, "exits 1 (P0 present)", rc == 1, f"rc={rc}")
    missed = sorted(MOTION_EXPECTED - ids)
    R.check(G, f"catches all {len(MOTION_EXPECTED)} seeded rules", not missed, f"missed {missed}")
    R.check(G, "every finding carries a file and a rule id",
            all(f.get("file") and f.get("rule") for f in r["findings"]))
    R.check(G, "every per-line finding carries a line number",
            all(f["line"] > 0 for f in r["findings"] if f["scope"] == "line"),
            str([x["rule"] for x in r["findings"] if x["scope"] == "line" and not x["line"]]))
    R.check(G, "rollup findings are labelled as such, not faked to a line",
            all(f["line"] == 0 for f in r["findings"] if f["scope"] != "line"))


def test_motion_good(R, path):
    rc, r = motion(path)
    G = "Motion — false-positive guard (good fixture)"
    R.check(G, "exits 0", rc == 0, f"rc={rc}")
    R.check(G, "zero findings on correct motion",
            len(r["findings"]) == 0, f"found {[f['rule'] for f in r['findings']]}")


def test_motion_no_false_positives_on_clean(R, path):
    """The clean design fixture seeds no motion defects; motion.py must not invent one."""
    rc, r = motion(path)
    p0 = [f["rule"] for f in r["findings"] if f["severity"] == "P0"
          and f["rule"] != "a11y-no-reduced-motion"]
    R.check("Motion — false-positive guard (clean design fixture)",
            "no P0 beyond the honest reduced-motion gap", not p0, f"got {p0}")


def test_motion_census(R, path):
    rc, r = motion(path)
    c = r["census"]
    R.check("Motion — census", "reports distinct durations and curves",
            "distinct_durations" in c and "distinct_curves" in c)
    R.check("Motion — census", "counts the two seeded curves",
            c["distinct_curves"] == 2, f"got {c['distinct_curves']}")


def test_determinism(R, path):
    a1, a2 = audit(path), audit(path)
    a1.pop("root", None); a2.pop("root", None)
    R.check("Determinism", "identical output across two runs",
            json.dumps(a1, sort_keys=True) == json.dumps(a2, sort_keys=True))


# ─────────────────────────────────────────────────────────── capture tests

CAPTURE_HTML = """<!doctype html><html><head>
<title>t</title>
<style>.b{transition:transform 160ms cubic-bezier(0.16,1,0.3,1)}</style>
</head><body><button class="b">go</button></body></html>"""

CAPTURE_CSS_PAGE = """<!doctype html><html><head>
<link rel="stylesheet" href="a.css">
<style>
@keyframes slide-in { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
.hero { animation: slide-in 600ms cubic-bezier(0.16,1,0.3,1) }
.nav { transition: height 240ms cubic-bezier(0.4,0,0.2,1) }
</style></head><body></body></html>"""

CAPTURE_CSS_EXTERNAL = """
.card { transition: transform 180ms ease-out, box-shadow 180ms ease-out }
@media (prefers-reduced-motion: reduce) { .card { transition: none } }
.panel { animation-timeline: scroll(root block) }
::view-transition-old(root) { animation-duration: 300ms }
"""

CAPTURE_LIB_PAGE = """<!doctype html><html><head>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1/dist/lenis.min.js"></script>
</head><body>
<section data-scroll data-speed="0.8">parallax</section>
<canvas id="bg"></canvas>
</body></html>"""


def _write_capture_page(tmp, name="page.html", html=CAPTURE_HTML, extra=None):
    d = os.path.join(tmp, "capture_" + name.replace(".", "_"))
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    for rel, content in (extra or {}).items():
        ep = os.path.join(d, rel)
        os.makedirs(os.path.dirname(ep), exist_ok=True)
        with open(ep, "w", encoding="utf-8") as f:
            f.write(content)
    return "file:///" + p.replace(os.sep, "/")


def capture(url, focus="", tier="static", md=False, *, tmp):
    # Write under the per-run tmp dir, not a fixed tempdir path — a crashed run
    # otherwise leaves a stale capture_out.json the next run would read.
    out = os.path.join(tmp, "capture_out.json")
    mdout = os.path.join(tmp, "capture_out.md")
    cmd = [sys.executable, os.path.join(SCRIPTS, "capture.py"),
           "--url", url, "--focus", focus, "--tier", tier,
           "--json", out, "--quiet"]
    if md:
        cmd += ["--md", mdout]
    rc, so, se = run(cmd)
    data = json.load(open(out, encoding="utf-8")) if os.path.exists(out) else None
    mdtext = open(mdout, encoding="utf-8").read() if md and os.path.exists(mdout) else ""
    return rc, data, mdtext, se


def test_capture_envelope(R, tmp):
    url = _write_capture_page(tmp)
    rc, data, _, se = capture(url, focus="the button", tmp=tmp)
    G = "Capture — envelope"
    R.check(G, "exits 0 on a reachable page", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "tool/version/tier stamped", data and data.get("tool") == "capture"
            and data.get("version") == 1 and data.get("tier") == "static", str(data)[:200])
    R.check(G, "records the source URL", data and data.get("sources") == [url])
    R.check(G, "echoes the focus", data and data.get("focus") == "the button")
    R.check(G, "not_captured is never empty at tier 1",
            data and len(data.get("not_captured", [])) >= 1, str(data.get("not_captured")))
    R.check(G, "unreachable URL exits 1",
            capture("file:///no/such/file.html", tmp=tmp)[0] == 1)


def test_capture_css_motion(R, tmp):
    url = _write_capture_page(tmp, name="css.html", html=CAPTURE_CSS_PAGE,
                              extra={"a.css": CAPTURE_CSS_EXTERNAL})
    rc, data, _, se = capture(url, focus="the nav", tmp=tmp)
    G = "Capture — CSS motion"
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    findings = data.get("motion_findings", []) if data else []
    blob = json.dumps(data)
    R.check(G, "captures the @keyframes block",
            any("slide-in" in json.dumps(f) for f in findings), blob[:300])
    R.check(G, "captures the nav transition with its duration",
            any(240 in f.get("timing", {}).get("durations_ms", []) for f in findings),
            blob[:400])
    R.check(G, "captures the exact cubic-bezier, not a keyword",
            "cubic-bezier(0.4,0,0.2,1)" in blob.replace(" ", "")
            or "cubic-bezier(0.4, 0, 0.2, 1)" in blob, blob[:400])
    R.check(G, "reads the linked stylesheet too (ease-out card transition)",
            any("ease-out" in json.dumps(f.get("timing", {})) for f in findings), blob[:400])
    R.check(G, "notes the reference DOES handle reduced motion",
            any(f.get("reduced_motion") == "declared" for f in findings), blob[:400])
    R.check(G, "flags scroll-timeline / view-transitions presence",
            "scroll-timeline" in blob or "view-transition" in blob
            or any(k in json.dumps(data.get("not_captured", []) + list(data.keys()))
                   for k in ("scroll", "view_transition")), blob[:400])


def test_capture_libraries(R, tmp):
    url = _write_capture_page(tmp, name="lib.html", html=CAPTURE_LIB_PAGE)
    rc, data, _, se = capture(url, focus="the parallax section", tmp=tmp)
    G = "Capture — libraries & hints"
    blob = json.dumps(data)
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "fingerprints gsap + scrolltrigger + lenis",
            set(data.get("libraries", [])) >= {"gsap", "scrolltrigger", "lenis"},
            str(data.get("libraries")))
    R.check(G, "counts the data-scroll / data-speed hints",
            data.get("trigger_hints", {}).get("data-scroll", 0) >= 1
            and "data-speed" in data.get("trigger_hints", {}),
            str(data.get("trigger_hints")))
    R.check(G, "not_captured flags canvas",
            any("canvas" in n.lower() for n in data.get("not_captured", [])), blob[:400])
    R.check(G, "not_captured flags library-driven motion needing tier 2",
            any("Tier 2" in n or "runtime" in n for n in data.get("not_captured", [])),
            blob[:400])


def test_capture_multi_and_md(R, tmp):
    u1 = _write_capture_page(tmp, name="m1.html", html=CAPTURE_CSS_PAGE,
                             extra={"a.css": CAPTURE_CSS_EXTERNAL})
    u2 = _write_capture_page(tmp, name="m2.html", html=CAPTURE_LIB_PAGE)
    out = os.path.join(tempfile.gettempdir(), "capture_multi.json")
    mdout = os.path.join(tempfile.gettempdir(), "capture_multi.md")
    rc, so, se = run([sys.executable, os.path.join(SCRIPTS, "capture.py"),
                      "--url", u1, "--url", u2, "--focus", "nav + parallax",
                      "--json", out, "--md", mdout, "--quiet"])
    data = json.load(open(out, encoding="utf-8"))
    md = open(mdout, encoding="utf-8").read()
    G = "Capture — multi-URL + markdown"
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "both source URLs present", u1 in data["sources"] and u2 in data["sources"],
            str(data["sources"]))
    R.check(G, "findings unioned across pages",
            any("slide-in" in json.dumps(f) for f in data["motion_findings"]))
    R.check(G, "libraries unioned across pages",
            "gsap" in data["libraries"] and "lenis" in data["libraries"])
    R.check(G, "markdown has the three sections",
            "## Motion findings" in md and "## Focus element" in md and "## Adopted" in md)
    n_find = len(data["motion_findings"])
    R.check(G, "markdown has FAITHFUL and ADAPTED stubs per finding",
            md.count("FAITHFUL") >= n_find and md.count("ADAPTED") >= n_find,
            f"FAITHFUL={md.count('FAITHFUL')} ADAPTED={md.count('ADAPTED')} findings={n_find}")
    R.check(G, "markdown header carries the tier and date",
            data["tier"] in md and data["captured"] in md)


def test_capture_tier_fallback(R, tmp):
    url = _write_capture_page(tmp, name="tier.html", html=CAPTURE_CSS_PAGE,
                              extra={"a.css": CAPTURE_CSS_EXTERNAL})
    G = "Capture — tier handling"
    # --tier static must never attempt runtime
    rc_s, data_s, _, _ = capture(url, tier="static", tmp=tmp)
    R.check(G, "--tier static exits 0 and stays static",
            rc_s == 0 and data_s["tier"] == "static", str(data_s.get("tier")))
    R.check(G, "--tier static does not add a runtime-unavailable note",
            not any("runtime capture unavailable" in n for n in data_s["not_captured"]))
    # --tier runtime with playwright absent must fall back cleanly
    try:
        import playwright  # noqa: F401
        have_pw = True
    except ImportError:
        have_pw = False
    rc_r, data_r, _, se = capture(url, tier="runtime", tmp=tmp)
    R.check(G, "--tier runtime exits 0 regardless", rc_r == 0, f"rc={rc_r} se={se[:200]}")
    if not have_pw:
        R.check(G, "falls back to static with an explicit note",
                data_r["tier"] == "static"
                and any("runtime capture unavailable" in n for n in data_r["not_captured"]),
                str(data_r["not_captured"]))
    else:
        R.check(G, "runtime tier ran (playwright present)",
                data_r["tier"] in ("runtime", "static"), str(data_r["tier"]))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--keep", action="store_true")
    args = ap.parse_args()

    tmp = tempfile.mkdtemp(prefix="dd_evals_")
    slop = write_fixture(os.path.join(tmp, "slop"), SLOP_FILES)
    motion_bad = write_fixture(os.path.join(tmp, "motion_bad"), MOTION_BAD_FILES)
    motion_good = write_fixture(os.path.join(tmp, "motion_good"), MOTION_GOOD_FILES)
    clean = write_fixture(os.path.join(tmp, "clean"), CLEAN_FILES)
    sparse = write_fixture(os.path.join(tmp, "sparse"), SPARSE_FILES)

    R = Results(args.verbose)
    print(f"Fixtures: {tmp}\n")
    test_contrast(R)
    test_color_fix(R)
    test_ramp(R)
    test_slop_fixture(R, slop)
    test_clean_fixture(R, clean)
    test_motion_bad(R, motion_bad)
    test_motion_good(R, motion_good)
    test_motion_no_false_positives_on_clean(R, clean)
    test_motion_census(R, motion_good)
    test_sparse_fixture(R, sparse)
    test_determinism(R, clean)
    test_capture_envelope(R, tmp)
    test_capture_css_motion(R, tmp)
    test_capture_libraries(R, tmp)
    test_capture_multi_and_md(R, tmp)
    test_capture_tier_fallback(R, tmp)
    test_lint_slop(R, slop)
    test_lint_clean(R, clean)
    test_lint_drift(R, tmp)

    ok = R.summary()
    if args.keep:
        print(f"\nFixtures kept at {tmp}")
    else:
        shutil.rmtree(tmp, ignore_errors=True)

    print("\nThis harness covers the script layer only. Trigger accuracy and process")
    print("compliance are separate layers — see evals/README.md.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
