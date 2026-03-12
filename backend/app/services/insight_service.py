from app.services.dataset_service import prepare_dataset_analysis
from app.analytics.engine import run_analytics
from app.insights.generator import generate_insight_summary


def generate_dataset_insights(file_path: str) -> dict:
    prepared_tables = prepare_dataset_analysis(file_path)
    outputs = []

    for item in prepared_tables:
        df = item["dataframe"]
        analytics_result = run_analytics(df, item["plan"])
        insight = generate_insight_summary(
            profile=item["profile"],
            semantics=item["semantics"],
            classification=item["classification"],
            plan=item["plan"],
            analytics_result=analytics_result
        )

        outputs.append({
            "table_name": item["table_name"],
            "insight": insight
        })

    return {"tables": outputs}