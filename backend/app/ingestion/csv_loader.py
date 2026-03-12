import pandas as pd


def load_csv(file_path: str) -> dict:
    df = pd.read_csv(file_path)
    return {
        "tables": [
            {
                "name": "csv_table",
                "dataframe": df
            }
        ],
        "source_type": "csv"
    }