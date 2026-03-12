"use client";

import { useMemo, useState } from "react";

type AnomalyItem = {
  time: string | null;
  metric: string;
  value: number | null;
  z_score: number | null;
  severity: string;
};

type AnomalyData = {
  metric?: string | null;
  time_column?: string | null;
  anomaly_count?: number;
  anomalies?: AnomalyItem[];
  summary?: string;
};

export default function AnomalySection({
  anomalies,
}: {
  anomalies: AnomalyData;
}) {
  const [showAll, setShowAll] = useState(false);

  if (!anomalies) return null;

  const safeItems = anomalies.anomalies || [];

  const visibleItems = useMemo(() => {
    return showAll ? safeItems : safeItems.slice(0, 25);
  }, [safeItems, showAll]);

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "24px",
        border: "1px solid #334155",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "18px" }}>
        Anomaly Detection
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={cardStyle}>
          <p style={labelStyle}>Metric</p>
          <p style={valueStyle}>{anomalies.metric || "N/A"}</p>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Anomaly Count</p>
          <p style={valueStyle}>{anomalies.anomaly_count ?? 0}</p>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Time Column</p>
          <p style={valueStyle}>{anomalies.time_column || "N/A"}</p>
        </div>
      </div>

      <p style={{ color: "#cbd5e1", marginBottom: "18px" }}>
        {anomalies.summary || "No anomaly summary available."}
      </p>

      <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          Showing {visibleItems.length} of {safeItems.length} anomaly records
        </p>

        {safeItems.length > 25 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            style={{
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#67e8f9",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {showAll ? "Show Top 25" : "Show All"}
          </button>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "rgba(15,23,42,0.75)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#111827" }}>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Metric</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Z-Score</th>
              <th style={thStyle}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length > 0 ? (
              visibleItems.map((item, idx) => (
                <tr key={idx} style={{ borderTop: "1px solid #1f2937" }}>
                  <td style={tdStyle}>{item.time || "-"}</td>
                  <td style={tdStyle}>{item.metric}</td>
                  <td style={tdStyle}>
                    {typeof item.value === "number" ? item.value.toLocaleString() : "-"}
                  </td>
                  <td style={tdStyle}>
                    {typeof item.z_score === "number" ? item.z_score.toFixed(2) : "-"}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        background:
                          item.severity === "high"
                            ? "rgba(239,68,68,0.18)"
                            : item.severity === "medium"
                            ? "rgba(245,158,11,0.18)"
                            : "rgba(59,130,246,0.18)",
                        color:
                          item.severity === "high"
                            ? "#fca5a5"
                            : item.severity === "medium"
                            ? "#fcd34d"
                            : "#93c5fd",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan={5}>
                  No anomalies detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  background: "rgba(15,23,42,0.75)",
  padding: "16px",
};

const labelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
  color: "#e2e8f0",
  fontSize: "24px",
  fontWeight: 700,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  color: "#cbd5e1",
  fontSize: "13px",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  color: "#e2e8f0",
  fontSize: "14px",
};