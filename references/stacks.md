# Stack Playbooks

One good example per stack beats a generic template for each — adapt these, don't fill them in like a form.

---

## 1. React + Tailwind + shadcn/ui

**Style and theme are two different axes — don't confuse them.** `shadcn`'s "style" (chosen at `init`/`create` time, e.g. `default` vs `new-york`) sets the component *foundation*: shape, density, which primitives compose which. "Theme" is colors, typography, and radius layered on top via CSS variables. Recoloring a `default`-style install doesn't change the fact that it's still shape- and density-wise the stock component library — if the direction calls for a denser or more angular structural feel, that's a style decision, made once, before any token work starts, not something a palette swap can retrofit.

**The default install is a starting point, not a finished palette.** shadcn ships with a `zinc`-based theme in `globals.css` as CSS custom properties. The direction's tokens replace those variables at the source — never override shadcn's classes ad hoc per-component, which is how a build ends up half on-brand and half on shadcn's defaults depending on which screen you're looking at.

```css
/* globals.css — replace shadcn's defaults with the direction's tokens,
   once, so every shadcn primitive inherits the direction automatically */
:root {
  --background: 39 33% 97%;      /* from --bg in the token spec, in HSL for shadcn's format */
  --foreground: 27 10% 15%;      /* from --text */
  --primary: 8 60% 44%;          /* from --accent */
  --primary-foreground: 0 0% 100%;
  --radius: 0.3125rem;           /* from --r-md — not shadcn's 0.5rem default */
}
```

Then extend the `Button` (or whichever primitive the direction leans on) with the variants the spec actually needs, instead of using only what shipped:

```tsx
// button-variants.ts — add the direction's variant, don't just reach for "default"
const buttonVariants = cva(base, {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      // added for this direction: the one quiet action that shouldn't compete
      quiet: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] underline-offset-4 hover:underline",
    },
  },
});
```

One visual weight of "primary" per screen. If two CTAs both render `variant="default"`, one of them needs to become `quiet` or `outline` — that's a Step B2 decision, not a Step B4 cleanup.

## 2. Plain HTML/CSS (+ vanilla JS only if needed)

No framework signal, a static artifact, or a marketing page with no interactivity beyond hover/focus. Write tokens as real CSS custom properties at `:root`, not inline styles — inline values are exactly the kind of undeclared decision `lint.py --tokens` is built to catch.

```html
<style>
  :root {
    --bg: #FAF9F6; --text: #2B2620; --accent: #B23A2E;
    --s-4: 16px; --s-8: 32px; --r-md: 5px;
  }
  .card { background: var(--bg); color: var(--text); padding: var(--s-4);
           border-radius: var(--r-md); border: 1px solid color-mix(in oklch, var(--text) 12%, transparent); }
</style>
```

Load the real display face via `<link>` to Google Fonts (or a self-hosted `@font-face`) before any component markup — never let it silently fall back to the system stack.

## 3. Vue + Tailwind

Same token-as-CSS-variable discipline as the React path; the construction difference is scoped styles and `<script setup>` props instead of a `cva` variant map. Keep one component per `.vue` file, tokens referenced via `var(--token-name)` inside `<style scoped>` rather than hardcoded, and states (empty/loading/error) as named slots or `v-if` branches designed in the same pass as the ideal state, not bolted on after.

```vue
<template>
  <div class="card" :class="{ 'card--error': state === 'error' }">
    <slot v-if="state === 'empty'" name="empty" />
    <slot v-else-if="state === 'loading'" name="loading" />
    <slot v-else />
  </div>
</template>
<style scoped>
.card { background: var(--bg); border-radius: var(--r-md); padding: var(--s-4); }
.card--error { border-color: var(--danger); }
</style>
```

---

## 4. Icons

Pick one library for the whole build — mixing two reintroduces the inconsistency a token system exists to remove. No default: choose by what the direction actually needs.

| Library | Count | Strength | Reach for when |
|---|---|---|---|
| **Lucide** | 1,500+ | Most consistent cross-icon family; the safe default for general product UI | React/Next.js, general SaaS, nothing unusual in the icon vocabulary |
| **Phosphor** | 9,000+, 6 weights | Covers both UI icons and expressive/illustrative icons in one matched family | Dashboards and SaaS that need marketing-adjacent illustration alongside interface icons |
| **Tabler** | 5,000+, uniform 24×24 grid | Broadest raw coverage | The subject's domain is specific enough that Lucide's set has real gaps (industry-specific objects, equipment, etc.) |

If the direction's `signature` element (SKILL.md Step 3) is a drawn mark from the subject's own world, that one icon stays custom SVG regardless of which library covers the rest — a signature bought off a shelf isn't a signature.

---

## Cross-stack rules

- **Component per file** wherever the stack supports it — many small, cohesive files over one large one that does everything.
- **Real content in every example**, including empty/error states — a component built against `""` or `null` and never against real-shaped data hides its own layout bugs.
- **The token names in code should match the token names in the spec exactly.** `--accent` in `tokens.md` and `--brand-primary` in the CSS is the same drift `lint.py` is built to catch, just done by hand mid-build instead of after.
