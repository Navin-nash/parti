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
CAPTURE = os.path.join(os.path.dirname(HERE), "skills", "parti", "scripts", "capture.py")

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
