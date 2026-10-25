"""
Main FastAPI Application Entry Point for Mehndi By Dhirali.
Configured for local Uvicorn development and Vercel serverless deployment.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
from app.core.config import settings
from app.api.routes import api_router
from app.db.base import Base
from app.db.session import engine
from app.models.category import Category
from app.db.session import SessionLocal

logger = structlog.get_logger(__name__)


def seed_initial_categories():
    """Seeds default boutique categories if database is empty."""
    db = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            default_categories = [
                {"name": "Mehndi Cones", "slug": "mehndi-cones", "description": "Freshly mixed organic henna cones", "sort_order": 1},
                {"name": "Mehndi Powder", "slug": "mehndi-powder", "description": "Triple-sifted 100% natural Sojat henna powder", "sort_order": 2},
                {"name": "Aftercare Oils", "slug": "aftercare-oils", "description": "Pure eucalyptus and essential oil blends", "sort_order": 3},
                {"name": "Practice Tools", "slug": "practice-tools", "description": "Acrylic practice hands and acrylic boards", "sort_order": 4},
                {"name": "Mehndi Kits", "slug": "mehndi-kits", "description": "Complete bridal and professional student kits", "sort_order": 5},
                {"name": "Accessories", "slug": "accessories", "description": "Sealant spray, cellophane sheets, pin tips", "sort_order": 6},
            ]
            for cat_data in default_categories:
                c = Category(**cat_data, is_active=True)
                db.add(c)
            db.commit()
            logger.info("Seeded initial store categories.")
    except Exception as e:
        logger.warning("Category seed check skipped or failed", error=str(e))
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        seed_initial_categories()
        logger.info("Database schema verified.")
    except Exception as e:
        logger.error("Database connection initialization failed", error=str(e))
    yield
    # Shutdown


app = FastAPI(
    title=settings.APP_NAME,
    description="Artisanal Organic Henna E-commerce API for Mehndi By Dhirali",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware (Explicit origins only, no wildcard with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Applies secure HTTP response headers."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact support."},
    )


# Include API router with /api prefix
app.include_router(api_router, prefix="/api")


@app.get("/")
def root_redirect():
    return {
        "app": "Mehndi By Dhirali API",
        "status": "online",
        "docs": "/api/docs",
    }
