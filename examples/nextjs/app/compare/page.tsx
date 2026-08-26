import Link from "next/link";
import { PAIRS, MEASURED } from "@/lib/compare";
import { REGISTRY } from "@/lib/registry";

export default function CompareIndex() {
  return (
    <article className="docs__article">
      <div className="docs__body">
        <div className="label">Overview</div>
        <h1 className="h1" style={{ marginTop: "var(--s-3)" }}>
          With the skill, and without it
        </h1>
        <p className="body muted measure" style={{ marginTop: "var(--s-4)" }}>
          Two agents were given the same prompt, verbatim, on the same model. One was required to
          invoke the <span className="strip">parti</span> skill and follow it; the other was
          denied it. Neither was told a comparison was happening. Every preview in the sidebar is
          one of those paired outputs, rendered live.
        </p>

        <div className="ribbon" style={{ marginTop: "var(--s-8)" }}>
          <div className="ribbon__item">
            <span className="label">Paired</span>
            <span className="strip">{PAIRS.length}</span>
          </div>
          <div className="ribbon__item">
            <span className="label">Components</span>
            <span className="strip">{REGISTRY.length}</span>
          </div>
          <div className="ribbon__item">
            <span className="label">Without</span>
            <span className="strip">{MEASURED.baseline.score}</span>
          </div>
          <div className="ribbon__item">
            <span className="label">With parti</span>
            <span className="strip" style={{ color: "var(--advisory)" }}>
              {MEASURED.parti.score}
            </span>
          </div>
        </div>

        <section style={{ marginTop: "var(--s-10)" }}>
          <h2 className="h3" id="the-finding">
            The finding that matters most
          </h2>
          <p className="small muted measure" style={{ marginTop: "var(--s-2)" }}>
            <strong>The baseline is good.</strong> It was expected to produce the convergent
            default the skill exists to prevent — warm cream, serif display, glass cards on a
            gradient mesh. It produced none of that. Unprompted, it reasoned to a dark ground for
            a dimmed ops room, reserved amber/red/green as an operational vocabulary, and used
            tabular figures so columns hold still on refresh.
          </p>
          <p className="small muted measure" style={{ marginTop: "var(--s-3)" }}>
            So the honest question is not &ldquo;generic versus distinctive&rdquo; — both runs
            reached for the real subject. It is what a strong one-shot build{" "}
            <em>still doesn&rsquo;t produce</em>: a base unit under the spacing, a token spec, and
            a design record that keeps a fifth surface consistent with the first four.
          </p>
        </section>

        <section style={{ marginTop: "var(--s-8)" }}>
          <h2 className="h3" id="how-to-read">
            How to read a preview
          </h2>
          <ul className="checklist" style={{ marginTop: "var(--s-3)" }}>
            <li>
              <strong>With parti</strong> / <strong>Without</strong> swap the rendered output.
              Each runs in its own iframe — two competing design systems in one document would
              let their stylesheets fight.
            </li>
            <li>
              <strong>Split</strong> shows both at once, baseline on the left.
            </li>
            <li>
              <strong>Measured</strong> is what the scripts report, with the caveat attached.
            </li>
            <li>
              Entries marked <span className="docs__soloTag">solo</span> are parti-only React
              components — there is no baseline equivalent, and none was invented.
            </li>
          </ul>
        </section>

        <section style={{ marginTop: "var(--s-8)" }}>
          <h2 className="h3" id="start">
            Start here
          </h2>
          <p className="small muted measure" style={{ marginTop: "var(--s-2)" }}>
            <Link href="/compare/state-empty" className="docs__inline">
              Rack · empty
            </Link>{" "}
            is the clearest single contrast in the set — an empty state either names the filter
            that caused it, or it makes you guess whether the board is broken.
          </p>
        </section>
      </div>

      <aside className="docs__rail" aria-label="On this page">
        <div className="label">On this page</div>
        <ul className="docs__railList">
          <li>
            <a href="#the-finding" className="docs__railLink">
              The finding that matters most
            </a>
          </li>
          <li>
            <a href="#how-to-read" className="docs__railLink">
              How to read a preview
            </a>
          </li>
          <li>
            <a href="#start" className="docs__railLink">
              Start here
            </a>
          </li>
        </ul>
      </aside>
    </article>
  );
}
