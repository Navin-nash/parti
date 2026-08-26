#!/usr/bin/env python3
"""
audit.py — extract the de-facto design system from a codebase.

Reads CSS/SCSS/JS/TS/JSX/TSX/HTML/Vue/Svelte + package.json and reports what the
design system ACTUALLY is, as opposed to what anyone thinks it is. Output feeds
score.py and the DESIGN.md generation step.

Usage:
    python audit.py <path> [--json out.json] [--quiet]

Stdlib only. Never writes to the scanned project.
"""

import argparse
import json
import os
import re
import sys
from collections import Counter, defaultdict

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

CODE_EXT = {".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx",
            ".html", ".vue", ".svelte", ".astro", ".mdx"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "out",
             "coverage", "vendor", ".venv", "venv", "__pycache__", ".turbo",
             ".cache", "public/assets", ".svelte-kit"}
MAX_FILE_BYTES = 2_000_000

# ---------------------------------------------------------------- patterns

RE_HEX = re.compile(r"#([0-9a-fA-F]{3,8})\b")
RE_RGB = re.compile(r"rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)")
RE_HSL = re.compile(r"hsla?\(\s*([\d.]+)")
RE_OKLCH = re.compile(r"oklch\(", re.I)
RE_FONT_FAMILY = re.compile(r"font-family\s*:\s*([^;{}\n]+)", re.I)
RE_TW_FONT = re.compile(r"fontFamily\s*:\s*\{([^}]*)\}", re.S)
RE_NEXT_FONT = re.compile(r"from\s+['\"]next/font/(google|local)['\"]")
RE_FONT_IMPORT = re.compile(r"import\s*\{\s*([A-Z][A-Za-z0-9_,\s]*)\}\s*from\s*['\"]next/font/google['\"]")
RE_GFONT_LINK = re.compile(r"fonts\.googleapis\.com/css2?\?family=([^&\"'\s]+)")
RE_FONT_SIZE = re.compile(r"font-size\s*:\s*([\d.]+)(px|rem|em)", re.I)
RE_RADIUS = re.compile(r"border-radius\s*:\s*([^;{}\n]+)", re.I)
RE_SHADOW = re.compile(r"box-shadow\s*:\s*([^;{}\n]+)", re.I)
RE_SPACING = re.compile(r"(?:margin|padding|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|inline|block))?\s*:\s*([^;{}\n]+)", re.I)
# Spacing declared as a token: --s-4: 16px, --space-2: 0.5rem, --gap-lg: 24px
RE_SPACE_TOKEN = re.compile(r"(--(?:s|sp|space|spacing|gap|size)-[a-z0-9]+)\s*:\s*([^;{}\n]+)", re.I)
RE_LEN = re.compile(r"(-?[\d.]+)(px|rem)")
RE_DURATION = re.compile(r"(?:transition-duration|animation-duration)\s*:\s*([\d.]+)(m?s)", re.I)
RE_TRANSITION_SHORT = re.compile(r"transition\s*:\s*([^;{}\n]+)", re.I)
RE_EASING = re.compile(r"cubic-bezier\([^)]*\)|\bease-in-out\b|\bease-in\b|\bease-out\b|\bease\b|\blinear\b|\bsteps\(", re.I)
RE_CSSVAR_DEF = re.compile(r"(--[a-zA-Z0-9_-]+)\s*:")
RE_CSSVAR_USE = re.compile(r"var\(\s*(--[a-zA-Z0-9_-]+)")
RE_REDUCED_MOTION = re.compile(r"prefers-reduced-motion|useReducedMotion|MotionConfig|matchMedia\(", re.I)
RE_FOCUS_KILL = re.compile(r"outline\s*:\s*(?:none|0)\b", re.I)
RE_BACKDROP = re.compile(r"backdrop-filter\s*:|backdrop-blur", re.I)
RE_TW_ARBITRARY = re.compile(r"(?:^|[\s\"'`])(?:[a-z-]+)-\[[^\]]+\]")
RE_IMPORTANT = re.compile(r"!important")
RE_ZINDEX = re.compile(r"z-index\s*:\s*(-?\d+)", re.I)

ANIM_LIBS = {
    "motion": ["motion", "framer-motion"],
    "gsap": ["gsap", "@gsap/react"],
    "lenis": ["lenis", "@studio-freight/lenis"],
    "react-spring": ["@react-spring/web", "react-spring"],
    "lottie": ["lottie-web", "lottie-react", "@lottiefiles/dotlottie-react"],
    "rive": ["@rive-app/react-canvas", "@rive-app/canvas"],
    "three": ["three", "@react-three/fiber", "@react-three/drei"],
    "auto-animate": ["@formkit/auto-animate"],
    "tailwindcss-animate": ["tailwindcss-animate", "tw-animate-css"],
    "anime": ["animejs"],
    "popmotion": ["popmotion"],
}
UI_LIBS = {
    "radix": ["@radix-ui/react-dialog", "@radix-ui/themes", "radix-ui"],
    "shadcn": ["class-variance-authority"],
    "mui": ["@mui/material"],
    "chakra": ["@chakra-ui/react"],
    "antd": ["antd"],
    "mantine": ["@mantine/core"],
    "bootstrap": ["bootstrap", "react-bootstrap"],
    "headlessui": ["@headlessui/react"],
    "tailwind": ["tailwindcss"],
    "styled-components": ["styled-components"],
    "emotion": ["@emotion/react"],
}

# Anti-slop tells detectable from source text. (id, human label, regex)
TELLS = [
    ("ai_cream", "AI-cream palette (#F4F1EA-family bg + terracotta accent)",
     re.compile(r"#(?:F4F1EA|FAF9F6|FDFCF8|F5F1E8|FAF8F3)\b", re.I)),
    ("terracotta", "The terracotta/clay accent (#D97757 family)",
     re.compile(r"#(?:D97757|C15F3C|E07A5F|CC785C|D97706)\b", re.I)),
    ("purple_blue_gradient", "Purple-to-blue gradient",
     re.compile(r"(?:from-(?:purple|violet|indigo|fuchsia)-\d{3}[^\"'`]{0,40}to-(?:blue|indigo|cyan|sky)-\d{3})|(?:linear-gradient\([^)]*#(?:6366F1|8B5CF6|A855F7|7C3AED)[^)]*#(?:3B82F6|2563EB|06B6D4))", re.I)),
    ("inter_only", "Inter/Geist/DM Sans as the only typeface",
     re.compile(r"\b(?:Inter|Geist|DM[_ ]Sans|Plus[_ ]Jakarta[_ ]Sans)\b")),
    ("glass_card", "Glassmorphic card (backdrop-blur + translucent bg)",
     re.compile(r"backdrop-blur[^\"'`]{0,60}bg-white/\d|backdrop-filter\s*:\s*blur", re.I)),
    ("mesh_gradient", "Animated gradient mesh / blob background",
     re.compile(r"(?:blur-3xl[^\"'`]{0,80}rounded-full)|mesh-?gradient|animate-blob", re.I)),
    ("icon_tile", "Rounded-square gradient icon tile above headings",
     re.compile(r"class(?:Name)?=[\"'`](?=[^\"'`]*(?:w-1[024]\b|size-1[024]\b))"
                r"(?=[^\"'`]*rounded-(?:lg|xl|2xl|md))"
                r"(?=[^\"'`]*bg-gradient)[^\"'`]{0,240}[\"'`]", re.I)),
    ("numbering", "01 / 02 / 03 markers",
     re.compile(r">\s*0[1-9]\s*<|['\"]0[1-9]['\"]\s*,\s*['\"]0[2-9]['\"]")),
    ("kpi_row", "Four-box KPI row with up-arrow deltas",
     re.compile(r"(?:TrendingUp|ArrowUpRight)[^\"'`]{0,200}(?:text-green-|text-emerald-)", re.I)),
    ("gray_on_color", "Mid-gray body text (#6B7280 family) as default",
     re.compile(r"#(?:6B7280|9CA3AF|8A8F98|71717A)\b|text-gray-(?:400|500)\b", re.I)),
    ("fade_up_all", "Fade-up-on-scroll applied uniformly",
     re.compile(r"(?:opacity:\s*0[^}]{0,80}(?:translateY|y:\s*)\s*\(?\s*[12]?\d(?:px)?)|whileInView", re.I)),
    ("emoji_icons", "Emoji used as interface icons",
     re.compile(r"['\"`](?:\U0001F300-\U0001FAFF|\u2700-\u27BF)['\"`]")),
    ("nested_cards", "Cards nested inside cards",
     re.compile(r"rounded-(?:lg|xl|2xl)[^>]{0,80}\bborder\b.{0,160}?rounded-(?:lg|xl|2xl)[^>]{0,80}\bborder\b", re.I | re.S)),
    ("three_word_heading", "'Powerful. Simple. Fast.'-style empty headlines",
     re.compile(r">\s*\w+\.\s+\w+\.\s+\w+\.\s*<")),
]


def norm_hex(h):
    h = h.lower()
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) == 4:
        h = "".join(c * 2 for c in h[:3])
    if len(h) == 8:
        h = h[:6]
    return "#" + h[:6]


def rel_lum(hex_color):
    r, g, b = (int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)


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


def to_px(val, unit):
    return float(val) * (16.0 if unit == "rem" else 1.0)


def audit(root):
    res = {
        "root": os.path.abspath(root),
        "files_scanned": 0,
        "color": {}, "type": {}, "space": {}, "shape": {},
        "motion": {}, "system": {}, "a11y": {}, "tells": [], "libraries": {},
    }

    colors = Counter()
    fams = Counter()
    sizes = Counter()
    radii = Counter()
    shadows = Counter()
    spacing = Counter()
    durations = Counter()
    easings = Counter()
    var_defs = set()
    var_uses = Counter()
    zindex = Counter()
    tell_hits = defaultdict(list)
    oklch = 0
    hsl = 0
    reduced_motion_files = set()
    focus_kill = 0
    important = 0
    tw_arbitrary = 0
    backdrop = 0
    gfonts = set()

    for path in iter_files(root):
        txt = read(path)
        if not txt:
            continue
        res["files_scanned"] += 1
        rel = os.path.relpath(path, root)

        for m in RE_HEX.finditer(txt):
            h = m.group(1)
            if len(h) in (3, 4, 6, 8):
                colors[norm_hex(h)] += 1
        for m in RE_RGB.finditer(txt):
            try:
                r, g, b = (int(round(float(x))) for x in m.groups())
                colors["#%02x%02x%02x" % (min(r, 255), min(g, 255), min(b, 255))] += 1
            except ValueError:
                pass
        hsl += len(RE_HSL.findall(txt))
        oklch += len(RE_OKLCH.findall(txt))

        for m in RE_FONT_FAMILY.finditer(txt):
            first = m.group(1).split(",")[0].strip().strip("'\"")
            if first and not first.startswith("var(") and len(first) < 40:
                fams[first] += 1
        for m in RE_FONT_IMPORT.finditer(txt):
            for name in m.group(1).split(","):
                name = name.strip()
                if name:
                    fams[name.replace("_", " ")] += 1
        for m in RE_GFONT_LINK.finditer(txt):
            for fam in m.group(1).split("&family="):
                gfonts.add(fam.split(":")[0].replace("+", " "))
        for m in RE_TW_FONT.finditer(txt):
            for q in re.findall(r"['\"]([A-Z][A-Za-z0-9 _-]{2,30})['\"]", m.group(1)):
                fams[q] += 1

        for m in RE_FONT_SIZE.finditer(txt):
            sizes[round(to_px(m.group(1), m.group(2).lower()), 2)] += 1
        for m in RE_RADIUS.finditer(txt):
            radii[m.group(1).strip()[:32]] += 1
        for m in RE_SHADOW.finditer(txt):
            shadows[re.sub(r"\s+", " ", m.group(1).strip())[:70]] += 1
        for m in RE_SPACING.finditer(txt):
            for val, unit in RE_LEN.findall(m.group(1)):
                px = round(to_px(val, unit.lower()), 2)
                if 0 < px <= 400:
                    spacing[px] += 1
        # Tokenized scales define spacing on the variable, not at the use site.
        # Without this a well-tokenized system reads as having no spacing scale.
        for m in RE_SPACE_TOKEN.finditer(txt):
            for val, unit in RE_LEN.findall(m.group(2)):
                px = round(to_px(val, unit.lower()), 2)
                if 0 < px <= 400:
                    spacing[px] += 1

        for m in RE_DURATION.finditer(txt):
            ms = float(m.group(1)) * (1000 if m.group(2).lower() == "s" else 1)
            durations[int(ms)] += 1
        for m in RE_TRANSITION_SHORT.finditer(txt):
            seg = m.group(1)
            for val, unit in re.findall(r"([\d.]+)(m?s)", seg):
                ms = float(val) * (1000 if unit == "s" else 1)
                durations[int(ms)] += 1
        for m in RE_EASING.finditer(txt):
            easings[m.group(0).lower().replace(" ", "")] += 1

        for m in RE_CSSVAR_DEF.finditer(txt):
            var_defs.add(m.group(1))
        for m in RE_CSSVAR_USE.finditer(txt):
            var_uses[m.group(1)] += 1
        for m in RE_ZINDEX.finditer(txt):
            zindex[int(m.group(1))] += 1

        if RE_REDUCED_MOTION.search(txt):
            reduced_motion_files.add(rel)
        focus_kill += len(RE_FOCUS_KILL.findall(txt))
        important += len(RE_IMPORTANT.findall(txt))
        tw_arbitrary += len(RE_TW_ARBITRARY.findall(txt))
        backdrop += len(RE_BACKDROP.findall(txt))

        for tid, label, rx in TELLS:
            if rx.search(txt) and len(tell_hits[tid]) < 6:
                tell_hits[tid].append(rel)

    # package.json
    libs = {"animation": [], "ui": [], "declared": {}}
    for cand in ("package.json", "apps/web/package.json", "frontend/package.json",
                 "web/package.json", "client/package.json"):
        pj = os.path.join(root, cand)
        if os.path.exists(pj):
            try:
                data = json.loads(read(pj))
            except json.JSONDecodeError:
                continue
            deps = {}
            deps.update(data.get("dependencies") or {})
            deps.update(data.get("devDependencies") or {})
            libs["declared"].update(deps)
            for name, pkgs in ANIM_LIBS.items():
                if any(p in deps for p in pkgs) and name not in libs["animation"]:
                    libs["animation"].append(name)
            for name, pkgs in UI_LIBS.items():
                if any(p in deps for p in pkgs) and name not in libs["ui"]:
                    libs["ui"].append(name)
            break
    libs["declared"] = {k: v for k, v in libs["declared"].items()
                        if any(k in p for p in sum(ANIM_LIBS.values(), []) + sum(UI_LIBS.values(), []))}
    res["libraries"] = libs

    # ---- color
    top_colors = colors.most_common(40)
    neutral = [c for c, _ in top_colors if _is_neutral(c)]
    chromatic = [c for c, _ in top_colors if not _is_neutral(c)]
    res["color"] = {
        "unique_count": len(colors),
        "top": [{"hex": c, "uses": n} for c, n in top_colors[:20]],
        "neutral_count": len(neutral),
        "chromatic_count": len(chromatic),
        "oklch_uses": oklch,
        "hsl_uses": hsl,
        "contrast_samples": _contrast_samples(top_colors),
    }

    # ---- type
    res["type"] = {
        "families": [{"name": f, "uses": n} for f, n in fams.most_common(12)],
        "family_count": len(fams),
        "google_fonts": sorted(gfonts),
        "size_count": len(sizes),
        "sizes_px": sorted(sizes.keys()),
        "scale_ratios": _ratios(sorted(sizes.keys())),
    }

    # ---- space
    sp = sorted(spacing.keys())
    res["space"] = {
        "unique_count": len(sp),
        "values_px": sp[:60],
        "base_unit": _base_unit(sp),
        "off_grid": _off_grid(sp),
    }

    # ---- shape
    res["shape"] = {
        "radius_variants": len(radii),
        "radii": [{"value": v, "uses": n} for v, n in radii.most_common(12)],
        "shadow_variants": len(shadows),
        "shadows": [{"value": v, "uses": n} for v, n in shadows.most_common(8)],
        "zindex_variants": len(zindex),
        "zindex_max": max(zindex) if zindex else None,
    }

    # ---- motion
    dur_list = sorted(durations.keys())
    custom_ease = sum(n for e, n in easings.items() if e.startswith("cubic-bezier"))
    default_ease = sum(n for e, n in easings.items() if e in {"ease", "ease-in-out", "ease-in", "ease-out", "linear"})
    res["motion"] = {
        "libraries": libs["animation"],
        "duration_variants": len(dur_list),
        "durations_ms": dur_list[:40],
        "durations_over_400ms": [d for d in dur_list if d > 400],
        "custom_easing_uses": custom_ease,
        "default_easing_uses": default_ease,
        "easings": dict(easings.most_common(10)),
        "reduced_motion_handled": len(reduced_motion_files) > 0,
        "reduced_motion_files": sorted(reduced_motion_files)[:8],
    }

    # ---- system
    unused = sorted(v for v in var_defs if v not in var_uses)
    res["system"] = {
        "css_vars_defined": len(var_defs),
        "css_vars_used": len(var_uses),
        "css_vars_unused": unused[:20],
        "tailwind_arbitrary_values": tw_arbitrary,
        "important_uses": important,
        "tokenization_ratio": round(len(var_uses) / max(len(colors) + len(sizes) + len(sp), 1), 3),
    }

    # ---- a11y
    res["a11y"] = {
        "outline_none_uses": focus_kill,
        "backdrop_filter_uses": backdrop,
        "reduced_motion_handled": res["motion"]["reduced_motion_handled"],
        "low_contrast_pairs": [c for c in res["color"]["contrast_samples"] if c["ratio"] < 4.5],
    }

    # ---- tells
    for tid, label, _ in TELLS:
        if tid in tell_hits:
            res["tells"].append({"id": tid, "label": label, "files": tell_hits[tid]})

    return res


def _is_neutral(hexc):
    r, g, b = (int(hexc[i:i + 2], 16) for i in (1, 3, 5))
    return (max(r, g, b) - min(r, g, b)) <= 12


def _contrast_samples(top_colors):
    """Pair the most-used light colors against the most-used dark ones."""
    cols = [c for c, _ in top_colors[:14]]
    lights = [c for c in cols if rel_lum(c) > 0.6][:3]
    darks = [c for c in cols if rel_lum(c) < 0.6][:5]
    out = []
    for lt in lights:
        for dk in darks:
            out.append({"fg": dk, "bg": lt, "ratio": contrast(dk, lt),
                        "passes_aa_body": contrast(dk, lt) >= 4.5})
    return sorted(out, key=lambda x: x["ratio"])[:12]


def _ratios(sizes):
    sizes = [s for s in sizes if 8 <= s <= 200]
    return [round(b / a, 3) for a, b in zip(sizes, sizes[1:]) if a > 0][:20]


def _base_unit(sp):
    # 2px and 3px "grids" are indistinguishable from no grid at all — a base unit
    # only means something if it constrains choices.
    for unit in (8, 4, 6, 5):
        vals = [v for v in sp if v >= unit]
        if vals and sum(1 for v in vals if abs(v % unit) < 0.01) / len(vals) >= 0.8:
            return unit
    return None


def _off_grid(sp):
    unit = _base_unit(sp)
    if not unit:
        return sp[:20]
    return [v for v in sp if abs(v % unit) >= 0.01][:20]


def summarize(r):
    L = []
    a = L.append
    a(f"Scanned {r['files_scanned']} files under {r['root']}\n")
    c, t, s, sh, m, sy = r["color"], r["type"], r["space"], r["shape"], r["motion"], r["system"]
    a(f"COLOR    {c['unique_count']} unique · {c['chromatic_count']} chromatic · "
      f"oklch:{c['oklch_uses']} hsl:{c['hsl_uses']}")
    for x in c["top"][:6]:
        a(f"         {x['hex']}  ×{x['uses']}")
    low = [x for x in c["contrast_samples"] if not x["passes_aa_body"]]
    if low:
        a(f"         ⚠ {len(low)} sampled pairs below 4.5:1 (worst {low[0]['fg']} on {low[0]['bg']} = {low[0]['ratio']}:1)")
    a(f"TYPE     {t['family_count']} families: {', '.join(f['name'] for f in t['families'][:5]) or '—'}")
    a(f"         {t['size_count']} distinct sizes: {t['sizes_px'][:12]}")
    a(f"SPACE    {s['unique_count']} values · base unit {s['base_unit'] or 'none detected'} · "
      f"{len(s['off_grid'])} off-grid")
    a(f"SHAPE    {sh['radius_variants']} radii · {sh['shadow_variants']} shadows · "
      f"{sh['zindex_variants']} z-index values (max {sh['zindex_max']})")
    a(f"MOTION   libs: {', '.join(m['libraries']) or 'none'} · {m['duration_variants']} durations "
      f"· custom easing {m['custom_easing_uses']} vs default {m['default_easing_uses']}")
    a(f"         reduced-motion handled: {m['reduced_motion_handled']}")
    a(f"SYSTEM   {sy['css_vars_defined']} vars defined / {sy['css_vars_used']} used · "
      f"{sy['tailwind_arbitrary_values']} arbitrary TW values · {sy['important_uses']} !important")
    a(f"A11Y     outline:none ×{r['a11y']['outline_none_uses']} · backdrop-filter ×{r['a11y']['backdrop_filter_uses']}")
    a(f"\nTELLS    {len(r['tells'])} detected")
    for tl in r["tells"]:
        a(f"         • {tl['label']}  →  {', '.join(tl['files'][:3])}")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--json", dest="out")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    if not os.path.isdir(args.path):
        sys.exit(f"not a directory: {args.path}")
    r = audit(args.path)
    if args.out:
        with open(args.out, "w") as f:
            json.dump(r, f, indent=2)
        if not args.quiet:
            print(f"wrote {args.out}")
    if not args.quiet:
        print(summarize(r))


if __name__ == "__main__":
    main()
