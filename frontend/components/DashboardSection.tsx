"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";

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

type DashboardData = {
  charts: DashboardChart[];
  filters: FilterDef[];
};

const PIE_COLORS = ["#22d3ee", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6"];

function normalizeChartType(type: string) {
  const t = (type || "").toLowerCase();

  if (t === "line" || t === "line_chart") return "line_chart";
  if (t === "bar" || t === "bar_chart") return "bar_chart";
  if (t === "pie" || t === "pie_chart") return "pie_chart";
  if (t === "donut") return "donut";
  if (t === "area" || t === "area_chart") return "area_chart";
  if (t === "scatter" || t === "scatter_chart") return "scatter_chart";
  if (t === "horizontal_bar") return "horizontal_bar";
  if (t === "summary_bar") return "summary_bar";
  if (t === "anomaly_bar") return "anomaly_bar";

  return t;
}

function formatAxisLabel(value: string | number | null) {
  if (value === null || value === undefined) return "";
  return String(value).length > 14 ? `${String(value).slice(0, 14)}…` : String(value);
}

function filterChartData(
  data: Record<string, string | number | null>[],
  filters: Record<string, string>
) {
  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value && value !== "__all__"
  );

  if (!activeFilters.length) return data;

  return data.filter((row) =>
    activeFilters.every(([key, value]) => String(row[key] ?? "") === value)
  );
}

export default function DashboardSection({
  dashboard,
  onApplyFilters,
  loading,
}: {
  dashboard: DashboardData;
  onApplyFilters: (filters: Record<string, string>) => void;
  loading: boolean;
}) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const safeCharts = dashboard?.charts || [];
  const safeFilters = dashboard?.filters || [];

  if (!safeCharts.length) return null;

  const derivedFilters = useMemo(() => {
    if (safeFilters.length > 0) {
      return safeFilters.map((filter) => ({
        ...filter,
        values: filter.values || [],
      }));
    }

    return [];
  }, [safeFilters]);

  const updateFilter = (filterName: string, value: string) => {
    const nextFilters = {
      ...selectedFilters,
      [filterName]: value,
    };
    setSelectedFilters(nextFilters);
    onApplyFilters(nextFilters);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 className="section-title" style={{ marginBottom: "8px" }}>
            Auto Dashboard
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            Automatically generated charts based on detected schema, metrics, and categories.
          </p>
        </div>

        {loading && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: "999px",
              background: "rgba(34, 211, 238, 0.10)",
              color: "#67e8f9",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            Updating dashboard...
          </div>
        )}
      </div>

      <div className="subtle-card" style={{ padding: "18px", marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "14px",
            color: "#67e8f9",
          }}
        >
          Functional Filters
        </h3>

        {derivedFilters.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {derivedFilters.map((filter, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>
                  {filter.name}
                </label>
                <select
                  value={selectedFilters[filter.name] || "__all__"}
                  onChange={(e) => updateFilter(filter.name, e.target.value)}
                  style={{
                    padding: "11px 12px",
                    borderRadius: "12px",
                    background: "#0f172a",
                    color: "white",
                    border: "1px solid #334155",
                    outline: "none",
                  }}
                >
                  <option value="__all__">All</option>
                  {filter.values.map((value, i) => (
                    <option key={i} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
            No filter values available for this dataset yet.
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "24px",
        }}
      >
        {safeCharts.map((chart, idx) => {
          const normalizedType = normalizeChartType(chart.type);
          const filteredData = filterChartData(chart.data || [], selectedFilters);

          const commonBoxStyle: React.CSSProperties = {
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.78)",
            padding: "18px",
            boxShadow: "0 16px 40px rgba(2, 6, 23, 0.28)",
          };

          const chartWrapStyle: React.CSSProperties = {
            width: "100%",
            height: "340px",
            background: "linear-gradient(180deg, rgba(15,23,42,0.94), rgba(15,23,42,0.78))",
            borderRadius: "14px",
            padding: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          };

          if (!filteredData.length) {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>
                  {chart.title}
                </h3>
                <div
                  style={{
                    ...chartWrapStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  No chart data available for the selected filters.
                </div>
              </div>
            );
          }

          if (normalizedType === "line_chart") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey={chart.x_key} tickFormatter={formatAxisLabel} stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={chart.y_key} stroke="#22d3ee" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (normalizedType === "area_chart") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey={chart.x_key} tickFormatter={formatAxisLabel} stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey={chart.y_key} stroke="#06b6d4" fill="#0891b2" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (normalizedType === "bar_chart" || normalizedType === "summary_bar" || normalizedType === "anomaly_bar") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData.slice(0, 20)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey={chart.x_key} tickFormatter={formatAxisLabel} stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={chart.y_key} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (normalizedType === "horizontal_bar") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData.slice(0, 20)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey={chart.y_key} type="category" width={100} tickFormatter={formatAxisLabel} stroke="#94a3b8" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={chart.x_key} fill="#22c55e" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (normalizedType === "pie_chart" || normalizedType === "donut") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie
                        data={filteredData.slice(0, 10)}
                        dataKey={chart.y_key}
                        nameKey={chart.x_key}
                        outerRadius={100}
                        innerRadius={normalizedType === "donut" ? 55 : 0}
                        label
                      >
                        {filteredData.slice(0, 10).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          if (normalizedType === "scatter_chart") {
            return (
              <div key={idx} style={commonBoxStyle}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
                <div style={chartWrapStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid stroke="#334155" />
                      <XAxis type="number" dataKey={chart.x_key} name={chart.x_key} stroke="#94a3b8" />
                      <YAxis type="number" dataKey={chart.y_key} name={chart.y_key} stroke="#94a3b8" />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Legend />
                      <Scatter name={chart.title} data={filteredData} fill="#f59e0b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          return (
            <div key={idx} style={commonBoxStyle}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>{chart.title}</h3>
              <div
                style={{
                  ...chartWrapStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                Unsupported chart type: {chart.type}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}