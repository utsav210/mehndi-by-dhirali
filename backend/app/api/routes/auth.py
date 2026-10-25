"""
Authentication routes: Register, Login, Logout, Me.
Uses HttpOnly secure cookies for session tokens.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user
from app.schemas.auth import RegisterRequest, LoginRequest, UserResponse, TokenResponse
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    data: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    # Check if email is already registered
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # First registered user or specific email can be given admin or default customer
    new_user = User(
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        role="customer",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT
    token = create_access_token(subject=new_user.id, role=new_user.role)

    # Set HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24,  # 24 hours
    )

    return new_user


@router.post("/login", response_model=UserResponse)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is currently inactive. Please contact support.",
        )

    token = create_access_token(subject=user.id, role=user.role)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24,
    )

    return user


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, secure=True, samesite="lax")
    return {"message": "Logged out successfully.", "success": True}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
