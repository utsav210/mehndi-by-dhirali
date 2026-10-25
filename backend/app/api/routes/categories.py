"""
Category public listing routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.category import Category
from app.schemas.product import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()
    return categories


@router.get("/{slug}", response_model=CategoryResponse)
def get_category(slug: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.slug == slug, Category.is_active == True).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category '{slug}' not found.",
        )
    return category
