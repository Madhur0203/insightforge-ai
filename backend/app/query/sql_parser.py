import re


def parse_sql_file(file_path: str) -> dict:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    create_tables = re.findall(r"CREATE\s+TABLE\s+([a-zA-Z0-9_]+)", content, flags=re.IGNORECASE)
    insert_tables = re.findall(r"INSERT\s+INTO\s+([a-zA-Z0-9_]+)", content, flags=re.IGNORECASE)
    select_statements = re.findall(r"SELECT\s+.*?;", content, flags=re.IGNORECASE | re.DOTALL)

    sql_type = "unknown"
    if create_tables and insert_tables:
        sql_type = "schema_and_data"
    elif create_tables:
        sql_type = "schema_only"
    elif insert_tables:
        sql_type = "data_only"
    elif select_statements:
        sql_type = "query_only"

    return {
        "tables": [],
        "metadata": {
            "sql_type": sql_type,
            "create_tables": list(set(create_tables)),
            "insert_tables": list(set(insert_tables)),
            "select_count": len(select_statements),
        }
    }