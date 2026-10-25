"""
Security utilities: Argon2id password hashing and JWT token handling.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing context: Argon2id prioritized, with bcrypt compatibility
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    role: str = "customer",
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)

    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token. Returns payload dict or None."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None
