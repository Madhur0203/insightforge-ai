def recommend_charts(plan: dict, analytics_result: dict) -> list[dict]:
    """
    Build chart recommendations dynamically from detected roles + analysis outputs.
    Returns abstract chart intents first. Another layer converts them into chart data.
    """
    metric_columns = plan.get("metric_columns", [])
    date_columns = plan.get("date_columns", [])
    category_columns = plan.get("category_columns", [])

    descriptive = analytics_result.get("descriptive") or {}
    trend = analytics_result.get("trend") or {}
    category = analytics_result.get("category") or {}
    anomaly = analytics_result.get("anomaly") or {}

    recommendations: list[dict] = []

    primary_metric = metric_columns[0] if metric_columns else None
    secondary_metric = metric_columns[1] if len(metric_columns) > 1 else None
    primary_date = date_columns[0] if date_columns else None
    primary_category = category_columns[0] if category_columns else None

    category_results = category.get("results", []) or []
    trend_points = trend.get("points", []) or []
    anomaly_records = anomaly.get("records", []) or []

    # Time-series charts
    if primary_metric and primary_date and trend_points:
        recommendations.append({
            "chart_type": "line",
            "title": f"{primary_metric} over time",
            "x": "date",
            "y": "value",
            "reason": "A time dimension and metric were detected.",
            "priority": 100,
        })

        recommendations.append({
            "chart_type": "area",
            "title": f"{primary_metric} trend area",
            "x": "date",
            "y": "value",
            "reason": "Area chart can emphasize magnitude over time.",
            "priority": 88,
        })

    # Category comparison charts
    if primary_metric and primary_category and category_results:
        recommendations.append({
            "chart_type": "bar",
            "title": f"{primary_metric} by {primary_category}",
            "x": "category",
            "y": "value",
            "reason": "A category and metric were detected.",
            "priority": 95,
        })

        recommendations.append({
            "chart_type": "horizontal_bar",
            "title": f"Top {primary_category} by {primary_metric}",
            "x": "value",
            "y": "category",
            "reason": "Horizontal bars work well for ranked categories.",
            "priority": 84,
        })

        if 2 <= len(category_results) <= 10:
            recommendations.append({
                "chart_type": "pie",
                "title": f"{primary_category} share of {primary_metric}",
                "x": "category",
                "y": "value",
                "reason": "Small category counts are suitable for share charts.",
                "priority": 78,
            })

            recommendations.append({
                "chart_type": "donut",
                "title": f"{primary_category} distribution",
                "x": "category",
                "y": "value",
                "reason": "Donut chart gives a compact part-to-whole view.",
                "priority": 76,
            })

    # Distribution summary from descriptive stats
    if primary_metric and primary_metric in descriptive:
        recommendations.append({
            "chart_type": "summary_bar",
            "title": f"{primary_metric} summary statistics",
            "x": "stat",
            "y": "value",
            "reason": "Summary statistics are available for the primary metric.",
            "priority": 72,
        })

    # Scatter if multiple numeric measures exist
    if primary_metric and secondary_metric:
        recommendations.append({
            "chart_type": "scatter",
            "title": f"{primary_metric} vs {secondary_metric}",
            "x": primary_metric,
            "y": secondary_metric,
            "reason": "Multiple metrics are available for relationship analysis.",
            "priority": 70,
        })

    # Anomaly chart if anomaly records are available
    if anomaly_records and primary_metric:
        recommendations.append({
            "chart_type": "anomaly_bar",
            "title": f"Top anomalies for {primary_metric}",
            "x": "time",
            "y": "value",
            "reason": "Anomaly records are available for the metric.",
            "priority": 90,
        })

    # Fallback chart if nothing else exists
    if not recommendations and descriptive:
        first_metric = next(iter(descriptive.keys()))
        recommendations.append({
            "chart_type": "summary_bar",
            "title": f"{first_metric} summary statistics",
            "x": "stat",
            "y": "value",
            "reason": "Fallback summary view from descriptive statistics.",
            "priority": 50,
        })

    # Sort by priority descending
    recommendations = sorted(recommendations, key=lambda x: x.get("priority", 0), reverse=True)

    # Remove duplicate chart_type + title combos
    seen = set()
    deduped = []
    for rec in recommendations:
        key = (rec.get("chart_type"), rec.get("title"))
        if key not in seen:
            deduped.append(rec)
            seen.add(key)

    return deduped