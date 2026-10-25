"""
Category model for product taxonomy.
"""
from sqlalchemy import Column, String, Text, Integer, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class Category(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "categories"

    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    products = relationship("Product", back_populates="category")
