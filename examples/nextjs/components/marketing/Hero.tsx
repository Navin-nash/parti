import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { StatusToken } from "@/components/ui/StatusToken";
import { FLIGHTS } from "@/lib/data";

/**
 * The hero shows the actual product, not an illustration of it. A marketing
 * page for a dispatch tool that renders a stock hero image is arguing that the
 * board is not the selling point — and the board is the entire selling point.
 */
export function Hero() {
  const rows = FLIGHTS.slice(0, 4);
  return (
    <section className="section" style={{ borderTop: 0 }}>
      <div className="wrap">
        <div className="eyebrow">
          <span className="dot" aria-hidden="true" />
          <span className="label">Dispatch desk · live board</span>
        </div>
        <h1 className="display measure">The board stays readable on the tenth hour.</h1>
        <p className="body measure muted" style={{ marginTop: "var(--s-5)" }}>
          Meridian is the reassignment surface for aircraft dispatchers. When a flight goes
          irregular, the rack shows what broke, what it breaks downline, and what you can
          legally do about it — without leaving the board.
        </p>
        <div style={{ display: "flex", gap: "var(--s-3)", marginTop: "var(--s-8)", flexWrap: "wrap" }}>
          <ButtonLink href="/dashboard" variant="primary" size="lg">
            See the board
          </ButtonLink>
          <ButtonLink href="/pricing" variant="quiet" size="lg">
            Pricing
          </ButtonLink>
        </div>

        <div style={{ marginTop: "var(--s-12)" }}>
          <Panel title="Rack · SEA desk · 14:22Z" meta={<span className="strip dim">7 active</span>} bodyless>
            <div className="rack-scroll">
              <table className="rack">
                <thead>
                  <tr>
                    <th scope="col">Flight</th>
                    <th scope="col">Tail</th>
                    <th scope="col">Pair</th>
                    <th scope="col">STD</th>
                    <th scope="col">ETD</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((f) => (
                    <tr key={f.id} data-state={f.state}>
                      <th scope="row" style={{ fontWeight: 500 }}>
                        {f.flight}
                      </th>
                      <td>{f.tail}</td>
                      <td>
                        {f.origin}–{f.dest}
                      </td>
                      <td>{f.std}</td>
                      <td>{f.etd}</td>
                      <td>
                        <StatusToken state={f.state} label={f.status} delta={f.delta} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
