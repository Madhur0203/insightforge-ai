"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import KPISection from "../components/KPISection";
import InsightSection from "../components/InsightSection";
import DashboardSection from "../components/DashboardSection";
import AskSection from "../components/AskSection";
import AnomalySection from "../components/AnomalySection";
import DataExplanationSection from "../components/DataExplanationSection";

type FilterDef = {
  name: string;
  values: string[];
};

type DashboardChart = {
  type: string;
  title: string;
  x_key: string;
  y_key: string;
  data: Record<string, string | number | null>[];
};

type ApiResponse = {
  status?: string;
  insights?: {
    executive_summary?: string;
    insights?: string[];
    recommendations?: string[];
  };
  kpis?: {
    name: string;
    value: number;
    type: string;
  }[];
  dashboard?: {
    charts: DashboardChart[];
    filters: FilterDef[];
  };
  decisions?: {
    type: string;
    message: string;
  }[];
  anomalies?: {
    metric?: string | null;
    time_column?: string | null;
    anomaly_count?: number;
    anomalies?: {
      time: string | null;
      metric: string;
      value: number | null;
      z_score?: number | null;
      severity: string;
    }[];
    summary?: string;
  };
  dataExplanation?: {
    title?: string;
    datasetType?: string;
    metricName?: string | null;
    dateColumn?: string | null;
    categoryColumn?: string | null;
    anomalyCount?: number;
  };
};

type BackendAnalyzeResponse = {
  tables?: {
    table_name: string;
    profile?: {
      shape?: {
        rows: number;
        columns: number;
      };
      columns?: {
        column_name: string;
      }[];
    };
    semantics?: {
      semantic_columns?: {
        column_name: string;
        role: string;
        confidence: number;
      }[];
    };
    analytics?: {
      descriptive?: Record<
        string,
        {
          count: number;
          mean: number;
          median: number;
          min: number;
          max: number;
          std: number;
          sum: number;
        }
      >;
      trend?: {
        date_column?: string;
        metric_column?: string;
        points?: {
          date: string;
          value: number;
        }[];
      };
      category?: {
        category_column?: string;
        metric_column?: string;
        results?: {
          category: string;
          value: number;
        }[];
      };
      anomaly?: {
        metric?: string;
        time_column?: string;
        anomaly_count?: number;
        method?: string;
        records?: {
          time?: string;
          metric: string;
          value: number;
          z_score?: number;
          severity: string;
        }[];
      };
    };
    filters?: {
      name: string;
      values: string[];
    }[];
    kpis?: {
      kpis?: {
        metric: string;
        total: number;
        average: number;
        median: number;
        min: number;
        max: number;
        count: number;
      }[];
    };
    decisions?: {
      recommended_actions?: {
        type: string;
        message: string;
      }[];
    };
    classification?: {
      dataset_type?: string;
    };
    plan?: {
      category_columns?: string[];
    };
  }[];
};

const API_BASE = "http://localhost:8000/api";

function transformBackendToFrontend(result: BackendAnalyzeResponse): ApiResponse {
  const table = result?.tables?.[0];

  if (!table) {
    return {
      status: "empty",
      insights: {
        executive_summary: "No analyzable table was returned by the backend.",
        insights: [],
        recommendations: [],
      },
      kpis: [],
      dashboard: { charts: [], filters: [] },
      decisions: [],
      anomalies: {
        metric: null,
        time_column: null,
        anomaly_count: 0,
        anomalies: [],
        summary: "No anomaly output available.",
      },
      dataExplanation: {
        title: "Unknown",
        datasetType: "Unknown",
        metricName: null,
        dateColumn: null,
        categoryColumn: null,
        anomalyCount: 0,
      },
    };
  }

  const descriptive = table.analytics?.descriptive || {};
  const descriptiveMetricName = Object.keys(descriptive)[0];
  const descriptiveMetric = descriptiveMetricName ? descriptive[descriptiveMetricName] : null;

  const firstKpi = table.kpis?.kpis?.[0];
  const trend = table.analytics?.trend;
  const category = table.analytics?.category;
  const anomaly = table.analytics?.anomaly;

  const metricSemantic =
    table.semantics?.semantic_columns?.find((c) => c.role === "metric")?.column_name || null;
  const dateSemantic =
    table.semantics?.semantic_columns?.find((c) => c.role === "date")?.column_name || null;
  const categorySemantic =
    table.semantics?.semantic_columns?.find((c) => c.role === "category")?.column_name || null;

  const charts: DashboardChart[] = [];

  if (trend?.points?.length) {
    charts.push({
      type: "line",
      title: `${trend.metric_column || "Metric"} Trend`,
      x_key: "date",
      y_key: "value",
      data: trend.points.map((p) => ({ date: p.date, value: p.value })),
    });
  }

  if (category?.results?.length) {
    charts.push({
      type: "bar",
      title: `${category.metric_column || "Metric"} by ${category.category_column || "Category"}`,
      x_key: "category",
      y_key: "value",
      data: category.results.slice(0, 15).map((r) => ({
        category: r.category,
        value: r.value,
      })),
    });

    charts.push({
      type: "pie",
      title: `Top ${category.category_column || "Categories"} Distribution`,
      x_key: "category",
      y_key: "value",
      data: category.results.slice(0, 8).map((r) => ({
        category: r.category,
        value: r.value,
      })),
    });
  }

  if (!charts.length && descriptiveMetric) {
    charts.push({
      type: "bar",
      title: `${descriptiveMetricName} Summary`,
      x_key: "category",
      y_key: "value",
      data: [
        { category: "Min", value: descriptiveMetric.min },
        { category: "Median", value: descriptiveMetric.median },
        { category: "Mean", value: descriptiveMetric.mean },
        { category: "Max", value: descriptiveMetric.max },
      ],
    });
  }

  const filters =
    table.filters?.map((f) => ({
      name: f.name,
      values: f.values || [],
    })) || [];

  const kpis =
    firstKpi
      ? [
          { name: "Total", value: firstKpi.total, type: "number" },
          { name: "Average", value: firstKpi.average, type: "number" },
          { name: "Median", value: firstKpi.median, type: "number" },
          { name: "Min", value: firstKpi.min, type: "number" },
          { name: "Max", value: firstKpi.max, type: "number" },
          { name: "Count", value: firstKpi.count, type: "number" },
        ]
      : descriptiveMetric
        ? [
            { name: "Total", value: descriptiveMetric.sum, type: "number" },
            { name: "Average", value: descriptiveMetric.mean, type: "number" },
            { name: "Median", value: descriptiveMetric.median, type: "number" },
            { name: "Min", value: descriptiveMetric.min, type: "number" },
            { name: "Max", value: descriptiveMetric.max, type: "number" },
            { name: "Count", value: descriptiveMetric.count, type: "number" },
          ]
        : [
            {
              name: "Rows",
              value: table.profile?.shape?.rows || 0,
              type: "number",
            },
            {
              name: "Columns",
              value: table.profile?.shape?.columns || 0,
              type: "number",
            },
          ];

  const profileColumns =
    table.profile?.columns?.slice(0, 8).map((c) => c.column_name).join(", ") || "Not available";

  return {
    status: "success",
    insights: {
      executive_summary: [
        `Table analyzed: ${table.table_name}.`,
        table.classification?.dataset_type
          ? `Dataset type: ${table.classification.dataset_type}.`
          : null,
        metricSemantic ? `Detected metric candidate: ${metricSemantic}.` : null,
        dateSemantic ? `Detected date candidate: ${dateSemantic}.` : null,
        categorySemantic ? `Detected category candidate: ${categorySemantic}.` : null,
        `Rows: ${table.profile?.shape?.rows || 0}, Columns: ${table.profile?.shape?.columns || 0}.`,
      ]
        .filter(Boolean)
        .join(" "),
      insights: [
        descriptiveMetric ? `Primary numeric summary is available for ${descriptiveMetricName}.` : "No strong numeric metric was confidently detected.",
        `Detected columns include: ${profileColumns}.`,
        category?.results?.[0]
          ? `Top category is ${category.results[0].category} with value ${category.results[0].value.toLocaleString()}.`
          : "No category comparison results were generated.",
        anomaly?.records?.[0]
          ? `Highest anomaly found at value ${anomaly.records[0].value.toLocaleString()}.`
          : "No anomaly output was generated.",
      ],
      recommendations: [
        !descriptiveMetric ? "Try a dataset with at least one clean numeric column." : "",
        !trend?.points?.length ? "Try including a date-like column for trend analysis." : "",
        !category?.results?.length ? "Try including a categorical grouping field for comparisons." : "",
      ].filter(Boolean),
    },
    kpis,
    dashboard: {
      charts,
      filters,
    },
    decisions:
      table.decisions?.recommended_actions?.map((d) => ({
        type: d.type,
        message: d.message,
      })) || [],
    anomalies: {
      metric: anomaly?.metric || null,
      time_column: anomaly?.time_column || null,
      anomaly_count: anomaly?.anomaly_count || 0,
      anomalies:
        anomaly?.records?.map((r) => ({
          time: r.time || null,
          metric: r.metric,
          value: r.value ?? null,
          z_score: r.z_score ?? null,
          severity: r.severity,
        })) || [],
      summary: anomaly
        ? `${anomaly.anomaly_count || 0} anomalies detected using ${anomaly.method || "backend"} method.`
        : "No anomaly output available.",
    },
    dataExplanation: {
      title: table.table_name,
      datasetType: table.classification?.dataset_type || "Unknown",
      metricName: metricSemantic || descriptiveMetricName || null,
      dateColumn: trend?.date_column || dateSemantic || null,
      categoryColumn: category?.category_column || categorySemantic || null,
      anomalyCount: anomaly?.anomaly_count || 0,
    },
  };
}

async function readErrorResponse(response: Response) {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return parsed?.detail || parsed || text;
  } catch {
    return text;
  }
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string>("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setData(null);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const detail = await readErrorResponse(uploadResponse);
        throw new Error(`Upload failed: ${String(detail)}`);
      }

      const uploadResult = await uploadResponse.json();
      setUploadedPath(uploadResult.path);

      const analyzeResponse = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_path: uploadResult.path,
          filters: {},
        }),
      });

      if (!analyzeResponse.ok) {
        const detail = await readErrorResponse(analyzeResponse);
        throw new Error(`Analyze failed: ${String(detail)}`);
      }

      const analyzeResult: BackendAnalyzeResponse = await analyzeResponse.json();
      setData(transformBackendToFrontend(analyzeResult));
    } catch (error) {
      console.error(error);
      setData(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilteredAnalyze = async (selectedFilters: Record<string, string>) => {
    if (!uploadedPath) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(selectedFilters).filter(([, value]) => value && value !== "__all__")
      );

      const analyzeResponse = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_path: uploadedPath,
          filters: cleanedFilters,
        }),
      });

      if (!analyzeResponse.ok) {
        const detail = await readErrorResponse(analyzeResponse);
        throw new Error(`Filtered analyze failed: ${String(detail)}`);
      }

      const analyzeResult: BackendAnalyzeResponse = await analyzeResponse.json();
      setData(transformBackendToFrontend(analyzeResult));
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="section-card" style={{ padding: "32px", marginBottom: "24px" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "rgba(34, 211, 238, 0.12)",
            color: "#67e8f9",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          InsightForge AI
        </div>

        <h1 className="hero-title">Universal Data Intelligence Platform</h1>
        <p className="hero-subtitle">
          Upload any structured dataset and let the platform profile it, understand it,
          generate KPIs, build dashboard logic, deliver insights, detect anomalies, and
          answer questions in natural language.
        </p>
      </section>

      <section className="section-card" style={{ padding: "24px", marginBottom: "24px" }}>
        <FileUpload file={file} setFile={setFile} onAnalyze={handleAnalyze} loading={loading} />
      </section>

      {errorMessage && (
        <section className="section-card" style={{ padding: "20px", marginBottom: "24px", borderColor: "rgba(239,68,68,0.35)" }}>
          <h2 className="section-title" style={{ color: "#fca5a5" }}>Error</h2>
          <p style={{ margin: 0, color: "#fecaca", lineHeight: 1.7 }}>{errorMessage}</p>
        </section>
      )}

      {data && (
        <>
          <section className="section-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <KPISection kpis={data.kpis || []} />
          </section>

          <section className="section-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <DataExplanationSection {...(data.dataExplanation || {})} />
          </section>

          <div className="grid-two" style={{ marginBottom: "24px" }}>
            <section className="section-card" style={{ padding: "24px" }}>
              <InsightSection insights={data.insights || {}} decisions={data.decisions || []} />
            </section>

            <section className="section-card" style={{ padding: "24px" }}>
              <AnomalySection anomalies={data.anomalies || {}} />
            </section>
          </div>

          <section className="section-card" style={{ padding: "24px", marginBottom: "24px" }}>
            <DashboardSection
              dashboard={data.dashboard || { charts: [], filters: [] }}
              onApplyFilters={handleFilteredAnalyze}
              loading={loading}
            />
          </section>

          <section className="section-card" style={{ padding: "24px" }}>
            <AskSection file={file} />
          </section>
        </>
      )}
    </main>
  );
}