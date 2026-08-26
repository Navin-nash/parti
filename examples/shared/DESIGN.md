# DESIGN.md

> Binding design constraints for **Meridian** (flight-operations control).
> Read before changing anything visual. Conflicts with a request must be surfaced, not silently resolved.
> Last updated: 2026-08-26 · Direction: **Strip Rack** · Scope: `examples/*/parti/*.html` + `examples/shared/parti.css`

## Premise

A dispatcher is interrupted every few minutes and works the board for ten hours in a
dimmed room. The interface therefore optimises for one thing above all: **being
re-readable in a single glance after an interruption.** Everything below serves that,
and the second rule that follows from it — *a dispatcher must never be able to mistake
absent data for good data.*

## Audience & posture

- **Users:** FAA-certificated aircraft dispatchers at regional carriers. What they use
  daily is Sabre/Jeppesen-class flight-planning software, ACARS terminals, and — for
  many of them, in training — literal printed progress strips in a rack.
- **Frequency:** daily, all shift. This licenses density, abbreviation, uppercase
  field labels and zero onboarding chrome. It forbids delight that repeats.
- **Priority order:** intuitive > intentional > modern > interactive. Every trade goes
  that way. Where "modern" and "scannable at 02:00" disagree, scannable wins.
- **Anti-references:** consumer analytics dashboards (KPI tiles with big numbers and
  green arrows), airline consumer booking sites, generic dark-mode SaaS.

## Color

Authoritative in OKLCH. Hex is the exact sRGB round-trip, for tooling only.
Verified with `python scripts/color.py check`.

| Token | OKLCH (hex) | Role | Contrast |
|---|---|---|---|
| `--bg` | `oklch(19.30% 0.0170 252.6)` (#0F151C) | the board | — |
| `--surface` | `oklch(22.72% 0.0212 251.7)` (#151D26) | panels, rack | — |
| `--surface-2` | `oklch(26.75% 0.0257 248.8)` (#1C2732) | column heads, hover, focused panel | — |
| `--tint-caution` | `oklch(26.03% 0.0235 80.8)` (#2A2317) | caution card stock | — |
| `--tint-warning` | `oklch(24.38% 0.0273 23.0)` (#2C1B1A) | warning card stock | — |
| `--tint-advisory` | `oklch(25.72% 0.0243 223.6)` (#16262C) | advisory card stock | — |
| `--border` | `oklch(33.80% 0.0331 248.8)` (#2A3948) | hairlines, printed cell rules | 1.44:1 — never a state signal |
| `--border-strong` | `oklch(54.36% 0.0342 246.9)` (#607283) | control boundaries | 3.05:1 worst case (on `--surface-2`); 3.70:1 on `--bg` |
| `--text` | `oklch(93.68% 0.0121 248.0)` (#E4EBF2) | primary | 15.26:1 on `--bg` |
| `--text-muted` | `oklch(74.92% 0.0299 246.6)` (#9FB0C0) | secondary | 8.25:1 on `--bg` |
| `--text-dim` | `oklch(64.23% 0.0353 249.8)` (#7D8FA2) | field labels, tertiary | 4.56:1 on `--surface-2` (worst case) |
| `--caution` | `oklch(80.13% 0.1390 75.0)` (#F2B04A) | amber — needs a decision | 9.69:1 on `--bg` |
| `--warning` | `oklch(69.27% 0.1675 29.8)` (#F26D5B) | red — needs it now | 6.22:1 on `--bg` |
| `--normal` | `oklch(77.38% 0.1449 154.0)` (#5FD08A) | green — nominal | 9.50:1 on `--bg` |
| `--advisory` | `oklch(78.24% 0.0979 215.9)` (#66C8E0) | cyan — informational, and the focus ring | 9.53:1 on `--bg` |
| `--on-signal` | `oklch(19.30% 0.0170 252.6)` (#0F151C) | text on a filled signal | 9.69:1 on `--caution`, 6.22:1 on `--warning` |

**Why this set, and not a brand palette.** Amber/red/green/cyan on a dark ground is the
EFIS caution-and-warning vocabulary every pilot and dispatcher in this audience has
worked behind for their whole career. It is not a colour choice; it is the audience's
existing language, and overriding it with a brand accent would cost comprehension for
nothing.

**Rules.** `--warning` is the only colour permitted to *fill* a surface, and only on the
status token and the error state — at most twice on a screen. Colour is never the sole
carrier of state: every tinted row also carries a printed status token and a signed
delta, so the board survives grayscale, peripheral vision, and colour-vision deficiency.

## Typography

No webfont is loaded: the brief forbids CDN links and a build step, and a self-hosted
binary face is out of scope. Both stacks are therefore chosen deliberately rather than
defaulted to `system-ui` — see Deviations.

| Role | Family | Weights | Used for |
|---|---|---|---|
| Display / UI | `-apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, system-ui, sans-serif` | 400–700 | headlines, prose, buttons |
| Data / utility | `ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", Menlo, Consolas, monospace` | 500–600 | every strip field, all times, tail numbers, codes, field labels, the ribbon |

Scale — base 14px:

| Token | Size/LH | Weight | Tracking | Use |
|---|---|---|---|---|
| `.display` | 46/48 | 700 | −0.028em | hero only |
| `.h1` | 30/34 | 700 | −0.02em | section title |
| `.h2` | 21/27 | 650 | −0.012em | tier name |
| `.h3` | 16/22 | 600 | −0.006em | beat title |
| body | 14/22 | 400 | 0 | interface, prose |
| `.small` | 13/19 | 400 | 0 | secondary |
| strip | 13/16 | 500 | 0 | rack fields — tabular figures |
| `.label` | 11/14 | 600 | 0.085em uppercase | field labels |

**Rules.** Measure 64ch for prose. Tabular figures everywhere a column of numbers
aligns. Uppercase is permitted only for field labels and status tokens, because that is
how a strip is printed — never for headlines or running text.

## Space

Base 4px: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80.
Section rhythm 80px desktop / 56px under 900px. Marketing container 1180px.
Rack row 34px. Console columns 330 / fluid / 350.
**Rule:** the console is full-bleed; only marketing surfaces get the container.

## Shape & elevation

Radii: `--r-none` 0 · `--r-sm` 2px (controls, inputs) · `--r-round` 50% (the live dot,
and nothing else).
**What stays square, and why:** the rack, every strip, every status token, every panel.
They are strips of card stock in a rack; card stock has corners.

Elevation: `--e-0` the board · `--e-1` `--surface` + hairline · `--e-2` `--surface-2` +
`--border-strong`.
**What elevation means here:** a lightness step, never a shadow. In a room dimmed for a
ten-hour shift a drop shadow is invisible and a 4% lightness step is not. **There is no
`box-shadow` anywhere in this build** — verified at 0 occurrences on all four surfaces.

## Logo & iconography

- **Marks:** wordmark `MERIDIAN` plus a mono context sub-label naming the surface
  (`Ops Board`, `Component Reference`). No submark, no glyph.
- **Clear space:** one wordmark cap-height on all sides.
- **Icon library:** **none, deliberately.** Status is carried by printed word tokens
  (`Mech`, `Flow hold`, `Duty watch`) because that is what a strip carries and because a
  word survives grayscale and a low-vision reader where a 16px glyph does not. The only
  non-typographic mark in the system is the 6px live dot.

## Motion

- **Posture:** responsive-only. Nothing enters, nothing animates on scroll, nothing
  animates on load.
- **Library:** none — CSS only.
- Durations: `--d-tick` 90ms · `--d-fast` 140ms · `--d-base` 200ms · `--d-slow` 260ms ·
  `--d-live` 2400ms (loop) · `--d-unfilled` 1400ms (loop).
- Easing: `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` · `--ease-in-out`
  `cubic-bezier(0.65, 0, 0.35, 1)`. Two curves, no others.
- **Animates:** row hover/focus tint (90ms); nav underline (90ms); control press
  (140ms, `translateY(1px)`); **status token colour change (200ms) — the one moment,
  because it is what a returning dispatcher needs to notice**; disruption disclosure via
  `grid-template-rows: 0fr → 1fr` (200ms); live-feed dot opacity (2400ms loop);
  unfilled strip fields (1400ms loop, deliberately unstaggered).
- **Never animates:** page and section entry, scroll position, numbers counting up, the
  rack rendering, sorting, route changes. Anything over 300ms that is not a loop.
- **Reduced motion:** live dot and unfilled pulse hold static; disclosure snaps (1ms);
  press and hover keep the colour change and drop the transform.

## Discipline

1. **Three channels for every state.** Row tint, printed token, and delta colour. Remove
   any one and the board still reads.
2. **Borders and lightness before shadows.** If something needs to lift, it lifts by
   getting lighter.
3. **Every strip field is monospace, tabular, and never truncated.** The rack scrolls
   sideways instead. A clipped tail number is an airworthiness risk.
4. **One filled colour per region.** If two things on a screen are filled red, one of
   them is not actually urgent.
5. **No state without a next action.** Empty says which filter emptied it; error says
   what was withdrawn and opens manual entry.

## Anti-rules

- **No gradients, anywhere.** The signal colours must stay unmistakable, and a gradient
  makes an amber that is partly not amber.
- **No `box-shadow`.** See Elevation.
- **No KPI tile row.** Board state is one line of mono in the ribbon, which is how ops
  status is actually transmitted, and it costs 24px instead of 140.
- **No icon-only control.** Every action carries its verb; a dispatcher acting from
  memory of an icon at hour nine is a defect.
- **No stale data displayed as current.** If a feed is dead the numbers are withdrawn,
  not dimmed. Nothing is interpolated.
- **No card nested inside a card.** Use a hairline and a `.label`.
- **No `01 / 02 / 03` numbering.** Where sequence matters it is stated in the subject's
  own unit — `T+0:00`, `T+1:10`.

## Accessibility floor

Contrast AA on every stated pair (measured, table above) · visible focus ring
(`2px solid --advisory`, 2px offset, applied globally via `:focus-visible`, never
removed) · keyboard-complete, DOM order, no positive `tabindex` · reduced motion
honoured per element · hierarchy survives grayscale · no horizontal page scroll at
390px or 1440px (verified) · error state carries `role="alert"`, loading carries
`aria-busy`.

**Target size:** 44px minimum on marketing surfaces. Console controls are 32px with
36px queue rows — above the WCAG 2.2 AA 2.5.8 minimum of 24px, below the AAA 44px.
Named deviation; see below.

## Deviations from spec

- **No webfont.** The brief bans CDN links and build steps. Both stacks are named
  explicitly and chosen for character (a genuine mono for data, a grotesque for voice)
  rather than left to fall back to `system-ui`. If a build step ever exists, replace the
  display stack first — the mono is doing the distinctive work and needs no change.
- **Console target size 32px, not 44px.** A 44px row on a rack showing 47 legs would put
  eleven of them on screen. Density is the job here; 32px with 8px separation clears the
  WCAG 2.2 AA floor and the surface is mouse-and-keyboard by definition.
- **Inline `style` on duty-clock bar widths.** Those are data values, not design values.
  No design token is ever written inline.
- **`motion.py` reports `a11y-reduced-motion-nuked` (P2).** The rule fires when only one
  *file* contains reduced-motion handling. The brief mandates a single shared stylesheet,
  so one file is the maximum possible. The handling itself is per-element, not a global
  nuke — see Motion above.

## Open questions

- [ ] Bay letters are carried over from the paper rack. Confirm with a carrier that they
      still map to anything real, or replace with hub codes.
- [ ] Whether the rack should pin the flight column when it scrolls horizontally. It is
      specified in the state matrix and not yet built.
- [ ] A light theme for daylight ramp-tower use has not been designed. The two-layer
      token model is in place for it; the tints will need re-derivation, not inversion.

## Changelog

- 2026-08-26 — Direction "Strip Rack" established and built across four surfaces.
  Palette derived from the EFIS caution/warning set and verified with `color.py`;
  elevation defined as a lightness step and `box-shadow` banned outright; motion posture
  set to responsive-only with two curves and four UI durations.
