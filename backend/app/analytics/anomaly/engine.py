import pandas as pd
import numpy as np


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


def detect_anomalies(df: pd.DataFrame, metric_column: str, date_column: str | None = None) -> dict:
    if metric_column not in df.columns:
        return {"metric": metric_column, "anomaly_count": 0, "records": []}

    working = df.copy()
    working[metric_column] = _clean_numeric(working[metric_column])

    if date_column and date_column in working.columns:
        working[date_column] = _clean_datetime(working[date_column])

    working = working.dropna(subset=[metric_column])

    if working.empty:
        return {"metric": metric_column, "anomaly_count": 0, "records": []}

    q1 = working[metric_column].quantile(0.25)
    q3 = working[metric_column].quantile(0.75)
    iqr = q3 - q1

    if pd.isna(iqr) or iqr == 0:
        return {"metric": metric_column, "anomaly_count": 0, "records": []}

    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    anomalies = working[
        (working[metric_column] < lower_bound) |
        (working[metric_column] > upper_bound)
    ].copy()

    def severity(value: float) -> str:
        if value > q3 + 3 * iqr or value < q1 - 3 * iqr:
            return "high"
        if value > upper_bound or value < lower_bound:
            return "medium"
        return "low"

    records = []
    for _, row in anomalies.iterrows():
        item = {
            "metric": metric_column,
            "value": float(row[metric_column]),
            "severity": severity(float(row[metric_column]))
        }
        if date_column and date_column in anomalies.columns and pd.notna(row[date_column]):
            item["time"] = str(row[date_column].date())
        records.append(item)

    records = sorted(records, key=lambda x: x["value"], reverse=True)

    return {
        "metric": metric_column,
        "time_column": date_column,
        "anomaly_count": len(records),
        "method": "IQR",
        "bounds": {
            "lower": float(lower_bound),
            "upper": float(upper_bound)
        },
        "records": records
    }