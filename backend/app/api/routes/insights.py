from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.insight_service import generate_dataset_insights

router = APIRouter(tags=["Insights"])


class InsightRequest(BaseModel):
    file_path: str
    filters: dict = Field(default_factory=dict)


@router.post("/insights")
def get_insights(request: InsightRequest):
    try:
        return generate_dataset_insights(
            file_path=request.file_path,
            filters=request.filters or {}
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))