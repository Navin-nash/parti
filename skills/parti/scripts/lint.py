#!/usr/bin/env python3
"""
lint.py — verify built UI code against the tokens it was supposed to follow.

Two things this checks that a visual review can't, reliably:

1. Build-time anti-slop tells — the subset of this skill's tell catalog
   (see references/bans.md) that only shows up once markup/CSS actually
   exists: untouched shadcn, missing alt text, focus killed with no
   replacement, lorem left in place. audit.py catches the concept-level
   tells at plan time; this catches the construction-level ones at build time.
2. TOKEN DRIFT — hex colors used in the build that don't appear in the token
   spec it was handed. A direction can pass every visual check and still have
   quietly invented three colors nobody chose. No visual review catches this
   reliably; this script checks it deterministically.
3. Countable ship-floor tells — h-screen, transition:all, em dashes, Inter/Geist
   as the only family (unless DESIGN.md declared them), eyebrow clustering,
   cloned three-column feature cards. These are regression guards, not a design
   quality score. Do not use this output (or score.py) to pick the "better"
   direction.

Usage:
    python lint.py <path>                              # tell scan only
    python lint.py <path> --tokens tokens.json          # + drift check
    python lint.py <path> --json out.json --quiet       # for CI
    python lint.py <path> --ignore "arms/*/baseline.tsx" # skip a comparison arm

tokens.json may be flat ({"--bg": "#FAF9F6", ...}) or nested per theme
({"light": {...}, "dark": {...}}) — the two-layer shape references/tokens.md
prescribes. Hex values are collected from any depth; non-colour metadata is
ignored. Exit code is 1 if any P0 finding exists, so this can gate a build step.

Stdlib only. Never writes to the scanned project.
"""

import argparse
import fnmatch
import json
import os
import re
import sys
from collections import defaultdict

CODE_EXT = {".css", ".scss", ".less", ".js", ".jsx", ".ts", ".tsx",
            ".html", ".vue", ".svelte", ".astro"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", ".nuxt", "out",
             "coverage", "vendor", ".venv", "venv", "__pycache__", ".turbo", ".cache"}
MAX_FILE_BYTES = 2_000_000

RE_HEX = re.compile(r"#([0-9a-fA-F]{3,8})\b")
RE_IMG_NO_ALT = re.compile(r"<img(?![^>]*\balt=)[^>]*>", re.I)
RE_FOCUS_KILL = re.compile(r"outline\s*:\s*(?:none|0)\b|\boutline-none\b", re.I)
RE_FOCUS_RING = re.compile(r":focus\b|focus:|focus-visible", re.I)
RE_LOREM = re.compile(r"lorem ipsum|feature one|feature two|\bfoo\s+bar\b", re.I)
RE_GET_STARTED = re.compile(r"\bget started\b", re.I)
RE_LEARN_MORE = re.compile(r"\blearn more\b", re.I)
RE_HSCREEN = re.compile(r"\bh-screen\b|(?<!min-)height\s*:\s*100vh\b", re.I)
RE_TRANS_ALL = re.compile(r"transition\s*:\s*all\b|\btransition-all\b", re.I)
RE_EMDASH = re.compile(r"—|&mdash;|&#8212;")
RE_EYEBROW = re.compile(
    r"uppercase[^\"'`\n]{0,100}tracking-(?:\[|[a-z])|tracking-(?:\[|[a-z0-9]+)[^\"'`\n]{0,100}uppercase",
    re.I,
)
RE_GRID_COLS_3 = re.compile(r"\bgrid-cols-3\b")
RE_FEATURE_CARD = re.compile(
    r"rounded-(?:lg|xl|2xl)[^>\"'`]{0,60}[\"'`][^>]*>\s*<h[23]\b",
    re.I,
)
RE_FONT_FAMILY = re.compile(r"font-family\s*:\s*([^;{}]+)", re.I)
GENERIC_FACE = re.compile(
    r"^(?:sans-serif|serif|monospace|system-ui|ui-sans-serif|ui-serif|"
    r"ui-monospace|emoji|math|fangsong|inherit|initial|unset|-apple-system|"
    r"blinkmacsystemfont|segoe ui|helvetica neue|helvetica|arial|georgia)$",
    re.I,
)
DESIGN_MD_CANDIDATES = ("DESIGN.md", "docs/DESIGN.md", ".design/DESIGN.md", "design/DESIGN.md")

# (id, severity, label, regex) — build-construction tells, not concept tells.
# Concept-level tells (palette, layout, copy voice) live in audit.py; these
# are the ones that only exist once code has actually been written.
TELLS = [
    ("purple_blue_gradient", "P0", "Purple-to-blue gradient",
     re.compile(r"(?:from-(?:purple|violet|indigo|fuchsia)-\d{3}[^\"'`]{0,40}to-(?:blue|indigo|cyan|sky)-\d{3})"
                r"|(?:linear-gradient\([^)]*#(?:6366F1|8B5CF6|A855F7|7C3AED)[^)]*#(?:3B82F6|2563EB|06B6D4))", re.I)),
    ("icon_tile", "P1", "Rounded-square gradient icon tile above a heading",
     re.compile(r"class(?:Name)?=[\"'`](?=[^\"'`]*(?:w-1[024]\b|size-1[024]\b))"
                r"(?=[^\"'`]*rounded-(?:lg|xl|2xl|md))(?=[^\"'`]*bg-gradient)[^\"'`]{0,240}[\"'`]", re.I)),
    ("shadow_default", "P2", "Copy-pasted default shadow (`shadow-sm`/`shadow-md`, no override) on 5+ elements",
     re.compile(r"\bshadow-(?:sm|md)\b(?![^\"'`]*\[)", re.I)),
    ("radius_uniform", "P2", "`rounded-2xl` reached for indiscriminately",
     re.compile(r"\brounded-2xl\b")),
    ("emoji_icon", "P1", "Emoji standing in for a UI icon",
     re.compile(r"[\"'`>]\s*[\U0001F300-\U0001FAFF✀-➿]\s*[\"'`<]")),
    ("nested_cards", "P1", "Cards nested inside cards",
     re.compile(r"rounded-(?:lg|xl|2xl)[^>]{0,80}\bborder\b.{0,160}?rounded-(?:lg|xl|2xl)[^>]{0,80}\bborder\b", re.I | re.S)),
    ("numbering", "P2", "01 / 02 / 03 markers on content that may not be a sequence",
     re.compile(r">\s*0[1-9]\s*<")),
    ("ghost_card_stack", "P1", "Border + wide diffuse box-shadow together (the 'ghost card' tell)",
     re.compile(r"border[^;{}\n]{0,20};[^}]{0,80}box-shadow\s*:\s*0\s+\d{1,2}px\s+\d{2,3}px", re.I | re.S)),
    ("radius_extreme", "P2", "border-radius 32px or higher — reads as a UI toy, not a product",
     re.compile(r"border-radius\s*:\s*(3[2-9]|[4-9]\d)px", re.I)),
    ("stripe_accent_border", "P2", "Colored left border-stripe as the only visual accent, applied broadly",
     re.compile(r"border-l(?:eft)?[^;{}\n]{0,10}(?:4|6|8)px[^;{}\n]{0,40}solid", re.I)),
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


RE_STYLE_SCRIPT = re.compile(r"<(style|script)\b[^>]*>.*?</\1\s*>", re.I | re.S)
RE_TEXT_NODE = re.compile(r">[^<]*<", re.S)


def colour_bearing(txt):
    """The part of a file where a hex can actually BE a colour.

    A hex inside visible copy is the page talking *about* a colour, not using
    one - "warm cream, #FAF9F6" in a paragraph arguing against warm cream is
    the clearest case, and it was reported as drift until this existed. Markup
    text nodes are therefore dropped before the hex scan.

    Style and script blocks are text nodes too, and they are exactly where the
    colours live, so they are lifted out and kept first. Files with no tags at
    all (.css, .ts) pass through whole. Only the drift and default-violet scans
    use this; em dashes, lorem and eyebrows are properties of the copy and are
    still read from the full text.
    """
    kept = [m.group(0) for m in RE_STYLE_SCRIPT.finditer(txt)]
    body = RE_STYLE_SCRIPT.sub(" ", txt)
    if "<" not in body:
        return txt
    return RE_TEXT_NODE.sub("><", body) + " " + " ".join(kept)


def load_tokens(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    # Two things have to line up here, and getting either wrong silently empties
    # the allowed set — which reports every color in the codebase as drift while
    # still passing a naive "does it flag the unspec'd one" test:
    #   - RE_HEX needs the leading '#' to match, so validate the restored form;
    #   - norm_hex expects BARE digits (it is fed RE_HEX group(1) at the call
    #     site below), so normalize the stripped form, not the '#'-prefixed one.
    # The walk is recursive because references/tokens.md prescribes a two-layer
    # spec — semantic names resolving to primitives PER THEME — so a real token
    # file nests ({"light": {...}, "dark": {...}}). A flat-only reader silently
    # produced an empty allowed set on exactly the format this skill documents.
    allowed = set()

    def walk(node):
        values = node.values() if isinstance(node, dict) else node
        for v in values:
            if isinstance(v, (dict, list)):
                walk(v)
            elif isinstance(v, str):
                bare = v.lstrip("#")
                if RE_HEX.fullmatch("#" + bare):
                    allowed.add(norm_hex(bare))

    walk(raw)
    return allowed


# The saturated default of generated interfaces. Every model reaches for the same
# indigo-violet band when nothing in the brief points anywhere: Tailwind's indigo-500/600
# and violet-500/600 are the literal values, and the band around them is where the
# hand-picked near-misses land. Detected by hue rather than by hex list so that nudging
# #6366F1 to #6165EE does not evade it - evading a tell is not choosing a colour.
DEFAULT_HUE_LO, DEFAULT_HUE_HI = 234.0, 295.0


def hex_to_hsl(h):
    # norm_hex takes the digits without a leading '#', so strip it before handing
    # over and after: callers here hold either form.
    h = norm_hex(h.lstrip("#")).lstrip("#")
    if len(h) != 6 or any(c not in "0123456789abcdef" for c in h):
        return None
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    mx, mn = max(r, g, b), min(r, g, b)
    light = (mx + mn) / 2
    if mx == mn:
        return 0.0, 0.0, light
    d = mx - mn
    sat = d / (2 - mx - mn) if light > 0.5 else d / (mx + mn)
    if mx == r:
        hue = ((g - b) / d) % 6
    elif mx == g:
        hue = (b - r) / d + 2
    else:
        hue = (r - g) / d + 4
    return hue * 60, sat, light


def is_default_violet(hexv):
    hsl = hex_to_hsl(hexv)
    if not hsl:
        return False
    hue, sat, light = hsl
    # Saturated and mid-toned: a near-black with a violet cast is a tinted neutral,
    # which is a legitimate and common choice. The tell is violet used as the accent.
    return DEFAULT_HUE_LO <= hue <= DEFAULT_HUE_HI and sat >= 0.45 and 0.35 <= light <= 0.80


def design_md_declares_violet(root):
    for name in ("DESIGN.md", "design.md", os.path.join("docs", "DESIGN.md")):
        p = os.path.join(root, name)
        if os.path.exists(p):
            txt = read(p).lower()
            if any(w in txt for w in ("indigo", "violet", "purple")):
                return True
    return False


def design_md_declares_inter_or_geist(root):
    for rel in DESIGN_MD_CANDIDATES:
        p = os.path.join(root, rel)
        if os.path.isfile(p) and re.search(r"\b(Inter|Geist)\b", read(p)):
            return True
    return False


def font_families(txt):
    faces = []
    for m in RE_FONT_FAMILY.finditer(txt):
        for part in m.group(1).split(","):
            raw = part.strip().strip("\"'")
            if raw:
                faces.append(raw)
    return faces


def is_inter_geist_only(families):
    named = []
    saw_inter_geist = False
    for f in families:
        if GENERIC_FACE.match(f):
            continue
        named.append(f)
        if re.search(r"^(Inter|Geist)(\s|$)", f, re.I):
            saw_inter_geist = True
    if not saw_inter_geist or not named:
        return False
    return all(re.search(r"^(Inter|Geist)(\s|$)", f, re.I) for f in named)


def is_ignored(rel, patterns):
    """True if a repo-relative path matches any --ignore glob.

    Two things legitimately live in a scanned tree and are not the build:
    a deliberately-bad comparison arm, and a data module whose STRINGS are
    prose about slop rather than markup containing it. Both trip content
    rules (lorem, focus-killed) on their own quoted text. An ignore list is
    the ordinary linter answer; a rule that tries to guess prose from code
    would be a worse one.
    """
    if not patterns:
        return False
    posix = rel.replace(os.sep, "/")
    return any(fnmatch.fnmatch(posix, pat) for pat in patterns)


def lint(root, tokens_path=None, ignore=()):
    res = {"root": os.path.abspath(root), "files_scanned": 0,
           "findings": [], "counts": defaultdict(int)}
    ignore = tuple(ignore or ())

    allowed = load_tokens(tokens_path) if tokens_path else None
    drift = defaultdict(list)
    shadow_hits = defaultdict(int)
    exempt_inter = design_md_declares_inter_or_geist(root)
    exempt_violet = design_md_declares_violet(root)
    violet_hits = defaultdict(list)
    all_families = []

    for path in iter_files(root):
        rel = os.path.relpath(path, root)
        if is_ignored(rel, ignore):
            continue
        txt = read(path)
        if not txt:
            continue
        res["files_scanned"] += 1

        for m in RE_HEX.finditer(colour_bearing(txt)):
            h = norm_hex(m.group(1))
            if allowed is not None and h not in allowed:
                drift[h].append(rel)
            if not exempt_violet and is_default_violet(h):
                violet_hits[h].append(rel)

        for _m in RE_IMG_NO_ALT.finditer(txt):
            res["findings"].append({"id": "missing_alt", "severity": "P0",
                                     "label": "<img> without alt text", "file": rel})

        if RE_FOCUS_KILL.search(txt) and not RE_FOCUS_RING.search(txt):
            res["findings"].append({"id": "focus_killed", "severity": "P0",
                                     "label": "Focus outline removed with no replacement ring", "file": rel})

        if RE_LOREM.search(txt):
            res["findings"].append({"id": "lorem", "severity": "P0",
                                     "label": "Placeholder copy left in shipped code", "file": rel})

        if RE_GET_STARTED.search(txt) and RE_LEARN_MORE.search(txt):
            res["findings"].append({"id": "generic_cta_pair", "severity": "P1",
                                     "label": "'Get Started' + 'Learn More' - the default CTA pair", "file": rel})

        all_families.extend(font_families(txt))

        if RE_HSCREEN.search(txt):
            res["findings"].append({"id": "h_screen", "severity": "P1",
                                     "label": "h-screen or height:100vh — use min-height: 100dvh", "file": rel})
        if RE_TRANS_ALL.search(txt):
            res["findings"].append({"id": "transition_all", "severity": "P1",
                                     "label": "transition: all / transition-all", "file": rel})
        if RE_EMDASH.search(txt):
            res["findings"].append({"id": "emdash", "severity": "P2",
                                     "label": "Em dash in copy or markup", "file": rel})
        brow = RE_EYEBROW.findall(txt)
        if len(brow) >= 3:
            res["findings"].append({"id": "eyebrow_cluster", "severity": "P1",
                                     "label": f"{len(brow)} uppercase+tracking eyebrows in one file (max ~1 per 3 sections)",
                                     "file": rel})
        if RE_GRID_COLS_3.search(txt) and len(RE_FEATURE_CARD.findall(txt)) >= 3:
            res["findings"].append({"id": "three_equal_cards", "severity": "P2",
                                     "label": "grid-cols-3 with three rounded heading cards", "file": rel})

        for tid, sev, label, rx in TELLS:
            hits = rx.findall(txt)
            if not hits:
                continue
            if tid == "shadow_default":
                shadow_hits[rel] += len(hits)
                continue
            res["findings"].append({"id": tid, "severity": sev, "label": label, "file": rel})

    for rel, n in shadow_hits.items():
        if n >= 5:
            res["findings"].append({"id": "shadow_default", "severity": "P2",
                                     "label": f"Default shadow utility reused {n}x with no override", "file": rel})

    if violet_hits:
        shown = ", ".join(sorted(violet_hits)[:4])
        res["findings"].append({
            "id": "default_violet", "severity": "P1",
            "label": (f"{shown} - the indigo/violet default of generated UI. "
                      "If this is a real brand colour, declare it in DESIGN.md; "
                      "otherwise derive one from the subject."),
            "file": ", ".join(sorted({f for files in violet_hits.values() for f in files})[:4]),
        })

    if not exempt_inter and is_inter_geist_only(all_families):
        res["findings"].append({"id": "inter_geist_only", "severity": "P1",
                                 "label": "Inter or Geist is the only named family (no DESIGN.md exemption)",
                                 "file": "."})

    for hexv, files in drift.items():
        res["findings"].append({"id": "token_drift", "severity": "P0",
                                 "label": f"{hexv} used but not in the token spec", "file": ", ".join(files[:4])})

    for f in res["findings"]:
        res["counts"][f["severity"]] += 1
    res["counts"] = dict(res["counts"])
    res["pass"] = res["counts"].get("P0", 0) == 0
    return res


def summarize(r):
    L = []
    a = L.append
    a(f"Scanned {r['files_scanned']} files under {r['root']}\n")
    if not r["findings"]:
        a("No findings. Clean.")
        return "\n".join(L)
    order = {"P0": 0, "P1": 1, "P2": 2}
    for f in sorted(r["findings"], key=lambda x: order[x["severity"]]):
        a(f"{f['severity']}  {f['label']}")
        a(f"     {f['file']}")
    a(f"\n{r['counts']}  ->  {'PASS' if r['pass'] else 'FAIL (P0 present)'}")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--tokens", dest="tokens", help="tokens.json to check color drift against")
    ap.add_argument("--json", dest="out")
    ap.add_argument("--quiet", action="store_true")
    ap.add_argument("--ignore", action="append", default=[], metavar="GLOB",
                    help="skip paths matching this glob, relative to <path>; repeatable")
    args = ap.parse_args()
    if not os.path.isdir(args.path):
        sys.exit(f"not a directory: {args.path}")
    r = lint(args.path, args.tokens, args.ignore)
    if args.out:
        with open(args.out, "w") as f:
            json.dump(r, f, indent=2)
        if not args.quiet:
            print(f"wrote {args.out}")
    if not args.quiet:
        print(summarize(r))
    sys.exit(0 if r["pass"] else 1)


if __name__ == "__main__":
    main()
