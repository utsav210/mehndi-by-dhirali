"""
Database session and connection engine.
Compatible with Neon PostgreSQL (serverless pooler) and local SQLite fallback.
"""
import os
os.environ.setdefault("DISABLE_SQLALCHEMY_CEXT", "1")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Engine configuration
connect_args = {}
db_url = settings.DATABASE_URL

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Engine with bounded pool parameters suited for serverless
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


_schema_initialized = False


def get_db():
    """Dependency that yields a database session and safely closes it."""
    global _schema_initialized
    if not _schema_initialized:
        try:
            from app.db.base import Base
            Base.metadata.create_all(bind=engine)
            _schema_initialized = True
        except Exception:
            pass
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
