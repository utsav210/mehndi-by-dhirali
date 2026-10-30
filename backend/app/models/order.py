"""
Order and OrderItem models.
All monetary totals are stored in integer minor units (paise).
Historical product name, SKU, and unit price are snapshotted to preserve invoicing integrity.
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class Order(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "orders"

    order_number = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)  # Nullable for guest checkout
    shipping_address_id = Column(String(36), ForeignKey("addresses.id"), nullable=True)

    # Order lifecycle state machine:
    # pending_payment -> paid -> processing -> shipped -> delivered
    # Alternate states: payment_failed, cancelled, refund_pending, refunded
    status = Column(String(30), default="pending_payment", index=True, nullable=False)

    subtotal_minor = Column(Integer, nullable=False)
    shipping_minor = Column(Integer, default=0, nullable=False)
    cod_fee_minor = Column(Integer, default=0, nullable=True)
    discount_minor = Column(Integer, default=0, nullable=False)
    total_minor = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    payment_method = Column(String(30), default="prepaid", nullable=True)

    # Razorpay tracking
    razorpay_order_id = Column(String(100), unique=True, index=True, nullable=True)

    # Customer snapshot (for guest checkouts)
    guest_email = Column(String(255), nullable=True)
    guest_name = Column(String(100), nullable=True)
    guest_phone = Column(String(20), nullable=True)
    notes = Column(Text, nullable=True)

    # Shipment Tracking & Fulfillment
    tracking_number = Column(String(100), index=True, nullable=True)
    courier_partner = Column(String(100), nullable=True)
    tracking_url = Column(String(500), nullable=True)
    estimated_delivery = Column(String(100), nullable=True)
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    tracking_notes = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Address", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base, UUIDMixin):
    __tablename__ = "order_items"

    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=True)

    # Immutable snapshot values
    product_name = Column(String(200), nullable=False)
    product_image = Column(String(500), default="", nullable=False)
    sku = Column(String(50), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price_minor = Column(Integer, nullable=False)
    total_price_minor = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
