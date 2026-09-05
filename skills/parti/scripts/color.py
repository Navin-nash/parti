#!/usr/bin/env python3
"""
color.py — palette math. Verify a proposed palette before you ship it in a token spec.

Contrast ratios are facts, not opinions; a direction that fails them is wrong
regardless of how it looks. OKLCH is used because its lightness axis is
perceptually uniform — a ramp built by stepping L actually looks evenly stepped,
which is not true of HSL.

Usage:
    python color.py contrast "#2B2620" "#FAF9F6"
    python color.py check palette.json          # {"bg":"#FAF9F6","text":"#2B2620",...}
    python color.py ramp "#B23A2E" --steps 9
    python color.py convert "#B23A2E"
    python color.py fix "#8A8F98" --on "#F7F7F8" --target 4.5
"""

import argparse
import json
import math
import sys

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

# ---------------------------------------------------------------- sRGB <-> OKLCH

def _srgb_to_lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _lin_to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def hex_to_rgb(h):
    h = h.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f"bad hex: {h}")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#" + "".join("%02X" % max(0, min(255, round(c * 255))) for c in rgb)


def hex_to_oklab(h):
    r, g, b = (_srgb_to_lin(c) for c in hex_to_rgb(h))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = (math.copysign(abs(v) ** (1 / 3), v) for v in (l, m, s))
    return (0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
            0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_)


def _oklab_to_linear(L, a, b_):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b_
    m_ = L - 0.1055613458 * a - 0.0638541728 * b_
    s_ = L - 0.0894841775 * a - 1.2914855480 * b_
    l, m, s = (v ** 3 for v in (l_, m_, s_))
    return (+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def in_gamut(L, C, H, eps=1e-4):
    rad = math.radians(H)
    return all(-eps <= c <= 1 + eps
               for c in _oklab_to_linear(L, C * math.cos(rad), C * math.sin(rad)))


def fit_chroma(L, C, H):
    """Reduce chroma until the color is inside sRGB. Clipping RGB channels instead
    shifts the hue, which is why naive OKLCH ramps drift toward orange or purple
    at the ends."""
    if in_gamut(L, C, H):
        return C
    lo, hi = 0.0, C
    for _ in range(24):
        mid = (lo + hi) / 2
        if in_gamut(L, mid, H):
            lo = mid
        else:
            hi = mid
    return lo


def oklab_to_hex(L, a, b_):
    l_ = L + 0.3963377774 * a + 0.2158037573 * b_
    m_ = L - 0.1055613458 * a - 0.0638541728 * b_
    s_ = L - 0.0894841775 * a - 1.2914855480 * b_
    l, m, s = (v ** 3 for v in (l_, m_, s_))
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return rgb_to_hex(tuple(_lin_to_srgb(max(0.0, min(1.0, c))) for c in (r, g, b)))


def hex_to_oklch(h):
    L, a, b = hex_to_oklab(h)
    return (L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360)


def oklch_to_hex(L, C, H, fit=True):
    if fit:
        C = fit_chroma(L, C, H)
    rad = math.radians(H)
    return oklab_to_hex(L, C * math.cos(rad), C * math.sin(rad))


def oklch_str(h):
    L, C, H = hex_to_oklch(h)
    return f"oklch({L * 100:.1f}% {C:.3f} {H:.1f})"

# ---------------------------------------------------------------- contrast

def rel_lum(h):
    r, g, b = (_srgb_to_lin(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = rel_lum(a), rel_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def verdict(ratio):
    tags = []
    tags.append("AA body ✓" if ratio >= 4.5 else "AA body ✗")
    tags.append("AA large ✓" if ratio >= 3.0 else "AA large ✗")
    tags.append("AAA ✓" if ratio >= 7.0 else "AAA ✗")
    tags.append("UI/non-text ✓" if ratio >= 3.0 else "UI/non-text ✗")
    return "  ".join(tags)

# ---------------------------------------------------------------- commands

def cmd_contrast(args):
    r = contrast(args.fg, args.bg)
    print(f"{args.fg} on {args.bg}   {r:.2f}:1   {verdict(r)}")
    print(f"  {args.fg} = {oklch_str(args.fg)}")
    print(f"  {args.bg} = {oklch_str(args.bg)}")


def cmd_check(args):
    with open(args.palette) as f:
        pal = json.load(f)
    bg_keys = [k for k in pal if any(t in k.lower() for t in ("bg", "background", "surface", "base", "paper"))]
    fg_keys = [k for k in pal if k not in bg_keys]
    if not bg_keys:
        sys.exit("no background-ish key found (expected one of: bg, background, surface, base, paper)")
    print(f"{'foreground':<18}{'background':<18}{'ratio':>8}   verdict")
    print("-" * 74)
    fails = 0
    for bk in bg_keys:
        for fk in fg_keys:
            try:
                r = contrast(pal[fk], pal[bk])
            except ValueError:
                continue
            flag = "" if r >= 4.5 else "   ← below body floor"
            if r < 4.5:
                fails += 1
            print(f"{fk + ' ' + pal[fk]:<18}{bk + ' ' + pal[bk]:<18}{r:>7.2f}:1   {verdict(r)}{flag}")
    print("-" * 74)
    print(f"{fails} pair(s) below 4.5:1. Not every pair must pass — only the ones that "
          f"actually co-occur as text. Confirm which do.")


def cmd_ramp(args):
    L0, C0, H0 = hex_to_oklch(args.color)
    n = args.steps
    print(f"base {args.color} = {oklch_str(args.color)}\n")
    print(f"{'step':<8}{'hex':<10}{'oklch':<28}{'on white':>10}{'on black':>10}")
    print("-" * 68)
    for i in range(n):
        L = 0.97 - (0.97 - 0.16) * (i / (n - 1))
        # taper chroma at the extremes so the ramp stays in gamut and looks even
        taper = math.sin(math.pi * (i + 0.5) / n) ** 0.5
        C = C0 * (0.35 + 0.65 * taper)
        hx = oklch_to_hex(L, C, H0)
        print(f"{(i + 1) * 100:<8}{hx:<10}{oklch_str(hx):<28}"
              f"{contrast(hx, '#FFFFFF'):>9.2f}{contrast(hx, '#000000'):>10.2f}")


def cmd_convert(args):
    L, C, H = hex_to_oklch(args.color)
    print(f"{args.color}")
    print(f"  oklch  {oklch_str(args.color)}")
    print(f"  L {L * 100:.1f}%   C {C:.4f}   H {H:.1f}°")
    print(f"  luminance {rel_lum(args.color):.4f}")
    print(f"  vs white {contrast(args.color, '#FFFFFF'):.2f}:1   vs black {contrast(args.color, '#000000'):.2f}:1")


def cmd_fix(args):
    """Darken or lighten in OKLCH until the target ratio is met, preserving hue and chroma."""
    L, C, H = hex_to_oklch(args.color)
    bg_lum = rel_lum(args.on)
    direction = -1 if bg_lum > 0.4 else 1  # darken on light bg, lighten on dark
    best = None
    step = 0.005
    for i in range(200):
        Lt = max(0.0, min(1.0, L + direction * step * i))
        cand = oklch_to_hex(Lt, C, H)
        if contrast(cand, args.on) >= args.target:
            best = (cand, Lt, contrast(cand, args.on))
            break
    orig = contrast(args.color, args.on)
    print(f"original  {args.color} on {args.on} = {orig:.2f}:1   {verdict(orig)}")
    if best:
        cand, Lt, r = best
        print(f"adjusted  {cand} on {args.on} = {r:.2f}:1   (L {L * 100:.1f}% → {Lt * 100:.1f}%, "
              f"hue and chroma preserved)")
        print(f"          {oklch_str(cand)}")
    else:
        print(f"could not reach {args.target}:1 by lightness alone — the background needs to change, "
              f"or drop chroma (C {C:.3f}) as well.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("contrast"); p.add_argument("fg"); p.add_argument("bg"); p.set_defaults(fn=cmd_contrast)
    p = sub.add_parser("check"); p.add_argument("palette"); p.set_defaults(fn=cmd_check)
    p = sub.add_parser("ramp"); p.add_argument("color"); p.add_argument("--steps", type=int, default=9); p.set_defaults(fn=cmd_ramp)
    p = sub.add_parser("convert"); p.add_argument("color"); p.set_defaults(fn=cmd_convert)
    p = sub.add_parser("fix"); p.add_argument("color"); p.add_argument("--on", required=True)
    p.add_argument("--target", type=float, default=4.5); p.set_defaults(fn=cmd_fix)

    args = ap.parse_args()
    try:
        args.fn(args)
    except ValueError as e:
        sys.exit(str(e))


if __name__ == "__main__":
    main()
