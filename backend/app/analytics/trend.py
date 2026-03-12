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


def _clean_datetime(series: pd.Series) -> pd.Series:
    as_text = series.astype(str).str.strip()

    parsed = pd.to_datetime(as_text, format="%Y%m%d", errors="coerce")
    fallback = pd.to_datetime(as_text, errors="coerce")

    return parsed.fillna(fallback)


def run_trend_analysis(df: pd.DataFrame, date_column: str, metric_column: str) -> dict:
    if date_column not in df.columns or metric_column not in df.columns:
        return {
            "date_column": date_column,
            "metric_column": metric_column,
            "points": []
        }

    working = df.copy()
    working[date_column] = _clean_datetime(working[date_column])
    working[metric_column] = _clean_numeric(working[metric_column])

    working = working.dropna(subset=[date_column, metric_column]).sort_values(date_column)

    if working.empty:
        return {
            "date_column": date_column,
            "metric_column": metric_column,
            "points": []
        }

    grouped = working.groupby(date_column, as_index=False)[metric_column].sum()

    return {
        "date_column": date_column,
        "metric_column": metric_column,
        "points": [
            {
                "date": str(row[date_column].date()),
                "value": float(row[metric_column])
            }
            for _, row in grouped.iterrows()
        ]
    }