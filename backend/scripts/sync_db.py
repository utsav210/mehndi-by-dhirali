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

DEPRECATED_CATEGORIES = ["aftercare-oils", "practice-tools"]

PRODUCTS_CATALOGUE = [   {   'category_slug': 'mehndi-powder',
        'compare_at_price_minor': 14900,
        'description': 'Experience the smoothness and quality of premium Mehndi Powder by Mehndi By Dhirali.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in an airtight container.\n'
                       '• Keep away from direct sunlight and moisture.\n'
                       '• Store in a cool and dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/100-gm-mehndi-powder.jpg',
        'name': '100 Gram 5 filter Mehndi Powder (Five Filter Super smooth & stringy)',
        'price_minor': 9900,
        'sku': 'MBD-POWDER-100',
        'slug': '100-gm-mehndi-powder',
        'specifications': 'Weight: 100g | Five Filter (Super Smooth & Stringy) | Origin: Sojat, Rajasthan | 100% '
                          'Organic Henna Powder',
        'stock_quantity': 100,
        'weight_grams': 100},
    {   'category_slug': 'mehndi-powder',
        'compare_at_price_minor': 27900,
        'description': 'Experience the smoothness and quality of premium Mehndi Powder by Mehndi By Dhirali.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in an airtight container.\n'
                       '• Keep away from direct sunlight and moisture.\n'
                       '• Store in a cool and dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/200-gm-mehndi-powder.jpg',
        'name': '200 Gram 5 filter Mehndi Powder (Five Filter Super smooth & stringy)',
        'price_minor': 18900,
        'sku': 'MBD-POWDER-200',
        'slug': '200-gm-mehndi-powder',
        'specifications': 'Weight: 200g | Five Filter (Super Smooth & Stringy) | Origin: Sojat, Rajasthan | 100% '
                          'Organic Henna Powder',
        'stock_quantity': 100,
        'weight_grams': 200},
    {   'category_slug': 'mehndi-oil',
        'compare_at_price_minor': 34900,
        'description': 'Pure 100% natural eucalyptus and terpene essential oil blend (100ml). Specially formulated to '
                       'enhance Lawsone dye penetration into skin pores for deep, rich mahogany to dark burgundy henna '
                       'stains. Free from synthetic fragrances and mineral oil. Detailed step-by-step instruction card '
                       'included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in a cool and dry place away from direct sunlight.\n'
                       '• Keep bottle tightly closed when not in use.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/mehndi-oil.jpg',
        'name': '100ML Mehndi oil',
        'price_minor': 24900,
        'sku': 'MBD-OIL-100',
        'slug': '100ml-mehndi-oil',
        'specifications': 'Volume: 100ml | Key Ingredients: Pure Eucalyptus Globulus & Herbal Terpenes | 100% Pure '
                          'Essential Oil | Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 100},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 14900,
        'description': 'Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 5). Formulated with pure '
                       'eucalyptus essential oil for a deep, rich mahogany stain. Ultra-smooth 0.38mm tip for '
                       'intricate bridal and festive designs. Step-by-step instruction & stain care card included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-5-mehndi-cones.jpg',
        'name': 'Pack of 5 Mehndi Cones',
        'price_minor': 9900,
        'sku': 'MBD-CONE-05',
        'slug': 'pack-of-5-mehndi-cones',
        'specifications': 'Quantity: 5 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 150},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 22900,
        'description': 'Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 8). Hand-poured in small '
                       'artisanal batches with natural eucalyptus oil for guaranteed dark stain. Step-by-step '
                       'instruction & stain care card included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-8-mehndi-cones.jpg',
        'name': 'Pack of 8 Mehndi Cones',
        'price_minor': 15900,
        'sku': 'MBD-CONE-08',
        'slug': 'pack-of-8-mehndi-cones',
        'specifications': 'Quantity: 8 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 240},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 34900,
        'description': 'Complete 1-dozen pack of freshly rolled organic henna cones. Ideal for family celebrations, '
                       'Karwa Chauth, Eid, and wedding festivities. Zero chemicals, 100% natural. Step-by-step '
                       'instruction & stain care card included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-12-mehndi-cones.jpg',
        'name': 'Pack of 12 Mehndi Cones',
        'price_minor': 23900,
        'sku': 'MBD-CONE-12',
        'slug': 'pack-of-12-mehndi-cones',
        'specifications': 'Quantity: 12 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 360},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 45900,
        'description': 'Value bundle of 16 organic bridal henna cones. Crafted with triple-sifted micro-fine henna '
                       'powder and pure essential oils for smooth flow and crisp line work. Step-by-step instruction & '
                       'stain care card included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-16-mehndi-cones.jpg',
        'name': 'Pack of 16 Mehndi Cones',
        'price_minor': 31900,
        'sku': 'MBD-CONE-16',
        'slug': 'pack-of-16-mehndi-cones',
        'specifications': 'Quantity: 16 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 480},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 59900,
        'description': 'Studio pack of 20 fresh organic henna cones. Perfect for henna artists and large family '
                       'occasions. Long-lasting, rich burgundy dye release. Step-by-step instruction & stain care card '
                       'included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-20-mehndi-cones.jpg',
        'name': 'Pack of 20 Mehndi Cones',
        'price_minor': 39900,
        'sku': 'MBD-CONE-20',
        'slug': 'pack-of-20-mehndi-cones',
        'specifications': 'Quantity: 20 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 600},
    {   'category_slug': 'mehndi-cones',
        'compare_at_price_minor': 149900,
        'description': 'Bulk artist master pack of 50 freshly rolled organic henna cones. Shipped in insulated '
                       'packaging to maintain optimal freshness. The ultimate value for professional bridal bookings. '
                       'Step-by-step instruction & stain care card included.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order (freshly rolled per batch)\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India in insulated packaging.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store in deep freezer (-18°C) immediately upon arrival.\n'
                       '• Thaw at room temperature for 15-20 minutes before application.\n'
                       '• Never microwave or heat cones.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/pack-of-50-mehndi-cones.jpg',
        'name': 'Pack of 50 Mehndi Cones',
        'price_minor': 99900,
        'sku': 'MBD-CONE-50',
        'slug': 'pack-of-50-mehndi-cones',
        'specifications': 'Quantity: 50 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | '
                          'Instruction card included',
        'stock_quantity': 100,
        'weight_grams': 1500},
    {   'category_slug': 'mehndi-kits',
        'compare_at_price_minor': 29900,
        'description': '100 gram mehndi powder, 30 ml oil, 0.38mm Plastic pin, Piping big bag, stocking, Anti leakage '
                       'powder, Golden cone sheets, pre rolled White flower cones, Instruction card (notes for '
                       'mixology) with upto 5 kg measurement.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store powder and oil in a cool, dry place away from moisture and sunlight.\n'
                       '• Keep all accessory sheets, pins, and cones safely stored in the kit box.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/trial-kit.jpg',
        'name': 'Business DIY Kit',
        'price_minor': 19900,
        'sku': 'MBD-KIT-BIZ-DIY',
        'slug': 'business-diy-kit',
        'specifications': '100g Henna Powder, 30ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, Anti-leakage '
                          'Powder, Golden Cone Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up to 5kg)',
        'stock_quantity': 100,
        'weight_grams': 250},
    {   'category_slug': 'mehndi-kits',
        'compare_at_price_minor': 59900,
        'description': '200 gram mehndi powder, 100 ml oil, 0.38mm Plastic pin, Piping big bag, stocking, Anti leakage '
                       'powder - 50gram, Golden cone sheets - 20 piece, pre rolled White flower cones, Instruction '
                       'card (notes for mixology) with upto 5 kg measurement.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India with FREE Delivery!\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store powder and oil in a cool, dry place away from moisture and sunlight.\n'
                       '• Keep all accessory sheets, pins, and cones safely stored in the kit box.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/mehndi-artist-kit.jpg',
        'name': 'Duo Business DIY Kit + FREE shipping',
        'price_minor': 39900,
        'sku': 'MBD-KIT-DUO-BIZ',
        'slug': 'duo-business-diy-kit',
        'specifications': '200g Henna Powder, 100ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, 50g '
                          'Anti-leakage Powder, 20x Golden Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up '
                          'to 5kg) | FREE shipping',
        'stock_quantity': 100,
        'weight_grams': 500},
    {   'category_slug': 'mehndi-kits',
        'compare_at_price_minor': 64900,
        'description': '200 gram mehndi powder, 100ml dark stain oil, 0.38mm - 2 pin, Piping bag - small 2, '
                       'Transperant 20 micron sheet- 20 piece, Pre rolled cones - 2, stocking - 1, Instruction card '
                       '(or bridal mehndi paste making).\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India with FREE Delivery!\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Store powder and dark stain oil in a cool, dry place away from moisture and sunlight.\n'
                       '• Keep all tools and rolling sheets in the protective bridal kit box.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'image_url': '/images/products/mehndi-artist-kit.jpg',
        'name': 'Bridal DIY kit + FREE shipping',
        'price_minor': 44900,
        'sku': 'MBD-KIT-BRIDAL-DIY',
        'slug': 'bridal-diy-kit',
        'specifications': '200g Henna Powder, 100ml Dark Stain Oil, 2x 0.38mm Pins, 2x Small Piping Bags, 20x '
                          'Transparent 20 Micron Sheets, 2x Pre-rolled Cones, 1x Stocking, Bridal Paste Guide | FREE '
                          'shipping',
        'stock_quantity': 100,
        'weight_grams': 550},
    {   'category_slug': 'accessories',
        'compare_at_price_minor': 7900,
        'description': 'Ergonomic, lightweight durable pink mixing bowl specially designed for smooth, lump-free henna '
                       'paste preparation and easy stirring. Stain-resistant, non-reactive food-grade plastic safe for '
                       'essential oils and lemon-sugar mixes.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Care Instructions:\n'
                       '• Wash and dry thoroughly after each henna mixing session.\n'
                       '• Store in a cool and dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'gallery_images': [   {   'alt_text': 'Pink Bowl - Top View Inside',
                                  'is_primary': False,
                                  'sort_order': 2,
                                  'url': '/images/products/pink-bowl-2.jpg'}],
        'image_url': '/images/products/pink-bowl-1.jpg',
        'name': 'Pink Bowl',
        'price_minor': 4900,
        'sku': 'MBD-ACC-BOWL',
        'slug': 'pink-bowl',
        'specifications': 'Material: BPA-free Non-reactive Polypropylene | Diameter: ~15cm | Color: Vibrant Pink | '
                          'Safe for: Henna paste mixing & aftercare prep',
        'stock_quantity': 100,
        'weight_grams': 60},
    {   'category_slug': 'accessories',
        'compare_at_price_minor': 6900,
        'description': 'Pack of heavy-duty sealing clips for henna piping bags and carrot bags. Tight snap-lock clamp '
                       'ensures an airtight seal, preventing paste from drying out, leaking, or pushing backwards '
                       'while rolling and filling henna cones.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Care Instructions:\n'
                       '• Rinse with lukewarm water and wipe clean.\n'
                       '• Store in a cool, dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'gallery_images': [   {   'alt_text': 'Clip for Piping Bag - In Hand',
                                  'is_primary': False,
                                  'sort_order': 2,
                                  'url': '/images/products/clip-for-piping-bag-2.jpg'}],
        'image_url': '/images/products/clip-for-piping-bag-1.jpg',
        'name': 'Clip for Piping Bag',
        'price_minor': 4900,
        'sku': 'MBD-ACC-CLIP',
        'slug': 'clip-for-piping-bag',
        'specifications': 'Quantity: Pack of 6 Clamping Clips | Material: High-durability food-grade polymer | Colors: '
                          'Multi-color assortment | Use: Airtight seal for henna carrot & piping bags',
        'stock_quantity': 100,
        'weight_grams': 40},
    {   'category_slug': 'accessories',
        'compare_at_price_minor': 5000,
        'description': '0.38 mm pin (pack of 5 pin) for henna cone clogging prevention and tip sealing. Essential '
                       'precision tool for smooth henna paste flow.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Storage Instructions:\n'
                       '• Keep pins in a protective case to avoid bending.\n'
                       '• Store in a clean and dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'gallery_images': [   {   'alt_text': '0.38 mm pin (pack of 5 pin) detail',
                                  'is_primary': False,
                                  'sort_order': 2,
                                  'url': '/images/products/0-38-mm-pin-1.jpg'}],
        'image_url': '/images/products/0-38-mm-pin.jpg',
        'name': '0.38 mm pin (pack of 5 pin)',
        'price_minor': 3500,
        'sku': 'MBD-ACC-PIN-038',
        'slug': '0-38-mm-pin-pack-of-5',
        'specifications': '0.38 mm tip caliber, pack of 5 durable plastic sealing pins',
        'stock_quantity': 100,
        'weight_grams': 20},
    {   'category_slug': 'accessories',
        'compare_at_price_minor': 4000,
        'description': 'High-grade fine mesh stocking strainers for silky-smooth, lump-free henna paste filtration. '
                       'Set of 2 durable nylon stockings.\n'
                       '\n'
                       '• Dispatch will be done after 2-3 days of placed order\n'
                       '• Delivery takes 5-6 days max after dispatch\n'
                       '• COD available\n'
                       '• Quick, reliable shipping to any location of India.\n'
                       '\n'
                       'Care Instructions:\n'
                       '• Hand-wash under running water immediately after paste filtration. Air dry before storing.\n'
                       '• Store in a clean and dry place.\n'
                       '\n'
                       'Order now and experience the quality of Mehndi By Dhirali!',
        'gallery_images': [   {   'alt_text': 'Stocking (Set of 2) detail',
                                  'is_primary': False,
                                  'sort_order': 2,
                                  'url': '/images/products/stocking-set-of-2-1.jpg'}],
        'image_url': '/images/products/stocking-set-of-2.jpg',
        'name': 'Stocking (Set of 2)',
        'price_minor': 2500,
        'sku': 'MBD-ACC-STOCKING-2',
        'slug': 'stocking-set-of-2',
        'specifications': 'Ultra-fine nylon mesh, stretchable elastic fit, Set of 2 strainers',
        'stock_quantity': 100,
        'weight_grams': 30}]


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

            # Deactivate removed products (old kits & removed 50g anti leakage powder)
            deprecated_products = ["trial-kit", "mehndi-artist-kit", "50-gram-anti-leakage-powder"]
            for d_slug in deprecated_products:
                old_k = db.query(Product).filter(Product.slug == d_slug).first()
                if old_k:
                    old_k.is_active = False
                    old_k.is_featured = False
                    print(f"  - Deactivated product: {old_k.name} ({d_slug})")
            db.commit()

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

                # Verify gallery images if specified
                if "gallery_images" in p_data:
                    for g_img in p_data["gallery_images"]:
                        existing_g = (
                            db.query(ProductImage)
                            .filter(ProductImage.product_id == prod.id, ProductImage.url == g_img["url"])
                            .first()
                        )
                        if not existing_g:
                            db.add(
                                ProductImage(
                                    product_id=prod.id,
                                    url=g_img["url"],
                                    alt_text=g_img.get("alt_text", prod.name),
                                    sort_order=g_img.get("sort_order", 2),
                                    is_primary=g_img.get("is_primary", False),
                                )
                            )
                            print(f"    + Added gallery image: {g_img['url']}")

                synced_count += 1

            db.commit()
            print(f"  [OK] Synchronized {synced_count} products and corresponding images.")
        finally:
            db.close()
    except Exception as e:
        print(f"  [ERR] Products sync error: {e}")
        return False

    # 4.5. Store Administrator Account Verification
    try:
        print("\n[4.5/5] Verifying Store Administrator Account:")
        db = Session()
        try:
            admin_email = os.getenv("ADMIN_EMAIL", "admin@mehndibydhirali.com").lower().strip()
            existing_admin = db.query(User).filter(User.email == admin_email).first()
            admin_pw = os.getenv("ADMIN_PASSWORD")
            if not existing_admin and admin_pw:
                from app.core.security import hash_password
                new_admin = User(
                    email=admin_email,
                    password_hash=hash_password(admin_pw),
                    first_name="Admin",
                    last_name="Doe",
                    phone="+919876543210",
                    role="admin",
                    is_active=True,
                )
                db.add(new_admin)
                db.commit()
                print(f"  [OK] Created store administrator account: {admin_email} (role: admin)")
            elif existing_admin:
                if existing_admin.role != "admin" or not existing_admin.is_active:
                    existing_admin.role = "admin"
                    existing_admin.is_active = True
                    db.commit()
                    print(f"  [OK] Updated user to administrator: {admin_email} (role: admin)")
                else:
                    print(f"  [OK] Administrator account verified: {admin_email} (role: admin)")
        finally:
            db.close()
    except Exception as e:
        print(f"  [ERR] Admin sync error: {e}")
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
