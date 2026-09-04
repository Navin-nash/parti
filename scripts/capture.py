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
RE_DECL_TRANSITION = re.compile(r"transition(?:-property|-duration|-timing-function|-delay|-behavior)?\s*:\s*([^;{}]+)", re.I)
RE_DECL_ANIMATION = re.compile(r"animation(?:-name|-duration|-timing-function|-delay|-iteration-count)?\s*:\s*([^;{}]+)", re.I)
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
    if report.get("focus_element") is None:
        L.append("_Not captured at Tier 1 (the page was not run). Use Tier 2 or the "
                 "Tier-3 snippet path to capture the element's DOM, states and rationale._")
    L += ["", "## Adopted", "",
          "_element → FAITHFUL | ADAPTED → build path (filled in at build time; "
          "mirror into DESIGN.md changelog)_", ""]
    return "\n".join(L) + "\n"


def _to_ms(value, unit):
    v = float(value)
    return int(round(v * 1000.0)) if unit == "s" else int(round(v))


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
