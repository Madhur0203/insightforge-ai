from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.upload import router as upload_router
from app.api.routes.analyze import router as analyze_router
from app.api.routes.insights import router as insights_router

app = FastAPI(
    title="Autonomous Analytics Engine",
    version="1.0.0",
    description="Universal analytics backend for structured datasets."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(insights_router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "Autonomous Analytics Engine is running",
        "version": "1.0.0"
    }