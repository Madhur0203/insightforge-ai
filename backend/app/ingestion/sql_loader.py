from app.query.sql_parser import parse_sql_file


def load_sql(file_path: str) -> dict:
    parsed = parse_sql_file(file_path)
    return {
        "tables": parsed.get("tables", []),
        "source_type": "sql",
        "sql_metadata": parsed.get("metadata", {})
    }