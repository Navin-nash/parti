# Art direction

Imagery is design material, not decoration to drop in after the grid is done. Loaded by `explore` render, `build`, and `signature`.

## Order of operations

1. **What must be pictured** for *this* subject — the artifact, the environment, the result. A tax product pictures a return, a 1099, a kitchen-table night — not an abstract gradient blob and not a fake dashboard made of `<div>`s.
2. **How it is pictured** — crop, light, palette relationship to `--bg` / `--accent`. Treatment (B&W, restrained color, hard flash) is a direction decision, same as type.
3. **Then place it.** Image size and type size are planned together. A huge photo plus a 12-word 6-line headline is a planning error.

## Sources (priority)

1. Generate a section-specific still if an image tool exists. Aspect ratio matches the slot.
2. Real photography (brief assets, licensed stock with a *descriptive* seed/URL, not "office-handshake-1").
3. If neither is possible: labeled empty slots (`<!-- TODO: 1099 crop, 4:5 -->`) and tell the user what's missing. **Do not** fill with gray rectangles, sketchy SVG scenes, or div-based fake product UI.

Even a restrained brand surface needs real images in the key screen. Pure type is only correct when the direction's structure axis is editorial-manifesto *and* you said so.

## Bans

- Gray placeholder boxes in a render you are asking the user to approve.
- Hand-drawn doodle SVGs (`feTurbulence` grain "illustrations", crude path-scenes). If you cannot render the subject, omit the illustration.
- Logo walls as text wordmarks. Marks only; no industry labels under each logo.
- Decorative photo credits (`Field study no. 12`) on stock.
- Pills/tags overlaid on images as default seasoning.

## Texture

Subject-native: paper fiber for documents, metal grain for hardware, nothing for a dense tool if the material is the data. CSS noise overlays belong on a **fixed, pointer-events-none** layer if used at all — never on a scrolling container.

A borrowed texture from `reference` capture gets a DESIGN.md changelog line naming the URL and faithful vs adapted — same rule as motion capture.
