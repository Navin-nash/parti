import { FEATURES } from "@/lib/data";

/**
 * Sequence markers are real dispatch units (T+0:00), not 01 / 02 / 03.
 * Numbering is only honest when the content genuinely is a sequence — here it
 * is: the elapsed clock of an irregular-operations event.
 */
export function Features() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h1 measure">What the desk actually does during an event</h2>
        <div className="grid-3" style={{ marginTop: "var(--s-10)" }}>
          {FEATURES.map((f) => (
            <article key={f.at}>
              <div className="label" style={{ color: "var(--advisory)" }}>
                {f.at}
              </div>
              <h3 className="h3" style={{ marginTop: "var(--s-3)" }}>
                {f.title}
              </h3>
              <p className="small muted" style={{ marginTop: "var(--s-2)" }}>
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
