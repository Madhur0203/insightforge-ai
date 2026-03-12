import pandas as pd


def _clean_text(series: pd.Series) -> pd.Series:
    return (
        series.astype(str)
        .str.strip()
        .replace({"nan": None, "None": None, "": None})
    )


def _clean_numeric(series: pd.Series) -> pd.Series:
    cleaned = series.copy()

    if cleaned.dtype == "object":
        cleaned = (
            cleaned.astype(str)
            .str.replace(",", "", regex=False)
            .str.replace("$", "", regex=False)
            .str.strip()
        )
        cleaned = cleaned.replace({"": None, "nan": None, "None": None})

    return pd.to_numeric(cleaned, errors="coerce")


def apply_filters(df: pd.DataFrame, filters: dict | None = None) -> pd.DataFrame:
    if filters is None or not filters:
        return df.copy()

    filtered = df.copy()

    for column, condition in filters.items():
        if column not in filtered.columns:
            continue

        if condition in [None, "", "__all__"]:
            continue

        if isinstance(condition, dict):
            numeric_series = _clean_numeric(filtered[column])

            if "min" in condition and condition["min"] not in [None, ""]:
                filtered = filtered[numeric_series >= float(condition["min"])]

            if "max" in condition and condition["max"] not in [None, ""]:
                filtered = filtered[numeric_series <= float(condition["max"])]

        elif isinstance(condition, list):
            allowed = {str(v).strip() for v in condition if v not in [None, "", "__all__"]}
            if allowed:
                text_series = _clean_text(filtered[column])
                filtered = filtered[text_series.isin(allowed)]

        else:
            value = str(condition).strip()
            if value == "__all__":
                continue
            text_series = _clean_text(filtered[column])
            filtered = filtered[text_series == value]

    return filtered.reset_index(drop=True)


def extract_filter_values(df: pd.DataFrame, category_columns: list[str], limit_per_column: int = 100) -> list[dict]:
    filters = []

    for col in category_columns:
        if col not in df.columns:
            continue

        values = (
            df[col]
            .dropna()
            .astype(str)
            .str.strip()
        )
        values = values[values != ""]
        unique_values = sorted(values.unique().tolist())[:limit_per_column]

        filters.append({
            "name": col,
            "values": unique_values
        })

    return filters