#!/usr/bin/env python3
"""
inline.py — make every example page self-contained so it previews on its own.

Both arms were built against one shared stylesheet two directories up, which
means no single file renders when opened directly. This inlines the arm's
stylesheet into each page as a <style> block, so any file can be double-clicked,
dragged into a browser, or opened in a preview pane with nothing else present.

The shared stylesheets under shared/ are kept as the readable source of the
design system. The pages are the previewable artifacts.

Usage:
    python examples/shared/inline.py            # inline into every page
    python examples/shared/inline.py --check    # report status, change nothing

Stdlib only. Idempotent — re-running does not double-inline.
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

LINK_RE = re.compile(
    r'[ \t]*<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\'][^>]*>[ \t]*\n?',
    re.I,
)
MARKER = "<!-- inlined-stylesheet -->"


def pages(arm):
    return sorted(glob.glob(os.path.join(EXAMPLES, "*", arm, "*.html")))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    total, changed, already = 0, 0, 0
    for arm in ARMS:
        css_path = os.path.join(EXAMPLES, "shared", f"{arm}.css")
        if not os.path.exists(css_path):
            continue
        css = open(css_path, encoding="utf-8").read()
        for page in pages(arm):
            total += 1
            html = open(page, encoding="utf-8").read()
            rel = os.path.relpath(page, EXAMPLES)

            if MARKER in html:
                already += 1
                print(f"  ok       {rel}  (already self-contained)")
                continue

            m = LINK_RE.search(html)
            if not m:
                print(f"  SKIP     {rel}  (no stylesheet link found)")
                continue

            if args.check:
                print(f"  needs    {rel}  -> {m.group(1)}")
                continue

            block = f"{MARKER}\n<style>\n{css}\n</style>\n"
            # lambda, not a string: CSS escapes like 4 read as regex backrefs
            out = LINK_RE.sub(lambda _m: block, html, count=1)
            with open(page, "w", encoding="utf-8", newline="\n") as f:
                f.write(out)
            changed += 1
            print(f"  inlined  {rel}  ({len(css.splitlines())} css lines)")

    print()
    print(f"  {total} pages · {changed} inlined · {already} already self-contained")
    if not args.check and changed:
        print("  every page now opens standalone — no shared file required")
    return 0


if __name__ == "__main__":
    sys.exit(main())
