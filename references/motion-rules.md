# Motion Rules

The rule catalog. Every rule has an **id**, a **severity**, a **fail** example, a **pass** example, and (where one exists) the **hunt** pattern that finds it in source. This is the reference `motion.py` implements, the `review` command cites, and the `animate`/`build` commands are held to.

Read it when reviewing motion, when writing motion, and before claiming a motion pass is clean.

**Contents**
1. [How to use it](#how-to-use-it)
2. [Severity](#severity)
3. [Purpose rules](#purpose-rules) — `purpose-*`
4. [Timing rules](#timing-rules) — `timing-*`
5. [Easing rules](#easing-rules) — `easing-*`
6. [Physics rules](#physics-rules) — `physics-*`
7. [Interruption rules](#interruption-rules) — `interrupt-*`
8. [Performance rules](#performance-rules) — `perf-*`
9. [Accessibility rules](#accessibility-rules) — `a11y-*`
10. [Cohesion rules](#cohesion-rules) — `cohesion-*`
11. [Staging rules](#staging-rules) — `staging-*`
12. [The canonical values](#the-canonical-values)
13. [Reconciled conflicts](#reconciled-conflicts)
14. [Output format](#output-format)

---

## How to use it

**Reviewing.** Run `python scripts/motion.py <path>` for the machine-checkable subset, then read for the rest — purpose, frequency, cohesion, and staging need a human judgment the regex can't make. Report every finding as `file:line — [rule-id] one sentence`, then the summary table (§14).

**Writing.** The pass column is the spec. Never approximate a value that appears in §12 — copy it. When a rule and a design decision genuinely conflict, that's a deviation and it gets named in the report with a reason, the same as any other deviation.

**A finding needs evidence.** "The animations feel slow" is not a finding. `components/dropdown.tsx:34 — [timing-over-300ms] 420ms open on a menu opened dozens of times a day` is.

---

## Severity

Shared with `lint.py` and `audit.py` so one vocabulary covers the whole skill.

| | Meaning | Effect |
|---|---|---|
| **P0** | Feel-breaking or accessibility-breaking. Wrong on any product. | Blocks "done". |
| **P1** | Noticeably off. Correct in some narrow case, wrong here. | Fix before shipping unless justified in writing. |
| **P2** | Polish and consistency. | Worth doing; not a blocker. |

**Frequency escalates severity.** The same finding on a command palette (opened 100+ times a day) and on an onboarding screen (seen once) are not the same finding. Establish the frequency map during recon (`references/audit-protocol.md` §1) and let it move severity up a level, never down past P1 for anything in the a11y group.

---

## Purpose rules

The gate. These run before any other category, and the strongest fix here is almost always **delete the animation**.

### `purpose-none` · P0

Motion with no nameable job. Every animation must be one of: **feedback** (the interface heard you), **spatial consistency** (where it came from / went), **state indication** (a change is legible), **preventing a jarring change** (content would otherwise teleport), **explanation** (marketing/onboarding demo), or **delight** (rare/first-time only).

**Fail**
```tsx
// A hero graphic that rotates forever because the page looked static
<motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20 }}>
  <ProductScreenshot />
</motion.div>
```

**Pass**
```tsx
// Static. The screenshot's job is to be read, not to move.
<ProductScreenshot />
```

Can't name the job in one of those six words? Don't build it. "It looks cool" on a frequently-seen element is a reason to stop.

### `purpose-high-frequency` · P0

Actions performed 100+ times a day, and **every keyboard-initiated action**, do not animate. This is a disqualifier, not a judgment call — Raycast's command palette has no open/close animation, and that is correct.

| Frequency | Decision |
|---|---|
| 100+/day, or keyboard-initiated | **No animation. Ever.** |
| Tens/day (hover, list nav) | Near-imperceptible, or nothing |
| Occasional (modal, drawer, toast) | Standard animation |
| Rare / first-time (onboarding, success) | The delight budget lives here |

**Fail**
```tsx
// ⌘K palette, opened dozens of times an hour
<motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}>
```

**Pass**
```tsx
// Appears instantly. The user already knows where it came from — they summoned it.
<div className="command-palette">
```

Animating high-frequency actions is the most common cause of software that feels slow while measuring fast.

### `purpose-decorative-on-data` · P1

Data the user is reading or acting on does not move for style. A mouse-tracking parallax belongs on a marketing page, not on a balance in a banking app or a row in a table.

**Fail**
```tsx
<td><motion.span animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity }}>{balance}</motion.span></td>
```

**Pass**
```tsx
<td>{balance}</td>
{/* If the value changed from a push, flash the row background 200ms — that's state indication, not decoration. */}
```

**Hunt:** `repeat: Infinity`, `animation-iteration-count: infinite`, `whileHover` on table cells, mouse-position handlers on data surfaces.

---

## Timing rules

### `timing-over-300ms` · P0

UI animations stay under 300ms. A 180ms dropdown feels more responsive than a 400ms one. Marketing, onboarding, and one-per-session choreographed moments are the documented exceptions.

**Fail**
```css
.dropdown { transition: transform 420ms var(--ease-out), opacity 420ms var(--ease-out); }
```

**Pass**
```css
.dropdown { transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out); }
```

Budgets — see §12 for the full table. Large surfaces get the top of their range; a full-height sheet at 150ms reads as a glitch.

### `timing-inconsistent` · P2

Sibling elements of the same kind use identical timing. Three buttons at 200/150/220ms is not a system.

**Fail**
```css
.btn-primary   { transition: transform 200ms; }
.btn-secondary { transition: transform 150ms; }
.btn-ghost     { transition: transform 220ms; }
```

**Pass**
```css
.btn-primary, .btn-secondary, .btn-ghost { transition: transform var(--dur-press); }
```

### `timing-symmetric-press` · P2

Where the user is *deciding*, the deliberate phase is slow and the system's response snaps. Symmetric press/release timing reads mechanical.

**Fail**
```css
.hold-to-delete       { transition: transform 200ms; }
.hold-to-delete:active{ transform: scale(0.97); }   /* same 200ms back */
```

**Pass**
```css
.hold-to-delete        { transition: transform 200ms var(--ease-out); }  /* release: snappy */
.hold-to-delete:active { transform: scale(0.97); transition: transform 2s linear; } /* hold: deliberate */
```

### `timing-scale-mismatch` · P2

Duration scales with the distance travelled and the size of the surface. A tooltip and a full-screen sheet cannot share a duration.

**Fail**
```css
.tooltip, .sheet { transition: transform 150ms; }
```

**Pass**
```css
.tooltip { transition: transform 150ms var(--ease-out); }
.sheet   { transition: transform 300ms var(--ease-drawer); }
```

---

## Easing rules

### `easing-transition-all` · P0

`transition: all` animates properties nobody chose, including layout-triggering ones, off the GPU. Always a finding.

**Fail**
```css
.card { transition: all 200ms ease; }
```

**Pass**
```css
.card { transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out); }
```

### `easing-ease-in-on-ui` · P0

`ease-in` starts slow, delaying the exact moment the user is watching. `ease-out` at 200ms *feels* faster than `ease-in` at 200ms.

**Fail**
```css
.modal-enter { transition-timing-function: ease-in; }
.toast-exit  { transition-timing-function: ease-in; }   /* fades in place — still wrong */
```

**Pass**
```css
.modal-enter { transition-timing-function: var(--ease-out); }
.toast-exit  { transition-timing-function: var(--ease-out); }
```

**The one exception**, and it is narrow: an element travelling *fully off-screen* (a sheet dropping past the bottom edge, a panel sliding out past the viewport) may accelerate into its departure with `--ease-in`. An in-place fade, a scale-down, or anything that settles at a visible resting state never does. See §13.

### `easing-default-curve` · P1

Browser built-in `ease`, `ease-out`, and `ease-in-out` are too weak for deliberate motion — they're the "system-sans" of easing. Fine for a hover color change; unauthored on anything the user watches travel.

**Fail**
```css
.drawer { transition: transform 300ms ease-in-out; }
```

**Pass**
```css
:root { --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1); }   /* see §12 */
.drawer { transition: transform 300ms var(--ease-drawer); }
```

Need a curve that isn't in §12? Take it from [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/). Don't hand-roll one and don't type `cubic-bezier(0.4, 0, 0.2, 1)` from memory.

### `easing-linear-motion` · P2

`linear` is for continuous motion only — progress bars, spinners, marquees, scrubbing. Anything that starts and stops has weight.

**Fail**
```css
.card { transition: transform 200ms linear; }
```

**Pass**
```css
.card     { transition: transform 200ms var(--ease-out); }
.progress { transition: width 100ms linear; }
```

---

## Physics rules

### `physics-scale-zero` · P0

Nothing in the real world appears from nothing. Entrances start at `scale(0.9–0.97)` with `opacity: 0`.

**Fail**
```css
@starting-style { .popover { transform: scale(0); opacity: 0; } }
```

**Pass**
```css
@starting-style { .popover { transform: scale(0.95); opacity: 0; } }
```

### `physics-origin-center` · P1

Popovers, dropdowns, menus, tooltips, selects, and comboboxes scale **from their trigger**, so the motion says where they came from. **Modals are exempt** — they aren't anchored to anything, so centered is correct; don't report it.

**Fail**
```css
.dropdown-content { transform-origin: center; }
```

**Pass**
```css
/* Base UI / Radix expose the resolved origin as a variable */
.dropdown-content { transform-origin: var(--transform-origin); }
```

### `physics-no-press-feedback` · P1

Anything pressable acknowledges the press. This is the cheapest tactility upgrade in most interfaces.

**Fail**
```css
.button:hover { background: var(--surface-2); }
/* no :active */
```

**Pass**
```css
.button:hover  { background: var(--surface-2); }
.button:active { transform: scale(0.97); transition: transform 160ms var(--ease-out); }
```

### `physics-excessive-deformation` · P1

Squash and stretch stay in the **0.95–1.05** range. Past that it reads as a toy, not a control.

**Fail**
```tsx
<motion.button whileTap={{ scale: 0.8 }} />
```

**Pass**
```tsx
<motion.button whileTap={{ scale: 0.97 }} />
```

### `physics-spring-for-overshoot` · P2

Overshoot-and-settle is a spring's job. A duration + curve that fakes it will not survive interruption.

**Fail**
```tsx
<motion.div transition={{ duration: 0.3, ease: "easeOut" }} />  // but the element should settle past its mark
```

**Pass**
```tsx
<motion.div transition={{ type: "spring", duration: 0.5, bounce: 0.2 }} />
```

Keep `bounce` at 0.1–0.3 and reserve visible bounce for drag-to-dismiss and deliberately playful moments. A dashboard does not bounce.

### `physics-hard-drag-boundary` · P2

A drag that hits its limit and stops dead has no mass. Resistance rises toward the boundary.

**Fail**
```ts
const y = Math.min(Math.max(dragY, 0), MAX);   // hard clamp
```

**Pass**
```ts
const y = dragY > MAX ? MAX + (dragY - MAX) * 0.25 : dragY;  // rubber-band past the limit
```

---

## Interruption rules

CSS **transitions** retarget from the current value mid-flight. **Keyframes** restart from zero. Anything a user can trigger twice in a second must be a transition or a spring.

### `interrupt-keyframes-on-rapid` · P0

**Fail**
```css
@keyframes toast-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
.toast { animation: toast-in 200ms var(--ease-out); }   /* second toast restarts the first */
```

**Pass**
```css
.toast              { transform: translateY(100%); transition: transform 200ms var(--ease-out); }
.toast[data-open]   { transform: translateY(0); }
```

Applies to toasts, toggles, switches, tooltips in a toolbar, expand/collapse, and anything driven by a rapidly changing value.

### `interrupt-tween-on-gesture` · P1

Gesture-driven motion uses springs — they carry velocity through an interruption. A fixed-duration tween throws the user's momentum away.

**Fail**
```tsx
<motion.div drag="y" dragSnapToOrigin transition={{ duration: 0.3, ease: "easeOut" }} />
```

**Pass**
```tsx
<motion.div drag="y" dragSnapToOrigin transition={{ type: "spring", duration: 0.5, bounce: 0.15 }} />
```

### `interrupt-asymmetric-exit-path` · P1

Exit the way it entered. A toast that slid up from the bottom leaves through the bottom. Symmetric paths are what make swipe-to-dismiss feel obvious before anyone explains it.

**Fail**
```tsx
initial={{ y: 40, opacity: 0 }}  animate={{ y: 0, opacity: 1 }}  exit={{ scale: 0.9, opacity: 0 }}
```

**Pass**
```tsx
initial={{ y: 40, opacity: 0 }}  animate={{ y: 0, opacity: 1 }}  exit={{ y: 40, opacity: 0 }}
```

Timing may differ — exits are usually a touch faster, because people wait for things to appear and want them gone immediately. The *path* does not.

### `interrupt-distance-only-dismiss` · P2

A fast flick that covers little distance is still a dismissal. Dismiss on velocity **or** distance, not distance alone.

**Fail**
```ts
if (Math.abs(offsetY) > 120) dismiss();
```

**Pass**
```ts
const velocity = Math.abs(offsetY) / elapsedMs;      // px per ms
if (velocity > 0.11 || Math.abs(offsetY) > 120) dismiss();
```

---

## Performance rules

### `perf-layout-property` · P0

Animate **`transform` and `opacity`**. `width`, `height`, `margin`, `padding`, `top`, `left`, `right`, `bottom` trigger layout, paint, and composite on every frame. `clip-path` is the sanctioned fourth; `height` is tolerated only for accordions, where there is no transform equivalent — and even there, `grid-template-rows: 0fr → 1fr` is better.

**Fail**
```css
.panel { transition: height 300ms var(--ease-out), margin-top 300ms var(--ease-out); }
```

**Pass**
```css
.panel-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 300ms var(--ease-out); }
.panel-wrap[data-open] { grid-template-rows: 1fr; }
.panel { overflow: hidden; }
```

### `perf-motion-shorthand` · P1

Motion's `x` / `y` / `scale` props are **not** hardware-accelerated — they run on the main thread and drop frames while the page is busy. Use the full transform string on anything that animates during load or under load.

**Fail**
```tsx
<motion.div animate={{ x: 100 }} />
```

**Pass**
```tsx
<motion.div animate={{ transform: "translateX(100px)" }} />
```

### `perf-parent-var-transform` · P1

Setting a CSS variable on a parent to drive children's transforms recalculates styles for every child on every frame. Set `transform` on the element itself.

**Fail**
```ts
container.style.setProperty("--x", `${mouseX}px`);
/* .child { transform: translateX(var(--x)); } — recalcs for all children */
```

**Pass**
```ts
el.style.transform = `translateX(${mouseX}px)`;   // or a Motion value bound to that element
```

### `perf-animated-blur` · P1

Blur radius is the most expensive common property to animate, and it is worst in Safari. Animate the **opacity of a pre-blurred layer** instead. Static transition-time blur stays under 20px.

**Fail**
```css
.overlay { transition: backdrop-filter 300ms; }
.overlay[data-open] { backdrop-filter: blur(24px); }
```

**Pass**
```css
.overlay { backdrop-filter: blur(12px); opacity: 0; transition: opacity 300ms var(--ease-out); }
.overlay[data-open] { opacity: 1; }
```

### `perf-shadow-animation` · P2

`box-shadow` repaints. Put the shadow on a pseudo-element and animate its opacity.

**Fail**
```css
.card:hover { box-shadow: 0 12px 32px rgb(0 0 0 / 0.18); transition: box-shadow 200ms; }
```

**Pass**
```css
.card::after { content: ""; position: absolute; inset: 0; box-shadow: var(--e-3);
               opacity: 0; transition: opacity 200ms var(--ease-out); pointer-events: none; }
.card:hover::after { opacity: 1; }
```

### `perf-will-change-permanent` · P2

`will-change` applied permanently to many elements exhausts GPU memory and makes everything slower. Apply just before the animation, remove after — or leave it off entirely, which is usually right.

**Fail**
```css
.card, .row, .tile { will-change: transform, opacity; }
```

**Pass**
```css
.card[data-animating] { will-change: transform; }
```

---

## Accessibility rules

### `a11y-no-reduced-motion` · P0

Movement without a `prefers-reduced-motion` branch. Not a preference — some users get genuinely ill from parallax and large-scale movement.

**Fail**
```css
.hero { transform: translateY(40px); transition: transform 600ms; }
/* no reduced-motion handling anywhere */
```

**Pass**
```css
@media (prefers-reduced-motion: reduce) {
  .hero { transform: none; transition: opacity 200ms ease; }
}
```
```tsx
const reduce = useReducedMotion();
const closedX = reduce ? 0 : "-100%";
```

### `a11y-reduced-motion-nuked` · P2

Reduced motion means **fewer and gentler**, not zero. A global `animation-duration: 0.01ms !important` reset as the *only* handling strips the state-change feedback those users still need.

**Fail**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
/* ...and nothing else in the codebase */
```

**Pass** — per-element degradation, with the global reset kept only as the safety net for what you missed:

| Full | Reduced |
|---|---|
| Slide + fade entrance | Fade only, shorter |
| Scale / zoom transition | Opacity crossfade |
| Parallax, scroll-scrub | Static final state |
| Auto-playing loop, marquee | Paused, or a static frame |
| Spring physics on drag | Instant snap |
| Hover / focus / status color | **Unchanged** — it's feedback, not decoration |

### `a11y-ungated-hover` · P1

Touch devices fire a false `:hover` on tap, leaving elements stuck in a hover state.

**Fail**
```css
.card:hover { transform: scale(1.03); }
```

**Pass**
```css
@media (hover: hover) and (pointer: fine) {
  .card:hover { transform: scale(1.03); }
}
```

### `a11y-flash-rate` · P0

Nothing flashes, strobes, or oscillates above **3Hz**. This is a seizure risk, not a taste question.

Also honor `prefers-reduced-transparency` wherever a direction leans on translucency.

---

## Cohesion rules

### `cohesion-fade-up-everything` · P1

The single most identifying tell of generated motion: every section entering with `opacity: 0, y: 20` over ~500ms on scroll.

**Fail**
```tsx
{sections.map(s => (
  <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} />
))}
```

**Pass** — animate the first screenful only, or reveal *groups* rather than every element, never re-trigger on scroll-up, and let the rest of the page be still:
```tsx
<motion.section initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} />
```

**The replacement principle:** animate one thing well rather than everything a little. Motion distributed evenly across a page reads as a setting that got turned on.

### `cohesion-token-sprawl` · P2

Five hand-typed cubic-beziers that almost match is not a system; it's five decisions nobody made.

**Fail**
```css
.a { transition: 200ms cubic-bezier(0.16, 1, 0.30, 1); }
.b { transition: 210ms cubic-bezier(0.18, 1, 0.32, 1); }
.c { transition: 200ms cubic-bezier(0.16, 1, 0.28, 1); }
```

**Pass**
```css
:root { --ease-out: cubic-bezier(0.16, 1, 0.3, 1); --dur-2: 200ms; }
.a, .b, .c { transition: transform var(--dur-2) var(--ease-out); }
```

**Extend the codebase's existing tokens; never fork them.** Adding a parallel scale next to one that already exists is itself the defect.

### `cohesion-stagger-excessive` · P2

Stagger is decorative. It must never delay interaction.

- **30–60ms per item**, hard cap **80ms**.
- Total sequence ≤ **400ms** — cap the item count, don't just lower the delay.
- Below 20ms it reads as simultaneous; twenty items at 60ms means the last one arrives 1.2s late.

**Fail**
```tsx
transition={{ staggerChildren: 0.15 }}
```

**Pass**
```tsx
transition={{ staggerChildren: 0.04, delayChildren: 0.08 }}
```

### `cohesion-no-stagger` · P2

The inverse: a group entering all at once where a short stagger would give the eye an order to read in. Only where the content genuinely has an order.

### `cohesion-personality-mismatch` · P2

One bouncy component in an otherwise crisp app, or one severe component in a playful one. Motion carries personality the same way type does, and it has to be the same personality throughout.

---

## Staging rules

### `staging-competing-focal` · P1

One element animates prominently at a time. Two competing entrances means the eye picks one at random and the choreography did nothing.

**Fail**
```tsx
<motion.div animate={{ scale: 1.1 }} />
<motion.div animate={{ scale: 1.1 }} />   // simultaneous, equal weight
```

**Pass** — sequence them, or animate one and let the other arrive already settled.

### `staging-undimmed-overlay` · P2

A modal or dialog dims what's behind it, so attention has somewhere to go.

**Fail**
```css
.overlay { background: transparent; }
```

**Pass**
```css
.overlay { background: rgb(0 0 0 / 0.4); opacity: 0; transition: opacity 200ms var(--ease-out); }
```

### `staging-z-index-hierarchy` · P2

Animated overlays declare their layer. A tooltip with no `z-index` renders behind whatever gets a stacking context next.

**Fail**
```css
.tooltip { position: absolute; }
```

**Pass**
```css
.tooltip { position: absolute; z-index: var(--z-tooltip); }
```

Layering belongs in the token spec (`references/tokens.md`), not typed per component.

---

## The canonical values

Copy these. Never approximate one.

### Easing tokens

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);       /* strong ease-out — the default for UI */
--ease-out-soft: cubic-bezier(0.25, 1, 0.5, 1);       /* gentler entrance */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);      /* movement between two on-screen states */
--ease-drawer:   cubic-bezier(0.32, 0.72, 0, 1);      /* iOS-like drawer / sheet */
--ease-in:       cubic-bezier(0.55, 0, 1, 0.45);      /* off-screen departures ONLY — see §13 */
--ease-back:     cubic-bezier(0.34, 1.56, 0.64, 1);   /* slight overshoot, playful directions only */
```

These are the same values `references/tokens.md` emits — **one set, one source.** If a
direction wants a different curve, change it in the token spec and let it propagate;
don't type a second one next to it.

### Easing decision order

| Situation | Easing |
|---|---|
| Entering | `--ease-out` |
| Exiting, settling at a visible state | `--ease-out` |
| Exiting fully off-screen | `--ease-in` (the narrow exception) |
| Moving / morphing on screen | `--ease-in-out` |
| Hover, focus, color change | browser `ease` is fine |
| Constant motion (marquee, progress, spinner) | `linear` |
| Anything interruptible or gesture-driven | a **spring**, not a curve |
| Default when unsure | `--ease-out` |

### Duration budgets

| Element | Duration |
|---|---|
| Button press feedback | 100–160ms |
| Hover, focus, color change | 100–150ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects, menus | 150–250ms |
| Modals | 200–300ms |
| Sheets, drawers | 250–500ms — they travel further; iOS-style sheets land near 500ms |
| Full-screen / page transitions | 300–400ms |
| Choreographed brand moment | 400–800ms, **once** |
| Marketing / explanatory | Longer is allowed |

**UI stays under 300ms**, with sheets and drawers the documented exception — distance travelled is part of the budget, and `scripts/motion.py` applies the wider ceiling when the selector or file says drawer/sheet. Exits are usually slightly faster than entrances.

### Spring configs

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }               // Apple-style — easier to reason about
{ type: "spring", stiffness: 400, damping: 30 }              // snappy UI
{ type: "spring", stiffness: 200, damping: 22 }              // softer, larger movement
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }     // traditional physics, most control
```

Bounce 0.1–0.3. Avoid visible bounce in most UI; reserve it for drag-to-dismiss and playful interactions.

### Tool ladder — cheapest that works

Walk down, stop at the first that fits.

| Need | Tool |
|---|---|
| Hover, press, color, a state toggle you control via class or attribute | **CSS transition** |
| Entry animation on mount, no JS state | **CSS `@starting-style`** (+ `transition-behavior: allow-discrete`) |
| Predetermined motion that must stay smooth while the page is loading | **CSS animation** (runs off the main thread) |
| Programmatic control with CSS performance, no library | **WAAPI** (`element.animate()`) |
| Springs, layout/shared-element animation, exit animation, gestures | **Motion** (`motion/react`) |
| Multi-element timelines with precise sequencing, scroll-scrubbed narrative | **GSAP** (+ ScrollTrigger) |
| Route/page transitions | **View Transitions API**, feature-detected |
| Designer-authored illustrated animation with state machines | **Rive** |

If the task actually needs a *component* — a toast, a drawer, a command menu, a dropdown — build on a headless primitive (Base UI, Radix) rather than hand-rolling one. Hand-rolled overlays are how you end up with a `<div>` dropdown and no focus management.

Full library guidance, scroll technique, and bundle-cost honesty: `references/motion.md` §3–§8.

---

## Reconciled conflicts

Where the sources this catalog merges disagree, the resolution and its reasoning:

**Exit easing.** One tradition says exits use `ease-in` (build momentum before departure); the other says `ease-in` is never correct on UI because it delays the moment the user is watching. **Resolution:** `--ease-out` for exits by default. `--ease-in` is permitted *only* when the element travels fully off-screen, where acceleration-into-departure reads as physics rather than lag. Never for an in-place fade or scale-down. Codified in `easing-ease-in-on-ui`.

**Stagger ceiling.** Sources give 50ms, 60ms, and 80ms. **Resolution:** 30–60ms typical, 80ms hard cap, plus a total-sequence ceiling of 400ms — the per-item number was never the real constraint; the last item's arrival time is.

**Context-menu entrances.** One source bans entrance animation on context menus outright (exit only). **Resolution:** subsumed by `purpose-high-frequency`, which is the actual reason — right-click menus and keyboard-summoned menus are high-frequency, so they don't animate in. A menu opened rarely from a deliberate click may animate at 150ms from its trigger origin.

**Reduced motion.** A global `!important` reset is a safety net, not an implementation. Per-element degradation is the rule; the reset catches what you missed. Codified in `a11y-reduced-motion-nuked`.

---

## Output format

Findings, one line each, ordered by severity then file:

```
components/modal/index.tsx:45 — [timing-over-300ms] 420ms exit on a modal; budget is 200–300ms
components/button/styles.css:12 — [physics-no-press-feedback] :hover styled, no :active state
app/globals.css:88 — [easing-transition-all] `transition: all` on .card animates layout properties off-GPU
```

Then the summary:

| Rule | Count | Severity |
|---|---|---|
| `timing-over-300ms` | 2 | P0 |
| `physics-no-press-feedback` | 3 | P1 |
| `easing-default-curve` | 1 | P1 |

Then, separately from the corrective findings, **missed opportunities** — at most a handful, each grounded in an actual UX seam you observed, never a wishlist:

- State changes that teleport where a brief transition would prevent a jarring change.
- Spatially-connected UI (a panel from a trigger) with no motion explaining where it came from.
- Rare high-emotion moments (first-run, success) rendered with none of the delight budget they're allowed.

A clean run means nothing on this list is wrong. It does not mean the motion is good — purpose, cohesion, and staging are judged, not scanned, and "the motion here is already right" is a valid result.
