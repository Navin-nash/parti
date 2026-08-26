import { FAQS } from "@/lib/data";

/**
 * Native <details> — a disclosure that works before hydration and with
 * JavaScript disabled. The open transition animates grid-template-rows rather
 * than height: height is a layout property, and animating it forces reflow on
 * every frame (motion-rules: perf-layout-property).
 */
export function FAQ() {
  return (
    <div className="stack">
      {FAQS.map((f) => (
        <details key={f.q} className="panel">
          <summary className="panel__head" style={{ cursor: "pointer" }}>
            <span className="h3">{f.q}</span>
            <span className="label" aria-hidden="true">
              Open
            </span>
          </summary>
          <div className="panel__body">
            <p className="small muted measure" style={{ margin: 0 }}>
              {f.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
