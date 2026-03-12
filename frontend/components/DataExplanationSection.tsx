type DataExplanationProps = {
  title?: string;
  datasetType?: string;
  metricName?: string | null;
  dateColumn?: string | null;
  categoryColumn?: string | null;
  anomalyCount?: number;
};

export default function DataExplanationSection({
  title,
  datasetType,
  metricName,
  dateColumn,
  categoryColumn,
  anomalyCount,
}: DataExplanationProps) {
  return (
    <div>
      <h2 className="section-title">Data Explanation</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "18px",
        }}
      >
        <InfoCard label="Dataset / Table" value={title || "Unknown"} />
        <InfoCard label="Dataset Type" value={datasetType || "Unknown"} />
        <InfoCard label="Primary Metric" value={metricName || "Not identified"} />
        <InfoCard label="Primary Date Column" value={dateColumn || "Not identified"} />
        <InfoCard label="Primary Category" value={categoryColumn || "Not identified"} />
        <InfoCard
          label="Detected Anomalies"
          value={typeof anomalyCount === "number" ? anomalyCount.toLocaleString() : "0"}
        />
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
          What this data means
        </h3>

        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            lineHeight: 1.9,
            fontSize: "15px",
          }}
        >
          This dataset appears to be a <strong>{datasetType || "general"}</strong> dataset.
          The main metric being analyzed is <strong>{metricName || "the detected numeric measure"}</strong>.
          The system is using <strong>{dateColumn || "the detected time field"}</strong> as the timeline
          and <strong>{categoryColumn || "the detected grouping field"}</strong> as the main comparison dimension.
          This means the dashboard is explaining how the metric changes over time, which categories contribute most,
          and which records behave unusually compared to the rest of the dataset.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="subtle-card"
      style={{
        padding: "16px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          color: "#e2e8f0",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        {value}
      </p>
    </div>
  );
}