from app.query.sql_parser import parse_sql_file


def analyze_sql_file(file_path: str) -> dict:
    parsed = parse_sql_file(file_path)
    metadata = parsed.get("metadata", {})

    sql_type = metadata.get("sql_type", "unknown")
    create_tables = metadata.get("create_tables", [])
    insert_tables = metadata.get("insert_tables", [])
    select_count = metadata.get("select_count", 0)

    summary_parts = [f"Detected SQL type: {sql_type}."]

    if create_tables:
        summary_parts.append(f"Schema references tables: {', '.join(create_tables)}.")

    if insert_tables:
        summary_parts.append(f"Data insertion targets tables: {', '.join(insert_tables)}.")

    if select_count:
        summary_parts.append(f"Found {select_count} SELECT statement(s).")

    return {
        "sql_metadata": metadata,
        "summary": " ".join(summary_parts),
        "tables_detected": sorted(list(set(create_tables + insert_tables))),
    }