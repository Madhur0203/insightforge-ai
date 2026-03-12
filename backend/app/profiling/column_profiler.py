import re
import pandas as pd


DATE_PATTERN = re.compile(
    r"""^(
        \d{4}[-/]\d{1,2}[-/]\d{1,2} |
        \d{1,2}[-/]\d{1,2}[-/]\d{2,4} |
        \d{4}\d{2}\d{2} |
        [A-Za-z]{3,9}\s+\d{1,2},\s*\d{4} |
        \d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4}
    )$""",
    re.VERBOSE,
)


def _clean_object_series(series: pd.Series) -> pd.Series:
    cleaned = series.copy()

    if cleaned.dtype == "object":
        cleaned = (
            cleaned.astype(str)
            .str.replace(",", "", regex=False)
            .str.replace("$", "", regex=False)
            .str.strip()
        )
        cleaned = cleaned.replace({"": None, "nan": None, "None": None})

    return cleaned


def _numeric_confidence(series: pd.Series) -> float:
    cleaned = _clean_object_series(series)
    numeric_candidate = pd.to_numeric(cleaned, errors="coerce")
    return float(numeric_candidate.notna().mean())


def _datetime_confidence(series: pd.Series) -> float:
    """
    Conservative date detection:
    - Avoid treating generic numeric columns as dates
    - Only parse values that actually look like dates
    """
    cleaned = _clean_object_series(series)
    non_null = pd.Series(cleaned).dropna()

    if non_null.empty:
        return 0.0

    as_text = non_null.astype(str).str.strip()

    # If the column is mostly pure numeric and doesn't look like YYYYMMDD, don't treat as date
    numeric_like_ratio = as_text.str.fullmatch(r"\d+").fillna(False).mean()

    # Allow YYYYMMDD only when values are 8 digits and plausible years
    yyyymmdd_mask = as_text.str.fullmatch(r"\d{8}").fillna(False)
    plausible_yyyymmdd_ratio = 0.0
    if yyyymmdd_mask.any():
        yyyymmdd_vals = as_text[yyyymmdd_mask]
        years = pd.to_numeric(yyyymmdd_vals.str.slice(0, 4), errors="coerce")
        plausible_yyyymmdd_ratio = float(years.between(1900, 2100).mean())

    # General textual/slashed date patterns
    pattern_ratio = float(as_text.str.match(DATE_PATTERN).mean())

    # Decide what subset should even be tested as dates
    should_try_date_parse = (
        pattern_ratio > 0.25
        or plausible_yyyymmdd_ratio > 0.5
        or (numeric_like_ratio < 0.6 and pattern_ratio > 0.05)
    )

    if not should_try_date_parse:
        return 0.0

    # Parse YYYYMMDD specifically first
    parsed_yyyymmdd = pd.to_datetime(as_text, format="%Y%m%d", errors="coerce")
    parsed_general = pd.to_datetime(as_text, errors="coerce")

    combined = parsed_yyyymmdd.fillna(parsed_general)
    return float(combined.notna().mean())


def profile_column(series: pd.Series) -> dict:
    cleaned = _clean_object_series(series)
    non_null = pd.Series(cleaned).dropna()
    sample_values = non_null.astype(str).head(5).tolist()

    numeric_confidence = _numeric_confidence(series)
    datetime_confidence = _datetime_confidence(series)

    return {
        "column_name": str(series.name),
        "dtype": str(series.dtype),
        "row_count": int(len(series)),
        "null_count": int(pd.Series(series).isna().sum()),
        "null_pct": float(pd.Series(series).isna().mean()),
        "unique_count": int(pd.Series(series).nunique(dropna=True)),
        "sample_values": sample_values,
        "numeric_confidence": numeric_confidence,
        "datetime_confidence": datetime_confidence,
    }