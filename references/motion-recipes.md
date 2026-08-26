# Motion Recipes

Correct implementations for the cases that come up most. **Start from the recipe, adapt, don't rebuild from a blank file** — every one here already satisfies `references/motion-rules.md`, and rebuilding from scratch is where `ease-in`, `scale(0)`, and `transition: all` come back.

Curves and durations are the tokens in `motion-rules.md` §12. If the codebase already defines an easing or duration scale, **extend it — never fork it.**

Each recipe states its **reduced-motion** degradation. That ships with the animation, not after it.

**Contents** — [Button press](#button-press) · [Dropdown / popover / menu](#dropdown-popover-menu-select) · [Tooltip](#tooltip) · [Modal](#modal) · [Drawer / sheet](#drawer--sheet) · [Toast](#toast) · [Accordion](#accordion--collapse) · [Group stagger](#group-stagger) · [Hold to confirm](#hold-to-confirm) · [Tab indicator](#tab-indicator) · [Shared element](#shared-element-transition) · [Row flash](#row-flash-on-a-push-update) · [Skeleton → content](#skeleton--content) · [Scroll reveal](#scroll-reveal) · [Drag to dismiss](#drag-to-dismiss) · [Masking a crossfade](#masking-a-crossfade-that-wont-settle) · [WAAPI](#programmatic-without-a-library)

---

## Button press

Any pressable element. The cheapest tactility upgrade in most interfaces.

```css
.button { transition: transform 160ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```

`scale()` scales children too — label and icon come along, which is what makes it read as a physical press. No hover gating needed: `:active` is a real press on touch. Gate any `:hover` styling separately (`a11y-ungated-hover`).

Motion equivalent: `whileTap={{ scale: 0.97 }}`.

**Reduced motion:** keep it. A 160ms scale of 3% is feedback, not movement.

---

## Dropdown, popover, menu, select

Scales out of its trigger, not out of thin air.

```css
.popover {
  transform-origin: var(--transform-origin);   /* Base UI / Radix supply this */
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}
.popover[data-starting-style],
.popover[data-ending-style] { opacity: 0; transform: scale(0.95); }
```

The `transform-origin` is the whole point — the panel should look like it came out of the thing you clicked (`physics-origin-center`).

**Gate first:** if this menu is keyboard-summoned or opened dozens of times an hour, it doesn't animate at all (`purpose-high-frequency`).

**Reduced motion:** opacity only, 150ms. Drop the scale.

---

## Tooltip

A popover, faster, plus the detail most implementations miss.

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition: transform 125ms var(--ease-out), opacity 125ms var(--ease-out);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] { opacity: 0; transform: scale(0.97); }

/* Once one tooltip in the group is open, neighbours open instantly */
.tooltip[data-instant] { transition-duration: 0ms; }
```

The initial delay prevents accidental activation. After that, skipping both the delay *and* the animation makes the whole toolbar feel faster. A toolbar where every tooltip re-delays and re-animates is the single most common way a fast app feels slow.

**Reduced motion:** opacity only.

---

## Modal

The one popover that stays centered.

```css
.modal {
  transform-origin: center;                     /* exempt — not anchored to a trigger */
  transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out);
}
.modal[data-starting-style],
.modal[data-ending-style] { opacity: 0; transform: scale(0.96); }

.backdrop { background: rgb(0 0 0 / 0.4); transition: opacity 250ms var(--ease-out); }
.backdrop[data-starting-style],
.backdrop[data-ending-style] { opacity: 0; }
```

Animate the backdrop's opacity alongside it so they read as one surface. The backdrop dims for a reason — attention needs somewhere to go (`staging-undimmed-overlay`).

**Reduced motion:** opacity only on both, 200ms.

---

## Drawer / sheet

```css
.drawer { transform: translateY(0); transition: transform 300ms var(--ease-drawer); }
.drawer[data-closed] { transform: translateY(100%); }
```

`translateY(100%)` is the element's **own height**, whatever the content — never a hardcoded pixel offset. Larger surfaces take the top of their duration range (250–500ms for sheets); a full-height sheet at 150ms reads as a glitch, and 500ms is correct for an iOS-style one.

Add drag and it becomes a gesture problem — see [Drag to dismiss](#drag-to-dismiss).

**Reduced motion:** opacity crossfade, 200ms, no translate.

---

## Toast

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

Two deliberate departures from the generic budget: `ease` rather than a strong curve, and 400ms rather than 250ms. Sonner reads as elegant partly because its motion is tuned to the *component's* personality rather than to the UI budget — which is a decision, made once, and written down. Don't copy the departure without copying the reason.

**Transitions, not keyframes** (`interrupt-keyframes-on-rapid`): a second toast arriving mid-animation must retarget, not restart.

Pre-`@starting-style` fallback:
```jsx
useEffect(() => { setMounted(true); }, []);
// <div data-mounted={mounted}>
```

When toasts stack and the list reflows, the opacity change works against the height change. There's no formula for that pair — tune it, then **look at it again the next day**.

**Reduced motion:** opacity only. Exits the way it entered (`interrupt-asymmetric-exit-path`) — through the bottom.

---

## Accordion / collapse

```css
.panel-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms var(--ease-out); }
.panel-wrap[data-open] { grid-template-rows: 1fr; }
.panel { overflow: hidden; }
```

The `0fr → 1fr` grid trick is the clean version — no measured heights, no `height: auto`. If the stack can't use it, animating `height` to a JS-measured value is the sanctioned exception to `perf-layout-property`; keep it short, because it costs layout on every frame.

**Reduced motion:** instant toggle, keep a 150ms opacity fade on the content.

---

## Group stagger

For a list or grid the user sees **occasionally** — never for a list they scroll past all day.

```css
.item { opacity: 0; transform: translateY(8px); animation: fadeIn 300ms var(--ease-out) forwards; }
.item:nth-child(2) { animation-delay: 40ms; }
.item:nth-child(3) { animation-delay: 80ms; }
.item:nth-child(4) { animation-delay: 120ms; }
@keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
```

Motion equivalent:
```tsx
const list = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 8 },
               show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } } };
```

30–60ms per item, 80ms hard cap, **total sequence ≤ 400ms** — cap the item count, don't just lower the delay. Stagger is decorative and must never block interaction while it plays.

**Reduced motion:** all items appear at once, opacity only.

---

## Hold to confirm

For destructive actions where a plain click is too easy to fire by accident.

```css
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); }  /* release: snappy */
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; }  /* hold: deliberate */
.button:active { transform: scale(0.97); }
```

`linear` is correct here — the fill is a progress indicator, and progress doesn't ease. The asymmetry is the design (`timing-symmetric-press`): slow where the user is deciding, instant where the system responds.

**Reduced motion:** keep it. It's a progress indicator, not decoration.

---

## Tab indicator

Timing individual color transitions across a tab list never quite lands — the background and the label always arrive a beat apart. Clip instead.

Duplicate the tab list, style the copy as the active state (different background, different text color), clip the copy so only the active tab shows, and animate the clip:

```css
.tabs-active-copy {
  clip-path: inset(0 60% 0 20%);              /* driven by the active tab's position */
  transition: clip-path 250ms var(--ease-in-out);
}
```

Text and background change in perfect sync because they're **one element being revealed**, not two colors being interpolated.

Motion alternative: `layoutId` on a pill behind the labels — simpler, but you're back to interpolating the label color separately.

**Reduced motion:** instant clip change.

---

## Shared element transition

The highest-value Motion feature and the most over-applied. Use it when a thing genuinely *becomes* another thing — thumbnail → lightbox, row → detail, card → expanded panel.

```tsx
<motion.img layoutId={`doc-${id}`} transition={{ type: "spring", duration: 0.5, bounce: 0.1 }} />
```

`layout` on many simultaneous elements measures every frame — keep it to a handful. If the two elements aren't the same object, this is a crossfade wearing a costume; don't reach for it.

Cross-route equivalent: the View Transitions API with `view-transition-name`, feature-detected so it no-ops elsewhere.

**Reduced motion:** 150ms opacity crossfade between the two states.

---

## Row flash on a push update

State the user didn't cause needs to announce itself without stealing focus.

```css
.row { transition: background-color 200ms linear; }
.row[data-updated] { background-color: var(--accent-wash); }   /* attribute removed after ~1.2s */
```

`linear` because it's a status wash, not travel. Never move the row — data being read doesn't move (`purpose-decorative-on-data`).

**Reduced motion:** keep it. Color feedback survives reduced motion; movement doesn't.

---

## Skeleton → content

```css
.skeleton { animation: pulse 1.6s var(--ease-in-out) infinite; }
@keyframes pulse { 50% { opacity: 0.55; } }
.content { animation: fadeIn 150ms var(--ease-out); }
```

Match the skeleton's **shape** to the content it stands in for, or the swap is a layout jump wearing a loading state. Skeleton for sub-second waits, spinner for indeterminate ones, progress for anything over ~3s. Nothing above 3Hz (`a11y-flash-rate`).

**Reduced motion:** static skeleton at a fixed opacity, no pulse.

---

## Scroll reveal

Marketing surfaces only. Don't do this to functional UI a user visits daily.

```css
.reveal { clip-path: inset(0 0 100% 0); transition: clip-path 600ms var(--ease-in-out); }
.reveal[data-visible] { clip-path: inset(0 0 0 0); }
```

Trigger with `IntersectionObserver`, or Motion's `useInView` with `{ once: true, margin: "-15%" }`. **Fire it once** — re-animating on every scroll-by is an interface fighting its reader.

A clip reveal is also a deliberate alternative to the fade-up tell (`cohesion-fade-up-everything`): it reads as material being uncovered rather than as the default everything-fades-in-20px. Apply it to the first screenful or to *groups*, not to every element on the page.

**Reduced motion:** render at the final state. No reveal.

---

## Drag to dismiss

Springs, not durations — the user can reverse mid-motion.

```js
// Dismiss on a flick, not just on distance
const elapsed  = Date.now() - dragStart.current;
const velocity = Math.abs(swipeAmount) / elapsed;          // px per ms
if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) dismiss();
```

```js
// Set transform on the dragged element directly.
// Driving it through a CSS variable on the parent recalcs styles for every child.
element.style.transform = `translateY(${distance}px)`;
```

Four details separate a good drag from a bad one:

- **Pointer capture** on drag start, so it continues when the pointer leaves the element's bounds.
- **Multi-touch protection** — `if (isDragging) return` on new touch points, or switching fingers mid-drag makes the element jump.
- **Damping past boundaries** — over-drag moves the element less the further it goes.
- **Friction, not a wall** — allow the over-drag with rising resistance rather than refusing it (`physics-hard-drag-boundary`).

Settle with a spring so an interrupted drag keeps its velocity:
```js
{ type: "spring", duration: 0.5, bounce: 0.2 }
```

**Reduced motion:** instant snap to the settled position. Keep the drag itself — it's direct manipulation, not animation.

---

## Masking a crossfade that won't settle

When two states overlap visibly during a transition and no amount of easing or duration tuning fixes it, blur the seam:

```css
.content { transition: filter 200ms ease, opacity 200ms ease; }
.content.transitioning { filter: blur(2px); opacity: 0.7; }
```

Without blur the eye reads two distinct objects swapping; blur blends them into one perceived transformation. Keep it under 20px — heavy blur is expensive, especially in Safari, and animating the *radius* is worse than animating the opacity of a pre-blurred layer (`perf-animated-blur`). At 2px over 200ms the cost is acceptable; scale it up and it isn't.

---

## Programmatic, without a library

When the motion needs JS control but not a dependency, WAAPI gives CSS-grade performance:

```js
element.animate(
  [{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }],
  { duration: 400, fill: "forwards", easing: "cubic-bezier(0.65, 0, 0.35, 1)" }
);
```

Hardware-accelerated, interruptible, no bundle cost. This is rung 4 of the tool ladder — reach for it before adding a motion library for one animation.

---

## What to feel-check

Some things can't be judged from code. When the result depends on one of these, say so and put the check in the report rather than guessing at a value:

- **Crossfades and opacity/height pairs** — play at 2–5× duration, or step frame by frame in the DevTools animation inspector.
- **A spring's bounce** — feels different at 60fps than it reads as a number.
- **Gestures** — a real device, real thumb. A trackpad drag proves nothing about a phone.
- **Anything you just tuned** — look at it again the next day. Familiarity is not the same as correctness.
