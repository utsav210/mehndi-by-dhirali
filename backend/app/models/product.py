"""
Product and ProductImage models.
Monetary values are stored in integer minor units (paise).
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class Product(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "products"

    name = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    description = Column(Text, nullable=False)
    specifications = Column(Text, nullable=True)

    # Money in paise (e.g. ₹120.00 = 12000 paise)
    price_minor = Column(Integer, nullable=False)
    compare_at_price_minor = Column(Integer, nullable=True)

    stock_quantity = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    weight_grams = Column(Integer, nullable=True)

    # Relationships
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order")
    order_items = relationship("OrderItem", back_populates="product")


class ProductImage(Base, UUIDMixin):
    __tablename__ = "product_images"

    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(200), default="", nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    is_primary = Column(Boolean, default=False, nullable=False)

    product = relationship("Product", back_populates="images")
