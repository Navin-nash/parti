#!/usr/bin/env python3
"""
sync-arms.py — copy the static baseline/parti artifacts into public/ so the
docs shell can iframe them.

Why iframes: the two arms are two complete, competing design systems. Rendering
both into one document would let their CSS fight — and a comparison where one
side is corrupted by the other's stylesheet measures nothing. An iframe gives
each arm the isolated document it was authored for.

Run from examples/nextjs:
    python scripts/sync-arms.py

Stdlib only. Idempotent.
"""

import os
import shutil
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
EXAMPLES = os.path.dirname(APP)
DEST = os.path.join(APP, "public", "arms")

# (surface slug, source relative to examples/, arm)
PAIRS = [
    ("landing", "01-landing-page/{arm}/index.html"),
    ("pricing", "02-pricing-page/{arm}/pricing.html"),
    ("dashboard", "03-dashboard/{arm}/dashboard.html"),
    ("components", "04-components/{arm}/components.html"),
    ("state-populated", "04-components/{arm}/states/populated.html"),
    ("state-empty", "04-components/{arm}/states/empty.html"),
    ("state-loading", "04-components/{arm}/states/loading.html"),
    ("state-error", "04-components/{arm}/states/error.html"),
]


def main():
    copied, missing = 0, []
    for arm in ("baseline", "parti"):
        out = os.path.join(DEST, arm)
        os.makedirs(out, exist_ok=True)
        for slug, template in PAIRS:
            src = os.path.join(EXAMPLES, template.format(arm=arm).replace("/", os.sep))
            if not os.path.exists(src):
                missing.append(f"{arm}/{slug}")
                continue
            shutil.copy(src, os.path.join(out, f"{slug}.html"))
            copied += 1
            print(f"  {arm:<9} {slug}")

    print()
    print(f"  {copied} files synced to public/arms/")
    if missing:
        print(f"  missing: {', '.join(missing)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
