import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { FlightRack } from "@/components/dashboard/FlightRack";
import { DisruptionQueue } from "@/components/dashboard/DisruptionQueue";
import { FLIGHTS, DISRUPTIONS } from "@/lib/data";

export const metadata = { title: "Board — Meridian" };

/**
 * The dispatcher screen.
 *
 * Note what is NOT here: a KPI tile row. Board state is one line of mono in the
 * ribbon, which is how ops status is actually transmitted between desks — four
 * big numbers in rounded cards is a consumer-analytics convention borrowed by
 * products that did not ask what the number is for.
 */
export default function DashboardPage() {
  const irops = FLIGHTS.filter((f) => f.state !== "normal").length;

  return (
    <div className="wrap" style={{ paddingTop: "var(--s-6)", paddingBottom: "var(--s-16)" }}>
      <div className="ribbon" style={{ marginBottom: "var(--s-4)" }}>
        <div className="ribbon__item">
          <span className="dot" aria-hidden="true" />
          <span className="label">SEA desk</span>
          <span className="strip">14:22Z</span>
        </div>
        <div className="ribbon__item">
          <span className="label">Active</span>
          <span className="strip">{FLIGHTS.length}</span>
        </div>
        <div className="ribbon__item">
          <span className="label">IROPS</span>
          <span className="strip">{irops}</span>
        </div>
        <div className="ribbon__item">
          <span className="label">Feed</span>
          <span className="strip">ACARS 14:22Z</span>
        </div>
        <div className="ribbon__item">
          <span className="label">Dispatcher</span>
          <span className="strip">R. OYELARAN</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 350px", gap: "var(--s-4)", alignItems: "start" }} className="board">
        <Panel
          title="Rack · SEA"
          meta={<span className="strip dim">{FLIGHTS.length} strips</span>}
          actions={<Button variant="quiet">Filter</Button>}
          bodyless
        >
          <FlightRack flights={FLIGHTS} />
        </Panel>

        <div className="stack">
          <Panel title="Disruptions" meta={<span className="strip dim">{DISRUPTIONS.length} open</span>} focus>
            <DisruptionQueue items={DISRUPTIONS} />
          </Panel>

          <Panel title="Desk log">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {[
                ["14:19Z", "HZ2214 ferry approved MEL 29-11-02 — R.O."],
                ["14:11Z", "HZ1180 EDCT 15:05Z acknowledged — R.O."],
                ["14:07Z", "HZ2260 reserve callout issued — R.O."],
                ["13:52Z", "HZ2214 diversion PSC opened — R.O."],
              ].map(([t, entry]) => (
                <li key={t} style={{ display: "flex", gap: "var(--s-3)", padding: "var(--s-2) 0", borderBottom: "1px solid var(--border)" }}>
                  <span className="strip dim">{t}</span>
                  <span className="small">{entry}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
