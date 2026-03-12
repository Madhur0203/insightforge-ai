from pathlib import Path


def detect_file_type(file_path: str) -> str:
    suffix = Path(file_path).suffix.lower()

    if suffix == ".csv":
        return "csv"
    if suffix in {".xlsx", ".xls"}:
        return "excel"
    if suffix == ".sql":
        return "sql"

    raise ValueError(f"Unsupported file type: {suffix}")