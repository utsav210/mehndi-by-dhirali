"""
Application Configuration using Pydantic Settings.
Loads environment variables from system or .env file with validation.
"""
import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_NAME: str = "Mehndi By Dhirali API"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: str = (
        "http://localhost:5173,http://localhost:3000,https://mehndi-by-dhirali.vercel.app"
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [
            origin.strip()
            for origin in self.ALLOWED_ORIGINS.split(",")
            if origin.strip()
        ]
        # Automatically permit Vercel deployment URLs if present in environment
        vercel_url = os.environ.get("VERCEL_URL")
        if vercel_url:
            origins.append(f"https://{vercel_url}")
        vercel_branch_url = os.environ.get("VERCEL_BRANCH_URL")
        if vercel_branch_url:
            origins.append(f"https://{vercel_branch_url}")
        return list(dict.fromkeys(origins))

    # Database (Defaults to SQLite for local development, uses Neon PostgreSQL from .env in production)
    DATABASE_URL: str = "sqlite:///./mehndi_dev.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def sanitize_database_url(cls, v: Union[str, None]) -> str:
        # Check system environment explicitly (including Vercel Neon integrations POSTGRES_URL)
        raw_val = (
            os.environ.get("DATABASE_URL")
            or os.environ.get("POSTGRES_URL")
            or os.environ.get("POSTGRES_PRISMA_URL")
            or os.environ.get("NEON_DATABASE_URL")
            or v
            or ""
        )
        if (
            os.environ.get("APP_ENV") == "testing"
            or ":memory:" in str(raw_val)
        ):
            return "sqlite:///:memory:"

        is_serverless = bool(
            os.environ.get("VERCEL")
            or os.environ.get("VERCEL_ENV")
            or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
            or os.environ.get("LAMBDA_TASK_ROOT")
            or os.path.exists("/var/task")
            or not os.access(".", os.W_OK)
        )

        clean_val = str(raw_val).strip().strip("'\"")

        # In serverless environments, SQLite files must be located in /tmp
        if "sqlite" in clean_val and is_serverless:
            return "sqlite:////tmp/mehndi_dev.db"

        if not clean_val:
            if is_serverless:
                return "sqlite:////tmp/mehndi_dev.db"
            return "sqlite:///./mehndi_dev.db"

        # Standardize postgres:// to postgresql:// for SQLAlchemy compatibility
        if clean_val.startswith("postgres://"):
            clean_val = "postgresql://" + clean_val[len("postgres://"):]

        return clean_val

    # JWT Authentication
    JWT_SECRET_KEY: str = "insecure-development-secret-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 24 hours

    @field_validator("JWT_SECRET_KEY", mode="before")
    @classmethod
    def sanitize_jwt_secret(cls, v: Union[str, None]) -> str:
        raw = v or os.environ.get("JWT_SECRET_KEY") or "insecure-development-secret-key-change-in-production-min-32-chars"
        return str(raw).strip().strip("'\"")

    # Admin Credentials (configured via environment / .env)
    ADMIN_EMAIL: str = "admin@mehndibydhirali.com"
    ADMIN_PASSWORD: str = ""
    ADMIN_FIRST_NAME: str = "Admin"
    ADMIN_LAST_NAME: str = "Doe"

    # Razorpay (Test / Production Mode - configured via environment / .env)
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    @field_validator("RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET", mode="before")
    @classmethod
    def sanitize_razorpay_keys(cls, v: Union[str, None]) -> str:
        if not v:
            return ""
        return str(v).strip().strip("'\"")

    # Supabase Storage
    SUPABASE_URL: str = "https://placeholder.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder_service_role_key"
    SUPABASE_STORAGE_BUCKET: str = "mehndi-products"

    @field_validator("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET", mode="before")
    @classmethod
    def sanitize_supabase_keys(cls, v: Union[str, None]) -> str:
        if not v:
            return ""
        return str(v).strip().strip("'\"")

    # Rate Limiting
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_CHECKOUT: str = "10/minute"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
