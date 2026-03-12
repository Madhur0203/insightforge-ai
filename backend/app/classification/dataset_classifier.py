def classify_dataset(profile: dict, semantics: dict) -> dict:
    roles = [item["role"] for item in semantics["semantic_columns"]]

    has_date = "date" in roles
    metric_count = roles.count("metric")
    category_count = roles.count("category")
    entity_count = roles.count("entity")

    dataset_type = "generic_tabular"

    if has_date and metric_count >= 1:
        dataset_type = "time_series_tabular"
    elif metric_count >= 1 and category_count >= 1:
        dataset_type = "transactional_tabular"
    elif entity_count >= 1 and category_count >= 1:
        dataset_type = "master_record_table"

    return {
        "table_name": profile["table_name"],
        "dataset_type": dataset_type,
        "confidence": 0.8
    }