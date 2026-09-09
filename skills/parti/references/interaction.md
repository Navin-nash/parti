# Interaction

Product-register haptic and state. Loaded by `build`, `animate`, `states`, `harden`. Do not duplicate `references/motion-rules.md` — that catalog + `scripts/motion.py` is law for curves, durations, and bans. This file is *when* and *how components should feel*.

Brand-register pages still honor reduced motion and press feedback on real buttons; they do not apply this file's "app chrome" rules to a marketing hero.

## Frequency gate (before any animation)

| How often seen | Decision |
|---|---|
| 100+/day, or keyboard-initiated | No animation. Ever. |
| Tens/day (list nav, hover) | Remove or ≤100–160ms |
| Occasional (modal, drawer, toast) | Standard, under 300ms UI |
| Rare / first-run | Delight allowed, still purposeful |

If you cannot answer "why does this animate?" with spatial continuity, state change, explanation, feedback, or anti-jarring, it doesn't.

## Feel (compound; users shouldn't notice one item)

- **Press:** `scale(0.97)` (0.95–0.98) on `:active` for pressable elements, ~100–160ms ease-out. Gate hover with `(hover: hover) and (pointer: fine)`.
- **Don't enter from `scale(0)`.** Use ≥0.9 plus opacity.
- **Popovers** scale from the trigger (`transform-origin` from Radix/Base UI vars). **Modals** stay centered.
- **Tooltips:** delay the first; subsequent siblings open with **0ms** delay and no animation while the group is hot.
- **Transitions over keyframes** on anything triggered rapidly (toasts, toggles). Keyframes restart from zero.
- **Asymmetric timing:** slow when the user is deciding (hold-to-delete), snappy on release / system response.
- **Blur (~2px)** only to mask a bad crossfade, never as decoration, never heavy.

Curves and duration tokens: copy from `references/motion-rules.md` §12, never invent "something close."

## States (same pass as the ideal)

Empty (first-run ≠ user-cleared), loading (skeleton matching layout, not a centered spinner in a data view), partial, ideal, error (what / why / next), overflow, offline, no-permission. Product UI that only implements ideal is how production diverges from the mock.

## Affordances

Dropdowns inside `overflow: hidden` clip — portal, `fixed`, or native `popover`/`dialog`. Icon-only controls have accessible names. Don't invent a new control for a standard settings row: label left, control right, 48–56px row, hairline — not a card per toggle.
