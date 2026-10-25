"""
Audit Log model for privileged and security-sensitive events.
"""
from sqlalchemy import Column, String, Text, ForeignKey
from app.db.base import Base, UUIDMixin, TimestampMixin


class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    user_id = Column(String(36), nullable=True)  # Admin or actor
    action = Column(String(100), nullable=False)  # e.g. "product.create", "order.status_update"
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)  # JSON string
    ip_address = Column(String(45), nullable=True)
