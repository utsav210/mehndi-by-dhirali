"""
Main FastAPI Application Entry Point for Mehndi By Dhirali.
Configured for local Uvicorn development and Vercel serverless deployment.
"""
import os
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

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
    """Seeds default boutique categories and cleans up removed categories."""
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

        default_categories = [
            {"name": "Mehndi Cones", "slug": "mehndi-cones", "description": "Freshly mixed organic henna cones", "sort_order": 1},
            {"name": "Mehndi Powder", "slug": "mehndi-powder", "description": "Triple-sifted 100% natural Sojat henna powder", "sort_order": 2},
            {"name": "Mehndi Oil", "slug": "mehndi-oil", "description": "Pure eucalyptus and essential herbal oil blends", "sort_order": 3},
            {"name": "Mehndi Kits", "slug": "mehndi-kits", "description": "Complete bridal and professional student kits", "sort_order": 4},
            {"name": "Accessories", "slug": "accessories", "description": "Sealant spray, cellophane sheets, pin tips", "sort_order": 5},
        ]
        for cat_data in default_categories:
            existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing_cat:
                c = Category(**cat_data, is_active=True)
                db.add(c)
            else:
                existing_cat.name = cat_data["name"]
                existing_cat.description = cat_data["description"]
                existing_cat.sort_order = cat_data["sort_order"]
                existing_cat.is_active = True
        db.commit()
        logger.info("Verified and updated store categories.")
    except Exception as e:
        logger.warning("Category seed check skipped or failed", error=str(e))
    finally:
        db.close()


def seed_initial_products():
    """Seeds initial Mehndi Cones, Mehndi Powder, Mehndi Oil, and Kits products if not already present."""
    db = SessionLocal()
    try:
        cones_cat = db.query(Category).filter(Category.slug == "mehndi-cones").first()
        powder_cat = db.query(Category).filter(Category.slug == "mehndi-powder").first()
        oil_cat = db.query(Category).filter(Category.slug == "mehndi-oil").first()
        kits_cat = db.query(Category).filter(Category.slug == "mehndi-kits").first()
        if not cones_cat and not powder_cat and not oil_cat and not kits_cat:
            return

        products_data = [
            # Mehndi Cones
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 5 Mehndi Cones",
                "slug": "pack-of-5-mehndi-cones",
                "price_minor": 9900,  # ₹99.00
                "compare_at_price_minor": 14900,  # ₹149.00
                "sku": "MBD-CONE-05",
                "stock_quantity": 100,
                "weight_grams": 150,
                "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 5). Formulated with pure eucalyptus essential oil for a deep, rich mahogany stain. Ultra-smooth 0.38mm tip for intricate bridal and festive designs. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 5 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 8 Mehndi Cones",
                "slug": "pack-of-8-mehndi-cones",
                "price_minor": 15900,  # ₹159.00
                "compare_at_price_minor": 22900,  # ₹229.00
                "sku": "MBD-CONE-08",
                "stock_quantity": 100,
                "weight_grams": 240,
                "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 8). Hand-poured in small artisanal batches with natural eucalyptus oil for guaranteed dark stain. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 8 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 12 Mehndi Cones",
                "slug": "pack-of-12-mehndi-cones",
                "price_minor": 23900,  # ₹239.00
                "compare_at_price_minor": 34900,  # ₹349.00
                "sku": "MBD-CONE-12",
                "stock_quantity": 100,
                "weight_grams": 360,
                "description": "Complete 1-dozen pack of freshly rolled organic henna cones. Ideal for family celebrations, Karwa Chauth, Eid, and wedding festivities. Zero chemicals, 100% natural. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 12 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 16 Mehndi Cones",
                "slug": "pack-of-16-mehndi-cones",
                "price_minor": 31900,  # ₹319.00
                "compare_at_price_minor": 45900,  # ₹459.00
                "sku": "MBD-CONE-16",
                "stock_quantity": 100,
                "weight_grams": 480,
                "description": "Value bundle of 16 organic bridal henna cones. Crafted with triple-sifted micro-fine henna powder and pure essential oils for smooth flow and crisp line work. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 16 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 20 Mehndi Cones",
                "slug": "pack-of-20-mehndi-cones",
                "price_minor": 39900,  # ₹399.00
                "compare_at_price_minor": 59900,  # ₹599.00
                "sku": "MBD-CONE-20",
                "stock_quantity": 100,
                "weight_grams": 600,
                "description": "Studio pack of 20 fresh organic henna cones. Perfect for henna artists and large family occasions. Long-lasting, rich burgundy dye release. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 20 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            {
                "category_id": cones_cat.id if cones_cat else None,
                "name": "Pack of 50 Mehndi Cones",
                "slug": "pack-of-50-mehndi-cones",
                "price_minor": 99900,  # ₹999.00
                "compare_at_price_minor": 149900,  # ₹1,499.00
                "sku": "MBD-CONE-50",
                "stock_quantity": 100,
                "weight_grams": 1500,
                "description": "Bulk artist master pack of 50 freshly rolled organic henna cones. Shipped in insulated packaging to maintain optimal freshness. The ultimate value for professional bridal bookings. Step-by-step instruction & stain care card included.",
                "specifications": "Quantity: 50 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
                "image_url": "/images/products/mehndi-cones.png",
            },
            # Mehndi Powder
            {
                "category_id": powder_cat.id if powder_cat else None,
                "name": "100 gm Mehndi Powder",
                "slug": "100-gm-mehndi-powder",
                "price_minor": 9900,  # ₹99.00
                "compare_at_price_minor": 14900,  # ₹149.00
                "sku": "MBD-POWDER-100",
                "stock_quantity": 100,
                "weight_grams": 100,
                "description": "100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (100g). Rich dye content (Lawsone 2.8%+) providing rich, deep mahogany stain for professional henna paste preparation and natural hair treatment. Detailed step-by-step instruction card included.",
                "specifications": "Weight: 100g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included",
                "image_url": "/images/products/mehndi-powder.png",
            },
            {
                "category_id": powder_cat.id if powder_cat else None,
                "name": "200 gm Mehndi Powder",
                "slug": "200-gm-mehndi-powder",
                "price_minor": 18900,  # ₹189.00
                "compare_at_price_minor": 27900,  # ₹279.00
                "sku": "MBD-POWDER-200",
                "stock_quantity": 100,
                "weight_grams": 200,
                "description": "100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (200g). High-potency Lawsonia inermis powder ideal for mixing silky, elastic bridal henna paste or full herbal hair conditioning. Detailed step-by-step instruction card included.",
                "specifications": "Weight: 200g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included",
                "image_url": "/images/products/mehndi-powder.png",
            },
            {
                "category_id": powder_cat.id if powder_cat else None,
                "name": "50 gram Anti leakage powder",
                "slug": "50-gram-anti-leakage-powder",
                "price_minor": 4900,  # ₹49.00
                "compare_at_price_minor": 7900,  # ₹79.00
                "sku": "MBD-POWDER-ANTI-LEAK",
                "stock_quantity": 100,
                "weight_grams": 50,
                "description": "Specialized 50g organic anti-leakage formula powder. Mix with your henna paste to improve consistency, eliminate smudging, and prevent tip seepage for razor-sharp lines. Detailed step-by-step instruction card included.",
                "specifications": "Weight: 50g | Purpose: Anti-leakage paste stabilizer | 100% Herbal & Organic | Instruction card included",
                "image_url": "/images/products/anti-leakage-powder.png",
            },
            # Mehndi Oil
            {
                "category_id": oil_cat.id if oil_cat else None,
                "name": "100ML Mehndi oil",
                "slug": "100ml-mehndi-oil",
                "price_minor": 24900,  # ₹249.00
                "compare_at_price_minor": 34900,  # ₹349.00
                "sku": "MBD-OIL-100",
                "stock_quantity": 100,
                "weight_grams": 100,
                "description": "Pure 100% natural eucalyptus and terpene essential oil blend (100ml). Specially formulated to enhance Lawsone dye penetration into skin pores for deep, rich mahogany to dark burgundy henna stains. Free from synthetic fragrances and mineral oil. Detailed step-by-step instruction card included.",
                "specifications": "Volume: 100ml | Key Ingredients: Pure Eucalyptus Globulus & Herbal Terpenes | 100% Pure Essential Oil | Instruction card included",
                "image_url": "/images/products/mehndi-oil.png",
            },
            # Mehndi Kits
            {
                "category_id": kits_cat.id if kits_cat else None,
                "name": "Trial Kit",
                "slug": "trial-kit",
                "price_minor": 17900,  # ₹179.00
                "compare_at_price_minor": 24900,  # ₹249.00
                "sku": "MBD-KIT-TRIAL",
                "stock_quantity": 100,
                "weight_grams": 250,
                "description": "Complete beginner starter trial kit including 100gm organic Sojat mehndi powder, 30ml eucalyptus mehndi oil, 10 precut transparent cellophane sheets, 2 durable piping bags, and 10 precision plastic pins. Perfect for students and beginners to roll and mix fresh cones at home. Step-by-step instruction card included.",
                "specifications": "Contents: 100gm powder + 30ml oil + 10 cello sheets + 2 piping bags + 10 pins | Ideal for: Beginners & Practice | Instruction card included",
                "image_url": "/images/products/trial-kit.png",
            },
            {
                "category_id": kits_cat.id if kits_cat else None,
                "name": "Artist Kit + FREE shipping",
                "slug": "mehndi-artist-kit",
                "price_minor": 59900,  # ₹599.00
                "compare_at_price_minor": 89900,  # ₹899.00
                "sku": "MBD-KIT-ARTIST",
                "stock_quantity": 100,
                "weight_grams": 500,
                "description": "All-in-one comprehensive kit for professional mehndi artists and bridal work with FREE doorstep shipping! Includes 200gm triple-sifted Sojat mehndi powder, 100ml pure eucalyptus mehndi oil, 5 heavy-duty piping bags, 0.38mm precision pin tips, 25 high-grade cellophane rolling sheets, 5 pre-rolled pencil empty cones, and 1 fresh dark stain bridal cone. Step-by-step masterclass instruction card included.",
                "specifications": "Contents: 200gm powder, 100ml oil, 5 piping bags, 0.38mm pins, 25 cone sheets, 5 pre-rolled empty cones, 1 dark stain cone | Level: Professional & Bridal | Shipping: FREE | Instruction card included",
                "image_url": "/images/products/mehndi-artist-kit.png",
            },
        ]

        for p_data in products_data:
            if not p_data["category_id"]:
                continue
            existing = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if not existing:
                prod = Product(
                    category_id=p_data["category_id"],
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
                    url=p_data["image_url"],
                    alt_text=prod.name,
                    sort_order=1,
                    is_primary=True,
                )
                db.add(img)
            else:
                existing.name = p_data["name"]
                existing.price_minor = p_data["price_minor"]
                existing.compare_at_price_minor = p_data["compare_at_price_minor"]
                existing.category_id = p_data["category_id"]
                existing.description = p_data["description"]
                existing.specifications = p_data["specifications"]
                existing.weight_grams = p_data["weight_grams"]
        db.commit()
        logger.info("Seeded initial store product catalogue.")
    except Exception as e:
        logger.warning("Product seed check skipped or failed", error=str(e))
    finally:
        db.close()


def ensure_order_tracking_columns():
    """Ensures fulfillment, payment method, and tracking columns exist on orders table across SQL dialects."""
    try:
        from sqlalchemy import inspect, text
        insp = inspect(engine)
        if "orders" not in insp.get_table_names():
            return
        existing = [col["name"] for col in insp.get_columns("orders")]
        is_sqlite = str(engine.url).startswith("sqlite")
        new_cols = [
            ("tracking_number", "VARCHAR(100)"),
            ("courier_partner", "VARCHAR(100)"),
            ("tracking_url", "VARCHAR(500)"),
            ("estimated_delivery", "VARCHAR(100)"),
            ("shipped_at", "TIMESTAMP" if not is_sqlite else "DATETIME"),
            ("delivered_at", "TIMESTAMP" if not is_sqlite else "DATETIME"),
            ("tracking_notes", "TEXT"),
            ("payment_method", "VARCHAR(30) DEFAULT 'prepaid'"),
            ("cod_fee_minor", "INTEGER DEFAULT 0"),
        ]
        with engine.connect() as conn:
            for col_name, col_type in new_cols:
                if col_name not in existing:
                    conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};"))
            conn.commit()
    except Exception as e:
        logger.warning("Order tracking columns check skipped", error=str(e))


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        ensure_order_tracking_columns()
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
