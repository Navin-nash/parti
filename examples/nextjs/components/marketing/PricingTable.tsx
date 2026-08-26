import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { TIERS } from "@/lib/data";

/**
 * The recommended tier is marked by a lightness step plus a printed word, never
 * by a shadow, a gradient, or a scale transform. Same elevation rule as the
 * rest of the system — see DESIGN.md § Shape & elevation.
 */
export function PricingTable() {
  return (
    <div className="grid-3">
      {TIERS.map((t) => {
        const featured = "featured" in t && Boolean(t.featured);
        return (
          <Panel
            key={t.name}
            title={t.name}
            focus={featured}
            meta={
              featured ? (
                <span className="label" style={{ color: "var(--advisory)" }}>
                  Most desks
                </span>
              ) : undefined
            }
          >
            <div className="tier__price">{t.price}</div>
            <div className="label" style={{ marginTop: "var(--s-1)" }}>
              {t.unit}
            </div>
            <p className="small muted" style={{ marginTop: "var(--s-4)" }}>
              {t.forWho}
            </p>
            <hr className="divider" />
            <ul className="checklist">
              {t.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div style={{ marginTop: "var(--s-5)" }}>
              <ButtonLink
                href="/dashboard"
                variant={featured ? "primary" : "default"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {t.cta}
              </ButtonLink>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
