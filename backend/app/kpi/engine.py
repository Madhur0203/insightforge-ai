def build_kpi_summary(plan: dict, analytics: dict) -> dict:
    metric_columns = plan.get("metric_columns", [])
    descriptive = analytics.get("descriptive", {})
    anomaly = analytics.get("anomaly")

    kpis = []

    for metric in metric_columns:
        stats = descriptive.get(metric)
        if not stats:
            continue

        kpis.append({
            "metric": metric,
            "total": stats.get("sum"),
            "average": stats.get("mean"),
            "median": stats.get("median"),
            "min": stats.get("min"),
            "max": stats.get("max"),
            "count": stats.get("count"),
        })

    anomaly_kpi = None
    if anomaly:
        anomaly_kpi = {
            "metric": anomaly.get("metric"),
            "anomaly_count": anomaly.get("anomaly_count", 0)
        }

    return {
        "kpis": kpis,
        "anomaly_kpi": anomaly_kpi
    }