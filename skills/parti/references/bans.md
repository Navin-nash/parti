# Build-Time Bans

`critique.md` catalogs tells visible in a plan or a static mock: a palette, a layout, a copy voice. This list is the other half — things that only exist once markup and CSS have actually been written, and that a design-time review has no way to catch because there's nothing to look at yet.

Run this against your own build in Step B3, the same way `critique.md`'s anti-slop pass runs against a direction before it's shown.

**Motion's build-time bans live in `references/motion-rules.md`**, not here — they have rule ids, fail/pass pairs, and a script (`scripts/motion.py`) behind them. Run both; neither covers the other.

---

## 1. CSS that cancels itself

The single most common way a considered design silently reverts to a browser default: two selectors of different specificity target the same property, and the lower-specificity one — often the more *intentional* one — loses without a build error to flag it.

```css
/* Both true; .cta wins on specificity, .section's spacing rule is dead code
   that will confuse the next person who edits it thinking it's live. */
.section { padding-block: var(--s-8); }
.section .cta { padding: 12px 24px; } /* accidentally also resets padding-block */
```

Before shipping: grep for repeated property names across selectors touching the same element, and prefer a single source of truth per property (a component-scoped class, not a cascade of section-level and element-level rules fighting for the same value). This specific failure is common enough to be worth a dedicated pass, not just a hope that the linter catches it.

## 2. Untouched component-library defaults

A component library shipped with sensible, generic defaults **because it doesn't know your subject.** Shipping those defaults unmodified is choosing the library's taste over the direction's.

| Left untouched | What it means |
|---|---|
| shadcn's default `zinc` base palette | The token spec's palette never actually got wired in |
| Default `Button` variant on every CTA | One visual weight of action across a screen that has more than one kind of action |
| Default `shadow-sm`/`shadow-md` on every `Card` | The spec's elevation scale (`--e-0/1/2/3`) exists in the spec and nowhere in the build |
| Default `rounded-md` radius everywhere, including things that should be square or fully round | The spec's radius rule ("tables stay square," "avatars are the only full circle") got skipped |
| A `cva` variant map with only the library's shipped variants, none added for this direction | The token system stopped at the CSS variables and never reached the component API |

**The fix isn't avoiding the library — it's not leaving it alone.** Every component that renders visible surface, text, or an interactive state should route through the token variables, not the library's shipped defaults. `references/stacks.md` §1 shows the concrete override pattern.

## 3. Accessibility regressions introduced at build time

These didn't exist in the spec — they get introduced while typing, almost always as a shortcut.

- **Focus killed, nothing put back.** `outline: none` / `outline-none` with no `:focus`/`focus:` rule anywhere in the same component. Silences a WCAG floor this skill explicitly calls non-negotiable.
- **`<img>` with no `alt`.** Even a decorative image needs `alt=""` to say so on purpose, not by omission.
- **Color as the only state signal.** A red border with no icon, label, or text change for an error state — fails for anyone who can't distinguish the hue, and fails the "hierarchy survives grayscale" test from `critique.md`'s self-critique disciplines.
- **Custom interactive elements under 44px**, or a `<div onClick>` standing in for a `<button>` — no keyboard path, no role, no focus state, because a div doesn't get any of that for free.

## 4. Current, model-specific tells

The headline three looks in `critique.md` (AI cream, acid-on-black, broadsheet) are the 2024–25 vintage. What shows up in freshly-generated 2026 code specifically:

- **The ghost card** — a hairline border *and* a wide, diffuse `box-shadow` on the same element, stacked rather than chosen between. Pick one language for elevation (border **or** shadow, per the spec's `--e-` rule) and stop there.
- **32px-plus radius on everything**, including elements with no reason to read as a rounded object (inputs, table cells, small icon buttons).
- **Hand-drawn "sketchy" SVG doodles** as decoration with no connection to the subject — a stock gesture at whimsy, same failure mode as the icon tile it usually replaces.
- **A colored left border-stripe as the only accent**, reached for reflexively wherever a heading needs "something." If it isn't in the spec's discipline rules, it's decoration, not a decision.
- **"___ Theater" / "___ Studio" copy patterns** as generic section names — naming something after a vague vibe instead of what it does.

## 5. Token drift

Every hardcoded hex, px, or duration that doesn't trace back to a token in the spec is either a decision nobody made or a decision the build made without saying so. `scripts/lint.py --tokens tokens.json` catches color drift deterministically; spacing and duration drift need a human pass — grep for raw pixel values outside the spacing scale and raw millisecond values outside the motion durations before calling a build done.
