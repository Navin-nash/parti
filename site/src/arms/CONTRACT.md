# Arm contract

Every rendered arm on this site obeys this file. It exists to make the
comparison honest: if the site's own tokens leaked into an arm, the arm would
inherit a verified palette and a designed type scale it did not earn, and the
comparison would be measuring the wrong thing.

## Location and naming

```
src/arms/<example-slug>/baseline.tsx     export function <Name>Baseline()
src/arms/<example-slug>/parti.tsx        export function <Name>Parti()
```

One file per arm. The file path is what the code viewer reads off disk, so the
file *is* the documentation - there is no second, hand-written snippet.

## Isolation - the rule that matters

1. An arm's root element declares **every** custom property it uses, inline:

   ```tsx
   <div
     data-arm="baseline"
     style={{
       "--b-bg": "#ffffff",
       "--b-fg": "#0f172a",
       /* ...every value the arm uses... */
     } as React.CSSProperties}
     className="..."
   >
   ```

2. An arm **never** reads a site token. No `bg-paper`, `text-ink`, `border-rule`,
   `var(--mark)`, `.plate`, `.plate-label`, `.display`, `font-display`. Those
   belong to the Specimen direction and are not available to an arm.

3. An arm **never** imports from `@/components/ui/*` or `@/components/specimen/*`.
   The baseline arm may reimplement a shadcn-shaped component inline - that is
   exactly what a capable generic agent does - but it may not import this
   site's copy of one, because this site's copy has been restyled.

4. Prefix every custom property: `--b-*` for baseline arms, `--p-*` for parti
   arms. Two arms render side by side in the same DOM; unprefixed names
   collide and the downstream arm silently wins.

5. Dark ground comes from a `.dark` ancestor, which the preview shell controls
   per-pane. Use `dark:` Tailwind variants, or a nested
   `.dark &` rule. Never read the site's `next-themes` state.

## Content

Real content, always. No lorem, no "Feature One", no `$XX,XXX`, no
`{company_name}`. Placeholder content hides every hierarchy problem, and on
this site it also makes the arm unfalsifiable. Use plausible, specific,
internally consistent domain content - real tickers, real-shaped figures,
real copy.

Do not invent testimonials attributed to named people at named companies, and
do not invent metrics presented as measured facts about a real product. Domain
content inside a fictional product is fine; a fabricated customer quote is not.

## Baseline arms

Build what a strong general-purpose coding agent actually produces from the
brief with no design skill loaded. That means:

- Competent, conventional, shadcn/Tailwind-shaped.
- Sensible spacing chosen per component rather than from a declared scale.
- Colour authored in hex or Tailwind palette classes.
- The ideal state, usually only the ideal state.
- Cards with `rounded-lg` and a `shadow-sm`.
- Reasonable accessibility, incompletely applied.

**Do not sandbag it.** Do not add clashing colours, broken spacing, or comic
typography. A baseline that is bad on purpose proves nothing and the reader can
tell. The finding is that a competent build still converges - not that a
strawman is ugly.

## Parti arms

Build the direction the brief's constraints demand, and hold it:

- A declared token set, used for every value. No off-scale one-offs.
- A type scale with a stated ratio and assigned roles.
- Elevation by a stated method, applied consistently.
- Every state the component can be in - empty, loading, error, overflow -
  not just the ideal one.
- Motion only where it carries meaning, gated on `prefers-reduced-motion`.
- Contrast at AA on every text pair.
- A signature element drawn from the subject's own world.

## Interactivity

Arms are interactive. Buttons press, tabs switch, disclosures open, tables
scroll. Add `"use client"` when the arm holds state. An arm that renders as a
picture of an interface is the thing this site argues against.

## Size

Aim for 150-400 lines per arm. Long enough to be a real screen, short enough
to read in the code viewer.
