"""Proof direction (open-sky revision) — palette authored in OKLCH, round-tripped
through the repo's own color math so the hex in tokens.json is exact, never
eyeballed. OKLCH triples below were derived from the hex in DESIGN.md via
hex_to_oklch, then this script re-derives the hex from OKLCH and verifies every
declared pair against its floor — the same round-trip DESIGN.md's header promises."""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "skills" / "parti" / "scripts"))
from color import oklch_to_hex, contrast, verdict  # noqa: E402

# (L%, C, H) — near-pure paper/ink, one sky-blue accent, same system in both themes.
LIGHT = {
    "paper":       (99.13, 0.0013, 286),
    "plate":       (100.00, 0.0000, 90),
    "plate-2":     (96.77, 0.0027, 286),
    "rule":        (91.97, 0.0040, 286),
    "rule-strong": (63.50, 0.0074, 286),
    "ink":         (18.70, 0.0063, 271),
    "ink-muted":   (45.27, 0.0070, 264),
    "ink-dim":     (50.67, 0.0083, 268),
    "mark":        (81.48, 0.0819, 226),   # the sky — a light tint, fill-only, never text
    "mark-text":   (53.50, 0.0890, 228),   # the accent's deep form — links, small text
    "mark-tint":   (95.99, 0.0151, 229),
    "on-mark":     (18.67, 0.0171, 217),
}
DARK = {
    "paper":       (11.56, 0.0032, 286),
    "plate":       (16.47, 0.0042, 286),
    "plate-2":     (8.60, 0.0056, 285),
    "rule":        (26.05, 0.0058, 271),
    "rule-strong": (49.00, 0.0080, 277),
    "ink":         (94.29, 0.0029, 265),
    "ink-muted":   (71.18, 0.0062, 265),
    "ink-dim":     (59.64, 0.0079, 269),
    "mark":        (81.48, 0.0819, 226),   # same hex both themes — one sky, one system
    "mark-text":   (81.48, 0.0819, 226),   # already light enough to read as text on dark
    "mark-tint":   (26.80, 0.0374, 222),
    "on-mark":     (18.67, 0.0171, 217),
}

# text token -> the grounds it is allowed to sit on. `mark` itself is deliberately
# absent: DESIGN.md declares it fill-only, never text, so it is not held to a text
# floor — mark-text is the token that carries the accent at text size.
PAIRS = [
    ("ink", "paper"), ("ink", "plate"), ("ink", "plate-2"),
    ("ink-muted", "paper"), ("ink-muted", "plate"), ("ink-muted", "plate-2"),
    ("ink-dim", "paper"), ("ink-dim", "plate"), ("ink-dim", "plate-2"),
    ("mark-text", "paper"), ("mark-text", "plate"), ("mark-text", "plate-2"),
    ("on-mark", "mark"),
    ("rule-strong", "paper"), ("rule-strong", "plate"),   # control boundaries: 3:1 floor
]
NON_TEXT = {("rule-strong", "paper"), ("rule-strong", "plate")}


def build(spec):
    return {k: oklch_to_hex(L / 100, C, H) for k, (L, C, H) in spec.items()}


def report(name, spec):
    hexes = build(spec)
    print(f"\n{'='*66}\n{name}\n{'='*66}")
    for k, (L, C, H) in spec.items():
        print(f"  --{k:<12} oklch({L:.2f}% {C:.4f} {H})".ljust(46) + hexes[k])
    print(f"\n  {'pair':<28}{'ratio':>8}   verdict   floor")
    fails = []
    for fg, bg in PAIRS:
        r = contrast(hexes[fg], hexes[bg])
        floor = 3.0 if (fg, bg) in NON_TEXT else 4.5
        ok = r >= floor
        if not ok:
            fails.append((fg, bg, r, floor))
        print(f"  {fg+' on '+bg:<28}{r:>7.2f}:1   {verdict(r):<8}  {floor}  {'ok' if ok else 'FAIL'}")
    return hexes, fails


if __name__ == "__main__":
    lh, lf = report("LIGHT — paper", LIGHT)
    dh, df = report("DARK — night sky", DARK)
    print("\n" + "=" * 66)
    if lf or df:
        for fg, bg, r, floor in lf + df:
            print(f"  FAIL  {fg} on {bg}  {r:.2f}:1 < {floor}")
        sys.exit(1)
    print("  all pairs pass their floor")
    out = pathlib.Path(__file__).parent / "palette.json"
    out.write_text(json.dumps({"light": lh, "dark": dh}, indent=2) + "\n")
    print(f"  wrote {out}")
