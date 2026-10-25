"""
User account model with roles: customer and admin.
"""
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), default="customer", nullable=False)  # "customer" | "admin"
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")
