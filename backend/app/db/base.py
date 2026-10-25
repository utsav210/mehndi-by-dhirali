"""
Declarative base and common mixins for all SQLAlchemy models.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class TimestampMixin:
    """Provides created_at and updated_at UTC timestamps."""
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class UUIDMixin:
    """Provides a UUID string primary key."""
    id = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
