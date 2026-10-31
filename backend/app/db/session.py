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
    # If running on Vercel or serverless Linux and a relative path was used, ensure /tmp is used
    if (
        os.environ.get("VERCEL")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or (os.name != "nt" and os.path.exists("/tmp"))
    ) and "///." in db_url:
        db_url = "sqlite:////tmp/mehndi_dev.db"

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


def get_db():
    """Dependency that yields a database session and safely closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
