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


def run_category_analysis(df: pd.DataFrame, category_column: str, metric_column: str) -> dict:
    if category_column not in df.columns or metric_column not in df.columns:
        return {
            "category_column": category_column,
            "metric_column": metric_column,
            "results": []
        }

    working = df.copy()
    working[metric_column] = _clean_numeric(working[metric_column])
    working[category_column] = working[category_column].astype(str).str.strip()

    working = working.dropna(subset=[category_column, metric_column])

    if working.empty:
        return {
            "category_column": category_column,
            "metric_column": metric_column,
            "results": []
        }

    grouped = (
        working.groupby(category_column, as_index=False)[metric_column]
        .sum()
        .sort_values(metric_column, ascending=False)
    )

    return {
        "category_column": category_column,
        "metric_column": metric_column,
        "results": [
            {
                "category": str(row[category_column]),
                "value": float(row[metric_column])
            }
            for _, row in grouped.iterrows()
        ]
    }