"""
Health check route for system diagnostics and deployment verification.
"""
from typing import Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    app_env: str
    database: Dict[str, Any]
    razorpay: Dict[str, Any]
    supabase: Dict[str, Any]


@router.get("/health", response_model=HealthResponse)
def health_check():
    db_status = "connected"
    dialect = "unknown"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        dialect = "postgresql" if str(engine.url).startswith("postgresql") else "sqlite"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "app_env": settings.APP_ENV,
        "database": {
            "status": db_status,
            "dialect": dialect,
        },
        "razorpay": {
            "configured": bool(
                settings.RAZORPAY_KEY_ID
                and not settings.RAZORPAY_KEY_ID.startswith("rzp_test_placeholder")
                and "paste_your" not in settings.RAZORPAY_KEY_ID
            ),
            "key_id_prefix": (
                settings.RAZORPAY_KEY_ID[:8] + "..."
                if settings.RAZORPAY_KEY_ID and len(settings.RAZORPAY_KEY_ID) > 8
                else None
            ),
        },
        "supabase": {
            "configured": bool(
                settings.SUPABASE_URL
                and "placeholder" not in settings.SUPABASE_URL
                and "paste-your" not in settings.SUPABASE_URL
            ),
        },
    }
