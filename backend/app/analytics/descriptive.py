import pandas as pd


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


def run_descriptive_analysis(df: pd.DataFrame, metric_columns: list[str]) -> dict:
    results = {}

    for col in metric_columns:
        if col not in df.columns:
            continue

        series = _clean_numeric(df[col]).dropna()
        if series.empty:
            continue

        results[col] = {
            "count": int(series.count()),
            "mean": float(series.mean()),
            "median": float(series.median()),
            "min": float(series.min()),
            "max": float(series.max()),
            "std": float(series.std()) if series.count() > 1 else 0.0,
            "sum": float(series.sum()),
        }

    return results