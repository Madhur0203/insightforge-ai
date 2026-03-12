def generate_insight_summary(profile: dict, semantics: dict, classification: dict, plan: dict, analytics_result: dict) -> dict:
    metric_columns = plan.get("metric_columns", [])
    date_columns = plan.get("date_columns", [])
    category_columns = plan.get("category_columns", [])

    summary_lines = []
    summary_lines.append(
        f"This dataset contains {profile['shape']['rows']} rows and {profile['shape']['columns']} columns."
    )
    summary_lines.append(
        f"It appears to be a {classification['dataset_type']} dataset."
    )

    if metric_columns:
        summary_lines.append(f"Primary metric candidate: {metric_columns[0]}.")

    if date_columns:
        summary_lines.append(f"Primary date candidate: {date_columns[0]}.")

    if category_columns:
        summary_lines.append(f"Primary category candidate: {category_columns[0]}.")

    anomaly = analytics_result.get("anomaly")
    if anomaly:
        summary_lines.append(
            f"Detected {anomaly['anomaly_count']} anomaly records for {anomaly['metric']}."
        )

    return {
        "summary": " ".join(summary_lines),
        "recommended_analyses": plan.get("recommended_analyses", [])
    }