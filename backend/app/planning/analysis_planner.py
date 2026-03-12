def build_analysis_plan(profile: dict, semantics: dict, dataset_classification: dict) -> dict:
    semantic_columns = semantics["semantic_columns"]

    metric_columns = [c["column_name"] for c in semantic_columns if c["role"] == "metric"]
    date_columns = [c["column_name"] for c in semantic_columns if c["role"] == "date"]
    category_columns = [c["column_name"] for c in semantic_columns if c["role"] == "category"]

    recommended = ["data_quality", "descriptive_statistics"]

    if metric_columns:
        recommended.append("distribution_analysis")
        recommended.append("anomaly_detection")

    if metric_columns and date_columns:
        recommended.append("trend_analysis")

    if metric_columns and category_columns:
        recommended.append("category_comparison")

    return {
        "table_name": profile["table_name"],
        "dataset_type": dataset_classification["dataset_type"],
        "metric_columns": metric_columns,
        "date_columns": date_columns,
        "category_columns": category_columns,
        "recommended_analyses": recommended
    }