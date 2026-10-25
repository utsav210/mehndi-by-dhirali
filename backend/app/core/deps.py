"""
FastAPI dependencies for authentication and authorization.
"""
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_access_token


def extract_token_from_request(request: Request) -> Optional[str]:
    """Extracts JWT token from HttpOnly cookie or Authorization header."""
    # 1. Check HttpOnly session cookie
    token = request.cookies.get("access_token")
    if token:
        return token

    # 2. Check Authorization Bearer header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:].strip()

    return None


def get_optional_user(
    request: Request,
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Returns the authenticated User or None for public/guest requests."""
    token = extract_token_from_request(request)
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None

    user = db.query(User).filter(User.id == payload["sub"], User.is_active == True).first()
    return user


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    """Enforces authentication; raises 401 Unauthorized if missing/invalid."""
    user = get_optional_user(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Enforces administrator role; raises 403 Forbidden if not admin."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required.",
        )
    return current_user
