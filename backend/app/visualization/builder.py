def build_chart_specs(plan: dict, analytics_result: dict) -> list[dict]:
    """
    Backward-compatible chart spec builder.
    Keeps a lightweight spec representation.
    """
    specs = []

    trend = analytics_result.get("trend")
    category = analytics_result.get("category")
    descriptive = analytics_result.get("descriptive", {})
    anomaly = analytics_result.get("anomaly")

    if trend and trend.get("points"):
        specs.append({
            "chart_type": "line",
            "title": f"{trend['metric_column']} over time",
            "x": "date",
            "y": "value",
        })

        specs.append({
            "chart_type": "area",
            "title": f"{trend['metric_column']} trend area",
            "x": "date",
            "y": "value",
        })

    if category and category.get("results"):
        specs.append({
            "chart_type": "bar",
            "title": f"{category['metric_column']} by {category['category_column']}",
            "x": "category",
            "y": "value",
        })

        specs.append({
            "chart_type": "horizontal_bar",
            "title": f"Top {category['category_column']} by {category['metric_column']}",
            "x": "value",
            "y": "category",
        })

        if len(category.get("results", [])) <= 10:
            specs.append({
                "chart_type": "pie",
                "title": f"{category['category_column']} share of {category['metric_column']}",
                "x": "category",
                "y": "value",
            })

            specs.append({
                "chart_type": "donut",
                "title": f"{category['category_column']} distribution",
                "x": "category",
                "y": "value",
            })

    if descriptive:
        first_metric = next(iter(descriptive.keys()))
        specs.append({
            "chart_type": "summary_bar",
            "title": f"{first_metric} summary statistics",
            "x": "stat",
            "y": "value",
        })

    if anomaly and anomaly.get("records"):
        specs.append({
            "chart_type": "anomaly_bar",
            "title": f"Top anomalies for {anomaly.get('metric', 'metric')}",
            "x": "time",
            "y": "value",
        })

    return specs