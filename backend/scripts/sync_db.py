"""
Database Synchronization & Maintenance Script for Mehndi By Dhirali.
Synchronizes schema, applies schema migrations (tracking columns),
updates category taxonomy, and seeds/updates full product catalogue.
Supports Neon PostgreSQL (production) and local SQLite.
"""
import os
import sys
from pathlib import Path
from typing import Optional

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure backend root is on Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

from dotenv import load_dotenv
load_dotenv(BACKEND_DIR / ".env")

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

from app.models import (
    Base,
    Category,
    Product,
    ProductImage,
    Order,
    OrderItem,
    User,
    Address,
    Payment,
    PaymentEvent,
    WishlistItem,
    AuditLog,
)

DEFAULT_CATEGORIES = [
    {
        "name": "Mehndi Cones",
        "slug": "mehndi-cones",
        "description": "Freshly mixed organic henna cones",
        "sort_order": 1,
    },
    {
        "name": "Mehndi Powder",
        "slug": "mehndi-powder",
        "description": "Triple-sifted 100% natural Sojat henna powder",
        "sort_order": 2,
    },
    {
        "name": "Mehndi Oil",
        "slug": "mehndi-oil",
        "description": "Pure eucalyptus and essential herbal oil blends",
        "sort_order": 3,
    },
    {
        "name": "Mehndi Kits",
        "slug": "mehndi-kits",
        "description": "Complete bridal and professional student kits",
        "sort_order": 4,
    },
    {
        "name": "Accessories",
        "slug": "accessories",
        "description": "Sealant spray, cellophane sheets, pin tips",
        "sort_order": 5,
    },
]

DEPRECATED_CATEGORIES = ["aftercare-oils", "practice-tools"]

PRODUCTS_CATALOGUE = [
    # Mehndi Cones
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 5 Mehndi Cones",
        "slug": "pack-of-5-mehndi-cones",
        "price_minor": 9900,
        "compare_at_price_minor": 14900,
        "sku": "MBD-CONE-05",
        "stock_quantity": 100,
        "weight_grams": 150,
        "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 5). Formulated with pure eucalyptus essential oil for a deep, rich mahogany stain. Ultra-smooth 0.38mm tip for intricate bridal and festive designs. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 5 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-5-mehndi-cones.jpg",
    },
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 8 Mehndi Cones",
        "slug": "pack-of-8-mehndi-cones",
        "price_minor": 15900,
        "compare_at_price_minor": 22900,
        "sku": "MBD-CONE-08",
        "stock_quantity": 100,
        "weight_grams": 240,
        "description": "Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 8). Hand-poured in small artisanal batches with natural eucalyptus oil for guaranteed dark stain. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 8 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-8-mehndi-cones.jpg",
    },
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 12 Mehndi Cones",
        "slug": "pack-of-12-mehndi-cones",
        "price_minor": 23900,
        "compare_at_price_minor": 34900,
        "sku": "MBD-CONE-12",
        "stock_quantity": 100,
        "weight_grams": 360,
        "description": "Complete 1-dozen pack of freshly rolled organic henna cones. Ideal for family celebrations, Karwa Chauth, Eid, and wedding festivities. Zero chemicals, 100% natural. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 12 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-12-mehndi-cones.jpg",
    },
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 16 Mehndi Cones",
        "slug": "pack-of-16-mehndi-cones",
        "price_minor": 31900,
        "compare_at_price_minor": 45900,
        "sku": "MBD-CONE-16",
        "stock_quantity": 100,
        "weight_grams": 480,
        "description": "Value bundle of 16 organic bridal henna cones. Crafted with triple-sifted micro-fine henna powder and pure essential oils for smooth flow and crisp line work. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 16 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-16-mehndi-cones.jpg",
    },
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 20 Mehndi Cones",
        "slug": "pack-of-20-mehndi-cones",
        "price_minor": 39900,
        "compare_at_price_minor": 59900,
        "sku": "MBD-CONE-20",
        "stock_quantity": 100,
        "weight_grams": 600,
        "description": "Studio pack of 20 fresh organic henna cones. Perfect for henna artists and large family occasions. Long-lasting, rich burgundy dye release. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 20 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-20-mehndi-cones.jpg",
    },
    {
        "category_slug": "mehndi-cones",
        "name": "Pack of 50 Mehndi Cones",
        "slug": "pack-of-50-mehndi-cones",
        "price_minor": 99900,
        "compare_at_price_minor": 149900,
        "sku": "MBD-CONE-50",
        "stock_quantity": 100,
        "weight_grams": 1500,
        "description": "Bulk artist master pack of 50 freshly rolled organic henna cones. Shipped in insulated packaging to maintain optimal freshness. The ultimate value for professional bridal bookings. Step-by-step instruction & stain care card included.",
        "specifications": "Quantity: 50 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included",
        "image_url": "/images/products/pack-of-50-mehndi-cones.jpg",
    },
    # Mehndi Powder
    {
        "category_slug": "mehndi-powder",
        "name": "100 gm Mehndi Powder",
        "slug": "100-gm-mehndi-powder",
        "price_minor": 9900,
        "compare_at_price_minor": 14900,
        "sku": "MBD-POWDER-100",
        "stock_quantity": 100,
        "weight_grams": 100,
        "description": "100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (100g). Rich dye content (Lawsone 2.8%+) providing rich, deep mahogany stain for professional henna paste preparation and natural hair treatment. Detailed step-by-step instruction card included.",
        "specifications": "Weight: 100g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included",
        "image_url": "/images/products/mehndi-powder.png",
    },
    {
        "category_slug": "mehndi-powder",
        "name": "200 gm Mehndi Powder",
        "slug": "200-gm-mehndi-powder",
        "price_minor": 18900,
        "compare_at_price_minor": 27900,
        "sku": "MBD-POWDER-200",
        "stock_quantity": 100,
        "weight_grams": 200,
        "description": "100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (200g). High-potency Lawsonia inermis powder ideal for mixing silky, elastic bridal henna paste or full herbal hair conditioning. Detailed step-by-step instruction card included.",
        "specifications": "Weight: 200g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included",
        "image_url": "/images/products/mehndi-powder.png",
    },
    {
        "category_slug": "mehndi-powder",
        "name": "50 gram Anti leakage powder",
        "slug": "50-gram-anti-leakage-powder",
        "price_minor": 4900,
        "compare_at_price_minor": 7900,
        "sku": "MBD-POWDER-ANTI-LEAK",
        "stock_quantity": 100,
        "weight_grams": 50,
        "description": "Specialized 50g organic anti-leakage formula powder. Mix with your henna paste to improve consistency, eliminate smudging, and prevent tip seepage for razor-sharp lines. Detailed step-by-step instruction card included.",
        "specifications": "Weight: 50g | Purpose: Anti-leakage paste stabilizer | 100% Herbal & Organic | Instruction card included",
        "image_url": "/images/products/anti-leakage-powder.png",
    },
    # Mehndi Oil
    {
        "category_slug": "mehndi-oil",
        "name": "100ML Mehndi oil",
        "slug": "100ml-mehndi-oil",
        "price_minor": 24900,
        "compare_at_price_minor": 34900,
        "sku": "MBD-OIL-100",
        "stock_quantity": 100,
        "weight_grams": 100,
        "description": "Pure 100% natural eucalyptus and terpene essential oil blend (100ml). Specially formulated to enhance Lawsone dye penetration into skin pores for deep, rich mahogany to dark burgundy henna stains. Free from synthetic fragrances and mineral oil. Detailed step-by-step instruction card included.",
        "specifications": "Volume: 100ml | Key Ingredients: Pure Eucalyptus Globulus & Herbal Terpenes | 100% Pure Essential Oil | Instruction card included",
        "image_url": "/images/products/mehndi-oil.png",
    },
    # Mehndi Kits
    {
        "category_slug": "mehndi-kits",
        "name": "Trial Kit",
        "slug": "trial-kit",
        "price_minor": 17900,
        "compare_at_price_minor": 24900,
        "sku": "MBD-KIT-TRIAL",
        "stock_quantity": 100,
        "weight_grams": 250,
        "description": "Complete beginner starter trial kit including 100gm organic Sojat mehndi powder, 30ml eucalyptus mehndi oil, 10 precut transparent cellophane sheets, 2 durable piping bags, and 10 precision plastic pins. Perfect for students and beginners to roll and mix fresh cones at home. Step-by-step instruction card included.",
        "specifications": "Contents: 100gm powder + 30ml oil + 10 cello sheets + 2 piping bags + 10 pins | Ideal for: Beginners & Practice | Instruction card included",
        "image_url": "/images/products/trial-kit.png",
    },
    {
        "category_slug": "mehndi-kits",
        "name": "Artist Kit + FREE shipping",
        "slug": "mehndi-artist-kit",
        "price_minor": 59900,
        "compare_at_price_minor": 89900,
        "sku": "MBD-KIT-ARTIST",
        "stock_quantity": 100,
        "weight_grams": 500,
        "description": "All-in-one comprehensive kit for professional mehndi artists and bridal work with FREE doorstep shipping! Includes 200gm triple-sifted Sojat mehndi powder, 100ml pure eucalyptus mehndi oil, 5 heavy-duty piping bags, 0.38mm precision pin tips, 25 high-grade cellophane rolling sheets, 5 pre-rolled pencil empty cones, and 1 fresh dark stain bridal cone. Step-by-step masterclass instruction card included.",
        "specifications": "Contents: 200gm powder, 100ml oil, 5 piping bags, 0.38mm pins, 25 cone sheets, 5 pre-rolled empty cones, 1 dark stain cone | Level: Professional & Bridal | Shipping: FREE | Instruction card included",
        "image_url": "/images/products/mehndi-artist-kit.png",
    },
]


def sync_database(db_url: str, db_label: str) -> bool:
    print(f"\n{'='*70}")
    print(f"SYNCING DATABASE: {db_label}")
    print(f"Target URL: {db_url.split('@')[-1] if '@' in db_url else db_url}")
    print(f"{'='*70}")

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    try:
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            pool_pre_ping=True,
        )
        Session = sessionmaker(bind=engine)
    except Exception as e:
        print(f"❌ Failed to connect to engine: {e}")
        return False

    # 1. Ensure all tables exist
    try:
        print("[1/5] Ensuring database tables exist...")
        Base.metadata.create_all(bind=engine)
        insp = inspect(engine)
        tables = insp.get_table_names()
        print(f"  [OK] Verified {len(tables)} tables: {', '.join(tables)}")
    except Exception as e:
        print(f"  [ERR] Table creation error: {e}")
        return False

    # 2. Ensure Orders tracking and COD columns exist
    try:
        print("\n[2/5] Checking and migrating orders table columns...")
        insp = inspect(engine)
        if "orders" in insp.get_table_names():
            existing_cols = [c["name"] for c in insp.get_columns("orders")]
            is_sqlite = db_url.startswith("sqlite")
            
            column_definitions = [
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
                for col_name, col_type in column_definitions:
                    if col_name not in existing_cols:
                        print(f"  + Adding column 'orders.{col_name}' ({col_type})...")
                        conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};"))
                    else:
                        print(f"  [OK] Column 'orders.{col_name}' already exists.")
                conn.commit()
            print("  [OK] Orders table columns verified and up to date.")
    except Exception as e:
        print(f"  [ERR] Order columns migration error: {e}")
        return False

    # 3. Synchronize Categories
    try:
        print("\n[3/5] Synchronizing product categories...")
        db = Session()
        try:
            # Handle deprecated categories
            for slug in DEPRECATED_CATEGORIES:
                cat = db.query(Category).filter(Category.slug == slug).first()
                if cat:
                    if len(cat.products) == 0:
                        db.delete(cat)
                        print(f"  - Deleted unused deprecated category: {slug}")
                    else:
                        cat.is_active = False
                        print(f"  ~ Deactivated deprecated category: {slug} (contains historical products)")
            db.commit()

            # Upsert default active categories
            for c_data in DEFAULT_CATEGORIES:
                cat = db.query(Category).filter(Category.slug == c_data["slug"]).first()
                if not cat:
                    cat = Category(
                        name=c_data["name"],
                        slug=c_data["slug"],
                        description=c_data["description"],
                        sort_order=c_data["sort_order"],
                        is_active=True,
                    )
                    db.add(cat)
                    print(f"  + Created category: {c_data['name']} (slug: {c_data['slug']}, sort: {c_data['sort_order']})")
                else:
                    cat.name = c_data["name"]
                    cat.description = c_data["description"]
                    cat.sort_order = c_data["sort_order"]
                    cat.is_active = True
                    print(f"  [OK] Updated category: {c_data['name']} (sort: {c_data['sort_order']})")
            db.commit()
            print("  [OK] Categories synchronization complete.")
        finally:
            db.close()
    except Exception as e:
        print(f"  [ERR] Categories sync error: {e}")
        return False

    # 4. Synchronize Products & Images
    try:
        print("\n[4/5] Synchronizing product catalogue and images...")
        db = Session()
        try:
            # Build category slug map
            category_map = {c.slug: c for c in db.query(Category).all()}

            synced_count = 0
            for p_data in PRODUCTS_CATALOGUE:
                cat = category_map.get(p_data["category_slug"])
                if not cat:
                    print(f"  [WARN] Category {p_data['category_slug']} not found, skipping {p_data['name']}")
                    continue

                prod = db.query(Product).filter(Product.slug == p_data["slug"]).first()
                if not prod:
                    prod = Product(
                        category_id=cat.id,
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
                    print(f"  + Created product: {prod.name} (SKU: {prod.sku}, Rs.{prod.price_minor/100})")
                else:
                    prod.category_id = cat.id
                    prod.name = p_data["name"]
                    prod.price_minor = p_data["price_minor"]
                    prod.compare_at_price_minor = p_data["compare_at_price_minor"]
                    prod.sku = p_data["sku"]
                    prod.stock_quantity = p_data["stock_quantity"]
                    prod.weight_grams = p_data["weight_grams"]
                    prod.description = p_data["description"]
                    prod.specifications = p_data["specifications"]
                    prod.is_active = True
                    prod.is_featured = True
                    print(f"  [OK] Updated product: {prod.name} (SKU: {prod.sku}, Rs.{prod.price_minor/100})")

                # Verify primary product image
                primary_img = (
                    db.query(ProductImage)
                    .filter(ProductImage.product_id == prod.id, ProductImage.is_primary == True)
                    .first()
                )
                if not primary_img:
                    img = ProductImage(
                        product_id=prod.id,
                        url=p_data["image_url"],
                        alt_text=prod.name,
                        sort_order=1,
                        is_primary=True,
                    )
                    db.add(img)
                    print(f"    + Added primary image: {p_data['image_url']}")
                else:
                    primary_img.url = p_data["image_url"]
                    primary_img.alt_text = prod.name

                synced_count += 1

            db.commit()
            print(f"  [OK] Synchronized {synced_count} products and corresponding images.")
        finally:
            db.close()
    except Exception as e:
        print(f"  [ERR] Products sync error: {e}")
        return False

    # 5. Database Health Check & Verification
    try:
        print("\n[5/5] Database Verification & Summary:")
        db = Session()
        try:
            active_cats = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()
            print(f"  * Active Categories ({len(active_cats)}):")
            for c in active_cats:
                p_count = db.query(Product).filter(Product.category_id == c.id, Product.is_active == True).count()
                print(f"    - {c.name} (slug: {c.slug}, order: {c.sort_order}) -> {p_count} active products")

            active_prods = db.query(Product).filter(Product.is_active == True).order_by(Product.price_minor).all()
            print(f"  * Active Products ({len(active_prods)}):")
            for p in active_prods:
                img_url = p.images[0].url if p.images else "None"
                comp = f"(was Rs.{p.compare_at_price_minor/100})" if p.compare_at_price_minor else ""
                print(f"    - {p.sku:<20} | {p.name:<30} | Rs.{p.price_minor/100:<6} {comp:<14} | {p.weight_grams}g | {img_url}")

            order_count = db.query(Order).count()
            print(f"  * Existing Orders in Database: {order_count}")
        finally:
            db.close()
    except Exception as e:
        print(f"  [ERR] Verification error: {e}")
        return False

    print(f"\n>> SUCCESS: {db_label} is 100% updated and healthy!\n")
    return True


def main():
    neon_url = os.getenv("DATABASE_URL")
    sqlite_url = f"sqlite:///{BACKEND_DIR / 'mehndi_dev.db'}"

    success_all = True

    # 1. Synchronize Local SQLite
    print("Beginning synchronization of local SQLite database...")
    sqlite_ok = sync_database(sqlite_url, "Local SQLite (mehndi_dev.db)")
    if not sqlite_ok:
        success_all = False

    # 2. Synchronize Production Neon PostgreSQL (if configured)
    if neon_url and "postgresql" in neon_url:
        print("\nBeginning synchronization of Production Neon PostgreSQL database...")
        neon_ok = sync_database(neon_url, "Production Neon PostgreSQL")
        if not neon_ok:
            success_all = False
    else:
        print("\n⚠️ No PostgreSQL DATABASE_URL found in environment; skipped remote PostgreSQL.")

    if not success_all:
        sys.exit(1)


if __name__ == "__main__":
    main()
