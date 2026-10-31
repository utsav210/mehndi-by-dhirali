"""
Customer Shipping Address model.
"""
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class Address(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "addresses"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)  # Nullable for guest checkouts
    label = Column(String(50), default="Home", nullable=False)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address_line_1 = Column(String(255), nullable=False)
    address_line_2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), default="India", nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="addresses")
    orders = relationship("Order", back_populates="shipping_address")
