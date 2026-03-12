def classify_column_role(column_profile: dict) -> dict:
    name = column_profile["column_name"].strip().lower()
    numeric_conf = column_profile.get("numeric_confidence", 0.0)
    datetime_conf = column_profile.get("datetime_confidence", 0.0)
    unique_count = column_profile.get("unique_count", 0)
    row_count = max(column_profile.get("row_count", 1), 1)

    identifier_keywords = [
        "id", "srno", "policy", "invoice", "order", "number", "no",
        "code", "cd", "agent cd", "branch code", "brn"
    ]

    date_keywords = [
        "date", "doc", "time", "month", "year", "timestamp", "fup",
        "transaction date", "posting date"
    ]

    metric_keywords = [
        "sales", "revenue", "amount", "premium", "prem", "price", "cost",
        "profit", "qty", "quantity", "value", "rs", "policies", "policy count",
        "count", "total", "fpi", "score", "income", "expense"
    ]

    category_keywords = [
        "plan", "segment", "type", "status", "stat", "agent", "region", "pin",
        "city", "state", "zone", "division", "branch", "channel", "name"
    ]

    entity_keywords = [
        "customer", "client", "vendor", "employee", "person", "holder"
    ]

    geography_keywords = [
        "zone", "division", "region", "city", "state", "district", "country", "pin"
    ]

    def has_any(words: list[str]) -> bool:
        return any(word in name for word in words)

    unique_ratio = unique_count / row_count

    role = "unknown"
    confidence = 0.5

    # Strong date only if actual date evidence exists
    if datetime_conf >= 0.75 or (datetime_conf >= 0.4 and has_any(date_keywords)):
        role = "date"
        confidence = max(datetime_conf, 0.82 if has_any(date_keywords) else datetime_conf)

    # Identifier-like columns
    elif has_any(identifier_keywords) and unique_ratio >= 0.5:
        role = "identifier"
        confidence = 0.88

    # Geography / entity-like named dimensions
    elif has_any(geography_keywords):
        role = "category"
        confidence = 0.86

    elif has_any(entity_keywords):
        role = "entity"
        confidence = 0.84

    # Strong metric if numeric and name suggests business measure
    elif numeric_conf >= 0.6 and has_any(metric_keywords):
        role = "metric"
        confidence = 0.94

    # Numeric columns with moderate uniqueness are usually metrics
    elif numeric_conf >= 0.9 and unique_ratio < 0.95:
        role = "metric"
        confidence = 0.78

    # Category-like names
    elif has_any(category_keywords):
        role = "category"
        confidence = 0.8

    # Low-cardinality text/numeric columns
    elif unique_ratio < 0.25:
        role = "category"
        confidence = 0.68

    # Very high-cardinality text columns
    elif unique_ratio >= 0.85 and numeric_conf < 0.2:
        role = "entity"
        confidence = 0.72

    return {
        "column_name": column_profile["column_name"],
        "role": role,
        "confidence": round(confidence, 3),
    }