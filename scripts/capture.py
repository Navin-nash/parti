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
import http.client
import json
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

RE_LINK_CSS = re.compile(r"<link\b[^>]*>", re.I)
RE_HREF = re.compile(r"""href\s*=\s*["']([^"']+)["']""", re.I)
RE_REL_SHEET = re.compile(r"""rel\s*=\s*["']?[^"'>]*stylesheet""", re.I)
RE_STYLE_BLOCK = re.compile(r"<style\b[^>]*>(.*?)</style>", re.I | re.S)

RE_KEYFRAMES = re.compile(r"@(?:-webkit-)?keyframes\s+([\w-]+)\s*\{", re.I)
# Broad: every transition/animation longhand. Feeds the census aggregate only.
RE_DECL_TRANSITION = re.compile(r"transition(?:-property|-duration|-timing-function|-delay|-behavior)?\s*:\s*([^;{}]+)", re.I)
RE_DECL_ANIMATION = re.compile(r"animation(?:-name|-duration|-timing-function|-delay|-iteration-count)?\s*:\s*([^;{}]+)", re.I)
# Shorthand only. Feeds motion_findings — a finding is one authored `transition:`/
# `animation:` declaration, never a stray `transition-duration: .2s` fragment.
RE_SHORT_TRANSITION = re.compile(r"(?<![-\w])transition\s*:\s*([^;{}]+)", re.I)
RE_SHORT_ANIMATION = re.compile(r"(?<![-\w])animation\s*:\s*([^;{}]+)", re.I)
# A declaration that is a single bare value carries no mechanism — drop it.
RE_BARE_VALUE = re.compile(
    r"^(all|none|inherit|initial|unset|revert|auto|infinite|both|forwards|backwards|"
    r"alternate|alternate-reverse|reverse|normal|running|paused|"
    r"ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|"
    r"[\d.]+m?s|[\d.]+|cubic-bezier\([^)]*\)|steps\([^)]*\)|[a-zA-Z][\w-]*)$")
RE_DUR = re.compile(r"(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])")
RE_CUBIC = re.compile(r"cubic-bezier\([^)]*\)")
RE_STEPS = re.compile(r"steps\([^)]*\)")
RE_EASE_KW = re.compile(r"\b(ease-in-out|ease-out|ease-in|linear|ease)\b")
RE_PROP = re.compile(r"\b(transform|opacity|filter|backdrop-filter|clip-path|height|width|top|left|right|bottom|margin|color|background(?:-color)?|box-shadow)\b")
RE_SCROLL_TL = re.compile(r"animation-timeline\s*:\s*(?:scroll|view)\s*\(", re.I)
RE_VIEW_TRANS = re.compile(r"@view-transition|view-transition-name\s*:|::view-transition", re.I)
RE_STARTING = re.compile(r"@starting-style", re.I)

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
    except (urllib.error.URLError, http.client.HTTPException, ValueError, OSError) as e:
        return {"url": url, "ok": False, "content_type": "", "text": "",
                "error": str(e)[:200]}


def build_report(urls, focus, tier, per_url):
    ok = [u for u in per_url if u.get("ok")]
    not_captured = [
        "content behind authentication, interaction, or geo/region gating is not captured",
    ]
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
    src = ", ".join(report["sources"][:6])
    L = [f"# Capture — {src}   ({report['captured']}, tier: {report['tier']})",
         f"Focus: {report['focus'] or '(none stated — narrow this before adopting anything)'}"]
    if report.get("focus_resolved_selector"):
        L.append(f"Focus resolved to selector: `{report['focus_resolved_selector']}`")
    if report.get("libraries"):
        L.append(f"Libraries seen: {', '.join(report['libraries'])}")
    if report.get("features"):
        L.append(f"Features: {', '.join(report['features'])}")
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
    fe = report.get("focus_element")
    if fe is None and report["tier"] != "runtime":
        L.append("_Not captured at Tier 1 (the page was not run). Use Tier 2 or the "
                 "Tier-3 snippet path to capture the element's DOM, states and rationale._")
    elif fe is None:
        L.append("_Runtime ran but no focus element resolved — pass `--focus` as a real "
                 "selector (e.g. `.hero-section`) so Tier 2 can lock onto the reveal layer._")
    else:
        L.append(f"```\n{fe.get('html', '')[:1200]}\n```")
        L.append(f"- box: {fe.get('box')}")
        L.append(f"- computed: {fe.get('css')}")
        L.append("- **FAITHFUL →** _its structure + states, in your stack_")
        L.append("- **ADAPTED →** _the mechanism only, rebuilt in your system_")
    L += ["", "## Adopted", "",
          "_element → FAITHFUL | ADAPTED → build path (filled in at build time; "
          "mirror into DESIGN.md changelog)_", ""]
    return "\n".join(L) + "\n"


def _to_ms(value, unit):
    v = float(value)
    return int(round(v * 1000.0)) if unit == "s" else int(round(v))


def _norm_ease(s):
    """Canonicalise an easing literal so spelling variants dedupe.
    cubic-bezier(0.4, 0, 0.2, 1) / cubic-bezier(.4,0,.2,1) -> cubic-bezier(.4,0,.2,1)
    (a genuinely different curve like cubic-bezier(0,0,.2,1) stays distinct)."""
    s = re.sub(r"\s+", "", s.strip().lower())
    m = re.match(r"(cubic-bezier|steps)\((.*)\)$", s)
    if m:
        try:
            parts = [p.strip() for p in m.group(2).split(",")]
            nums = [float(p) if re.fullmatch(r"-?[\d.]+", p) else p for p in parts]
            fmt = ",".join(
                (p if isinstance(p, str)
                 else (str(int(p)) if p == int(p) else f"{p:g}".replace("0.", ".")))
                for p in nums)
            return f"{m.group(1)}({fmt})"
        except ValueError:
            pass
    return s


def _norm_mechanism(decl):
    """Collapse whitespace and normalise embedded curves / 0.x durations so
    `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)` and its terse twin dedupe."""
    d = " ".join(decl.split())
    d = re.sub(r"cubic-bezier\([^)]*\)|steps\([^)]*\)",
               lambda x: _norm_ease(x.group(0)), d)
    d = re.sub(r"(?<![\d.])0(\.\d+m?s)\b", r"\1", d)   # 0.8s -> .8s
    return d


def extract_stylesheets(html, base_url):
    css_parts = list(RE_STYLE_BLOCK.findall(html))
    sources = []
    base_scheme = urllib.parse.urlparse(base_url).scheme
    for tag in RE_LINK_CSS.findall(html)[:25]:  # a hostile page can carry hundreds
        if not RE_REL_SHEET.search(tag):
            continue
        m = RE_HREF.search(tag)
        if not m:
            continue
        href = urllib.parse.urljoin(base_url, m.group(1))
        if urllib.parse.urlparse(href).scheme != base_scheme:
            continue  # block cross-scheme inclusion (e.g. remote page linking file://)
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
    # Findings come from the SHORTHAND only, so `transition-duration: .2s` and
    # `animation-name: foo` no longer each spawn a bare-token "finding".
    for raw in (RE_SHORT_TRANSITION.findall(css) + RE_SHORT_ANIMATION.findall(css)):
        decl = _norm_mechanism(raw)
        if RE_BARE_VALUE.match(decl):
            continue
        findings.append({
            "element": "(css)", "trigger": "unknown", "mechanism": decl[:200],
            "properties": sorted(set(RE_PROP.findall(decl))),
            "timing": {
                "durations_ms": sorted({_to_ms(a, b) for a, b in RE_DUR.findall(decl)}),
                "easings": sorted({_norm_ease(e) for e in
                                   (RE_CUBIC.findall(decl) + RE_STEPS.findall(decl))}
                                  | {_norm_ease(e) for e in RE_EASE_KW.findall(decl)}),
            },
            "library": "CSS", "scrubbed": False, "reduced_motion": reduced,
        })
    return _dedupe_findings(findings), m


def _dedupe_findings(findings):
    """Collapse findings that describe the same thing (minified + source copy,
    curve spelled two ways). Order-preserving."""
    seen, out = set(), []
    for f in findings:
        t = f["timing"]
        key = (f["mechanism"].replace(" ", "").lower(),
               tuple(t.get("durations_ms", [])),
               tuple(t.get("easings", [])),
               tuple(f["properties"]) if isinstance(f["properties"], list) else (),
               f.get("library", ""))
        if key in seen:
            continue
        seen.add(key)
        out.append(f)
    return out


# One getAnimations() snapshot. Used for the load-time dump and re-used at every
# scroll step by SCROLL_CAPTURE_JS.
_DUMP_ANIMATIONS = """
  (() => document.getAnimations().map(a => {
    let kf = [], tm = {};
    try { kf = a.effect.getKeyframes(); } catch (e) {}
    try { tm = a.effect.getTiming(); } catch (e) {}
    return {
      type: a.constructor.name,
      id: (a.animationName || a.transitionProperty || ""),
      target: (a.effect && a.effect.target && a.effect.target.tagName) || "",
      duration: tm.duration, delay: tm.delay, easing: tm.easing,
      iterations: tm.iterations,
      keyframes: kf.map(k => ({ offset: k.offset, easing: k.easing,
        transform: k.transform, opacity: k.opacity })),
    };
  }))()
"""

RUNTIME_JS = r"""
() => {
  const out = { animations: %s, scrollTriggers: [] };
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
""" % _DUMP_ANIMATIONS.strip()

# Scroll the page top-to-bottom, and at every step re-read getAnimations() so
# reveals that only instantiate once their section enters the viewport are
# actually seen. Also samples transform/opacity of the focus elements.
SCROLL_CAPTURE_JS = r"""
async (focus) => {
  const raf = () => new Promise(r => requestAnimationFrame(r));
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const HEURISTICS = ["[class*='hero']", "main > section", "section",
                      "[data-scroll]", "[data-aos]", "header", "footer"];
  let sel = focus, resolved = "";
  const looksSelector = /^\s*[.#\[]|[.#\[]|^[a-z][\w-]*$/i.test(focus || "");
  const cands = (focus && looksSelector) ? [focus, ...HEURISTICS] : HEURISTICS;
  for (const c of cands) {
    try { if (document.querySelector(c)) { sel = c; resolved = c; break; } } catch (e) {}
  }
  const els = resolved ? [...document.querySelectorAll(resolved)].slice(0, 6) : [];
  const dump = () => %s;
  const seen = new Map(), samples = [];
  const key = (a) => a.id + "|" + Math.round(a.duration || 0) + "|" + a.type + "|" + a.target;
  const H = document.documentElement.scrollHeight;
  const STEPS = 14;
  for (let i = 0; i <= STEPS; i++) {
    const y = Math.round(H * i / STEPS);
    window.scrollTo(0, y);
    await raf(); await raf(); await sleep(90);
    for (const a of dump()) if (!seen.has(key(a))) seen.set(key(a), a);
    samples.push({ y, e: els.map(el => { const s = getComputedStyle(el);
      return { t: s.transform, o: s.opacity }; }) });
  }
  window.scrollTo(0, 0); await raf();
  return { animations: [...seen.values()], samples, resolvedSelector: resolved };
}
""" % _DUMP_ANIMATIONS.strip()


def _anim_to_finding(a, trigger):
    dur = a.get("duration")
    return {
        "element": "(runtime)", "trigger": trigger,
        "mechanism": _norm_mechanism(
            f"{a.get('type', 'Animation')} {a.get('id', '')}".strip()),
        "properties": sorted({k for kf in a.get("keyframes", [])
                              for k in ("transform", "opacity")
                              if kf.get(k) is not None}),
        "timing": {
            "durations_ms": [int(dur)] if isinstance(dur, (int, float)) else [],
            "easings": [_norm_ease(a["easing"])] if a.get("easing") else [],
        },
        "library": "WAAPI", "scrubbed": False,
        "reduced_motion": "check both states (see report notes)",
    }


def _anim_key(a):
    return (a.get("id", ""), int(a.get("duration") or 0),
            a.get("type", ""), a.get("target", ""))


def capture_runtime(urls, focus):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return None
    try:
        merged = {"tier": "runtime", "motion_findings": [], "focus_element": None,
                  "scroll_samples": [], "runtime_libraries": {},
                  "focus_resolved_selector": None}
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for url in urls:
                page = browser.new_page()
                page.goto(url, wait_until="networkidle", timeout=20000)

                load = page.evaluate(RUNTIME_JS)
                load_keys = {_anim_key(a) for a in load.get("animations", [])}
                for a in load.get("animations", []):
                    merged["motion_findings"].append(
                        _anim_to_finding(a, "load-or-state"))
                if load.get("scrollTriggers"):
                    merged["runtime_libraries"]["gsap_scrolltrigger"] = \
                        load["scrollTriggers"]

                try:
                    sc = page.evaluate(SCROLL_CAPTURE_JS, focus or "")
                    merged["scroll_samples"].extend(sc.get("samples", []))
                    merged["focus_resolved_selector"] = sc.get("resolvedSelector") or None
                    for a in sc.get("animations", []):
                        if _anim_key(a) not in load_keys:
                            merged["motion_findings"].append(
                                _anim_to_finding(a, "in-view / scroll"))
                except Exception:
                    pass

                resolved = merged["focus_resolved_selector"]
                if resolved:
                    try:
                        merged["focus_element"] = page.evaluate(
                            """(sel) => { const el=document.querySelector(sel); if(!el) return null;
                              const s=getComputedStyle(el); const r=el.getBoundingClientRect();
                              return { html: el.outerHTML.slice(0,1200),
                                box: {w:r.width,h:r.height},
                                css: {display:s.display, position:s.position,
                                      transition:s.transition, transform:s.transform} }; }""",
                            resolved)
                    except Exception:
                        pass
                page.close()
            browser.close()
        merged["motion_findings"] = _dedupe_findings(merged["motion_findings"])
        return merged
    except Exception:
        return None


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
            report["motion_findings"] = _dedupe_findings(
                report["motion_findings"] + rt["motion_findings"])
            report["focus_element"] = rt.get("focus_element")
            report["focus_resolved_selector"] = rt.get("focus_resolved_selector")
            report["scroll_samples"] = rt.get("scroll_samples", [])
            report["runtime_libraries"] = rt.get("runtime_libraries", {})
            report["not_captured"] = [n for n in report["not_captured"]
                                      if "Tier 2 (runtime)" not in n]
            if not any(f["trigger"] == "in-view / scroll"
                       for f in rt["motion_findings"]):
                report["not_captured"].append(
                    "no scroll-triggered animation surfaced during the scroll pass "
                    "(the page may reveal via class toggles / transforms rather than "
                    "the Web Animations API, or the focus selector missed the reveal layer)")

    if report["tier"] == "static":
        report["not_captured"].append(
            "JS-driven motion inside minified bundles is not executed at this tier")
    else:
        report["not_captured"] += [
            "canvas / WebGL / shader internals are not readable even at runtime",
            "Rive / Lottie asset animation is flagged, not reproduced",
            "a prefers-reduced-motion pass was not run this capture",
        ]

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
    for u in args.urls:
        scheme = urllib.parse.urlparse(u).scheme.lower()
        if scheme not in ("http", "https", "file"):
            sys.exit(f"unsupported --url scheme {scheme!r} (allowed: http, https, file): {u}")

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
