"""
Order and OrderItem models.
All monetary totals are stored in integer minor units (paise).
Historical product name, SKU, and unit price are snapshotted to preserve invoicing integrity.
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship, validates
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

    # Synchronized payment status column ('pending' or 'succeeded')
    payment_status = Column(String(30), default="pending", nullable=True)

    @validates("payment_status")
    def validate_payment_status(self, key, value):
        if value:
            v_lower = str(value).strip().lower()
            if v_lower in ("paid", "succeeded", "success", "captured"):
                return "succeeded"
            if v_lower in ("pending", "pending_payment"):
                return "pending"
            return v_lower
        return "pending"

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

    @property
    def customer_name(self) -> str:
        """Returns the customer's full name from registered account, shipping address, or snapshot."""
        if self.user:
            name = f"{self.user.first_name} {self.user.last_name}".strip()
            if name:
                return name
        if self.shipping_address and self.shipping_address.full_name:
            return self.shipping_address.full_name
        return self.guest_name or "Customer"

    @property
    def customer_email(self) -> str:
        """Returns customer email from user account or guest checkout."""
        if self.user and self.user.email:
            return self.user.email
        return self.guest_email or ""

    @property
    def customer_phone(self) -> str:
        """Returns contact phone from shipping address, account, or snapshot."""
        if self.shipping_address and self.shipping_address.phone:
            return self.shipping_address.phone
        if self.user and self.user.phone:
            return self.user.phone
        return self.guest_phone or ""

    @property
    def destination_city(self) -> str:
        """Returns destination delivery city."""
        if self.shipping_address and self.shipping_address.city:
            return self.shipping_address.city
        return ""


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
