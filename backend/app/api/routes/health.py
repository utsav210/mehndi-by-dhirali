"""
Health check route.
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str


@router.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "app": "Mehndi By Dhirali API",
        "version": "1.0.0",
    }
