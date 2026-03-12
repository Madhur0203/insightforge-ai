from app.ingestion.parser import parse_dataset
from app.profiling.profiler import profile_dataframe
from app.semantics.semantic import infer_semantics
from app.classification.dataset_classifier import classify_dataset
from app.planning.analysis_planner import build_analysis_plan
from app.filters.engine import apply_filters


def prepare_dataset_analysis(file_path: str, filters: dict | None = None) -> list[dict]:
    loaded = parse_dataset(file_path)
    outputs = []

    for table in loaded["tables"]:
        original_df = table["dataframe"]
        table_name = table["name"]

        df = apply_filters(original_df, filters or {})

        profile = profile_dataframe(df, table_name)
        semantics = infer_semantics(profile)
        classification = classify_dataset(profile, semantics)
        plan = build_analysis_plan(profile, semantics, classification)

        outputs.append({
            "table_name": table_name,
            "dataframe": df,
            "profile": profile,
            "semantics": semantics,
            "classification": classification,
            "plan": plan,
        })

    return outputs