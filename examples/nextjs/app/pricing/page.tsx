import { PricingTable } from "@/components/marketing/PricingTable";
import { FAQ } from "@/components/marketing/FAQ";
import { CTA } from "@/components/marketing/CTA";

export const metadata = { title: "Pricing — Meridian" };

export default function PricingPage() {
  return (
    <>
      <section className="section" style={{ borderTop: 0 }}>
        <div className="wrap">
          <div className="label">Pricing</div>
          <h1 className="h1 measure" style={{ marginTop: "var(--s-3)" }}>
            Priced per desk, because that is the unit that does the work.
          </h1>
          <p className="body measure muted" style={{ marginTop: "var(--s-4)" }}>
            Not per seat. A desk is staffed around the clock by whoever holds it, and charging
            per head would penalise the handover the product is built around.
          </p>
          <div style={{ marginTop: "var(--s-10)" }}>
            <PricingTable />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="h1">Questions the desk actually asks</h2>
          <div style={{ marginTop: "var(--s-8)" }}>
            <FAQ />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
