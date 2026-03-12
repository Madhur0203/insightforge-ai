from app.profiling.column_profiler import profile_column


def profile_dataframe(df, table_name: str) -> dict:
    columns = [profile_column(df[col]) for col in df.columns]

    return {
        "table_name": table_name,
        "shape": {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
        },
        "columns": columns
    }