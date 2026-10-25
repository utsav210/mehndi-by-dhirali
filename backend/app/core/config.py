"""
Application Configuration using Pydantic Settings.
Loads environment variables from system or .env file with validation.
"""
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_NAME: str = "Mehndi By Dhirali API"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://mehndi-by-dhirali.vercel.app"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    # Database (Defaults to SQLite for local development when Neon credentials are not yet set)
    DATABASE_URL: str = "sqlite:///./mehndi_dev.db"

    # JWT Authentication
    JWT_SECRET_KEY: str = "insecure-development-secret-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 24 hours

    # Razorpay (Test Mode)
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "placeholder_secret"
    RAZORPAY_WEBHOOK_SECRET: str = "placeholder_webhook_secret"

    # Supabase Storage
    SUPABASE_URL: str = "https://placeholder.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder_service_role_key"
    SUPABASE_STORAGE_BUCKET: str = "mehndi-products"

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
