#!/usr/bin/env python3
"""
score.py — the MEASURED half of a design evaluation.

Takes audit.py output and scores the six dimensions that can be computed from
source. It deliberately does NOT score hierarchy, signature, copy, or taste —
those are judged by Claude with written evidence and reported alongside, never
averaged in. A single blended number would hide which half is real.

Usage:
    python audit.py ./src --json /tmp/a.json --quiet
    python score.py /tmp/a.json [--json out.json]
"""

import argparse
import json
import sys

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# dimension -> max points (measured half totals 100)
WEIGHTS = {
    "color_discipline": 20,
    "type_system": 20,
    "spatial_rhythm": 15,
    "tokenization": 15,
    "motion_craft": 15,
    "distinctiveness": 15,
}

BANDS = [
    (85, "Systematic", "A real design system. Refine, don't rebuild."),
    (70, "Coherent", "Sound underneath; the gaps are specific and cheap to close."),
    (55, "Drifting", "A system existed once. Enforcement lapsed. Surgical pass warranted."),
    (40, "Ad hoc", "Decisions are being made per-component. Consolidate before adding surface."),
    (0, "Unsystematic", "No shared vocabulary. A directional pass is the honest recommendation."),
]


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def score_color(a):
    c = a["color"]
    f = []
    n = c["unique_count"]
    # 8-24 unique colors is a healthy tokenized palette; sprawl is the failure.
    if n <= 6:
        pal, note = 0.75, f"only {n} unique colors — possibly untokenized or very thin"
    elif n <= 26:
        pal, note = 1.0, f"{n} unique colors — within a systematic range"
    elif n <= 60:
        pal, note = 0.55, f"{n} unique colors — palette is sprawling"
    else:
        pal, note = 0.2, f"{n} unique colors — no palette discipline"
    f.append(note)

    chroma_ratio = c["chromatic_count"] / max(c["unique_count"], 1)
    restraint = clamp(1.0 - max(0.0, chroma_ratio - 0.45) * 2.0)
    f.append(f"{c['chromatic_count']} chromatic of {c['unique_count']} "
             f"({chroma_ratio:.0%}) — accents should be a minority")

    samples = c["contrast_samples"]
    if samples:
        fails = sum(1 for s in samples if not s["passes_aa_body"])
        contrast = clamp(1.0 - fails / len(samples))
        if fails:
            worst = samples[0]
            f.append(f"⚠ {fails}/{len(samples)} sampled pairs below 4.5:1 "
                     f"(worst: {worst['fg']} on {worst['bg']} = {worst['ratio']}:1)")
        else:
            f.append("all sampled foreground/background pairs clear 4.5:1")
    else:
        contrast, _ = 0.6, f.append("no contrast pairs could be sampled — verify manually")

    modern = 1.0 if c["oklch_uses"] > 0 else 0.7
    if c["oklch_uses"] == 0:
        f.append("no OKLCH — perceptual lightness stepping unavailable")

    pts = WEIGHTS["color_discipline"] * (pal * .35 + restraint * .2 + contrast * .35 + modern * .1)
    return round(pts, 1), f


def score_type(a):
    t = a["type"]
    f = []
    fc = t["family_count"]
    if fc == 0:
        fam, note = 0.5, "no font-family declarations found — inherited or framework-default"
    elif fc == 1:
        fam, note = 0.65, "single typeface — functional, but no display/body distinction"
    elif fc <= 3:
        fam, note = 1.0, f"{fc} families — a deliberate pairing"
    elif fc <= 5:
        fam, note = 0.6, f"{fc} families — drifting"
    else:
        fam, note = 0.25, f"{fc} families — no typographic system"
    f.append(note)

    sc = t["size_count"]
    if sc == 0:
        scale, note = 0.5, "no explicit font sizes — likely utility classes; verify the scale manually"
    elif sc <= 9:
        scale, note = 1.0, f"{sc} distinct sizes — a real scale"
    elif sc <= 14:
        scale, note = 0.65, f"{sc} distinct sizes — scale is loosening"
    else:
        scale, note = 0.25, f"{sc} distinct sizes — sizes are chosen per-component, not from a scale"
    f.append(note)

    ratios = [r for r in t.get("scale_ratios", []) if 1.02 <= r <= 2.2]
    if ratios:
        spread = max(ratios) - min(ratios)
        consist = clamp(1.0 - spread / 0.6)
        f.append(f"step ratios {min(ratios):.2f}–{max(ratios):.2f} — "
                 f"{'consistent' if spread < 0.25 else 'irregular; no single ratio governs the scale'}")
    else:
        consist = 0.5
        f.append("could not derive step ratios")

    pts = WEIGHTS["type_system"] * (fam * .4 + scale * .35 + consist * .25)
    return round(pts, 1), f


def score_space(a):
    s = a["space"]
    f = []
    unit = s["base_unit"]
    if unit:
        base = 1.0 if unit in (4, 8) else 0.75
        f.append(f"base unit {unit}px detected")
    else:
        base = 0.2
        f.append("no base unit detected — spacing is arbitrary")

    n = s["unique_count"]
    if n <= 12:
        density, note = 1.0, f"{n} spacing values — a tight scale"
    elif n <= 22:
        density, note = 0.7, f"{n} spacing values — loose but workable"
    else:
        density, note = 0.3, f"{n} spacing values — spacing is improvised per-component"
    f.append(note)

    og = len(s["off_grid"])
    grid = clamp(1.0 - og / 12.0)
    if og:
        f.append(f"{og} off-grid values: {s['off_grid'][:8]}")

    pts = WEIGHTS["spatial_rhythm"] * (base * .4 + density * .3 + grid * .3)
    return round(pts, 1), f


def score_tokens(a):
    sy, sh = a["system"], a["shape"]
    f = []
    defined = sy["css_vars_defined"]
    if defined == 0:
        var, note = 0.15, "no CSS custom properties — every value is hardcoded"
    elif defined < 12:
        var, note = 0.55, f"{defined} custom properties — partial tokenization"
    else:
        var, note = 1.0, f"{defined} custom properties defined, {sy['css_vars_used']} referenced"
    f.append(note)
    if sy["css_vars_unused"]:
        f.append(f"{len(sy['css_vars_unused'])} defined but never referenced: {sy['css_vars_unused'][:5]}")

    rv, sv = sh["radius_variants"], sh["shadow_variants"]
    shape = clamp(1.0 - max(0, rv - 5) / 12.0) * 0.5 + clamp(1.0 - max(0, sv - 4) / 10.0) * 0.5
    f.append(f"{rv} radius variants, {sv} shadow variants "
             f"({'systematic' if rv <= 5 and sv <= 4 else 'ad hoc — elevation carries no meaning'})")

    zi = sh["zindex_variants"]
    if zi > 8 or (sh["zindex_max"] or 0) > 1000:
        f.append(f"⚠ {zi} z-index values, max {sh['zindex_max']} — stacking is being fought, not designed")
    layer = clamp(1.0 - max(0, zi - 6) / 10.0)

    esc = sy["important_uses"] + sy["tailwind_arbitrary_values"] // 4
    escape = clamp(1.0 - esc / 40.0)
    if sy["important_uses"] or sy["tailwind_arbitrary_values"] > 20:
        f.append(f"{sy['important_uses']} !important, {sy['tailwind_arbitrary_values']} arbitrary values "
                 f"— the system is being escaped")

    pts = WEIGHTS["tokenization"] * (var * .4 + shape * .25 + layer * .15 + escape * .2)
    return round(pts, 1), f


def score_motion(a):
    m = a["motion"]
    f = []
    if m["duration_variants"] == 0 and not m["libraries"]:
        f.append("no motion detected — stillness is a valid direction, but confirm it's a choice")
        return round(WEIGHTS["motion_craft"] * 0.55, 1), f

    ce, de = m["custom_easing_uses"], m["default_easing_uses"]
    tot = ce + de
    ease = clamp(ce / tot) if tot else 0.4
    f.append(f"easing: {ce} custom curves vs {de} CSS defaults — "
             f"{'curves are authored' if ease > 0.5 else 'mostly browser defaults; the feel is unauthored'}")

    dv = m["duration_variants"]
    if dv <= 6:
        dur, note = 1.0, f"{dv} duration values — a motion scale exists"
    elif dv <= 12:
        dur, note = 0.6, f"{dv} duration values — loosening"
    else:
        dur, note = 0.25, f"{dv} duration values — durations picked per-component"
    f.append(note)

    slow = m["durations_over_400ms"]
    speed = clamp(1.0 - len(slow) / 8.0)
    if slow:
        f.append(f"⚠ {len(slow)} durations over 400ms: {slow[:8]} — UI transitions past ~300ms read as sluggish")

    rm = 1.0 if m["reduced_motion_handled"] else 0.0
    f.append("prefers-reduced-motion handled" if rm else
             "⚠ prefers-reduced-motion NOT handled — accessibility failure, not a nicety")

    pts = WEIGHTS["motion_craft"] * (ease * .3 + dur * .2 + speed * .2 + rm * .3)
    return round(pts, 1), f


def score_distinct(a):
    tells = a["tells"]
    f = []
    if not tells:
        f.append("no recognizable generated-design tells detected in source")
    for t in tells:
        f.append(f"⚠ {t['label']} — {', '.join(t['files'][:3])}")
    # each tell costs; five or more zeroes the dimension
    pts = WEIGHTS["distinctiveness"] * clamp(1.0 - len(tells) / 5.0)
    return round(pts, 1), f


def band(total):
    for cut, name, advice in BANDS:
        if total >= cut:
            return name, advice
    return BANDS[-1][1], BANDS[-1][2]


def run(a):
    parts = {
        "color_discipline": score_color(a),
        "type_system": score_type(a),
        "spatial_rhythm": score_space(a),
        "tokenization": score_tokens(a),
        "motion_craft": score_motion(a),
        "distinctiveness": score_distinct(a),
    }
    total = round(sum(p[0] for p in parts.values()), 1)
    name, advice = band(total)
    return {
        "measured_score": total,
        "band": name,
        "recommendation": advice,
        "dimensions": {k: {"score": v[0], "max": WEIGHTS[k], "findings": v[1]}
                       for k, v in parts.items()},
        "judged_dimensions_not_scored_here": [
            "hierarchy — does attention land in the intended order",
            "signature — is there one memorable element",
            "content fit — does density match what the content demands",
            "copy — does the writing carry its weight",
            "state coverage — empty, loading, error, overflow",
            "concept — is there a thesis, or only defaults",
        ],
    }


def render(r):
    L = [f"MEASURED SCORE  {r['measured_score']} / 100   ({r['band']})",
         f"                {r['recommendation']}", ""]
    for k, d in r["dimensions"].items():
        bar_len = int(round(d["score"] / d["max"] * 20)) if d["max"] else 0
        bar = "█" * bar_len + "·" * (20 - bar_len)
        L.append(f"{k.replace('_', ' ').title():<18} {d['score']:>5.1f}/{d['max']:<3} {bar}")
        for fnd in d["findings"]:
            L.append(f"    {fnd}")
        L.append("")
    L.append("NOT MEASURED — judge these yourself, with evidence, and report separately:")
    for j in r["judged_dimensions_not_scored_here"]:
        L.append(f"    · {j}")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audit_json")
    ap.add_argument("--json", dest="out")
    args = ap.parse_args()
    try:
        with open(args.audit_json) as f:
            a = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        sys.exit(f"could not read audit json: {e}")
    r = run(a)
    if args.out:
        if args.out == "-":
            print(json.dumps(r, indent=2))
            return
        with open(args.out, "w") as f:
            json.dump(r, f, indent=2)
    print(render(r))


if __name__ == "__main__":
    main()
