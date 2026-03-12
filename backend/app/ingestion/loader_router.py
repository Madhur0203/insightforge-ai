from app.ingestion.format_detector import detect_file_type
from app.ingestion.csv_loader import load_csv
from app.ingestion.excel_loader import load_excel
from app.ingestion.sql_loader import load_sql


def load_dataset(file_path: str) -> dict:
    file_type = detect_file_type(file_path)

    if file_type == "csv":
        return load_csv(file_path)
    if file_type == "excel":
        return load_excel(file_path)
    if file_type == "sql":
        return load_sql(file_path)

    raise ValueError(f"Unsupported dataset type: {file_type}")