from app.services.dataset_service import prepare_dataset_analysis
from app.analytics.engine import run_analytics
from app.visualization.builder import build_chart_specs
from app.visualization.chart_recommender import recommend_charts
from app.kpi.engine import build_kpi_summary
from app.decision.engine import generate_decisions
from app.filters.engine import extract_filter_values

import pandas as pd


def _build_summary_bar_data(descriptive: dict, metric_name: str) -> list[dict]:
    metric_stats = descriptive.get(metric_name)
    if not metric_stats:
        return []

    return [
        {"stat": "Min", "value": metric_stats.get("min")},
        {"stat": "Median", "value": metric_stats.get("median")},
        {"stat": "Mean", "value": metric_stats.get("mean")},
        {"stat": "Max", "value": metric_stats.get("max")},
    ]


def _build_anomaly_bar_data(anomaly: dict, limit: int = 15) -> list[dict]:
    records = anomaly.get("records", []) or []
    rows = []
    for record in records[:limit]:
        rows.append({
            "time": record.get("time", "Unknown"),
            "value": record.get("value"),
            "severity": record.get("severity"),
        })
    return rows


def _safe_numeric(series: pd.Series) -> pd.Series:
    cleaned = (
        series.astype(str)
        .str.replace(",", "", regex=False)
        .str.replace("$", "", regex=False)
        .str.strip()
    )
    cleaned = cleaned.replace({"": None, "nan": None, "None": None})
    return pd.to_numeric(cleaned, errors="coerce")


def _build_scatter_data(df, x_col: str, y_col: str, limit: int = 500) -> list[dict]:
    if x_col not in df.columns or y_col not in df.columns:
        return []

    working = df[[x_col, y_col]].copy()
    working[x_col] = _safe_numeric(working[x_col])
    working[y_col] = _safe_numeric(working[y_col])

    # If either column is mostly non-numeric, do not build scatter
    x_valid_ratio = float(working[x_col].notna().mean()) if len(working) else 0.0
    y_valid_ratio = float(working[y_col].notna().mean()) if len(working) else 0.0

    if x_valid_ratio < 0.6 or y_valid_ratio < 0.6:
        return []

    working = working.dropna().head(limit)

    return [
        {
            x_col: float(row[x_col]),
            y_col: float(row[y_col]),
        }
        for _, row in working.iterrows()
    ]


def _enrich_charts_with_data(df, plan: dict, chart_recommendations: list[dict], analytics_result: dict) -> list[dict]:
    enriched = []

    trend = analytics_result.get("trend") or {}
    category = analytics_result.get("category") or {}
    descriptive = analytics_result.get("descriptive") or {}
    anomaly = analytics_result.get("anomaly") or {}

    for rec in chart_recommendations:
        chart_type = rec.get("chart_type")

        if chart_type == "line" and trend.get("points"):
            enriched.append({
                "type": "line",
                "title": rec.get("title", "Trend"),
                "x_key": "date",
                "y_key": "value",
                "data": trend.get("points", []),
            })

        elif chart_type == "area" and trend.get("points"):
            enriched.append({
                "type": "area",
                "title": rec.get("title", "Area Trend"),
                "x_key": "date",
                "y_key": "value",
                "data": trend.get("points", []),
            })

        elif chart_type == "bar" and category.get("results"):
            enriched.append({
                "type": "bar",
                "title": rec.get("title", "Category Comparison"),
                "x_key": "category",
                "y_key": "value",
                "data": category.get("results", [])[:20],
            })

        elif chart_type == "horizontal_bar" and category.get("results"):
            enriched.append({
                "type": "horizontal_bar",
                "title": rec.get("title", "Top Categories"),
                "x_key": "value",
                "y_key": "category",
                "data": category.get("results", [])[:20],
            })

        elif chart_type == "pie" and category.get("results"):
            enriched.append({
                "type": "pie",
                "title": rec.get("title", "Distribution"),
                "x_key": "category",
                "y_key": "value",
                "data": category.get("results", [])[:10],
            })

        elif chart_type == "donut" and category.get("results"):
            enriched.append({
                "type": "donut",
                "title": rec.get("title", "Distribution"),
                "x_key": "category",
                "y_key": "value",
                "data": category.get("results", [])[:10],
            })

        elif chart_type == "summary_bar":
            metric_columns = plan.get("metric_columns", [])
            metric = metric_columns[0] if metric_columns else next(iter(descriptive.keys()), None)
            if metric:
                data = _build_summary_bar_data(descriptive, metric)
                if data:
                    enriched.append({
                        "type": "summary_bar",
                        "title": rec.get("title", f"{metric} Summary"),
                        "x_key": "stat",
                        "y_key": "value",
                        "data": data,
                    })

        elif chart_type == "anomaly_bar" and anomaly.get("records"):
            data = _build_anomaly_bar_data(anomaly)
            if data:
                enriched.append({
                    "type": "anomaly_bar",
                    "title": rec.get("title", "Top Anomalies"),
                    "x_key": "time",
                    "y_key": "value",
                    "data": data,
                })

        elif chart_type == "scatter":
            x_col = rec.get("x")
            y_col = rec.get("y")
            if x_col and y_col:
                data = _build_scatter_data(df, x_col, y_col)
                if data:
                    enriched.append({
                        "type": "scatter",
                        "title": rec.get("title", "Scatter Plot"),
                        "x_key": x_col,
                        "y_key": y_col,
                        "data": data,
                    })

    return enriched


def run_full_analysis(file_path: str, filters: dict | None = None) -> dict:
    prepared_tables = prepare_dataset_analysis(file_path, filters=filters)
    final_output = []

    for item in prepared_tables:
        df = item["dataframe"]
        plan = item["plan"]
        analytics_result = run_analytics(df, plan)

        _ = build_chart_specs(plan, analytics_result)
        chart_recommendations = recommend_charts(plan, analytics_result)
        dashboard_charts = _enrich_charts_with_data(df, plan, chart_recommendations, analytics_result)

        filter_defs = extract_filter_values(df, plan.get("category_columns", []))
        kpi_summary = build_kpi_summary(plan, analytics_result)
        decision_summary = generate_decisions(plan, analytics_result)

        final_output.append({
            "table_name": item["table_name"],
            "profile": item["profile"],
            "semantics": item["semantics"],
            "classification": item["classification"],
            "plan": item["plan"],
            "analytics": analytics_result,
            "charts": dashboard_charts,
            "filters": filter_defs,
            "kpis": kpi_summary,
            "decisions": decision_summary,
        })

    return {"tables": final_output}