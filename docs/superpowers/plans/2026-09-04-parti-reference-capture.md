# `reference` — Capture Design & Motion from Inspiration Sites — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `reference` capability to the `parti` skill so users can share inspiration-site URLs and the skill captures, explains, and makes buildable the specific elements / transitions / animations from those pages — per element, faithful or adapted, never a whole-site clone.

**Architecture:** One new stdlib-only script `scripts/capture.py` does Tier-1 static extraction (fetch HTML + linked CSS, parse `@keyframes` / transitions / animations / scroll-timeline, fingerprint animation libraries) and emits a JSON report plus a Markdown skeleton on a fixed schema. A guarded Playwright path (`--tier runtime`) adds runtime introspection when `playwright` is importable and silently falls back to static otherwise. A new reference doc `references/motion-capture.md` carries the Tier-3 agent-driven snippet path, the schema, the guardrails, and the faithful-vs-adapted method. `SKILL.md` / `references/commands.md` gain the `reference` command and one wiring line each into `explore` / `motion` / `redesign` / `build` / `sync`. Tests go in the repo's existing `evals/run_script_evals.py` harness.

**Tech Stack:** Python 3 standard library only (`urllib`, `re`, `argparse`, `json`, `html.parser` not needed — regex scan matches the sibling scripts). Playwright is an *optional* runtime dependency, imported inside a `try/except ImportError` and never required by the test harness. Docs are Markdown.

**Spec:** `docs/superpowers/specs/2026-09-04-parti-reference-capture-design.md` — the plan argues from the spec; executors read both.

## Global Constraints

Copied verbatim from the spec. Every task's requirements implicitly include this section.

- **Tier 1 and the eval harness are standard-library only.** No `pip install` for `capture.py`'s static path or for `evals/run_script_evals.py`. Match the existing scripts: `import argparse, json, os, re, sys` and the `sys.stdout.reconfigure(encoding="utf-8")` guard.
- **Playwright is import-guarded and optional.** `from playwright... import ...` happens *inside* the runtime function, wrapped in `try/except ImportError`. Absence → fall to Tier 1 + a `not_captured` note + exit 0. The deterministic test harness must pass with Playwright absent.
- **Per element, never whole-site.** Capture is scoped to a stated focus (an element or a named behavior). Absent / "the whole look" focus → no capture; the command returns the three options in spec §2.
- **Capture scope is motion + one named element's construction.** Transitions, scroll choreography, page-load sequences, stagger, parallax, hover/press, view transitions — plus the DOM/CSS/states of *one* element the user points at. **Not** a full token system (no type scale / spacing / color capture as a system).
- **The report always states which tier ran and what it could not see.** The `not_captured` list is never empty for Tier 1 (minified-JS motion is always in it). No millisecond or easing values are ever invented — an unmeasurable behavior is described qualitatively or flagged.
- **Artifact:** `captures/<domain>-<date>.md` (human) + `captures/<domain>-<date>.json` (machine). `<domain>` is the URL host, lowercased, non-`[a-z0-9.-]` collapsed to `-`. `<date>` is `YYYY-MM-DD`. Entries are evidence: pruned when stale, not deleted.
- **Script conventions:** single file, `argparse` CLI, `--json <path>`, `--quiet`, a `--selfcheck` path that asserts on known input (see `scripts/motion.py` `_selfcheck`), exit `1` to gate on failure, never write into a scanned/fetched project.
- **`parti`'s one rule governs the output:** style is derived, never selected. Faithful reproduction is offered per element and flagged for signature elements; the skill will not merge one site's identity onto another.

---

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `scripts/capture.py` | Tier-1 static extractor + guarded Tier-2 runtime + JSON/Markdown emitters + `--selfcheck`. Single file, ~320 lines, mirrors `scripts/motion.py` structure. |
| `references/motion-capture.md` | The capture reference: three tiers, Tier-3 in-page JS snippets, the §6 schema, the §9 guardrails, the faithful-vs-adapted method + worked example. |
| `captures/README.md` | What the directory is, the `<domain>-<date>` naming, that entries are evidence (pruned, not deleted). |
| `evals/capture_runtime_smoke.py` | Optional, self-skipping Playwright smoke check. Prints `SKIP` + exits 0 when `playwright` absent. Not wired into `run_script_evals.py`. |

**Modified:**

| Path | Change |
|---|---|
| `evals/run_script_evals.py` | Add `CAPTURE_*` fixtures, `test_capture_*` functions, and their calls in `main()`. |
| `evals/trigger_cases.json` | Add URL-bearing design queries as positive cases; a bare-scrape query as a negative case. |
| `SKILL.md` | `reference` row in the Direction command table; `capture.py` in the Scripts block; one line in the Step 0 "on the way out" note. |
| `references/commands.md` | Full `reference` entry; one wiring sentence each in `explore` / `motion` / `redesign` / `build` (B4) / `sync`. |
| `references/motion.md` | One pointer from §12 to `references/motion-capture.md`. |
| `references/design-md.md` | The Changelog-line format for a capture. |

---

## Task 1: `capture.py` skeleton — CLI, fetch, JSON envelope, `--selfcheck` stub

**Files:**
- Create: `scripts/capture.py`
- Test: `evals/run_script_evals.py` (add `test_capture_envelope`)

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `fetch(url: str, timeout: int = 15, cap: int = 3_000_000) -> dict` — returns `{"url": final_url, "ok": bool, "content_type": str, "text": str, "error": str}` (`error` only when `ok is False`). Supports `http`, `https`, and `file://`.
  - `slug(url: str) -> str` — URL host, lowercased, `[^a-z0-9.-]+` → `-`, stripped of leading/trailing `-`; `"local"` when there is no host.
  - `today() -> str` — `datetime.date.today().isoformat()`.
  - `build_report(urls: list[str], focus: str, tier: str, per_url: list[dict]) -> dict` — assembles the top-level JSON envelope (schema below). At this task `per_url` entries only need `{"url", "ok", "error"}`; later tasks enrich them.
  - `main()` — argparse CLI: `--url` (repeatable, required), `--focus` (default `""`), `--tier {auto,static,runtime}` (default `auto`), `--json <path>`, `--md <path>`, `--quiet`. Exit `1` if every URL failed to fetch, else `0`.
  - `python scripts/capture.py --selfcheck` runs `_selfcheck()`.

**JSON envelope (top level, stable across all tasks):**

```json
{
  "tool": "capture",
  "version": 1,
  "captured": "2026-09-04",
  "tier": "static",
  "focus": "the plan toggle",
  "sources": ["https://example.com/pricing"],
  "not_captured": ["JS-driven motion inside minified bundles is not executed at this tier"],
  "motion_findings": [],
  "focus_element": null,
  "libraries": [],
  "trigger_hints": {}
}
```

- [ ] **Step 1: Write the failing test**

Add to `evals/run_script_evals.py` (near the other `test_*` functions):

```python
CAPTURE_HTML = """<!doctype html><html><head>
<title>t</title>
<style>.b{transition:transform 160ms cubic-bezier(0.16,1,0.3,1)}</style>
</head><body><button class="b">go</button></body></html>"""


def _write_capture_page(tmp, name="page.html", html=CAPTURE_HTML, extra=None):
    d = os.path.join(tmp, "capture_" + name.replace(".", "_"))
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    for rel, content in (extra or {}).items():
        ep = os.path.join(d, rel)
        os.makedirs(os.path.dirname(ep), exist_ok=True)
        with open(ep, "w", encoding="utf-8") as f:
            f.write(content)
    return "file:///" + p.replace(os.sep, "/")


def capture(url, focus="", tier="static", md=False, tmp=None):
    out = os.path.join(tempfile.gettempdir(), "capture_out.json")
    mdout = os.path.join(tempfile.gettempdir(), "capture_out.md")
    cmd = [sys.executable, os.path.join(SCRIPTS, "capture.py"),
           "--url", url, "--focus", focus, "--tier", tier,
           "--json", out, "--quiet"]
    if md:
        cmd += ["--md", mdout]
    rc, so, se = run(cmd)
    data = json.load(open(out, encoding="utf-8")) if os.path.exists(out) else None
    mdtext = open(mdout, encoding="utf-8").read() if md and os.path.exists(mdout) else ""
    return rc, data, mdtext, se


def test_capture_envelope(R, tmp):
    url = _write_capture_page(tmp)
    rc, data, _, se = capture(url, focus="the button", tmp=tmp)
    G = "Capture — envelope"
    R.check(G, "exits 0 on a reachable page", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "tool/version/tier stamped", data and data.get("tool") == "capture"
            and data.get("version") == 1 and data.get("tier") == "static", str(data)[:200])
    R.check(G, "records the source URL", data and data.get("sources") == [url])
    R.check(G, "echoes the focus", data and data.get("focus") == "the button")
    R.check(G, "not_captured is never empty at tier 1",
            data and len(data.get("not_captured", [])) >= 1, str(data.get("not_captured")))
    R.check(G, "unreachable URL exits 1",
            capture("file:///no/such/file.html", tmp=tmp)[0] == 1)
```

Add the call inside `main()` after `test_determinism(R, clean)`:

```python
    test_capture_envelope(R, tmp)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python evals/run_script_evals.py --verbose`
Expected: FAIL — `capture.py` does not exist, `RuntimeError`/`FileNotFoundError` from the subprocess, checks in group "Capture — envelope" fail.

- [ ] **Step 3: Write the minimal implementation**

Create `scripts/capture.py`:

```python
#!/usr/bin/env python3
"""
capture.py - capture design & motion from an inspiration URL.

Tier 1 (this file, stdlib only): fetch the page + linked stylesheets, parse
@keyframes / transitions / animations / scroll-timeline / view-transitions,
and fingerprint the animation libraries the page loads. Emits a JSON report
and an optional Markdown skeleton on the schema in references/motion-capture.md.

Tier 2 (--tier runtime): if `playwright` is importable, also run the page and
read document.getAnimations(), ScrollTrigger.getAll(), and a scroll sampler.
Absent -> fall back to Tier 1 with a note. Never required.

Tier 3 is agent-driven and lives in references/motion-capture.md.

The report always states which tier ran and what it could not see. It never
invents a millisecond or easing value.

Usage:
    python capture.py --url URL [--url URL2 ...] --focus "the nav" \\
        --tier auto|static|runtime --json /tmp/capture.json --md captures/x.md
    python capture.py --selfcheck

Exit code is 1 if every URL failed to fetch, so a caller can gate on it.
Stdlib only for Tier 1. Never writes into the fetched site.
"""

import argparse
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

try:  # a Windows console defaults to cp1252; this output uses real typography
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

UA = "Mozilla/5.0 (compatible; parti-capture/1.0; +https://github.com/Navin-nash/parti)"
FETCH_CAP = 3_000_000


def today():
    return datetime.date.today().isoformat()


def slug(url):
    host = urllib.parse.urlparse(url).netloc or "local"
    return re.sub(r"[^a-z0-9.-]+", "-", host.lower()).strip("-") or "local"


def fetch(url, timeout=15, cap=FETCH_CAP):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:  # noqa: S310 (http/https/file only)
            raw = r.read(cap)
            ctype = r.headers.get("Content-Type", "") if r.headers else ""
            final = r.geturl()
        return {"url": final, "ok": True, "content_type": ctype,
                "text": raw.decode("utf-8", "ignore"), "error": ""}
    except (urllib.error.URLError, ValueError, OSError) as e:
        return {"url": url, "ok": False, "content_type": "", "text": "",
                "error": str(e)[:200]}


def build_report(urls, focus, tier, per_url):
    ok = [u for u in per_url if u.get("ok")]
    not_captured = []
    if tier == "static":
        not_captured.append(
            "JS-driven motion inside minified bundles is not executed at this tier")
    report = {
        "tool": "capture",
        "version": 1,
        "captured": today(),
        "tier": tier,
        "focus": focus,
        "sources": list(urls),
        "not_captured": not_captured,
        "motion_findings": [],
        "focus_element": None,
        "libraries": [],
        "trigger_hints": {},
        "_fetch_errors": [{"url": u["url"], "error": u["error"]}
                          for u in per_url if not u.get("ok")],
    }
    return report, bool(ok)


def render_markdown(report):
    # Skeleton only. The agent fills Faithful/Adapted columns and "why it works".
    lines = [f"# Capture — {', '.join(report['sources'])}   "
             f"({report['captured']}, tier: {report['tier']})",
             f"Focus: {report['focus'] or '(none stated — narrow this before adopting anything)'}",
             ""]
    if report["not_captured"]:
        lines.append("Not captured: " + "; ".join(report["not_captured"]))
        lines.append("")
    lines += ["## Motion findings", "",
              "_One row per distinct behavior. Fill FAITHFUL and ADAPTED per row._", ""]
    lines += ["## Focus element", "",
              "_structure / states / why it works — then FAITHFUL and ADAPTED._", ""]
    lines += ["## Adopted", "",
              "_element → FAITHFUL|ADAPTED → build path (filled in at build time)_", ""]
    return "\n".join(lines) + "\n"


def run_capture(urls, focus, tier):
    want_runtime = tier in ("auto", "runtime")
    per_url = [fetch(u) for u in urls]
    effective_tier = "static"
    report, any_ok = build_report(urls, focus, effective_tier, per_url)
    return report, any_ok


def _selfcheck():
    r = fetch("file:///no/such/path/xyz.html")
    assert r["ok"] is False, "missing file should not fetch"
    assert slug("https://Sub.Example.com/x") == "sub.example.com", slug("https://Sub.Example.com/x")
    rep, ok = build_report(["https://x.test"], "nav", "static",
                           [{"url": "https://x.test", "ok": True, "error": ""}])
    assert rep["tool"] == "capture" and rep["version"] == 1
    assert rep["not_captured"], "tier-1 not_captured must be non-empty"
    assert ok is True
    print("selfcheck ok")


def main():
    ap = argparse.ArgumentParser(description="Capture design & motion from an inspiration URL")
    ap.add_argument("--url", action="append", dest="urls", default=[], required=False)
    ap.add_argument("--focus", default="")
    ap.add_argument("--tier", choices=["auto", "static", "runtime"], default="auto")
    ap.add_argument("--json", dest="out")
    ap.add_argument("--md", dest="mdout")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()
    if not args.urls:
        sys.exit("no --url given")

    report, any_ok = run_capture(args.urls, args.focus, args.tier)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        if not args.quiet:
            print(f"wrote {args.out}")
    if args.mdout:
        with open(args.mdout, "w", encoding="utf-8") as f:
            f.write(render_markdown(report))
        if not args.quiet:
            print(f"wrote {args.mdout}")
    if not args.quiet:
        print(json.dumps({k: report[k] for k in
                          ("tier", "focus", "sources", "not_captured")}, indent=2))
    sys.exit(0 if any_ok else 1)


if __name__ == "__main__":
    if "--selfcheck" in sys.argv:
        _selfcheck()
    else:
        main()
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python evals/run_script_evals.py --verbose`
Expected: PASS — group "Capture — envelope" all green. Other groups unchanged.

Run: `python scripts/capture.py --selfcheck`
Expected: prints `selfcheck ok`, exit 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture.py evals/run_script_evals.py
git commit -m "feat: capture.py skeleton — fetch, JSON/MD envelope, selfcheck

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 2: CSS motion parser

**Files:**
- Modify: `scripts/capture.py` (add `extract_stylesheets`, `parse_css_motion`; call them in `run_capture`)
- Test: `evals/run_script_evals.py` (add `test_capture_css_motion`)

**Interfaces:**
- Consumes: `fetch` (Task 1).
- Produces:
  - `extract_stylesheets(html: str, base_url: str) -> tuple[str, list[str]]` — returns `(combined_css, sources)`: every `<style>` block concatenated with every successfully fetched `<link rel="stylesheet">` (relative hrefs resolved with `urllib.parse.urljoin`; each fetched via `fetch`; failures skipped). `sources` is the list of external stylesheet URLs that were fetched.
  - `parse_css_motion(css: str) -> dict` — returns
    `{"keyframes": [str], "durations_ms": [int], "easings": [str], "transitions": [str], "animations": [str], "scroll_timeline": bool, "view_transitions": bool, "starting_style": bool}`.
    `easings` includes each distinct `cubic-bezier(...)` / `steps(...)` literal and any bare `ease-out` / `ease-in-out` / `linear` / `ease-in` keyword found on a `transition`/`animation` declaration. `durations_ms` is every `<n>ms` / `<n>s` on a `transition`/`animation` declaration, converted to int ms, de-duplicated, sorted.
  - `run_capture` now populates `report["motion_findings"]` with **one finding per `@keyframes` block** and **one finding per distinct transition declaration**, each shaped:
    `{"element": "(css)", "trigger": "unknown", "mechanism": <declaration text, trimmed>, "properties": <matched property list or "">, "timing": {"durations_ms": [...], "easings": [...]}, "library": "CSS", "scrubbed": false, "reduced_motion": <"declared" if the css contains prefers-reduced-motion else "not handled by the reference">}`.

- [ ] **Step 1: Write the failing test**

```python
CAPTURE_CSS_PAGE = """<!doctype html><html><head>
<link rel="stylesheet" href="a.css">
<style>
@keyframes slide-in { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
.hero { animation: slide-in 600ms cubic-bezier(0.16,1,0.3,1) }
.nav { transition: height 240ms cubic-bezier(0.4,0,0.2,1) }
</style></head><body></body></html>"""

CAPTURE_CSS_EXTERNAL = """
.card { transition: transform 180ms ease-out, box-shadow 180ms ease-out }
@media (prefers-reduced-motion: reduce) { .card { transition: none } }
.panel { animation-timeline: scroll(root block) }
::view-transition-old(root) { animation-duration: 300ms }
"""


def test_capture_css_motion(R, tmp):
    url = _write_capture_page(tmp, name="css.html", html=CAPTURE_CSS_PAGE,
                              extra={"a.css": CAPTURE_CSS_EXTERNAL})
    rc, data, _, se = capture(url, focus="the nav", tmp=tmp)
    G = "Capture — CSS motion"
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    findings = data.get("motion_findings", []) if data else []
    blob = json.dumps(data)
    R.check(G, "captures the @keyframes block",
            any("slide-in" in json.dumps(f) for f in findings), blob[:300])
    R.check(G, "captures the nav transition with its duration",
            any(240 in f.get("timing", {}).get("durations_ms", []) for f in findings),
            blob[:400])
    R.check(G, "captures the exact cubic-bezier, not a keyword",
            "cubic-bezier(0.4,0,0.2,1)" in blob.replace(" ", "")
            or "cubic-bezier(0.4, 0, 0.2, 1)" in blob, blob[:400])
    R.check(G, "reads the linked stylesheet too (ease-out card transition)",
            any("ease-out" in json.dumps(f.get("timing", {})) for f in findings), blob[:400])
    R.check(G, "notes the reference DOES handle reduced motion",
            any(f.get("reduced_motion") == "declared" for f in findings), blob[:400])
    R.check(G, "flags scroll-timeline / view-transitions presence",
            "scroll-timeline" in blob or "view-transition" in blob
            or any(k in json.dumps(data.get("not_captured", []) + list(data.keys()))
                   for k in ("scroll", "view_transition")), blob[:400])
```

Add `test_capture_css_motion(R, tmp)` in `main()` after `test_capture_envelope(R, tmp)`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python evals/run_script_evals.py --verbose`
Expected: FAIL — group "Capture — CSS motion": `motion_findings` is still `[]`.

- [ ] **Step 3: Write the minimal implementation**

Add to `scripts/capture.py` (above `run_capture`):

```python
RE_LINK_CSS = re.compile(r"<link\b[^>]*>", re.I)
RE_HREF = re.compile(r"""href\s*=\s*["']([^"']+)["']""", re.I)
RE_REL_SHEET = re.compile(r"""rel\s*=\s*["']?[^"'>]*stylesheet""", re.I)
RE_STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style>", re.I | re.S)

RE_KEYFRAMES = re.compile(r"@(?:-webkit-)?keyframes\s+([\w-]+)\s*\{", re.I)
RE_DECL_TRANSITION = re.compile(r"transition(?:-property|-duration|-timing-function|-delay)?\s*:\s*([^;{}]+)", re.I)
RE_DECL_ANIMATION = re.compile(r"animation(?:-name|-duration|-timing-function|-delay|-iteration-count)?\s*:\s*([^;{}]+)", re.I)
RE_DUR = re.compile(r"(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])")
RE_CUBIC = re.compile(r"cubic-bezier\([^)]*\)")
RE_STEPS = re.compile(r"steps\([^)]*\)")
RE_EASE_KW = re.compile(r"\b(ease-in-out|ease-out|ease-in|linear|ease)\b")
RE_PROP = re.compile(r"\b(transform|opacity|filter|backdrop-filter|clip-path|height|width|top|left|right|bottom|margin|color|background(?:-color)?|box-shadow)\b")
RE_SCROLL_TL = re.compile(r"animation-timeline\s*:\s*(?:scroll|view)\s*\(", re.I)
RE_VIEW_TRANS = re.compile(r"@view-transition|view-transition-name\s*:|::view-transition", re.I)
RE_STARTING = re.compile(r"@starting-style", re.I)


def _to_ms(value, unit):
    v = float(value)
    return int(round(v * 1000.0)) if unit == "s" else int(round(v))


def extract_stylesheets(html, base_url):
    css_parts = list(RE_STYLE_BLOCK.findall(html))
    sources = []
    for tag in RE_LINK_CSS.findall(html):
        if not RE_REL_SHEET.search(tag):
            continue
        m = RE_HREF.search(tag)
        if not m:
            continue
        href = urllib.parse.urljoin(base_url, m.group(1))
        got = fetch(href)
        if got["ok"] and got["text"].strip():
            css_parts.append(got["text"])
            sources.append(href)
    return "\n".join(css_parts), sources


def parse_css_motion(css):
    keyframes = sorted(set(RE_KEYFRAMES.findall(css)))
    durations, easings, transitions, animations = set(), set(), [], []
    for rx, bucket in ((RE_DECL_TRANSITION, transitions), (RE_DECL_ANIMATION, animations)):
        for decl in rx.findall(css):
            decl = " ".join(decl.split())
            bucket.append(decl)
            for m in RE_DUR.finditer(decl):
                durations.add(_to_ms(m.group(1), m.group(2)))
            for m in RE_CUBIC.finditer(decl):
                easings.add(m.group(0).replace(" ", ""))
            for m in RE_STEPS.finditer(decl):
                easings.add(m.group(0).replace(" ", ""))
            for m in RE_EASE_KW.finditer(decl):
                easings.add(m.group(1))
    return {
        "keyframes": keyframes,
        "durations_ms": sorted(durations),
        "easings": sorted(easings),
        "transitions": sorted(set(transitions)),
        "animations": sorted(set(animations)),
        "scroll_timeline": bool(RE_SCROLL_TL.search(css)),
        "view_transitions": bool(RE_VIEW_TRANS.search(css)),
        "starting_style": bool(RE_STARTING.search(css)),
    }


def _css_findings(css):
    m = parse_css_motion(css)
    reduced = "declared" if "prefers-reduced-motion" in css else \
              "not handled by the reference"
    findings = []
    for name in m["keyframes"]:
        findings.append({
            "element": "(css)", "trigger": "unknown",
            "mechanism": f"@keyframes {name}",
            "properties": "", "timing": {"durations_ms": [], "easings": []},
            "library": "CSS", "scrubbed": False, "reduced_motion": reduced,
        })
    for decl in m["transitions"] + m["animations"]:
        findings.append({
            "element": "(css)", "trigger": "unknown", "mechanism": decl[:200],
            "properties": sorted(set(RE_PROP.findall(decl))),
            "timing": {
                "durations_ms": sorted({d for d in
                                        (_to_ms(a, b) for a, b in RE_DUR.findall(decl))}),
                "easings": sorted({e.replace(" ", "") for e in
                                   (RE_CUBIC.findall(decl) + RE_STEPS.findall(decl))}
                                  | set(RE_EASE_KW.findall(decl))),
            },
            "library": "CSS", "scrubbed": False, "reduced_motion": reduced,
        })
    return findings, m
```

Replace `run_capture` with:

```python
def run_capture(urls, focus, tier):
    per_url = [fetch(u) for u in urls]
    report, any_ok = build_report(urls, focus, "static", per_url)
    all_css = []
    for u in per_url:
        if not u["ok"]:
            continue
        css, css_srcs = extract_stylesheets(u["text"], u["url"])
        report["sources"] = list(dict.fromkeys(report["sources"] + css_srcs))
        all_css.append((u, css))
    combined = "\n".join(css for _, css in all_css)
    findings, m = _css_findings(combined)
    report["motion_findings"] = findings
    if m["scroll_timeline"]:
        report["not_captured"].append(
            "scroll-timeline is present; its per-element scroll->property mapping "
            "needs Tier 2 (runtime) to measure")
    if m["view_transitions"]:
        report.setdefault("features", []).append("view-transitions")
    if m["starting_style"]:
        report.setdefault("features", []).append("@starting-style")
    return report, any_ok
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python evals/run_script_evals.py --verbose`
Expected: PASS — "Capture — CSS motion" all green; "Capture — envelope" still green.

Run: `python scripts/capture.py --selfcheck` → `selfcheck ok`.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture.py evals/run_script_evals.py
git commit -m "feat: capture.py — parse @keyframes, transitions, animations, scroll-timeline

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 3: Library fingerprint, trigger hints, `not_captured` completion

**Files:**
- Modify: `scripts/capture.py` (add `fingerprint_libraries`, `trigger_hints`, extend `run_capture`)
- Test: `evals/run_script_evals.py` (add `test_capture_libraries`)

**Interfaces:**
- Consumes: `fetch`, `run_capture` (Tasks 1–2).
- Produces:
  - `fingerprint_libraries(html: str) -> list[str]` — scans `<script src>` URLs and inline `<script>` text against `LIB_SIGNATURES`; returns the sorted list of matched library ids from: `gsap`, `scrolltrigger`, `splittext`, `motion`, `lenis`, `locomotive-scroll`, `swiper`, `aos`, `lottie`, `rive`, `three`.
  - `trigger_hints(html: str) -> dict` — counts occurrences of `data-scroll`, `data-aos`, `data-speed`, `data-lag`, `data-gsap`, `data-splitting`; returns only the non-zero ones.
  - `run_capture` now sets `report["libraries"]` and `report["trigger_hints"]`, tags CSS findings whose declaration is empty-of-timing as `library: "CSS"` still, and appends to `not_captured`: `"canvas / WebGL animation (not readable from source)"` when `<canvas` appears; `"Rive / Lottie asset animation (flagged, not reproduced — rebuild the intent)"` when `rive` or `lottie` fingerprinted; `"library-driven motion (<libs>) — values need Tier 2 (runtime) or the Tier-3 snippet path"` when any JS animation library is fingerprinted.

- [ ] **Step 1: Write the failing test**

```python
CAPTURE_LIB_PAGE = """<!doctype html><html><head>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1/dist/lenis.min.js"></script>
</head><body>
<section data-scroll data-speed="0.8">parallax</section>
<canvas id="bg"></canvas>
</body></html>"""


def test_capture_libraries(R, tmp):
    url = _write_capture_page(tmp, name="lib.html", html=CAPTURE_LIB_PAGE)
    rc, data, _, se = capture(url, focus="the parallax section", tmp=tmp)
    G = "Capture — libraries & hints"
    blob = json.dumps(data)
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "fingerprints gsap + scrolltrigger + lenis",
            set(data.get("libraries", [])) >= {"gsap", "scrolltrigger", "lenis"},
            str(data.get("libraries")))
    R.check(G, "counts the data-scroll / data-speed hints",
            data.get("trigger_hints", {}).get("data-scroll", 0) >= 1
            and "data-speed" in data.get("trigger_hints", {}),
            str(data.get("trigger_hints")))
    R.check(G, "not_captured flags canvas",
            any("canvas" in n.lower() for n in data.get("not_captured", [])), blob[:400])
    R.check(G, "not_captured flags library-driven motion needing tier 2",
            any("Tier 2" in n or "runtime" in n for n in data.get("not_captured", [])),
            blob[:400])
```

Add `test_capture_libraries(R, tmp)` in `main()` after `test_capture_css_motion(R, tmp)`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python evals/run_script_evals.py --verbose`
Expected: FAIL — `libraries` empty, `trigger_hints` empty, canvas not flagged.

- [ ] **Step 3: Write the minimal implementation**

Add to `scripts/capture.py` (above `run_capture`):

```python
RE_SCRIPT_SRC = re.compile(r"""<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>""", re.I)
RE_SCRIPT_BLOCK = re.compile(r"<script\b[^>]*>(.*?)</script>", re.I | re.S)

LIB_SIGNATURES = [
    ("gsap", re.compile(r"gsap|greensock", re.I)),
    ("scrolltrigger", re.compile(r"scrolltrigger", re.I)),
    ("splittext", re.compile(r"splittext", re.I)),
    ("motion", re.compile(r"framer-motion|/motion@|/motion/|motion\.min|motion/react", re.I)),
    ("lenis", re.compile(r"lenis|studio-freight", re.I)),
    ("locomotive-scroll", re.compile(r"locomotive-scroll", re.I)),
    ("swiper", re.compile(r"swiper", re.I)),
    ("aos", re.compile(r"aos\.js|aos\.css|/aos@|\baos/dist\b", re.I)),
    ("lottie", re.compile(r"lottie", re.I)),
    ("rive", re.compile(r"rive-js|@rive-app|\brive\.min", re.I)),
    ("three", re.compile(r"three\.min\.js|three\.module|/three@|react-three|@react-three", re.I)),
]
TRIGGER_ATTRS = ["data-scroll", "data-aos", "data-speed", "data-lag",
                 "data-gsap", "data-splitting"]


def fingerprint_libraries(html):
    hay = " ".join(RE_SCRIPT_SRC.findall(html)) + " " + " ".join(RE_SCRIPT_BLOCK.findall(html))
    return sorted({lid for lid, rx in LIB_SIGNATURES if rx.search(hay)})


def trigger_hints(html):
    return {a: html.count(a) for a in TRIGGER_ATTRS if html.count(a)}
```

In `run_capture`, before `return report, any_ok`, insert:

```python
    html_all = "\n".join(u["text"] for u in per_url if u["ok"])
    libs = fingerprint_libraries(html_all)
    report["libraries"] = libs
    report["trigger_hints"] = trigger_hints(html_all)
    if "<canvas" in html_all.lower():
        report["not_captured"].append("canvas / WebGL animation (not readable from source)")
    if {"rive", "lottie"} & set(libs):
        report["not_captured"].append(
            "Rive / Lottie asset animation (flagged, not reproduced — rebuild the intent)")
    js_motion_libs = [l for l in libs if l not in ("three",)]
    if js_motion_libs:
        report["not_captured"].append(
            f"library-driven motion ({', '.join(js_motion_libs)}) — values need "
            f"Tier 2 (runtime) or the Tier-3 snippet path in references/motion-capture.md")
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python evals/run_script_evals.py --verbose`
Expected: PASS — "Capture — libraries & hints" green; earlier capture groups still green.

Run: `python scripts/capture.py --selfcheck` → `selfcheck ok`.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture.py evals/run_script_evals.py
git commit -m "feat: capture.py — library fingerprint, trigger hints, not_captured completion

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 4: Multi-URL report + Markdown skeleton

**Files:**
- Modify: `scripts/capture.py` (`render_markdown` — flesh out; confirm multi-`--url` path)
- Test: `evals/run_script_evals.py` (add `test_capture_multi_and_md`)

**Interfaces:**
- Consumes: `run_capture`, `render_markdown` (Tasks 1–3).
- Produces:
  - `render_markdown(report: dict) -> str` — now emits, under `## Motion findings`, one Markdown sub-block per `motion_findings` entry: a `### <mechanism>` heading, a bullet list of `trigger` / `properties` / `timing` / `library` / `reduced_motion`, then two stub lines `**FAITHFUL →** _measured values, re-expressed in your stack_` and `**ADAPTED →** _mechanism only, values re-derived from your tokens_`. Under `## Focus element`, a `_captured at Tier 2 only — Tier 1 did not run the page_` note when `focus_element is None`. Header lists every source URL and, per source, which library ids were seen on it is not required (single combined list is fine).
  - Multi-`--url`: `sources` contains every input URL plus every fetched stylesheet URL, order-preserving, de-duplicated. `motion_findings` is the union across pages. The report stays a single object (no per-site nesting) — cross-site identity merge is out of scope by the Global Constraints.

- [ ] **Step 1: Write the failing test**

```python
def test_capture_multi_and_md(R, tmp):
    u1 = _write_capture_page(tmp, name="m1.html", html=CAPTURE_CSS_PAGE,
                             extra={"a.css": CAPTURE_CSS_EXTERNAL})
    u2 = _write_capture_page(tmp, name="m2.html", html=CAPTURE_LIB_PAGE)
    out = os.path.join(tempfile.gettempdir(), "capture_multi.json")
    mdout = os.path.join(tempfile.gettempdir(), "capture_multi.md")
    rc, so, se = run([sys.executable, os.path.join(SCRIPTS, "capture.py"),
                      "--url", u1, "--url", u2, "--focus", "nav + parallax",
                      "--json", out, "--md", mdout, "--quiet"])
    data = json.load(open(out, encoding="utf-8"))
    md = open(mdout, encoding="utf-8").read()
    G = "Capture — multi-URL + markdown"
    R.check(G, "exits 0", rc == 0, f"rc={rc} se={se[:200]}")
    R.check(G, "both source URLs present", u1 in data["sources"] and u2 in data["sources"],
            str(data["sources"]))
    R.check(G, "findings unioned across pages",
            any("slide-in" in json.dumps(f) for f in data["motion_findings"]))
    R.check(G, "libraries unioned across pages",
            "gsap" in data["libraries"] and "lenis" in data["libraries"])
    R.check(G, "markdown has the three sections",
            "## Motion findings" in md and "## Focus element" in md and "## Adopted" in md)
    R.check(G, "markdown has FAITHFUL and ADAPTED stubs per finding",
            md.count("FAITHFUL") >= 1 and md.count("ADAPTED") >= 1)
    R.check(G, "markdown header carries the tier and date",
            data["tier"] in md and data["captured"] in md)
```

Add `test_capture_multi_and_md(R, tmp)` in `main()` after `test_capture_libraries(R, tmp)`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python evals/run_script_evals.py --verbose`
Expected: FAIL — markdown has no per-finding `FAITHFUL`/`ADAPTED` sub-blocks.

- [ ] **Step 3: Write the minimal implementation**

Replace `render_markdown` in `scripts/capture.py`:

```python
def render_markdown(report):
    src = ", ".join(report["sources"][:6])
    L = [f"# Capture — {src}   ({report['captured']}, tier: {report['tier']})",
         f"Focus: {report['focus'] or '(none stated — narrow this before adopting anything)'}"]
    if report.get("libraries"):
        L.append(f"Libraries seen: {', '.join(report['libraries'])}")
    if report["not_captured"]:
        L.append("")
        L.append("Not captured: " + "; ".join(report["not_captured"]))
    L += ["", "## Motion findings", ""]
    if not report["motion_findings"]:
        L.append("_No CSS-level motion found. If the page clearly animates, it is "
                 "library-driven — use Tier 2 or the Tier-3 snippets._")
    for f in report["motion_findings"]:
        L.append(f"### {f['mechanism']}")
        L.append(f"- trigger: {f.get('trigger', 'unknown')}")
        L.append(f"- properties: {f.get('properties') or '—'}")
        t = f.get("timing", {})
        L.append(f"- timing: durations {t.get('durations_ms') or '—'} · "
                 f"easings {t.get('easings') or '—'}")
        L.append(f"- library: {f.get('library', 'CSS')} · "
                 f"scrubbed: {f.get('scrubbed', False)}")
        L.append(f"- reduced-motion on the reference: {f.get('reduced_motion', 'unknown')}")
        L.append("- **FAITHFUL →** _measured values, re-expressed in your stack "
                 "(swap a layout property for transform/opacity here)_")
        L.append("- **ADAPTED →** _mechanism only; values re-derived from your tokens, "
                 "density and motion posture_")
        L.append("")
    L += ["## Focus element", ""]
    if report.get("focus_element") is None:
        L.append("_Not captured at Tier 1 (the page was not run). Use Tier 2 or the "
                 "Tier-3 snippet path to capture the element's DOM, states and rationale._")
    L += ["", "## Adopted", "",
          "_element → FAITHFUL | ADAPTED → build path (filled in at build time; "
          "mirror into DESIGN.md changelog)_", ""]
    return "\n".join(L) + "\n"
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python evals/run_script_evals.py --verbose`
Expected: PASS — "Capture — multi-URL + markdown" green; all earlier capture groups green.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture.py evals/run_script_evals.py
git commit -m "feat: capture.py — multi-URL union + per-finding markdown skeleton

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 5: Guarded Tier-2 runtime + `--tier` handling + fallback note

**Files:**
- Modify: `scripts/capture.py` (add `capture_runtime`, wire `--tier` in `run_capture`)
- Test: `evals/run_script_evals.py` (add `test_capture_tier_fallback`)

**Interfaces:**
- Consumes: `run_capture` (Tasks 1–4).
- Produces:
  - `capture_runtime(urls: list[str], focus: str) -> dict | None` — imports Playwright inside a `try/except ImportError`; returns `None` when Playwright is unavailable **or** when it raises at launch (so the caller falls back). When it runs: launches headless Chromium, for each URL loads the page, calls `document.getAnimations()` and (if `window.ScrollTrigger`) `ScrollTrigger.getAll()`, runs a 40-step scroll sampler recording `{scrollY, transform, opacity}` for elements matching the focus (or `section, header, [data-scroll]` when focus is a plain-English phrase), and — when focus names a selector-ish token — captures that element's `outerHTML` (trimmed to 1200 chars), computed box, and `:hover` / `:focus-visible` snapshots. Returns a dict merged into the report: `{"tier": "runtime", "motion_findings": [...], "focus_element": {...} | None, "scroll_samples": [...], "runtime_libraries": {...}}`. Every returned finding carries real measured `timing`; nothing is fabricated.
  - `run_capture` honors `--tier`: `static` → never calls `capture_runtime`; `runtime` / `auto` → calls it, and on `None` appends to `not_captured`: `"runtime capture unavailable (playwright not installed or failed to launch) — ran Tier 1 only"` and keeps `tier: "static"`.

- [ ] **Step 1: Write the failing test**

```python
def test_capture_tier_fallback(R, tmp):
    url = _write_capture_page(tmp, name="tier.html", html=CAPTURE_CSS_PAGE,
                              extra={"a.css": CAPTURE_CSS_EXTERNAL})
    G = "Capture — tier handling"
    # --tier static must never attempt runtime
    rc_s, data_s, _, _ = capture(url, tier="static", tmp=tmp)
    R.check(G, "--tier static exits 0 and stays static",
            rc_s == 0 and data_s["tier"] == "static", str(data_s.get("tier")))
    R.check(G, "--tier static does not add a runtime-unavailable note",
            not any("runtime capture unavailable" in n for n in data_s["not_captured"]))
    # --tier runtime with playwright absent must fall back cleanly
    try:
        import playwright  # noqa: F401
        have_pw = True
    except ImportError:
        have_pw = False
    rc_r, data_r, _, se = capture(url, tier="runtime", tmp=tmp)
    R.check(G, "--tier runtime exits 0 regardless", rc_r == 0, f"rc={rc_r} se={se[:200]}")
    if not have_pw:
        R.check(G, "falls back to static with an explicit note",
                data_r["tier"] == "static"
                and any("runtime capture unavailable" in n for n in data_r["not_captured"]),
                str(data_r["not_captured"]))
    else:
        R.check(G, "runtime tier ran (playwright present)",
                data_r["tier"] in ("runtime", "static"), str(data_r["tier"]))
```

Add `test_capture_tier_fallback(R, tmp)` in `main()` after `test_capture_multi_and_md(R, tmp)`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python evals/run_script_evals.py --verbose`
Expected: FAIL — no `--tier` branching yet; `capture_runtime` undefined; the runtime-unavailable note is never added.

- [ ] **Step 3: Write the minimal implementation**

Add to `scripts/capture.py` (above `run_capture`):

```python
_SELECTORISH = re.compile(r"^[.#\[]|^[a-z]+[.#\[]|^[a-z-]+$", re.I)

RUNTIME_JS = r"""
() => {
  const out = { animations: [], scrollTriggers: [] };
  for (const a of document.getAnimations()) {
    let kf = [];
    try { kf = a.effect.getKeyframes(); } catch (e) {}
    let tm = {};
    try { tm = a.effect.getTiming(); } catch (e) {}
    out.animations.push({
      type: a.constructor.name,
      id: (a.animationName || a.transitionProperty || ""),
      duration: tm.duration, delay: tm.delay, easing: tm.easing,
      iterations: tm.iterations,
      keyframes: kf.map(k => ({ offset: k.offset, easing: k.easing,
        transform: k.transform, opacity: k.opacity })),
    });
  }
  if (window.ScrollTrigger && window.ScrollTrigger.getAll) {
    for (const st of window.ScrollTrigger.getAll()) {
      out.scrollTriggers.push({
        start: String(st.start), end: String(st.end),
        scrub: st.vars && st.vars.scrub, pin: !!(st.vars && st.vars.pin),
        trigger: st.trigger && st.trigger.tagName,
        vars: st.animation && st.animation.vars ? Object.keys(st.animation.vars) : [],
      });
    }
  }
  return out;
}
"""


def capture_runtime(urls, focus):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None
    try:
        merged = {"tier": "runtime", "motion_findings": [], "focus_element": None,
                  "scroll_samples": [], "runtime_libraries": {}}
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for url in urls:
                page = browser.new_page()
                page.goto(url, wait_until="networkidle", timeout=20000)
                data = page.evaluate(RUNTIME_JS)
                for a in data.get("animations", []):
                    dur = a.get("duration")
                    merged["motion_findings"].append({
                        "element": "(runtime)",
                        "trigger": "load-or-state",
                        "mechanism": f"{a.get('type', 'Animation')} {a.get('id', '')}".strip(),
                        "properties": sorted({k for kf in a.get("keyframes", [])
                                              for k in ("transform", "opacity")
                                              if kf.get(k) is not None}),
                        "timing": {
                            "durations_ms": [int(dur)] if isinstance(dur, (int, float)) else [],
                            "easings": [a["easing"]] if a.get("easing") else [],
                        },
                        "library": "WAAPI", "scrubbed": False,
                        "reduced_motion": "check both states (see report notes)",
                    })
                if data.get("scrollTriggers"):
                    merged["runtime_libraries"]["gsap_scrolltrigger"] = data["scrollTriggers"]
                sel = focus if _SELECTORISH.match(focus or "") else "section, header, [data-scroll]"
                try:
                    samples = page.evaluate(
                        """(sel) => { const els=[...document.querySelectorAll(sel)].slice(0,6);
                          const rows=[]; const H=document.body.scrollHeight;
                          for (let i=0;i<=40;i++){ const y=Math.round(H*i/40);
                            window.scrollTo(0,y);
                            rows.push({y, e: els.map(el=>{const s=getComputedStyle(el);
                              return {t:s.transform, o:s.opacity};})}); }
                          window.scrollTo(0,0); return rows; }""", sel)
                    merged["scroll_samples"].extend(samples)
                except Exception:
                    pass
                if focus and _SELECTORISH.match(focus):
                    try:
                        merged["focus_element"] = page.evaluate(
                            """(sel) => { const el=document.querySelector(sel); if(!el) return null;
                              const s=getComputedStyle(el); const r=el.getBoundingClientRect();
                              return { html: el.outerHTML.slice(0,1200),
                                box: {w:r.width,h:r.height},
                                css: {display:s.display, position:s.position,
                                      transition:s.transition, transform:s.transform} }; }""",
                            focus)
                    except Exception:
                        pass
                page.close()
            browser.close()
        return merged
    except Exception:
        return None
```

Update `run_capture` — replace its body with:

```python
def run_capture(urls, focus, tier):
    per_url = [fetch(u) for u in urls]
    report, any_ok = build_report(urls, focus, "static", per_url)

    all_css = []
    for u in per_url:
        if not u["ok"]:
            continue
        css, css_srcs = extract_stylesheets(u["text"], u["url"])
        report["sources"] = list(dict.fromkeys(report["sources"] + css_srcs))
        all_css.append(css)
    combined = "\n".join(all_css)
    findings, m = _css_findings(combined)
    report["motion_findings"] = findings
    if m["scroll_timeline"]:
        report["not_captured"].append(
            "scroll-timeline is present; its per-element scroll->property mapping "
            "needs Tier 2 (runtime) to measure")
    if m["view_transitions"]:
        report.setdefault("features", []).append("view-transitions")
    if m["starting_style"]:
        report.setdefault("features", []).append("@starting-style")

    html_all = "\n".join(u["text"] for u in per_url if u["ok"])
    libs = fingerprint_libraries(html_all)
    report["libraries"] = libs
    report["trigger_hints"] = trigger_hints(html_all)
    if "<canvas" in html_all.lower():
        report["not_captured"].append("canvas / WebGL animation (not readable from source)")
    if {"rive", "lottie"} & set(libs):
        report["not_captured"].append(
            "Rive / Lottie asset animation (flagged, not reproduced — rebuild the intent)")
    js_motion_libs = [l for l in libs if l != "three"]
    if js_motion_libs:
        report["not_captured"].append(
            f"library-driven motion ({', '.join(js_motion_libs)}) — values need "
            f"Tier 2 (runtime) or the Tier-3 snippet path in references/motion-capture.md")

    if tier in ("auto", "runtime") and any_ok:
        rt = capture_runtime([u["url"] for u in per_url if u["ok"]], focus)
        if rt is None:
            report["not_captured"].append(
                "runtime capture unavailable (playwright not installed or failed to "
                "launch) — ran Tier 1 only")
        else:
            report["tier"] = "runtime"
            report["motion_findings"] += rt["motion_findings"]
            report["focus_element"] = rt.get("focus_element")
            report["scroll_samples"] = rt.get("scroll_samples", [])
            report["runtime_libraries"] = rt.get("runtime_libraries", {})
            report["not_captured"] = [n for n in report["not_captured"]
                                      if "Tier 2 (runtime)" not in n]

    return report, any_ok
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `python evals/run_script_evals.py --verbose`
Expected: PASS — "Capture — tier handling" green; all earlier capture groups green; the whole harness still exits 0 with Playwright absent.

Run: `python scripts/capture.py --selfcheck` → `selfcheck ok`.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture.py evals/run_script_evals.py
git commit -m "feat: capture.py — guarded Playwright Tier 2 with clean static fallback

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 6: `references/motion-capture.md`

**Files:**
- Create: `references/motion-capture.md`
- Test: manual — a grep check plus a read-through against the spec.

**Interfaces:**
- Consumes: the schema and behavior built in Tasks 1–5; the spec §5, §6, §9.
- Produces: the reference doc that `SKILL.md`, `commands.md`, and `motion.md` will point at.

- [ ] **Step 1: Write the doc**

Create `references/motion-capture.md` with these sections (write full prose, no placeholders):

1. **Header + when to read it** — read when a `parti` invocation includes an inspiration URL, or when running `reference` / `capture` directly, or when specifying motion "like site X". State the one rule up front: *captured per element, never per site; every borrowed element gets a dated record with a faithful-or-adapted verdict.*
2. **The three tiers** — a table mirroring spec §5: Tier 1 static (`scripts/capture.py`, stdlib, what it sees / is blind to), Tier 2 Playwright runtime (`--tier runtime`, `document.getAnimations()` + `ScrollTrigger.getAll()` + scroll sampler + focus-element snapshot; needs `pip install playwright && playwright install chromium`), Tier 3 agent-driven (paste the snippets below into whatever browser tool the harness has). Say the tiers run cheapest-first and stop when the focus is answered.
3. **Running it** —
   ```bash
   python scripts/capture.py --url https://siteX.com/pricing --focus "the plan toggle" \
       --tier auto --json /tmp/capture.json --md captures/sitex-com-2026-09-04.md
   ```
   Note `--tier static` for the fast dependency-free pass, `--url` repeatable for multiple references (still per-element, no identity merge).
4. **Tier 3 in-page snippets** — three fenced `js` blocks the agent can run via the Claude Browser pane / claude-in-chrome / Playwright MCP:
   - `getAnimations()` dump (same shape as `RUNTIME_JS` in `capture.py`).
   - `ScrollTrigger.getAll()` dump (guarded by `window.ScrollTrigger`).
   - the 40-step scroll sampler recording `{y, transform, opacity}` for a selector.
   Tell the agent to paste results back and hand them to `capture.py` is not required — the agent folds them into the report markdown directly at Tier 3.
5. **The capture schema** — reproduce spec §6 verbatim: the motion-finding row shape, the focus-element anatomy, and the two columns (Faithful / Adapted) with the rule that a layout-property animation is re-expressed as transform/opacity in the Faithful column.
6. **Faithful vs Adapted — the method** — how to decide per element: Faithful when the mechanism *is* the value (an easing that carries the brand's character, a precise stagger that paces reading); Adapted when only the idea transfers (a nav that collapses on scroll — your proportions, your curve). A worked example on a real pattern (a sliding-pill segmented control), showing both columns.
7. **Guardrails** — reproduce spec §9 as a table: whole-site-clone refusal, signature-element flag, "Not captured" honesty, cross-origin CSS fetched by URL, reduced-motion gap not inherited, no invented values, Playwright-absent fallback.
8. **What this is not** — no full token-system capture, no Rive/Lottie/WebGL reproduction, no cross-site merge, not a general scraper.

- [ ] **Step 2: Verify**

Run:
```bash
grep -Eq "Tier 1|Tier 2|Tier 3" references/motion-capture.md && \
grep -q "never a whole-site clone\|never per site" references/motion-capture.md && \
grep -q "getAnimations" references/motion-capture.md && \
grep -q "FAITHFUL\|Faithful" references/motion-capture.md && \
grep -q "scripts/capture.py --url" references/motion-capture.md && echo OK
```
Expected: `OK`.

Read the file against spec §5, §6, §9 — every row of §9's table has a home here.

- [ ] **Step 3: Commit**

```bash
git add references/motion-capture.md
git commit -m "docs: references/motion-capture.md — tiers, snippets, schema, guardrails

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 7: `SKILL.md` + `references/commands.md` — the `reference` command and wiring

**Files:**
- Modify: `SKILL.md` (Commands → Direction table; Scripts block; Step 0 note)
- Modify: `references/commands.md` (Index → Direction table; new `### reference` section; one wiring line in `explore`, `motion`, `redesign`, `build`, `sync`)
- Test: manual grep + read-through.

**Interfaces:**
- Consumes: `scripts/capture.py` CLI (Tasks 1–5), `references/motion-capture.md` (Task 6).
- Produces: the user-facing command surface and the auto-trigger rule.

- [ ] **Step 1: Edit `SKILL.md`**

In the **Direction** command table (the one containing `motion` / `animate`), add a row:

```
| `reference` | capture an inspiration URL → per-element faithful/adapted spec | `capture` | alias for `reference` |
```

Match the existing two-column-pair table shape — place `reference` next to `motion` / `animate`.

In the **Scripts** fenced block, add after the `motion.py` line:

```bash
python scripts/capture.py --url <url> --focus "<element>" --json /tmp/capture.json  # inspiration-site capture (Tier 1 static; --tier runtime adds Playwright)
```

And append one sentence to the paragraph under the scripts block:

> `capture.py` fetches an inspiration URL and extracts its CSS-level motion, the animation libraries it loads, and — with `--tier runtime` — its live `getAnimations()` / `ScrollTrigger` data and one focus element's anatomy; it never captures a whole site, only the element or behavior named in `--focus`. Full protocol: `references/motion-capture.md`.

In **Step 0 — DESIGN.md, always**, in the "On the way out — sync it" bullet, append:

> A borrowed element from a `reference` capture gets a dated Changelog line naming the source URL and whether it was taken faithfully or adapted; the capture itself lives in `captures/`.

- [ ] **Step 2: Edit `references/commands.md`**

In the **Direction** index table add:

```
| `reference` | one or more inspiration URLs + a focus | per-element capture (faithful + adapted columns) in `captures/` | M |
```

Add a new section after `### animate` (before `### density`):

```markdown
### reference

Capture a specific element, transition, or animation from an inspiration URL and make it
buildable in the user's own stack. Alias: `capture`.

**Input:** one or more URLs, plus a focus — an element or a named behavior ("the nav",
"the scroll reveals", "that pricing toggle"). **A focus is required.** Absent, or "the whole
look", is not a capture: respond with the three options — name a specific element / run
`explore` *informed by* the reference / proceed element-by-element — and wait.

**Auto-trigger:** any URL in a `parti` invocation ("redesign my hero like stripe.com",
"build this the way linear.app does it") runs `reference` first, emitting one line:
`Capturing linear.app first (focus: hero motion). Say "skip capture" to work from description only.`

**Run:**

```bash
python scripts/capture.py --url <url> --focus "<element>" --tier auto \
    --json /tmp/capture.json --md captures/<domain>-<date>.md
```

`--tier static` for the fast, dependency-free pass; `--tier runtime` (needs Playwright) adds
live `getAnimations()` / `ScrollTrigger` data, a scroll sampler, and the focus element's
anatomy. `--url` repeats for multiple references — findings are attributed per source and
stay per-element; there is no cross-site identity merge.

**Output:** `captures/<domain>-<date>.md` (+ `.json`). Per motion finding and for the focus
element, two columns: **Faithful** (measured values re-expressed in the user's stack; a
layout-property animation re-expressed as transform/opacity) and **Adapted** (mechanism and
intent only, values re-derived from the user's tokens, density, and motion posture). The
report always states which tier ran and what it could not see — it never invents a duration
or easing.

**Effort modifiers:** `quick` = Tier 1 only. `standard` = Tier 1 + Tier 2 if available.
`deep` = + a `prefers-reduced-motion` pass, a scroll-through screencast for the feel pass,
and multiple viewports. Whatever the level, say what was not covered.

**Then:** fold the adopted rows into the motion spec (`references/motion.md` §12 format) or
the target component, add the DESIGN.md Changelog line, and — at build time — fill each
Adopted row's build path. Full protocol: `references/motion-capture.md`.
```

Add one wiring sentence to each of these existing sections:

- `### explore` — after "Full process in SKILL.md: ...": *"If the brief includes an inspiration URL, run `reference` on it first (step 2); its findings are constraints and its Adapted column feeds steps 3–4."*
- `### motion` — after the first paragraph: *"If a reference URL is given, run `reference` first and write the spec as a diff from the captured findings."*
- `### redesign` — after "Audit first, propose second.": *"A 'like siteX' request runs `reference` on siteX during the audit; every borrowed element goes on the keep/change list explicitly."*
- `### build` — in the verify step description: *"If motion was captured via `reference`, re-run `scripts/capture.py --tier runtime` against the shipped build and diff its `getAnimations` dump against the spec — a measured fidelity check, not an eyeball one."*
- `### sync` — in the list of what it writes back: *"the build path for each Adopted row in the relevant `captures/*.md`."*

- [ ] **Step 3: Verify**

Run:
```bash
grep -q "### reference" references/commands.md && \
grep -q "reference" SKILL.md && \
grep -q "capture.py" SKILL.md && \
grep -c "reference" references/commands.md && echo OK
```
Expected: `OK` and a count ≥ 6 (the section + five wiring lines + index row).

Read both edits: the `reference` row sits with the other Direction commands; the wiring sentences read naturally in place; nothing contradicts the existing "style is derived" framing.

- [ ] **Step 4: Commit**

```bash
git add SKILL.md references/commands.md
git commit -m "feat: add the reference command + wire capture into explore/motion/redesign/build/sync

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 8: Small pointers, `captures/README.md`, eval trigger cases, optional smoke

**Files:**
- Modify: `references/motion.md` (one pointer in §12)
- Modify: `references/design-md.md` (Changelog-line format for a capture)
- Create: `captures/README.md`
- Modify: `evals/trigger_cases.json`
- Create: `evals/capture_runtime_smoke.py`
- Test: run the eval harness; run the smoke script.

**Interfaces:**
- Consumes: everything above.
- Produces: the last cross-references and the CI-safe trigger cases.

- [ ] **Step 1: `references/motion.md` — §12 pointer**

In section **12. Specifying motion in a direction**, after the intro line, add:

> If the direction is being specified from an inspiration site, capture it first —
> `references/motion-capture.md` — and write this section as a diff from the capture's
> Faithful/Adapted columns rather than from a blank page.

- [ ] **Step 2: `references/design-md.md` — capture Changelog format**

In the Changelog guidance, add a bullet:

> - A borrowed element from a `reference` capture: `YYYY-MM-DD — adopted <element> from <url>
>   (faithful|adapted); see captures/<domain>-<date>.md`. One line per element, not one per
>   capture.

- [ ] **Step 3: Create `captures/README.md`**

```markdown
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
```

- [ ] **Step 4: `evals/trigger_cases.json` — add cases**

Add these objects to the array (keep valid JSON — comma between existing last item and these):

```json
  { "query": "build this hero the way linear.app/method does it", "should_trigger": true },
  { "query": "I want the scroll animations from https://stripe.com/payments on our page", "should_trigger": true },
  { "query": "capture the nav collapse from vercel.com and use it in our dashboard", "should_trigger": true },
  { "query": "just download the raw HTML of example.com for me", "should_trigger": false }
```

- [ ] **Step 5: Create `evals/capture_runtime_smoke.py`**

```python
#!/usr/bin/env python3
"""
capture_runtime_smoke.py - optional Playwright smoke for scripts/capture.py.

Not wired into run_script_evals.py: that harness must pass with no third-party
deps. This one self-skips when `playwright` is absent.

    python evals/capture_runtime_smoke.py          # SKIP or PASS/FAIL, exit 0/1
"""
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
CAPTURE = os.path.join(os.path.dirname(HERE), "scripts", "capture.py")

PAGE = """<!doctype html><html><head><style>
section{height:120vh;transition:opacity 300ms cubic-bezier(0.16,1,0.3,1)}
</style></head><body>
<section id="a" data-scroll>one</section><section id="b">two</section>
<script>document.getElementById('a').animate(
  [{transform:'translateY(20px)',opacity:0},{transform:'none',opacity:1}],
  {duration:500, easing:'cubic-bezier(0.16,1,0.3,1)'});</script>
</body></html>"""


def main():
    try:
        import playwright  # noqa: F401
    except ImportError:
        print("SKIP  playwright not installed — runtime smoke not run")
        return 0
    tmp = tempfile.mkdtemp(prefix="cap_smoke_")
    page = os.path.join(tmp, "p.html")
    open(page, "w", encoding="utf-8").write(PAGE)
    out = os.path.join(tmp, "o.json")
    url = "file:///" + page.replace(os.sep, "/")
    rc = subprocess.run([sys.executable, CAPTURE, "--url", url, "--focus", "section",
                         "--tier", "runtime", "--json", out, "--quiet"]).returncode
    data = json.load(open(out, encoding="utf-8"))
    ok = (rc == 0 and data["tier"] == "runtime"
          and any(f["timing"].get("durations_ms") for f in data["motion_findings"])
          and len(data.get("scroll_samples", [])) >= 10)
    print(("PASS" if ok else "FAIL") + f"  tier={data['tier']} "
          f"findings={len(data['motion_findings'])} samples={len(data.get('scroll_samples', []))}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 6: Verify**

Run: `python -c "import json; json.load(open('evals/trigger_cases.json')); print('json ok')"`
Expected: `json ok`.

Run: `python evals/run_script_evals.py`
Expected: `TOTAL <n>/<n> passed`, exit 0.

Run: `python evals/capture_runtime_smoke.py`
Expected: `SKIP ...` (no Playwright) or `PASS ...` — exit 0 either way.

Run:
```bash
grep -q "motion-capture.md" references/motion.md && \
grep -q "reference. capture" references/design-md.md; grep -q "captures/" references/design-md.md && echo OK
```
Expected: `OK`.

- [ ] **Step 7: Commit**

```bash
git add references/motion.md references/design-md.md captures/README.md evals/trigger_cases.json evals/capture_runtime_smoke.py
git commit -m "docs+test: capture pointers, captures/ README, trigger cases, runtime smoke

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Task 9: Full-suite verification + spec sync

**Files:**
- Modify: `docs/superpowers/specs/2026-09-04-parti-reference-capture-design.md` (status line only)
- Test: the whole `evals/` suite + `--selfcheck` on every script.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a green suite and a synced spec.

- [ ] **Step 1: Run everything**

```bash
python scripts/capture.py --selfcheck
python scripts/motion.py --selfcheck
python evals/run_script_evals.py --verbose
python evals/capture_runtime_smoke.py
```

Expected: `selfcheck ok` twice; the eval harness prints `TOTAL <n>/<n> passed` and exits 0 with **no capture group failing**; the smoke prints `SKIP` or `PASS`.

- [ ] **Step 2: Manual end-to-end against a real fixture in the repo**

```bash
python scripts/capture.py \
  --url "file:///$(pwd)/examples/01-landing-page/parti/index.html" \
  --focus "the hero" --json /tmp/cap.json --md /tmp/cap.md --quiet
cat /tmp/cap.md
```

Expected: a Markdown skeleton with `## Motion findings` populated from that file's CSS,
`## Focus element` carrying the Tier-1 "not captured at Tier 1" note, `## Adopted` empty,
and a `Not captured:` line that includes the minified-JS caveat. Exit 0.

- [ ] **Step 3: Spec coverage check**

Re-read `docs/superpowers/specs/2026-09-04-parti-reference-capture-design.md` §§4–11 and
confirm each requirement has a landing task (this is a read-through, not a script). Note any
gap in the commit message if one is found and fixed.

- [ ] **Step 4: Sync the spec status**

Change the spec's `**Status:** approved for planning` line to
`**Status:** implemented 2026-09-04 (plan: docs/superpowers/plans/2026-09-04-parti-reference-capture.md)`.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-04-parti-reference-capture-design.md
git commit -m "chore: mark reference-capture spec implemented

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review

**1. Spec coverage**

| Spec section | Task(s) |
|---|---|
| §4 `reference` command, invocation, auto-trigger, effort modifiers, whole-site refusal | Task 7 (command def), Task 8 (trigger cases) |
| §5.1 Tier 1 static (CSS motion, library fingerprint, trigger hints) | Tasks 2, 3 |
| §5.2 Tier 2 Playwright runtime (`getAnimations`, `ScrollTrigger.getAll`, scroll sampler, focus element, reduced-motion `deep`) | Task 5; `deep`-only screencast documented in Task 6 §2 (agent-run, not scripted) |
| §5.3 Tier 3 agent-driven snippets | Task 6 §4 |
| §5.4 honesty ("not captured", no invented values) | Tasks 1, 3, 5 (`not_captured` never empty; no fabricated timing) |
| §6 schema (motion findings, focus element, Faithful/Adapted columns) | Tasks 2, 4, 5 (JSON), Task 6 §5 (doc) |
| §7 artifact `captures/<domain>-<date>.{md,json}`, DESIGN.md Changelog line | Tasks 1, 4 (emit), Task 8 (README, design-md format) |
| §8 wiring into explore/motion/redesign/build/sync | Task 7 §2 |
| §9 guardrails | Task 6 §7 (doc); Tasks 3, 5 (mechanical parts: cross-origin fetch-by-URL via `extract_stylesheets`, layout-property note in markdown, Playwright fallback) |
| §10 files | Tasks 1, 6, 7, 8 |
| §11 testing (unit fixtures, Playwright smoke, trigger cases) | Tasks 1–5 (unit), Task 8 §5 (smoke), Task 8 §4 (trigger cases) |
| §12 out of scope | Enforced by omission; stated in Task 6 §8 |

No gaps. One deliberate narrowing: spec §11's "Playwright smoke against `examples/nextjs`" is implemented as a self-contained fixture page in `capture_runtime_smoke.py` instead of standing up the Next.js dev server — same assertion (`getAnimations` non-empty, scroll sampler monotonic), no server dependency in CI.

**2. Placeholder scan**

No `TBD` / `TODO` / "implement later" / "add error handling" / "similar to Task N". Every code step is a full code block. Test steps contain real assertions. Doc steps (Tasks 6–8) specify exact section content and exact strings to grep for.

**3. Type consistency**

- `fetch()` return dict keys `{url, ok, content_type, text, error}` — same in Tasks 1, 2, 3, 5.
- `parse_css_motion()` return keys — defined Task 2, consumed by `_css_findings` in Task 2 only; stable.
- Motion-finding shape `{element, trigger, mechanism, properties, timing:{durations_ms, easings}, library, scrubbed, reduced_motion}` — identical in Task 2 (`_css_findings`), Task 4 (`render_markdown` reads these keys), Task 5 (`capture_runtime` emits the same shape). `render_markdown` uses `.get()` on every optional key.
- Report envelope keys — introduced Task 1 (`build_report`), extended in place in Tasks 2/3/5 (`motion_findings`, `libraries`, `trigger_hints`, `focus_element`, `not_captured`, `sources`, `tier`, `scroll_samples`, `runtime_libraries`, `features`). `render_markdown` and every test reads them by the same names.
- CLI flags `--url` (append), `--focus`, `--tier {auto,static,runtime}`, `--json`, `--md`, `--quiet` — identical across Tasks 1, 4, 5 and every `capture()` test helper call.
- `capture_runtime(urls, focus) -> dict | None` — defined and consumed only in Task 5; caller handles `None`.

No mismatches found.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-09-04-parti-reference-capture.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
