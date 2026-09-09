#!/usr/bin/env python3
"""Verify the surface directions in skills/parti/surfaces/.

Three things are checked, all of them ways this material has actually gone wrong:

1. **No implementations.** A surface direction that ships markup is a template, and a
   template is a default with better manners - the substitution this skill exists to
   prevent, arriving one level deeper. Enforced mechanically, because the pull toward
   "just show them the code" is exactly the reflex being resisted.
2. **Every required part present.** A direction missing its states or its failure list
   is unfinished, and an unfinished direction reads as permission.
3. **Every cited rule id is real.** Rule ids are the link between direction and the
   scripts that check a build. An id that does not exist in motion-rules.md sends the
   reader nowhere and quietly breaks that link.

    python evals/check_surfaces.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "parti"
SURFACES = SKILL / "surfaces"
INDEX = SKILL / "references" / "surfaces.md"
MOTION_RULES = SKILL / "references" / "motion-rules.md"

REQUIRED = [
    "## When it applies",
    "## The shape decisions",
    "## What the tokens have to carry",
    "## States that must exist",
    "## Responsive",
    "## Motion",
    "## How it goes wrong",
]

FENCE = re.compile(r"^```", re.M)
RULE_REF = re.compile(r"`([a-z0-9]+-[a-z0-9-]+)`")
RULE_DEF = re.compile(r"^### `([a-z0-9-]+)`", re.M)

# Words that look like rule ids but are ordinary hyphenated code in backticks.
NOT_A_RULE = {"prefers-reduced-motion", "aria-invalid", "aria-describedby", "text-wrap"}


def main() -> int:
    files = sorted(SURFACES.glob("*.md"))
    if not files:
        print("no surface directions found", file=sys.stderr)
        return 1

    known_rules = set(RULE_DEF.findall(MOTION_RULES.read_text(encoding="utf-8")))
    index_text = INDEX.read_text(encoding="utf-8")
    failures: list[str] = []

    for f in files:
        text = f.read_text(encoding="utf-8")
        rel = f.relative_to(ROOT).as_posix()

        # 1. no implementations
        if FENCE.search(text):
            failures.append(
                f"{rel}: contains a code fence - surface directions carry decisions, not markup"
            )

        # 2. required parts
        for part in REQUIRED:
            if part not in text:
                failures.append(f"{rel}: missing section '{part}'")

        # 3. real rule ids
        for ref in set(RULE_REF.findall(text)):
            if ref in NOT_A_RULE or ref in known_rules:
                continue
            failures.append(f"{rel}: cites rule id '{ref}', which is not in motion-rules.md")

        # the index has to actually list it, or nothing routes here
        if f.name not in index_text:
            failures.append(f"{rel}: not listed in references/surfaces.md")

    print(f"checked {len(files)} surface direction(s)")
    if failures:
        print("\nFAIL")
        for msg in failures:
            print(f"  {msg}")
        return 1
    print("all directions: no implementations, all parts present, rule ids resolve")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
