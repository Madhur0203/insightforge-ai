from app.analytics.descriptive import run_descriptive_analysis
from app.analytics.trend import run_trend_analysis
from app.analytics.category import run_category_analysis
from app.analytics.anomaly.engine import detect_anomalies


def run_analytics(df, plan: dict) -> dict:
    metric_columns = plan.get("metric_columns", [])
    date_columns = plan.get("date_columns", [])
    category_columns = plan.get("category_columns", [])

    descriptive = run_descriptive_analysis(df, metric_columns)

    trend = None
    if metric_columns and date_columns:
        trend = run_trend_analysis(df, date_columns[0], metric_columns[0])

    category = None
    if metric_columns and category_columns:
        category = run_category_analysis(df, category_columns[0], metric_columns[0])

    anomaly = None
    if metric_columns:
        anomaly = detect_anomalies(
            df=df,
            metric_column=metric_columns[0],
            date_column=date_columns[0] if date_columns else None
        )

    return {
        "descriptive": descriptive,
        "trend": trend,
        "category": category,
        "anomaly": anomaly
    }