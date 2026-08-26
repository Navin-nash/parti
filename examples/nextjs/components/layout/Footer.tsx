export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <span className="label">Meridian Dispatch · reference build</span>
        <span className="label">Direction: Strip Rack · see shared/DESIGN.md</span>
      </div>
    </footer>
  );
}
