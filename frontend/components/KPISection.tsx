type KPI = {
  name: string;
  value: number;
  type: string;
};

function formatKPIValue(value: number) {
  if (!Number.isFinite(value)) return "N/A";

  if (Math.abs(value) >= 1_000_000) {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  }

  if (!Number.isInteger(value)) {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
  }

  return value.toLocaleString();
}

export default function KPISection({ kpis }: { kpis: KPI[] }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div>
      <h2 className="section-title">KPI Overview</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid rgba(34, 211, 238, 0.14)",
              borderRadius: "18px",
              background: "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.78))",
              padding: "18px",
              boxShadow: "0 14px 32px rgba(2,6,23,0.28)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(34,211,238,0.10)",
                color: "#67e8f9",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              {kpi.type}
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "#e2e8f0",
              }}
            >
              {kpi.name}
            </h3>

            <p
              style={{
                margin: "14px 0 0",
                fontSize: "30px",
                fontWeight: 800,
                color: "#22d3ee",
                lineHeight: 1.1,
              }}
            >
              {formatKPIValue(kpi.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}