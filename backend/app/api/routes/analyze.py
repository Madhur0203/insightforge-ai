from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.analysis_service import run_full_analysis

router = APIRouter(tags=["Analyze"])


class AnalyzeRequest(BaseModel):
    file_path: str
    filters: dict = Field(default_factory=dict)


@router.post("/analyze")
def analyze_dataset(request: AnalyzeRequest):
    try:
        return run_full_analysis(
            file_path=request.file_path,
            filters=request.filters or {}
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))