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
from app.models.product import Product, ProductImage
from app.db.session import SessionLocal

logger = structlog.get_logger(__name__)


def seed_initial_categories():
    """Seeds default boutique categories if database is empty and cleans up removed categories."""
    db = SessionLocal()
    try:
        # Clean up deprecated categories if present
        removed_slugs = ["aftercare-oils", "practice-tools"]
        for slug in removed_slugs:
            cat = db.query(Category).filter(Category.slug == slug).first()
            if cat and len(cat.products) == 0:
                db.delete(cat)
            elif cat:
                cat.is_active = False
        db.commit()

        if db.query(Category).count() == 0:
            default_categories = [
                {"name": "Mehndi Cones", "slug": "mehndi-cones", "description": "Freshly mixed organic henna cones", "sort_order": 1},
                {"name": "Mehndi Powder", "slug": "mehndi-powder", "description": "Triple-sifted 100% natural Sojat henna powder", "sort_order": 2},
                {"name": "Mehndi Kits", "slug": "mehndi-kits", "description": "Complete bridal and professional student kits", "sort_order": 3},
                {"name": "Accessories", "slug": "accessories", "description": "Sealant spray, cellophane sheets, pin tips", "sort_order": 4},
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


def seed_initial_products():
    """Seeds initial Mehndi Cones packs if not already present."""
    db = SessionLocal()
    try:
        category = db.query(Category).filter(Category.slug == "mehndi-cones").first()
        if not category:
            return

        products_data = [
            {
                "name": "Pack of 5 Mehndi Cones",
                "slug": "pack-of-5-mehndi-cones",
                "price_minor": 9900,  # ₹99.00
                "compare_at_price_minor": 14900,  # ₹149.00
                "sku": "MBD-CONE-05",
                "stock_quantity": 100,
                "weight_grams": 150,
                "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 5). Formulated with pure eucalyptus essential oil for a deep, rich mahogany stain. Ultra-smooth 0.38mm tip for intricate bridal and festive designs.",
                "specifications": "Quantity: 5 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
            {
                "name": "Pack of 8 Mehndi Cones",
                "slug": "pack-of-8-mehndi-cones",
                "price_minor": 15900,  # ₹159.00
                "compare_at_price_minor": 22900,  # ₹229.00
                "sku": "MBD-CONE-08",
                "stock_quantity": 100,
                "weight_grams": 240,
                "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 8). Hand-poured in small artisanal batches with natural eucalyptus oil for guaranteed dark stain.",
                "specifications": "Quantity: 8 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
            {
                "name": "Pack of 12 Mehndi Cones",
                "slug": "pack-of-12-mehndi-cones",
                "price_minor": 23900,  # ₹239.00
                "compare_at_price_minor": 34900,  # ₹349.00
                "sku": "MBD-CONE-12",
                "stock_quantity": 100,
                "weight_grams": 360,
                "description": "Complete 1-dozen pack of freshly rolled organic henna cones. Ideal for family celebrations, Karwa Chauth, Eid, and wedding festivities. Zero chemicals, 100% natural.",
                "specifications": "Quantity: 12 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
            {
                "name": "Pack of 16 Mehndi Cones",
                "slug": "pack-of-16-mehndi-cones",
                "price_minor": 31900,  # ₹319.00
                "compare_at_price_minor": 45900,  # ₹459.00
                "sku": "MBD-CONE-16",
                "stock_quantity": 100,
                "weight_grams": 480,
                "description": "Value bundle of 16 organic bridal henna cones. Crafted with triple-sifted micro-fine henna powder and pure essential oils for smooth flow and crisp line work.",
                "specifications": "Quantity: 16 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
            {
                "name": "Pack of 20 Mehndi Cones",
                "slug": "pack-of-20-mehndi-cones",
                "price_minor": 39900,  # ₹399.00
                "compare_at_price_minor": 59900,  # ₹599.00
                "sku": "MBD-CONE-20",
                "stock_quantity": 100,
                "weight_grams": 600,
                "description": "Studio pack of 20 fresh organic henna cones. Perfect for henna artists and large family occasions. Long-lasting, rich burgundy dye release.",
                "specifications": "Quantity: 20 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
            {
                "name": "Pack of 50 Mehndi Cones",
                "slug": "pack-of-50-mehndi-cones",
                "price_minor": 99900,  # ₹999.00
                "compare_at_price_minor": 149900,  # ₹1,499.00
                "sku": "MBD-CONE-50",
                "stock_quantity": 100,
                "weight_grams": 1500,
                "description": "Bulk artist master pack of 50 freshly rolled organic henna cones. Shipped in insulated packaging to maintain optimal freshness. The ultimate value for professional bridal bookings.",
                "specifications": "Quantity: 50 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen",
            },
        ]

        for p_data in products_data:
            existing = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if not existing:
                prod = Product(
                    category_id=category.id,
                    name=p_data["name"],
                    slug=p_data["slug"],
                    price_minor=p_data["price_minor"],
                    compare_at_price_minor=p_data["compare_at_price_minor"],
                    sku=p_data["sku"],
                    stock_quantity=p_data["stock_quantity"],
                    weight_grams=p_data["weight_grams"],
                    description=p_data["description"],
                    specifications=p_data["specifications"],
                    is_active=True,
                    is_featured=True,
                )
                db.add(prod)
                db.flush()
                img = ProductImage(
                    product_id=prod.id,
                    url="/images/products/mehndi-cones.png",
                    alt_text=prod.name,
                    sort_order=1,
                    is_primary=True,
                )
                db.add(img)
            else:
                existing.price_minor = p_data["price_minor"]
                existing.compare_at_price_minor = p_data["compare_at_price_minor"]
        db.commit()
        logger.info("Seeded initial Mehndi Cones product catalogue.")
    except Exception as e:
        logger.warning("Product seed check skipped or failed", error=str(e))
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        seed_initial_categories()
        seed_initial_products()
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
@app.get("/api")
def root_redirect():
    return {
        "app": "Mehndi By Dhirali API",
        "status": "online",
        "docs": "/api/docs",
    }
