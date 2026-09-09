# Live session

Interactive design against the running page. The user picks an element in their own
browser, names an action, and gets variants written into source and hot-swapped. You
never guess what they meant by "this bit" — they point at it.

`live/` is Node, no dependencies. It runs the helper; the user's own browser runs the
overlay. No headless browser is required, and nothing here needs a harness browser tool —
use one if you have it, for screenshots and verification, not for the session itself.

## Contract

Execute in order. No step skipped.

1. **Boot.** `node skills/parti/live/boot.mjs --page <entry.html>`
   Prints `{ok, port, token, session, dir, pages, snippet, recovered}`.
   Omit `--page` and it injects only into one conventional entry (`index.html`,
   `public/index.html`, `src/index.html`). If `pages` is empty it returns `candidates`
   and a `snippet` — ask which page, or paste the snippet into the framework's root
   layout yourself. **Never inject into every HTML file in a repo.**
2. **Confirm the dev server.** The overlay talks to the helper on `port`; the *page* is
   served by the project's own dev server. Those are different ports. Open the app URL,
   not the helper's.
3. **Poll.** `node skills/parti/live/poll.mjs --port P --token T`
   Long-parks until an event arrives. Never pass a short `--timeout`; a short timeout
   turns one parked request into a loop that burns turns.
   - Claude Code: run the poll as a **background task**.
   - Foreground on harnesses that do not return background stdout reliably.
4. **Handle the event, then reply.** Every event needs exactly one terminal reply or the
   overlay stays spinning. `poll.mjs --reply <id> --status <status> --message <json>`

   `--status progress` is the one non-terminal status: it updates the overlay's status
   line and leaves the event open. Send one before a slow step. The user reads "writing 3
   variants into Hero.tsx", not a spinner that could mean anything.
5. **Poll again immediately** after each reply.
6. **On `exit`:** `node skills/parti/live/boot.mjs --cleanup`, then stop the helper.

Interrupted? `--status-only` prints the queue. The journal at `dir/journal.jsonl` is
canonical: booting again requeues every event that was taken but never replied to, so
do not ask the user to click again before checking.

## Events

| type | payload | what you do |
|---|---|---|
| `generate` (replace) | `action`, `count`, `freeformPrompt`, `element`, `pageUrl`, `annotations?` | write N variants into source, reply `variants_ready` |
| `generate` (insert) | `mode: "insert"`, `insert: {position, anchor, placeholder}`, `freeformPrompt` | write N *new* elements at that position, reply `variants_ready` |
| `steer` | `note`, `pendingId` | fold the note into the work in flight; do not start over |
| `abort` | `pendingId` | stop. The reply you were about to send will be dropped |
| `manual_edit` | `element`, `before`, `after` | replay the user's in-page edit into source, reply `done` |
| `accept` | `variant`, `params?` | keep that block with the tuned values applied, delete the rest, reply `done` |
| `discard` | — | restore the original, unwrap, reply `done` |
| `undo` | `variant` | revert the last accept, reply `done` |
| `exit` | — | clean up |
| `timeout` | — | poll again, nothing happened |

`element` carries the anatomy the overlay measured: a reload-stable selector, the rect,
~25 computed styles, truncated `outerHTML`, viewport and color scheme. Use it. Do not
re-derive from source what the browser already told you.

## Handling `generate`

1. Read `DESIGN.md` and the token spec. **Live variants are bound by the spec exactly
   like a build.** The interactive frame is not a license to invent a color.
2. Wrap the target with the script, not by hand:

   ```bash
   node live/wrap.mjs --file src/Hero.tsx --anchor '<h1 className="hero"' --variants A,B,C --session <dir>
   ```

   It duplicates the element as marked siblings, keeps a full-file backup, and prints
   the line range of each variant. Use `--line N` when no unique anchor exists. The
   marker goes **on** the element; a wrapper div would move a flex or grid child and
   change the thing being judged. In JSX expression position it adds a fragment,
   because three adjacent elements there is a syntax error, and removes it on accept.
   Do not hand-edit the wrapping: `already_wrapped`, `anchor_not_unique`, and
   `unbalanced_element` are refusals that mean stop and look, not retry.
3. Edit the variants at the reported lines, **all in one edit**. The user is watching a
   status line; every extra tool call is time they spend reading it.
4. Vary on **one named axis** — the `variants` discipline applies here. Three variants
   differing on everything cannot be compared and teach the user nothing.
5. **Lint before offering.** Run `scripts/lint.py <file> --tokens tokens.json` and map the
   findings per variant. Pass them in the reply as `{"lint": {"C": ["PT-COLOR-DRIFT ..."]}}`
   — the overlay shows a warning count on that variant's button with the findings on
   hover. An off-spec option is visible as off-spec *at the moment of choosing*, which is
   the whole reason this beats picking from a screenshot.
6. Reply `variants_ready`. The message shape drives the rail:

```json
{"variants": {
  "A": {"label": "A · original", "note": "44px, as shipped"},
  "C": {"label": "C · display",  "note": "78px gradient",
        "lint": ["PT-COLOR-DRIFT gradient text is not in the token spec"]}
}}
```

`label` names the axis position, `note` says in a few words what is different, `lint`
carries that variant's drift findings. Write a real `note` for every variant: the rail is
where the user chooses, and "variant B" tells them nothing that the letter did not.

## Handling `generate` in insert mode

There is no element to vary — the user pointed at a *gap*. `insert.anchor` is an
existing element's selector and `insert.position` is `before` or `after` it;
`placeholder` carries the anchor's size as a soft hint at what fits. The prompt is the
brief and the overlay will not send the event without one.

Wrap with `--anchor` on the anchor element and `--position before|after`, then write
each variant as a *different answer to the brief*, not three sizes of the same answer.
Everything else — one axis, token binding, lint before offering — is unchanged.

## Annotations: what they pointed at, in their words

When the event carries `annotations`, **read the file before planning anything.** It is
the most direct statement of intent in the whole protocol: the user stopped, pointed at
something, and said what was wrong.

```json
{"kind": "pin", "at": [78, 66], "text": "heading crowds the cards", "target": "#title"}
{"kind": "stroke", "text": "this whole row is too tight", "target": "#b",
 "box": {"x": 60, "y": 92, "w": 1150, "h": 9},
 "covers": ["#a", "main > div.row", "#b"]}
```

Every mark is **anchored to elements**, not to pixels. A pin carries the element under
it; a stroke carries everything it crossed, so "this whole row" arrives as a list of
selectors rather than a rectangle you have to guess about. Work from `target` and
`covers`; the coordinates are for reconstructing the picture, not for locating the work.

**parti does not rasterize the page, and that is deliberate.** Doing it without a
dependency means serializing the DOM into an SVG foreignObject, which silently drops
cross-origin images, taints the canvas, and substitutes fallback fonts — a picture that
lies about the design is worse for judging it than no picture at all. The `overlay` path
is the marks themselves as a viewport-sized transparent SVG. If your harness has a
browser tool, take your own screenshot at the recorded `viewport` size and read the
overlay against it; if it does not, the anchored notes still carry the whole intent.

A note names a problem, not a solution. "This row is too tight" is a constraint every
variant has to satisfy — it is not itself the axis. Pick the axis as usual, and treat
the notes as the thing all three answers must fix.

## Parameters: let the user tune without another round trip

A variant may declare its own tunable axes, and the overlay renders them as controls
above the rail. This is the difference between "close, regenerate" and "close, drag the
slider". Declare them as JSON on the variant element:

```
data-parti-params='[{"name":"scale","label":"Type scale","type":"range",
                     "min":0.8,"max":1.8,"step":0.05,"value":1.4,"var":"--scale"}]'
```

`var` is a custom property **the variant's own CSS already reads** — a knob moves a
value the variant was written to accept, it never invents a style. `type` is `range`,
`select` (with `options`), or `toggle` (with `on`/`off`). `unit` is appended to the
value. At most four per variant; beyond that the panel stops being legible and the
choice stops being a choice.

Declare a knob for any axis where the user might mutter "a bit tighter" without wanting
a different design. Shipping none on a composition with an obvious axis is the common
failure, not the safe default.

**On accept the event carries `params` with the user's values.** Write those values into
the source you keep. A variant accepted at its declared defaults after the user tuned it
has thrown their tuning away silently.

## Handling `steer` and `abort`

Both jump the queue, because they are about work already running.

- **`steer`** — the user can see it going the wrong way. Fold the note into what you are
  doing and keep going. Do not restart, and do not treat it as a new brief.
- **`abort`** — stop. If you reply anyway, the helper journals it and drops it: the
  browser has moved on, and resurrecting cancelled work is worse than doing nothing.
  Poll again; an aborted event is never replayed after a restart.

## Handling `accept` / `discard` / `undo`

```bash
node live/accept.mjs --session <dir> --variant B    # keep B, delete the rest
node live/accept.mjs --session <dir> --discard      # restore the pre-wrap file
node live/accept.mjs --session <dir> --undo         # reverse the last accept
```

Accept finds blocks by their marker in the current file, because by then you have
edited them and any stored range is stale. Discard and undo are byte-for-byte restores
from backups, never reconstructions. The file is left as if the chosen variant had been
written by hand — no `data-parti-*` residue, indentation intact. Then sync `DESIGN.md` if the accepted variant
changed anything the spec covers, with a dated changelog line. An accepted variant that
silently diverges from the spec is drift, and drift gets reported, not absorbed.

## Handling `manual_edit`

The user edited text directly in the page. The DOM change is thrown away on the next
reload — **source is the only place a change lives**.

```bash
node live/edit.mjs --file src/Hero.tsx --session <dir> --before "<event.before>" --after "<event.after>"
```

The browser reports `textContent`: whitespace collapsed, entities decoded, template
values rendered. The script matches a whitespace- and entity-tolerant form of the text
against source, replaces only that span, and leaves the file's own formatting alone.

It refuses rather than guessing, and each refusal has one right response:

| refusal | what to do |
|---|---|
| `text_not_unique` | re-run with `--within '<tag ...'` using the element from the event; only then `--nth N` |
| `text_not_found` | read the `near` lines it reports — the copy is usually templated or split by markup, and that case is a hand edit |
| `within_not_found` | the element moved; re-read the file before trying again |

Tell the user which line changed, and say so plainly when the copy appeared elsewhere
and you left those alone.

## What the user has in front of them

The overlay is keyboard-first, because it gets used many times per session while the real
work is the page underneath.

| key | does |
|---|---|
| `p` | pick mode |
| `↑` / `↓` | widen / narrow the selection |
| `k` / `cmd+k` | action palette |
| `1`–`9` | switch variant |
| `enter` | run the chosen action, or accept the shown variant |
| `backspace` | discard variants |
| `e` | edit text in place |
| `esc` | cancel, close, deselect |
| `cmd+z` | undo the last accept |
| `i` | insert mode — click a gap, not an element |
| `n` | note mode — drag to mark an area, click to drop a pin |

Selecting an element shows its size, its padding box, a clickable ancestor breadcrumb,
and **its measured contrast** — the same WCAG math `color.py` uses, run on the pixels the
browser actually painted, so an overlay or a gradient behind text cannot hide a failure
the way a source-level check does. If the user picks something that reads `below 4.5`,
that is a finding worth naming even if they asked about something else.

The action palette anchors beside the element rather than over it. **Narrow** opens the
page in a real phone-width window, because scaling the page inside this one would not
re-run a single media query and would show a shrunken desktop layout while calling it
mobile.

Assume the user can see all this; do not narrate the UI back to them.

## What live mode is not

Not a page builder, not a style menu, not a way around the token spec. It is the
selection problem solved: the user points, you work on the thing they pointed at, and
the spec still governs what comes back.
