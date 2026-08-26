import { ButtonLink } from "@/components/ui/Button";

/**
 * The default generic CTA pair is avoided here: it says nothing about what
 * happens next. These name the actual next step for this audience, which is a
 * shadow shift beside the existing board.
 */
export function CTA() {
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="h1 measure">Put it on one desk first.</h2>
        <p className="body measure muted" style={{ marginTop: "var(--s-4)" }}>
          Most carriers start with a single desk on a shadow shift — the board runs beside the
          existing one for a week, with no cutover and no records implication.
        </p>
        <div style={{ display: "flex", gap: "var(--s-3)", marginTop: "var(--s-6)", flexWrap: "wrap" }}>
          <ButtonLink href="/pricing" variant="primary" size="lg">
            Start a shadow shift
          </ButtonLink>
          <ButtonLink href="/dashboard" variant="quiet" size="lg">
            Walk the board
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
