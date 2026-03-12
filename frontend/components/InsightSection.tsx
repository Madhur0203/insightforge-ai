type InsightsData = {
  executive_summary?: string;
  insights?: string[];
  recommendations?: string[];
};

type DecisionItem = {
  type: string;
  message: string;
};

export default function InsightSection({
  insights,
  decisions,
}: {
  insights: InsightsData;
  decisions: DecisionItem[];
}) {
  const executiveSummary = insights?.executive_summary || "No summary available.";
  const keyFindings = insights?.insights || [];
  const recommendations = insights?.recommendations || [];
  const safeDecisions = decisions || [];

  return (
    <div>
      <h2 className="section-title">AI Insights</h2>

      <div
        style={{
          display: "grid",
          gap: "18px",
        }}
      >
        <div
          className="subtle-card"
          style={{
            padding: "18px",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#67e8f9",
            }}
          >
            Executive Summary
          </h3>
          <p
            style={{
              margin: 0,
              color: "#cbd5e1",
              lineHeight: 1.8,
              fontSize: "15px",
            }}
          >
            {executiveSummary}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "18px",
          }}
        >
          <div
            className="subtle-card"
            style={{
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#67e8f9",
              }}
            >
              Key Findings
            </h3>

            {keyFindings.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "#e2e8f0",
                  lineHeight: 1.9,
                }}
              >
                {keyFindings.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#94a3b8" }}>No findings available.</p>
            )}
          </div>

          <div
            className="subtle-card"
            style={{
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#67e8f9",
              }}
            >
              Recommendations
            </h3>

            {recommendations.length > 0 ? (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  color: "#e2e8f0",
                  lineHeight: 1.9,
                }}
              >
                {recommendations.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#94a3b8" }}>No recommendations available.</p>
            )}
          </div>

          <div
            className="subtle-card"
            style={{
              padding: "18px",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#67e8f9",
              }}
            >
              Decision Engine
            </h3>

            {safeDecisions.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {safeDecisions.map((decision, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid rgba(148,163,184,0.14)",
                      borderRadius: "14px",
                      padding: "14px",
                      background: "rgba(15,23,42,0.55)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        background: "rgba(59,130,246,0.14)",
                        color: "#93c5fd",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      {decision.type}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "#e2e8f0",
                        lineHeight: 1.7,
                        fontSize: "14px",
                      }}
                    >
                      {decision.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: "#94a3b8" }}>No decision guidance available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}