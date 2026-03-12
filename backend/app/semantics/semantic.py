from app.semantics.column_role_classifier import classify_column_role


def infer_semantics(profile: dict) -> dict:
    semantic_columns = [classify_column_role(col) for col in profile["columns"]]

    role_summary = {}
    for item in semantic_columns:
        role_summary[item["role"]] = role_summary.get(item["role"], 0) + 1

    return {
        "table_name": profile["table_name"],
        "semantic_columns": semantic_columns,
        "role_summary": role_summary
    }