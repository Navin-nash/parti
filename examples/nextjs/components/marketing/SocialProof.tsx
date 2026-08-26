/**
 * No avatars and no logo wall of unnamed marks. A dispatcher evaluates this by
 * fleet size and certificate type, so those are the figures shown — and the
 * quote is attributed by role, which is what carries weight here.
 */
export function SocialProof() {
  const stats = [
    { label: "Carriers", value: "14" },
    { label: "Desks live", value: "63" },
    { label: "Events / mo", value: "2,940" },
    { label: "Median reassign", value: "4m 12s" },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="ribbon" role="group" aria-label="Deployment figures">
          {stats.map((s) => (
            <div className="ribbon__item" key={s.label}>
              <span className="label">{s.label}</span>
              <span className="strip">{s.value}</span>
            </div>
          ))}
        </div>
        <blockquote className="measure" style={{ margin: "var(--s-10) 0 0", padding: 0 }}>
          <p className="body">
            &ldquo;The previous board made me open three tabs to find out whether a swap was
            legal. This one refuses the swap and tells me which limit it hit. That is the
            whole job.&rdquo;
          </p>
          <footer className="label" style={{ marginTop: "var(--s-3)" }}>
            Duty manager · 42-aircraft regional certificate
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
