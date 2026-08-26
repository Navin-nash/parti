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

Usage:
    python lint.py <path>                              # tell scan only
    python lint.py <path> --tokens tokens.json          # + drift check
    python lint.py <path> --json out.json --quiet       # for CI

tokens.json is flat: {"--bg": "#FAF9F6", "--accent": "#B23A2E", ...} — the
same names references/tokens.md's spec format uses. Exit code is 1 if any
P0 finding exists, so this can gate a build step.

Stdlib only. Never writes to the scanned project.
"""

import argparse
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


def load_tokens(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    # Two things have to line up here, and getting either wrong silently empties
    # the allowed set — which reports every color in the codebase as drift while
    # still passing a naive "does it flag the unspec'd one" test:
    #   - RE_HEX needs the leading '#' to match, so validate the restored form;
    #   - norm_hex expects BARE digits (it is fed RE_HEX group(1) at the call
    #     site below), so normalize the stripped form, not the '#'-prefixed one.
    allowed = set()
    for v in raw.values():
        if not isinstance(v, str):
            continue
        bare = v.lstrip("#")
        if RE_HEX.fullmatch("#" + bare):
            allowed.add(norm_hex(bare))
    return allowed


def lint(root, tokens_path=None):
    res = {"root": os.path.abspath(root), "files_scanned": 0,
           "findings": [], "counts": defaultdict(int)}

    allowed = load_tokens(tokens_path) if tokens_path else None
    drift = defaultdict(list)
    shadow_hits = defaultdict(int)

    for path in iter_files(root):
        txt = read(path)
        if not txt:
            continue
        res["files_scanned"] += 1
        rel = os.path.relpath(path, root)

        if allowed is not None:
            for m in RE_HEX.finditer(txt):
                h = norm_hex(m.group(1))
                if h not in allowed:
                    drift[h].append(rel)

        for m in RE_IMG_NO_ALT.finditer(txt):
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
    args = ap.parse_args()
    if not os.path.isdir(args.path):
        sys.exit(f"not a directory: {args.path}")
    r = lint(args.path, args.tokens)
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
