#!/usr/bin/env python3
"""
motion.py - evaluate an interface's motion against the rule catalog.

Implements the machine-checkable subset of references/motion-rules.md and
reports findings as `file:line - [rule-id] message`, followed by the summary
table that reference specifies.

What it CAN see: easing keywords, durations, transform values, animated
properties, Motion props, stagger values, reduced-motion handling, token
sprawl. What it CANNOT see: whether an animation has a purpose, how often a
surface is actually used, whether the personality is coherent, whether a
crossfade settles. Those are the judged half - `purpose-*`, `cohesion-
personality-mismatch`, `staging-competing-focal` and the missed-opportunity
list stay with the reviewer, and a clean run here never means the motion is
good. Same relationship score.py has to a full evaluate.

Usage:
    python motion.py <path>
    python motion.py <path> --json /tmp/motion.json --quiet
    python motion.py <path> --census          # just the durations/easings inventory

Exit code is 1 if any P0 finding exists, so it can gate a build step.

Line numbers come from a per-line scan: a `transition` declaration split
across several lines is attributed to the line carrying the matched token.
Stdlib only. Never writes to the scanned project.
"""

import argparse
import json
import os
import re
import sys

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass
from collections import defaultdict, Counter

CODE_EXT = {".css", ".scss", ".less", ".js", ".jsx", ".ts", ".tsx",
            ".html", ".vue", ".svelte", ".astro"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "out",
             "coverage", "vendor", ".venv", "venv", "__pycache__", ".turbo", ".cache"}
MAX_FILE_BYTES = 2_000_000

UI_BUDGET_MS = 300
SHEET_BUDGET_MS = 500   # drawers and sheets travel further; iOS-style sheets land near 500ms
STAGGER_CAP_S = 0.08
PRESS_SCALE_MIN, PRESS_SCALE_MAX = 0.95, 1.05

# Files where a long duration is legitimately allowed (marketing, onboarding,
# one-per-session choreography). Motion budgets are for UI, not for a hero.
RE_LONG_OK_PATH = re.compile(
    r"(marketing|landing|hero|onboard|welcome|splash|story|promo|banner)", re.I)
# Lines where a long duration is legitimately allowed (continuous motion).
RE_LONG_OK_LINE = re.compile(
    r"infinite|repeat\s*:|marquee|spin|pulse|skeleton|shimmer|progress|scrub", re.I)

RE_TRIGGER_ANCHORED = re.compile(
    r"(popover|dropdown|menu|tooltip|select|combobox|popper|listbox)", re.I)
RE_NOT_ANCHORED = re.compile(r"(modal|dialog|sheet|drawer|lightbox)", re.I)
RE_SHEET = re.compile(r"(sheet|drawer|vaul|bottom-?sheet|side-?panel)", re.I)
RE_COMMENT = re.compile(r"//.*$|/\*.*?\*/|<!--.*?-->")
RE_RAPID_FIRE = re.compile(r"(toast|toggle|switch|snackbar|tooltip|checkbox|radio)", re.I)
RE_OVERLAY_FILE = re.compile(r"(overlay|backdrop|scrim)", re.I)
RE_ACCORDION_FILE = re.compile(r"(accordion|collapse|disclosure|details)", re.I)

RE_MOTION_LINE = re.compile(r"transition|animation|@keyframes|animate=|whileTap|whileHover|transform", re.I)
RE_DUR = re.compile(r"(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])")
RE_CUBIC = re.compile(r"cubic-bezier\(\s*[-\d.]+\s*,\s*[-\d.]+\s*,\s*[-\d.]+\s*,\s*[-\d.]+\s*\)")

# (rule_id, severity, regex, message)
LINE_RULES = [
    ("easing-transition-all", "P0",
     re.compile(r"transition\s*:\s*all\b|\btransition-all\b"),
     "`transition: all` animates properties nobody chose, including layout ones, off the GPU"),

    ("easing-ease-in-on-ui", "P0",
     re.compile(r"\bease-in(?!-out)\b|\beaseIn(?!Out)\b"),
     "`ease-in` delays the moment the user is watching; use --ease-out "
     "(permitted only for an element travelling fully off-screen)"),

    ("physics-scale-zero", "P0",
     re.compile(r"scale\(\s*0\s*\)|scale3d\(\s*0\s*,|\bscale\s*:\s*0\s*[,}\n]"),
     "entrance from scale(0) - nothing appears from nothing; start at scale(0.9-0.97) + opacity 0"),

    ("perf-layout-property", "P0",
     re.compile(r"(?:transition|animation)(?:-property)?\s*:\s*[^;{}\n]*"
                r"\b(width|height|top|left|right|bottom|margin|padding|inset)\b"),
     "animating a layout property triggers layout+paint+composite every frame; use transform/opacity"),

    ("perf-motion-shorthand", "P1",
     re.compile(r"(?:animate|initial|exit|whileHover|whileTap)\s*=\s*\{\{[^}]*?\b(?:x|y|scale)\s*:"),
     "Motion x/y/scale shorthands are not hardware-accelerated; use the full transform string"),

    ("perf-animated-blur", "P1",
     re.compile(r"transition\s*:\s*[^;{}\n]*\b(?:backdrop-)?filter\b|"
                r"transition-property\s*:\s*[^;{}\n]*\bfilter\b"),
     "animating blur radius is the most expensive common effect; animate the opacity of a pre-blurred layer"),

    ("perf-shadow-animation", "P2",
     re.compile(r"transition\s*:\s*[^;{}\n]*\bbox-shadow\b|transition-property\s*:\s*[^;{}\n]*\bbox-shadow\b"),
     "box-shadow repaints; put the shadow on a pseudo-element and animate its opacity"),

    ("perf-will-change-permanent", "P2",
     re.compile(r"\bwill-change\s*:"),
     "will-change left on permanently exhausts GPU memory; apply it only while animating"),

    ("perf-parent-var-transform", "P1",
     re.compile(r"setProperty\(\s*[\"'`]--"),
     "a CSS variable on a parent driving child transforms recalcs styles for every child; "
     "set transform on the element directly"),

    ("cohesion-stagger-excessive", "P2",
     re.compile(r"staggerChildren\s*:\s*0\.(?:0[89]|[1-9])"),
     "stagger above 80ms per item; 30-60ms typical, and the whole sequence stays under 400ms"),

    ("interrupt-distance-only-dismiss", "P2",
     re.compile(r"(?:swipe|drag|offset)[A-Za-z]*\s*\)?\s*>\s*\d{2,}\s*\)\s*[{;]"),
     "dismissing on distance alone ignores a fast flick; also test velocity (> ~0.11 px/ms)"),
]


def iter_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for fn in filenames:
            if os.path.splitext(fn)[1].lower() in CODE_EXT:
                p = os.path.join(dirpath, fn)
                try:
                    if os.path.getsize(p) > MAX_FILE_BYTES:
                        continue
                except OSError:
                    continue
                yield p


def read(p):
    try:
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except OSError:
        return ""


def to_ms(value, unit):
    v = float(value)
    return v * 1000.0 if unit == "s" else v


def scan(root):
    res = {"root": os.path.abspath(root), "files_scanned": 0, "findings": [],
           "census": {}, "counts": {}}
    add = res["findings"].append

    durations = Counter()
    easings = Counter()
    has_reduced_motion = False
    reduced_motion_sites = []
    has_hover_gate = False
    ungated_hover_files = []
    motion_present = False

    for path in iter_files(root):
        txt = read(path)
        if not txt:
            continue
        res["files_scanned"] += 1
        rel = os.path.relpath(path, root).replace(os.sep, "/")
        lines = txt.splitlines()
        base = os.path.basename(rel)

        if "prefers-reduced-motion" in txt:
            has_reduced_motion = True
            reduced_motion_sites.append(rel)
        if re.search(r"\(\s*hover\s*:\s*hover\s*\)", txt):
            has_hover_gate = True
        if re.search(r":hover[^{]*\{[^}]*(transform|translate|scale)", txt, re.S):
            ungated_hover_files.append(rel)

        file_has_hover = ":hover" in txt or "whileHover" in txt
        file_has_press = bool(re.search(r":active|whileTap|data-\[?pressed|:is\(:active", txt))

        selector = ""   # last CSS selector / JSX tag seen, so a duration line inherits its context
        for n, raw_line in enumerate(lines, 1):
            line = RE_COMMENT.sub("", raw_line)
            m_sel = re.match(r"\s*([^{}();]+?)\s*\{", line)
            if m_sel:
                selector = m_sel.group(1)
            if not RE_MOTION_LINE.search(line):
                # still collect duration/easing census from token files
                if "--ease" in line or "--dur" in line:
                    for m in RE_CUBIC.finditer(line):
                        easings[m.group(0)] += 1
                    for m in RE_DUR.finditer(line):
                        durations[int(to_ms(m.group(1), m.group(2)))] += 1
                continue
            motion_present = True

            for rid, sev, rx, msg in LINE_RULES:
                if not rx.search(line):
                    continue
                if rid == "perf-layout-property":
                    if "grid-template-rows" in line:
                        continue
                    if RE_ACCORDION_FILE.search(rel) and re.search(r"\bheight\b", line):
                        continue  # sanctioned exception; still worth grid-template-rows
                if rid == "easing-ease-in-on-ui" and re.search(r"off-?screen|departure", line, re.I):
                    continue
                add({"rule": rid, "severity": sev, "file": rel, "line": n,
                     "message": msg, "code": line.strip()[:120]})

            # census + duration budget
            for m in RE_CUBIC.finditer(line):
                easings[m.group(0)] += 1
            for m in re.finditer(r"\b(ease|ease-out|ease-in-out|linear)\b", line):
                easings[m.group(1)] += 1

            long_ok = RE_LONG_OK_PATH.search(rel) or RE_LONG_OK_LINE.search(line)
            budget = (SHEET_BUDGET_MS if (RE_SHEET.search(rel) or RE_SHEET.search(line)
                                          or RE_SHEET.search(selector)) else UI_BUDGET_MS)
            for m in RE_DUR.finditer(line):
                ms = to_ms(m.group(1), m.group(2))
                durations[int(ms)] += 1
                if ms > budget and not long_ok:
                    add({"rule": "timing-over-300ms", "severity": "P0", "scope": "line", "scope": "line", "file": rel, "line": n,
                         "message": f"{int(ms)}ms; budget for this surface is under {budget}ms "
                                    f"(see motion-rules.md §12 for the per-element table)",
                         "code": line.strip()[:120]})
            # Motion's numeric seconds: transition={{ duration: 0.45 }}
            for m in re.finditer(r"duration\s*:\s*(0?\.\d+|[1-9]\d*(?:\.\d+)?)\s*[,}]", line):
                ms = float(m.group(1)) * 1000.0
                durations[int(ms)] += 1
                if ms > budget and not long_ok:
                    add({"rule": "timing-over-300ms", "severity": "P0", "scope": "line", "scope": "line", "file": rel, "line": n,
                         "message": f"{int(ms)}ms; budget for this surface is under {budget}ms",
                         "code": line.strip()[:120]})

            # Tailwind duration utilities
            for m in re.finditer(r"\bduration-\[?(\d{2,4})m?s?\]?\b", line):
                ms = int(m.group(1))
                durations[ms] += 1
                if ms > budget and not long_ok:
                    add({"rule": "timing-over-300ms", "severity": "P0", "scope": "line", "scope": "line", "file": rel, "line": n,
                         "message": f"duration-{ms}; budget for this surface is under {budget}ms",
                         "code": line.strip()[:120]})

            # press deformation range
            for m in re.finditer(r"(?:whileTap\s*=\s*\{\{[^}]*?scale\s*:\s*|scale\(\s*)"
                                 r"(0?\.\d+|1\.\d+)", line):
                v = float(m.group(1))
                if v != 0 and not (PRESS_SCALE_MIN <= v <= PRESS_SCALE_MAX):
                    if re.search(r"whileTap|:active|press", line, re.I):
                        add({"rule": "physics-excessive-deformation", "severity": "P1", "scope": "line",
                             "file": rel, "line": n,
                             "message": f"press scale {v} outside the 0.95-1.05 range - reads as a toy, not a control",
                             "code": line.strip()[:120]})

            # trigger-anchored origin
            if re.search(r"transform-origin\s*:\s*(center|50%)", line):
                if RE_TRIGGER_ANCHORED.search(rel) and not RE_NOT_ANCHORED.search(rel):
                    add({"rule": "physics-origin-center", "severity": "P1", "scope": "line", "file": rel, "line": n,
                         "message": "trigger-anchored surface scaling from center; use var(--transform-origin) "
                                    "so it looks like it came out of its trigger (modals are exempt)",
                         "code": line.strip()[:120]})

            # keyframes on rapid-fire components
            if re.search(r"animation\s*:|animation-name\s*:|@keyframes", line):
                if RE_RAPID_FIRE.search(rel):
                    add({"rule": "interrupt-keyframes-on-rapid", "severity": "P0", "scope": "line",
                         "file": rel, "line": n,
                         "message": "keyframes restart from zero; a rapidly re-triggered element needs "
                                    "a transition (or a spring) so it retargets from its current value",
                         "code": line.strip()[:120]})

            # flash rate
            if "infinite" in line:
                fast = [to_ms(m.group(1), m.group(2)) for m in RE_DUR.finditer(line)]
                if fast and min(fast) < 333:
                    add({"rule": "a11y-flash-rate", "severity": "P0", "scope": "line", "file": rel, "line": n,
                         "message": f"{int(min(fast))}ms infinite loop is above 3Hz - a seizure risk, not a taste question",
                         "code": line.strip()[:120]})

            # undimmed overlay
            if RE_OVERLAY_FILE.search(base) and re.search(r"background(?:-color)?\s*:\s*transparent", line):
                add({"rule": "staging-undimmed-overlay", "severity": "P2", "scope": "line", "file": rel, "line": n,
                     "message": "overlay does not dim; attention has nowhere to go",
                     "code": line.strip()[:120]})

            # linear on non-continuous motion
            if re.search(r"transition\s*:\s*(?:transform|opacity)[^;{}\n]*\blinear\b", line) \
                    and not RE_LONG_OK_LINE.search(line):
                add({"rule": "easing-linear-motion", "severity": "P2", "scope": "line", "file": rel, "line": n,
                     "message": "linear is for continuous motion (progress, marquee, spinner); "
                                "anything that starts and stops has weight",
                     "code": line.strip()[:120]})

            # default browser curves on deliberate motion
            if re.search(r"transition\s*:\s*[^;{}\n]*\b(?:ease-out|ease-in-out)\s*[;,}]", line) \
                    and "cubic-bezier" not in line and "var(--" not in line:
                add({"rule": "easing-default-curve", "severity": "P1", "scope": "line", "file": rel, "line": n,
                     "message": "built-in easing keywords are too weak for deliberate motion; "
                                "use a token (--ease-out: cubic-bezier(0.16, 1, 0.3, 1))",
                     "code": line.strip()[:120]})

        if file_has_hover and not file_has_press and re.search(r"button|btn|pressable|clickable", txt, re.I):
            add({"rule": "physics-no-press-feedback", "severity": "P1", "scope": "file", "file": rel, "line": 0,
                 "message": "pressable elements styled for :hover with no :active/whileTap - "
                            "no acknowledgement that the interface heard the press",
                 "code": ""})

    # ---- repo-level ----
    if motion_present and not has_reduced_motion:
        add({"rule": "a11y-no-reduced-motion", "severity": "P0", "scope": "repo", "file": "(repo)", "line": 0,
             "message": "motion present with no prefers-reduced-motion handling anywhere in the tree",
             "code": ""})
    elif len(reduced_motion_sites) == 1:
        add({"rule": "a11y-reduced-motion-nuked", "severity": "P2", "scope": "file",
             "file": reduced_motion_sites[0], "line": 0,
             "message": "the only reduced-motion handling is one global block; reduced motion means "
                        "fewer and gentler, not zero - degrade per element and keep the reset as a net",
             "code": ""})

    if ungated_hover_files and not has_hover_gate:
        add({"rule": "a11y-ungated-hover", "severity": "P1", "scope": "repo",
             "file": ", ".join(sorted(ungated_hover_files)[:4]), "line": 0,
             "message": f"hover motion in {len(ungated_hover_files)} file(s) with no "
                        "@media (hover: hover) and (pointer: fine) anywhere - touch taps stick in hover state",
             "code": ""})

    distinct_curves = {k for k in easings if k.startswith("cubic-bezier")}
    distinct_durs = set(durations)
    if len(distinct_curves) > 3:
        add({"rule": "cohesion-token-sprawl", "severity": "P2", "scope": "repo", "file": "(repo)", "line": 0,
             "message": f"{len(distinct_curves)} distinct cubic-bezier curves - "
                        "near-identical curves are decisions nobody made; consolidate into tokens",
             "code": ""})
    if len(distinct_durs) > 6:
        add({"rule": "cohesion-token-sprawl", "severity": "P2", "scope": "repo", "file": "(repo)", "line": 0,
             "message": f"{len(distinct_durs)} distinct durations - "
                        "a duration scale is 3-5 steps, not a list of everything anyone typed",
             "code": ""})

    res["census"] = {
        "durations_ms": dict(sorted(durations.items())),
        "easings": dict(easings.most_common()),
        "distinct_curves": len(distinct_curves),
        "distinct_durations": len(distinct_durs),
        "reduced_motion_sites": len(reduced_motion_sites),
        "hover_gated": has_hover_gate,
    }

    for f in res["findings"]:
        f.setdefault("scope", "line")

    counts = defaultdict(int)
    for f in res["findings"]:
        counts[f["severity"]] += 1
    res["counts"] = dict(counts)
    res["pass"] = counts["P0"] == 0
    return res


def summarize(r, census_only=False):
    L = []
    a = L.append
    c = r["census"]

    if census_only or True:
        a(f"Scanned {r['files_scanned']} files under {r['root']}")
        a("")
        a("CENSUS")
        a(f"  distinct durations : {c['distinct_durations']}  "
          f"{sorted(c['durations_ms'])[:12]}{' ...' if c['distinct_durations'] > 12 else ''}")
        a(f"  distinct curves    : {c['distinct_curves']}")
        a(f"  reduced-motion     : {c['reduced_motion_sites']} site(s)")
        a(f"  hover gated        : {'yes' if c['hover_gated'] else 'NO'}")
        a("")
    if census_only:
        return "\n".join(L)

    if not r["findings"]:
        a("No findings on the machine-checkable rules.")
        a("")
        a("That means nothing on the scanned list is wrong. It does not mean the motion is")
        a("good - purpose, frequency, cohesion and staging are judged, not scanned. Read")
        a("references/motion-rules.md §3, §10, §11 and report those separately.")
        return "\n".join(L)

    order = {"P0": 0, "P1": 1, "P2": 2}
    a("FINDINGS")
    for f in sorted(r["findings"], key=lambda x: (order[x["severity"]], x["file"], x["line"])):
        loc = f"{f['file']}:{f['line']}" if f["line"] else f["file"]
        a(f"  {loc} - [{f['rule']}] {f['message']}")
        if f["code"]:
            a(f"      {f['code']}")
    a("")

    by_rule = defaultdict(lambda: [0, ""])
    for f in r["findings"]:
        by_rule[f["rule"]][0] += 1
        by_rule[f["rule"]][1] = f["severity"]
    a("SUMMARY")
    a("  | Rule | Count | Severity |")
    a("  |---|---|---|")
    for rule, (n, sev) in sorted(by_rule.items(), key=lambda kv: (order[kv[1][1]], -kv[1][0])):
        a(f"  | `{rule}` | {n} | {sev} |")
    a("")
    a(f"  {dict(r['counts'])}  ->  {'PASS' if r['pass'] else 'FAIL (P0 present)'}")
    a("")
    a("  Still to judge by hand: purpose & frequency (motion-rules.md §3), cohesion (§10),")
    a("  staging (§11), and the missed-opportunity list (§14).")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser(description="Evaluate motion against references/motion-rules.md")
    ap.add_argument("path")
    ap.add_argument("--json", dest="out")
    ap.add_argument("--census", action="store_true", help="inventory only, no findings")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    if not os.path.isdir(args.path):
        sys.exit(f"not a directory: {args.path}")
    r = scan(args.path)
    if args.out:
        with open(args.out, "w") as f:
            json.dump(r, f, indent=2)
        if not args.quiet:
            print(f"wrote {args.out}")
    if not args.quiet:
        print(summarize(r, census_only=args.census))
    sys.exit(0 if r["pass"] or args.census else 1)


def _selfcheck():
    """python motion.py --selfcheck  - asserts the rules fire on known-bad input."""
    import tempfile
    bad = """
.card { transition: all 420ms ease-in; }
.pop  { transform-origin: center; }
.panel { transition: height 200ms ease-out; }
@keyframes toast-in { from { transform: scale(0); } }
.toast { animation: toast-in 200ms; }
.x { will-change: transform; }
"""
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(os.path.join(d, "components"), exist_ok=True)
        with open(os.path.join(d, "components", "toast.css"), "w") as f:
            f.write(bad)
        with open(os.path.join(d, "components", "dropdown.css"), "w") as f:
            f.write(".menu { transform-origin: center; transition: transform 500ms ease-in; }\n")
        r = scan(d)
        got = {f["rule"] for f in r["findings"]}
        for expect in ("easing-transition-all", "easing-ease-in-on-ui", "timing-over-300ms",
                       "physics-scale-zero", "perf-layout-property", "physics-origin-center",
                       "interrupt-keyframes-on-rapid", "perf-will-change-permanent",
                       "a11y-no-reduced-motion"):
            assert expect in got, f"missed {expect}; got {sorted(got)}"
        assert r["pass"] is False
        # and a clean file stays clean
        with tempfile.TemporaryDirectory() as d2:
            with open(os.path.join(d2, "ok.css"), "w") as f:
                f.write(":root{--ease-out:cubic-bezier(0.23,1,0.32,1)}\n"
                        ".b{transition:transform 160ms var(--ease-out)}\n"
                        ".b:active{transform:scale(0.97)}\n"
                        "@media (hover: hover) and (pointer: fine){.b:hover{transform:scale(1.02)}}\n"
                        "@media (prefers-reduced-motion: reduce){.b{transition:none}}\n"
                        "@media (prefers-reduced-motion: reduce){.c{transition:none}}\n")
            r2 = scan(d2)
            assert r2["pass"], [f["rule"] for f in r2["findings"]]
    print("selfcheck ok")


if __name__ == "__main__":
    if "--selfcheck" in sys.argv:
        _selfcheck()
    else:
        main()
