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
from app.models.user import User
from app.core.security import hash_password
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
            {
                "name": "Mehndi Powder",
                "slug": "mehndi-powder",
                "description": "Triple-sifted 100% natural Sojat henna powder",
                "image_url": "/images/products/100-gm-mehndi-powder.jpg",
                "sort_order": 1,
            },
            {
                "name": "Mehndi Oil",
                "slug": "mehndi-oil",
                "description": "Pure eucalyptus and essential herbal oil blends",
                "image_url": "/images/products/mehndi-oil.jpg",
                "sort_order": 2,
            },
            {
                "name": "Mehndi Cones",
                "slug": "mehndi-cones",
                "description": "Freshly mixed organic henna cones",
                "image_url": "/images/products/pack-of-5-mehndi-cones.jpg",
                "sort_order": 3,
            },
            {
                "name": "Mehndi Kits",
                "slug": "mehndi-kits",
                "description": "Complete bridal and professional student kits",
                "image_url": "/images/products/mehndi-artist-kit.jpg",
                "sort_order": 4,
            },
            {
                "name": "Accessories",
                "slug": "accessories",
                "description": "Essential mixing bowls, sealing clips & tools",
                "image_url": "/images/products/pink-bowl-1.jpg",
                "sort_order": 5,
            },
        ]
        for cat_data in default_categories:
            existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing_cat:
                c = Category(**cat_data, is_active=True)
                db.add(c)
            else:
                existing_cat.name = cat_data["name"]
                existing_cat.description = cat_data["description"]
                existing_cat.image_url = cat_data["image_url"]
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
        acc_cat = db.query(Category).filter(Category.slug == "accessories").first()
        if not cones_cat and not powder_cat and not oil_cat and not kits_cat and not acc_cat:
            return

        # Deactivate old kits if present
        old_kit_slugs = ["trial-kit", "mehndi-artist-kit"]
        for old_slug in old_kit_slugs:
            old_prod = db.query(Product).filter(Product.slug == old_slug).first()
            if old_prod:
                old_prod.is_active = False
                old_prod.is_featured = False
        db.commit()

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
                "image_url": "/images/products/pack-of-5-mehndi-cones.jpg",
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
                "image_url": "/images/products/pack-of-8-mehndi-cones.jpg",
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
                "image_url": "/images/products/pack-of-12-mehndi-cones.jpg",
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
                "image_url": "/images/products/pack-of-16-mehndi-cones.jpg",
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
                "image_url": "/images/products/pack-of-20-mehndi-cones.jpg",
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
                "image_url": "/images/products/pack-of-50-mehndi-cones.jpg",
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
                "image_url": "/images/products/100-gm-mehndi-powder.jpg",
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
                "image_url": "/images/products/200-gm-mehndi-powder.jpg",
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
                "image_url": "/images/products/50-gram-anti-leakage-powder.jpg",
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
                "image_url": "/images/products/mehndi-oil.jpg",
            },
            # Mehndi Kits (Only the 3 requested DIY kits)
            {
                "category_id": kits_cat.id if kits_cat else None,
                "name": "Business DIY Kit",
                "slug": "business-diy-kit",
                "price_minor": 19900,  # ₹199.00
                "compare_at_price_minor": 29900,  # ₹299.00
                "sku": "MBD-KIT-BIZ-DIY",
                "stock_quantity": 100,
                "weight_grams": 250,
                "description": "100 gram mehndi powder, 30 ml oil, 0.38mm Plastic pin, Piping big bag, stocking, Anti leakage powder, Golden cone sheets, pre rolled White flower cones, Instruction card (notes for mixology) with upto 5 kg measurement.",
                "specifications": "100g Henna Powder, 30ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, Anti-leakage Powder, Golden Cone Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up to 5kg)",
                "image_url": "/images/products/mehndi-artist-kit.jpg",
            },
            {
                "category_id": kits_cat.id if kits_cat else None,
                "name": "Duo Business DIY Kit + FREE shipping",
                "slug": "duo-business-diy-kit",
                "price_minor": 39900,  # ₹399.00
                "compare_at_price_minor": 59900,  # ₹599.00
                "sku": "MBD-KIT-DUO-BIZ",
                "stock_quantity": 100,
                "weight_grams": 500,
                "description": "200 gram mehndi powder, 100 ml oil, 0.38mm Plastic pin, Piping big bag, stocking, Anti leakage powder - 50gram, Golden cone sheets - 20 piece, pre rolled White flower cones, Instruction card (notes for mixology) with upto 5 kg measurement.",
                "specifications": "200g Henna Powder, 100ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, 50g Anti-leakage Powder, 20x Golden Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up to 5kg) | FREE shipping",
                "image_url": "/images/products/mehndi-artist-kit.jpg",
            },
            {
                "category_id": kits_cat.id if kits_cat else None,
                "name": "Bridal DIY kit + FREE shipping",
                "slug": "bridal-diy-kit",
                "price_minor": 44900,  # ₹449.00
                "compare_at_price_minor": 64900,  # ₹649.00
                "sku": "MBD-KIT-BRIDAL-DIY",
                "stock_quantity": 100,
                "weight_grams": 550,
                "description": "200 gram mehndi powder, 100ml dark stain oil, 0.38mm - 2 pin, Piping bag - small 2, Transperant 20 micron sheet- 20 piece, Pre rolled cones - 2, stocking - 1, Instruction card (or bridal mehndi paste making).",
                "specifications": "200g Henna Powder, 100ml Dark Stain Oil, 2x 0.38mm Pins, 2x Small Piping Bags, 20x Transparent 20 Micron Sheets, 2x Pre-rolled Cones, 1x Stocking, Bridal Paste Guide | FREE shipping",
                "image_url": "/images/products/mehndi-artist-kit.jpg",
            },
            # Accessories
            {
                "category_id": acc_cat.id if acc_cat else None,
                "name": "Pink Bowl",
                "slug": "pink-bowl",
                "price_minor": 4900,  # ₹49.00
                "compare_at_price_minor": 7900,  # ₹79.00
                "sku": "MBD-ACC-BOWL",
                "stock_quantity": 100,
                "weight_grams": 60,
                "description": "Ergonomic, lightweight durable pink mixing bowl specially designed for smooth, lump-free henna paste preparation and easy stirring. Stain-resistant, non-reactive food-grade plastic safe for essential oils and lemon-sugar mixes.",
                "specifications": "Material: BPA-free Non-reactive Polypropylene | Diameter: ~15cm | Color: Vibrant Pink | Safe for: Henna paste mixing & aftercare prep",
                "image_url": "/images/products/pink-bowl-1.jpg",
                "gallery_images": [
                    {
                        "url": "/images/products/pink-bowl-2.jpg",
                        "alt_text": "Pink Bowl - Top View Inside",
                        "sort_order": 2,
                        "is_primary": False,
                    }
                ],
            },
            {
                "category_id": acc_cat.id if acc_cat else None,
                "name": "Clip for Piping Bag",
                "slug": "clip-for-piping-bag",
                "price_minor": 4900,  # ₹49.00
                "compare_at_price_minor": 6900,  # ₹69.00
                "sku": "MBD-ACC-CLIP",
                "stock_quantity": 100,
                "weight_grams": 40,
                "description": "Pack of heavy-duty sealing clips for henna piping bags and carrot bags. Tight snap-lock clamp ensures an airtight seal, preventing paste from drying out, leaking, or pushing backwards while rolling and filling henna cones.",
                "specifications": "Quantity: Pack of 6 Clamping Clips | Material: High-durability food-grade polymer | Colors: Multi-color assortment | Use: Airtight seal for henna carrot & piping bags",
                "image_url": "/images/products/clip-for-piping-bag-1.jpg",
                "gallery_images": [
                    {
                        "url": "/images/products/clip-for-piping-bag-2.jpg",
                        "alt_text": "Clip for Piping Bag - In Hand",
                        "sort_order": 2,
                        "is_primary": False,
                    }
                ],
            },
            {
                "category_id": acc_cat.id if acc_cat else None,
                "name": "0.38 mm pin (pack of 5 pin)",
                "slug": "0-38-mm-pin-pack-of-5",
                "price_minor": 3500,  # ₹35.00
                "compare_at_price_minor": 5000,  # ₹50.00
                "sku": "MBD-ACC-PIN-038",
                "stock_quantity": 100,
                "weight_grams": 20,
                "description": "0.38 mm pin (pack of 5 pin) for henna cone clogging prevention and tip sealing. Essential precision tool for smooth henna paste flow.",
                "specifications": "0.38 mm tip caliber, pack of 5 durable plastic sealing pins",
                "image_url": "/images/products/0-38-mm-pin.jpg",
                "gallery_images": [
                    {
                        "url": "/images/products/0-38-mm-pin-1.jpg",
                        "alt_text": "0.38 mm pin (pack of 5 pin) detail",
                        "sort_order": 2,
                        "is_primary": False,
                    }
                ],
            },
            {
                "category_id": acc_cat.id if acc_cat else None,
                "name": "Stocking (Set of 2)",
                "slug": "stocking-set-of-2",
                "price_minor": 2500,  # ₹25.00
                "compare_at_price_minor": 4000,  # ₹40.00
                "sku": "MBD-ACC-STOCKING-2",
                "stock_quantity": 100,
                "weight_grams": 30,
                "description": "High-grade fine mesh stocking strainers for silky-smooth, lump-free henna paste filtration. Set of 2 durable nylon stockings.",
                "specifications": "Ultra-fine nylon mesh, stretchable elastic fit, Set of 2 strainers",
                "image_url": "/images/products/stocking-set-of-2.jpg",
                "gallery_images": [
                    {
                        "url": "/images/products/stocking-set-of-2-1.jpg",
                        "alt_text": "Stocking (Set of 2) detail",
                        "sort_order": 2,
                        "is_primary": False,
                    }
                ],
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
                existing_img = db.query(ProductImage).filter(ProductImage.product_id == existing.id, ProductImage.is_primary == True).first()
                if existing_img:
                    existing_img.url = p_data["image_url"]
                else:
                    new_img = ProductImage(
                        product_id=existing.id,
                        url=p_data["image_url"],
                        alt_text=existing.name,
                        sort_order=1,
                        is_primary=True,
                    )
                    db.add(new_img)

            target_prod_id = prod.id if not existing else existing.id
            if "gallery_images" in p_data:
                for g_img in p_data["gallery_images"]:
                    existing_g = (
                        db.query(ProductImage)
                        .filter(ProductImage.product_id == target_prod_id, ProductImage.url == g_img["url"])
                        .first()
                    )
                    if not existing_g:
                        db.add(
                            ProductImage(
                                product_id=target_prod_id,
                                url=g_img["url"],
                                alt_text=g_img.get("alt_text", p_data["name"]),
                                sort_order=g_img.get("sort_order", 2),
                                is_primary=g_img.get("is_primary", False),
                            )
                        )
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
            if "addresses" in insp.get_table_names() and not is_sqlite:
                try:
                    conn.execute(text("ALTER TABLE addresses ALTER COLUMN user_id DROP NOT NULL;"))
                except Exception:
                    pass
            conn.commit()
    except Exception as e:
        logger.warning("Order tracking columns check skipped", error=str(e))


def seed_initial_admin():
    """Seeds default boutique admin user if not present or ensures admin role is active."""
    db = SessionLocal()
    try:
        admin_email = (settings.ADMIN_EMAIL or "admin@mehndibydhirali.com").lower().strip()
        existing = db.query(User).filter(User.email == admin_email).first()
        admin_pw = settings.ADMIN_PASSWORD or os.environ.get("ADMIN_PASSWORD")
        if not existing and admin_pw:
            admin_user = User(
                email=admin_email,
                password_hash=hash_password(admin_pw),
                first_name=settings.ADMIN_FIRST_NAME or "Admin",
                last_name=settings.ADMIN_LAST_NAME or "Doe",
                phone="+919876543210",
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            logger.info("Default store administrator account created", email=admin_email)
        elif existing:
            if existing.role != "admin" or not existing.is_active:
                existing.role = "admin"
                existing.is_active = True
                db.commit()
                logger.info("Elevated existing user to administrator", email=admin_email)
    except Exception as e:
        logger.warning("Admin seeding skipped or failed", error=str(e))
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
        ensure_order_tracking_columns()
        seed_initial_categories()
        seed_initial_products()
        seed_initial_admin()
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

# CORS Middleware (Explicit origins and all Vercel deployment preview domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https:\/\/.*\.vercel\.app$",
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
        content={"detail": f"Server Error: {str(exc)}"},
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
