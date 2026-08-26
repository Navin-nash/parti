#!/usr/bin/env python3
"""
split_components.py — split each arm's components page into one standalone file
per state, so a single component state can be previewed on its own.

The four table states (populated / empty / loading / error) live as sections in
one page. For a showcase you usually want to look at exactly one — "here is the
empty state, nothing else on screen" — so each section is extracted into its own
self-contained HTML file carrying the same inlined stylesheet.

The combined components page is left in place; these are additions, not
replacements.

Usage:
    python examples/shared/split_components.py
    python examples/shared/split_components.py --check

Stdlib only. Idempotent.
"""

import argparse
import glob
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
EXAMPLES = os.path.dirname(HERE)
ARMS = ("baseline", "parti")
STATES = ("populated", "empty", "loading", "error")

STYLE_RE = re.compile(r"<style>.*?</style>", re.S | re.I)
SECTION_OPEN = re.compile(r"<section\b", re.I)
SECTION_CLOSE = re.compile(r"</section\s*>", re.I)


def enclosing_section(html, idx):
    """Return (start, end) of the <section> element containing position idx."""
    starts = [m.start() for m in SECTION_OPEN.finditer(html) if m.start() < idx]
    if not starts:
        return None
    # walk back through candidate openings until one closes after idx
    for start in reversed(starts):
        depth = 0
        pos = start
        while pos < len(html):
            o = SECTION_OPEN.search(html, pos)
            c = SECTION_CLOSE.search(html, pos)
            if not c:
                return None
            if o and o.start() < c.start():
                depth += 1
                pos = o.end()
            else:
                depth -= 1
                pos = c.end()
                if depth == 0:
                    if c.end() > idx:
                        return (start, c.end())
                    break
    return None


def find_state(html, state):
    """Locate a heading naming this state; return its position or None."""
    for rx in (
        re.compile(rf"<h2[^>]*>[^<]*\b{state}\b[^<]*</h2>", re.I),
        re.compile(rf'id=["\'][^"\']*{state}[^"\']*["\']', re.I),
    ):
        m = rx.search(html)
        if m:
            return m.start()
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    made = 0
    for arm in ARMS:
        src = os.path.join(EXAMPLES, "04-components", arm, "components.html")
        if not os.path.exists(src):
            continue
        html = open(src, encoding="utf-8").read()

        sm = STYLE_RE.search(html)
        if not sm:
            print(f"  SKIP {arm}: no inlined <style> (run inline.py first)")
            continue
        style = sm.group(0)

        lang = "en"
        out_dir = os.path.join(EXAMPLES, "04-components", arm, "states")
        os.makedirs(out_dir, exist_ok=True)

        for state in STATES:
            idx = find_state(html, state)
            if idx is None:
                print(f"  SKIP {arm}/{state}: no heading found")
                continue
            span = enclosing_section(html, idx)
            if not span:
                print(f"  SKIP {arm}/{state}: no enclosing <section>")
                continue
            body = html[span[0]:span[1]]
            title = f"Flight rack — {state} state ({arm})"
            page = (
                f"<!doctype html>\n<html lang=\"{lang}\">\n<head>\n"
                f"<meta charset=\"utf-8\">\n"
                f"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
                f"<title>{title}</title>\n{style}\n</head>\n<body>\n"
                f"<main style=\"padding:2rem\">\n{body}\n</main>\n</body>\n</html>\n"
            )
            dest = os.path.join(out_dir, f"{state}.html")
            if args.check:
                print(f"  would write {os.path.relpath(dest, EXAMPLES)}  ({len(body)} bytes of section)")
                continue
            with open(dest, "w", encoding="utf-8", newline="\n") as f:
                f.write(page)
            made += 1
            print(f"  wrote {os.path.relpath(dest, EXAMPLES)}")

    print()
    print(f"  {made} standalone state files written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
