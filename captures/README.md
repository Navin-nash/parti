# captures/

Evidence from `reference` / `capture` runs. One pair of files per capture:

- `<domain>-<date>.md` — the human-readable capture: motion findings and one focus
  element, each with a **Faithful** and an **Adapted** column, plus an **Adopted** list.
- `<domain>-<date>.json` — the machine record `scripts/capture.py` emitted.

`<domain>` is the URL host, lowercased, non-`[a-z0-9.-]` collapsed to `-`. `<date>` is the
capture date, `YYYY-MM-DD`.

These are **evidence**, like `plans/`. Prune a capture when it is no longer referenced by
`DESIGN.md` or any component; do not delete one that is still cited. A superseded capture
stays until nothing points at it.

Nothing here is authoritative on its own — `DESIGN.md` is. A capture informs the spec; it
does not override it. And a capture is per element: the skill does not reproduce a site's
overall identity from one URL.
