def generate_decisions(plan: dict, analytics: dict) -> dict:
    recommendations = []

    anomaly = analytics.get("anomaly")
    trend = analytics.get("trend")
    category = analytics.get("category")
    descriptive = analytics.get("descriptive", {})

    if anomaly and anomaly.get("anomaly_count", 0) > 0:
        recommendations.append({
            "type": "anomaly_action",
            "priority": "high",
            "message": f"Review {anomaly['anomaly_count']} detected anomaly record(s) for metric '{anomaly['metric']}'."
        })

    if trend and trend.get("points"):
        values = [p["value"] for p in trend["points"]]
        if len(values) >= 2 and values[-1] > values[0]:
            recommendations.append({
                "type": "trend_observation",
                "priority": "medium",
                "message": f"The metric '{trend['metric_column']}' shows an upward overall trend."
            })
        elif len(values) >= 2 and values[-1] < values[0]:
            recommendations.append({
                "type": "trend_observation",
                "priority": "medium",
                "message": f"The metric '{trend['metric_column']}' shows a downward overall trend."
            })

    if category and category.get("results"):
        top = category["results"][0]
        recommendations.append({
            "type": "category_focus",
            "priority": "medium",
            "message": f"Top contributing category is '{top['category']}' with value {top['value']}."
        })

    if not recommendations:
        recommendations.append({
            "type": "general",
            "priority": "low",
            "message": "No urgent decision signals were detected. Continue monitoring core metrics and distributions."
        })

    return {
        "recommended_actions": recommendations,
        "count": len(recommendations)
    }