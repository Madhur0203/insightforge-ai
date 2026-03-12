import pandas as pd


def _score_header_row(row_values: list[str]) -> float:
    """
    Score how likely a row is to be the real header.
    Higher score = more likely.
    """
    if not row_values:
        return -1.0

    cleaned = [str(v).strip() for v in row_values if str(v).strip() not in ["", "nan", "None"]]

    if not cleaned:
        return -1.0

    total = len(row_values)
    non_empty = len(cleaned)
    non_empty_ratio = non_empty / max(total, 1)

    unique_ratio = len(set(cleaned)) / max(non_empty, 1)

    unnamed_count = sum(1 for v in cleaned if str(v).lower().startswith("unnamed:"))
    unnamed_penalty = unnamed_count / max(non_empty, 1)

    numeric_like_count = 0
    for v in cleaned:
        try:
            float(str(v).replace(",", ""))
            numeric_like_count += 1
        except Exception:
            pass

    numeric_ratio = numeric_like_count / max(non_empty, 1)

    long_text_penalty = 0.0
    avg_len = sum(len(v) for v in cleaned) / max(non_empty, 1)
    if avg_len > 35:
        long_text_penalty = 0.35
    elif avg_len > 20:
        long_text_penalty = 0.15

    # Prefer rows that:
    # - have many non-empty cells
    # - have unique names
    # - are not mostly numeric
    # - are not mostly Unnamed
    score = (
        (non_empty_ratio * 0.45)
        + (unique_ratio * 0.35)
        + ((1 - numeric_ratio) * 0.15)
        - (unnamed_penalty * 0.35)
        - long_text_penalty
    )

    return score


def _detect_best_header_row(preview_df: pd.DataFrame, max_scan_rows: int = 20) -> int:
    """
    Detect the most likely header row in report-style Excel files.
    """
    best_row_idx = 0
    best_score = -999.0

    scan_limit = min(max_scan_rows, len(preview_df))

    for i in range(scan_limit):
        row = preview_df.iloc[i].tolist()
        score = _score_header_row(row)

        row_text = " ".join(
            str(v).strip().lower()
            for v in row
            if str(v).strip() not in ["", "nan", "None"]
        )

        # Penalize obvious title/report rows
        if len(row_text) > 60 and ("statement" in row_text or "report" in row_text or "statistics" in row_text):
            score -= 0.6

        # Prefer rows that contain multiple short header-like cells
        short_cells = [
            str(v).strip() for v in row
            if str(v).strip() not in ["", "nan", "None"] and len(str(v).strip()) <= 25
        ]
        if len(short_cells) >= 3:
            score += 0.15

        if score > best_score:
            best_score = score
            best_row_idx = i

    return best_row_idx


def _clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    # Drop fully empty rows/cols
    df = df.dropna(how="all")
    df = df.dropna(axis=1, how="all")

    # Clean column names
    cleaned_columns = []
    for idx, col in enumerate(df.columns):
        col_str = str(col).strip()

        # Normalize placeholder/blank headers
        if col_str in ["", "nan", "None"]:
            col_str = f"column_{idx+1}"

        cleaned_columns.append(col_str)

    df.columns = cleaned_columns

    # Drop duplicate columns if exact duplicates exist after cleaning
    seen = set()
    keep_cols = []
    for col in df.columns:
        if col not in seen:
            keep_cols.append(col)
            seen.add(col)

    df = df.loc[:, keep_cols]

    # Remove top repeated pseudo-header rows if they exactly mirror column names
    if len(df) > 0:
        first_row = df.iloc[0].astype(str).str.strip().tolist()
        col_names = [str(c).strip() for c in df.columns.tolist()]
        overlap = sum(1 for a, b in zip(first_row, col_names) if a == b)
        if overlap >= max(2, len(col_names) // 2):
            df = df.iloc[1:].reset_index(drop=True)

    return df


def load_excel(file_path: str) -> dict:
    excel_file = pd.ExcelFile(file_path)
    tables = []

    for sheet_name in excel_file.sheet_names:
        # Read raw sheet with no header first
        preview_df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

        if preview_df.empty or preview_df.shape[1] == 0:
            continue

        preview_df = preview_df.dropna(how="all")
        preview_df = preview_df.dropna(axis=1, how="all")

        if preview_df.empty or preview_df.shape[1] == 0:
            continue

        header_row_idx = _detect_best_header_row(preview_df, max_scan_rows=20)

        # Re-read using detected header row
        df = pd.read_excel(file_path, sheet_name=sheet_name, header=header_row_idx)

        if df.empty or df.shape[1] == 0:
            continue

        df = _clean_dataframe(df)

        if df.empty or df.shape[1] == 0:
            continue

        tables.append({
            "name": sheet_name,
            "dataframe": df
        })

    return {
        "tables": tables,
        "source_type": "excel"
    }