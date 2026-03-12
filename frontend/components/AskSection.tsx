"use client";

import { useState } from "react";
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
} from "recharts";

type Props = {
  file: File | null;
};

type AskResult = {
  answer?: string;
  answer_type?: string;
  chart_type?: string;
  x_key?: string;
  y_key?: string;
  data?: Record<string, string | number | null>[];
};

export default function AskSection({ file }: Props) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!file || !question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", question);

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setResult({
        answer: "Failed to fetch answer from backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "40px", padding: "24px", border: "1px solid #334155", borderRadius: "16px", background: "rgba(255,255,255,0.04)" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>
        Ask Your Data
      </h2>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something like: Show sales by region"
          style={{
            flex: 1,
            minWidth: "280px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#0f172a",
            color: "white",
            border: "1px solid #334155",
          }}
        />
        <button
          onClick={askQuestion}
          disabled={!file || loading}
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            border: "none",
            background: "#d946ef",
            color: "white",
            fontWeight: 600,
            cursor: !file || loading ? "not-allowed" : "pointer",
            opacity: !file || loading ? 0.6 : 1,
          }}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            background: "rgba(15,23,42,0.75)",
            padding: "16px",
          }}
        >
          <p style={{ color: "#e2e8f0", marginBottom: "16px" }}>{result.answer}</p>

          {result.answer_type === "chart_data" &&
            result.chart_type === "line_chart" &&
            result.data &&
            result.x_key &&
            result.y_key && (
              <div style={{ width: "100%", height: "320px", background: "#0f172a", borderRadius: "10px", padding: "8px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={result.x_key} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={result.y_key} stroke="#22c55e" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

          {result.answer_type === "chart_data" &&
            result.chart_type === "bar_chart" &&
            result.data &&
            result.x_key &&
            result.y_key && (
              <div style={{ width: "100%", height: "320px", background: "#0f172a", borderRadius: "10px", padding: "8px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={result.x_key} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={result.y_key} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
        </div>
      )}
    </div>
  );
}