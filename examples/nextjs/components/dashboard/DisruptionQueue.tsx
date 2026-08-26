import { Button } from "@/components/ui/Button";
import { StatusToken } from "@/components/ui/StatusToken";
import type { Disruption } from "@/lib/data";

/**
 * The signature interaction: a disruption discloses its detail in place, so the
 * dispatcher never loses board position to read one. Open state animates
 * grid-template-rows 0fr -> 1fr, which is the one transition in the system
 * allowed to run at 200ms.
 *
 * Note there is no nested panel here — each disruption is separated by a
 * hairline and a label, because a card inside a card is banned.
 */
export function DisruptionQueue({ items }: { items: Disruption[] }) {
  return (
    <div>
      {items.map((d, i) => (
        <details
          key={d.id}
          open={i === 0}
          style={{
            borderTop: i === 0 ? 0 : "1px solid var(--border)",
            padding: "var(--s-3) 0",
          }}
        >
          <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--s-3)", flexWrap: "wrap" }}>
            <span className="strip">{d.flight}</span>
            <StatusToken state={d.state} label={d.state === "warning" ? "IROPS" : "WATCH"} />
            <span className="body" style={{ flex: 1, minWidth: "12ch" }}>
              {d.headline}
            </span>
            <span className="label">{d.opened}</span>
          </summary>
          <div style={{ paddingTop: "var(--s-3)" }}>
            <p className="small muted measure" style={{ margin: 0 }}>
              {d.detail}
            </p>
            <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-4)", flexWrap: "wrap" }}>
              <Button variant="primary">Reassign aircraft</Button>
              <Button>Call reserve</Button>
              <Button variant="quiet">Add desk-log note</Button>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
