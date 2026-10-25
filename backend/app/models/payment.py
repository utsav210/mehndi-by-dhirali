"""
Payment and Webhook PaymentEvent models.
Payment events ensure idempotent webhook handling and prevent double fulfillment.
"""
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base, UUIDMixin, TimestampMixin


class Payment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "payments"

    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    razorpay_payment_id = Column(String(100), unique=True, index=True, nullable=True)
    razorpay_order_id = Column(String(100), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)

    # status: pending, captured, failed, refunded
    status = Column(String(30), default="pending", nullable=False)
    amount_minor = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    method = Column(String(50), nullable=True)  # upi, card, netbanking, wallet

    order = relationship("Order", back_populates="payments")


class PaymentEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "payment_events"

    # Unique event ID from Razorpay (e.g. event_Lxxxxxxxx) for deduplication
    event_id = Column(String(100), unique=True, index=True, nullable=False)
    event_type = Column(String(100), nullable=False)
    order_id = Column(String(36), nullable=True)
    payload = Column(Text, nullable=False)
    processed = Column(Boolean, default=False, nullable=False)
