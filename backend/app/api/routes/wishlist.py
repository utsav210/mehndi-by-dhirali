"""
Customer Wishlist routes.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.wishlist import WishlistItem
from app.models.product import Product
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.product import ProductResponse
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=List[ProductResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id)
        .all()
    )
    products = [item.product for item in items if item.product and item.product.is_active]
    return products


@router.post("/{product_id}", response_model=MessageResponse)
def add_to_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if not existing:
        item = WishlistItem(user_id=current_user.id, product_id=product_id)
        db.add(item)
        db.commit()

    return {"message": "Product added to wishlist.", "success": True}


@router.delete("/{product_id}", response_model=MessageResponse)
def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if item:
        db.delete(item)
        db.commit()

    return {"message": "Product removed from wishlist.", "success": True}
