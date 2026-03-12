from app.ingestion.loader_router import load_dataset


def parse_dataset(file_path: str) -> dict:
    """
    Unified ingestion entrypoint.
    Returns normalized dataset structure:
    {
        "source_type": "...",
        "tables": [
            {
                "name": "...",
                "dataframe": <pd.DataFrame>
            }
        ]
    }
    """
    return load_dataset(file_path)