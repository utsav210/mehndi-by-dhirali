"""
Customer Wishlist model.
"""
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class WishlistItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "wishlist_items"

    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")

    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uq_user_product_wishlist"),
    )
