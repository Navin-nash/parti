"""Specimen direction — palette authored in OKLCH, round-tripped through the
repo's own color math so the hex in tokens.json is exact, never eyeballed."""
import sys, json, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "scripts"))
from color import oklch_to_hex, contrast, verdict  # noqa: E402

# (L%, C, H)
LIGHT = {
    "paper":       (96.20, 0.0022, 250),   # the bench
    "plate":       (99.30, 0.0010, 250),   # a specimen sits lighter than the bench
    "plate-2":     (93.60, 0.0035, 250),   # recessed: gutters, code wells, table heads
    "rule":        (88.50, 0.0045, 250),
    "rule-strong": (63.20, 0.0070, 250),
    "ink":         (18.50, 0.0060, 250),
    "ink-muted":   (46.50, 0.0075, 250),
    "ink-dim":     (51.80, 0.0080, 250),
    "mark":        (52.00, 0.1750, 27),    # proofing red — annotation only
    "mark-tint":   (95.00, 0.0180, 27),
    "on-mark":     (99.00, 0.0000, 0),
}
DARK = {
    "paper":       (15.80, 0.0045, 250),
    "plate":       (19.60, 0.0055, 250),
    "plate-2":     (13.20, 0.0040, 250),
    "rule":        (28.50, 0.0080, 250),
    "rule-strong": (50.20, 0.0100, 250),
    "ink":         (94.50, 0.0040, 250),
    "ink-muted":   (72.00, 0.0080, 250),
    "ink-dim":     (60.50, 0.0090, 250),
    "mark":        (70.00, 0.1600, 29),
    "mark-tint":   (26.00, 0.0420, 29),
    "on-mark":     (16.00, 0.0060, 29),
}

# text token -> the grounds it is allowed to sit on
PAIRS = [
    ("ink", "paper"), ("ink", "plate"), ("ink", "plate-2"),
    ("ink-muted", "paper"), ("ink-muted", "plate"), ("ink-muted", "plate-2"),
    ("ink-dim", "paper"), ("ink-dim", "plate"), ("ink-dim", "plate-2"),
    ("mark", "paper"), ("mark", "plate"), ("mark", "plate-2"), ("mark", "mark-tint"),
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
    dh, df = report("DARK — graphite", DARK)
    print("\n" + "=" * 66)
    if lf or df:
        for fg, bg, r, floor in lf + df:
            print(f"  FAIL  {fg} on {bg}  {r:.2f}:1 < {floor}")
        sys.exit(1)
    print("  all pairs pass their floor")
    out = pathlib.Path(__file__).parent / "palette.json"
    out.write_text(json.dumps({"light": lh, "dark": dh}, indent=2) + "\n")
    print(f"  wrote {out}")
