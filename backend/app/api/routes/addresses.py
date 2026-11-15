"""
Customer Saved Addresses Management Routes.
Allows authenticated customers to save, update, view, and delete saved delivery addresses.
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.user import User
from app.models.address import Address
from app.core.deps import get_current_user
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.schemas.common import MessageResponse

router = APIRouter(prefix="/addresses", tags=["Addresses"])


@router.get("", response_model=List[AddressResponse])
def list_saved_addresses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lists all saved addresses belonging to the authenticated customer."""
    addresses = (
        db.query(Address)
        .filter(Address.user_id == current_user.id)
        .order_by(desc(Address.is_default), desc(Address.created_at))
        .all()
    )
    return addresses


@router.post("", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
def create_saved_address(
    data: AddressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Saves a new delivery address for the authenticated customer."""
    # Check if this is the first address or marked default
    existing_count = db.query(Address).filter(Address.user_id == current_user.id).count()
    is_default = data.is_default or existing_count == 0

    if is_default:
        # Reset default on existing addresses
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    new_address = Address(
        user_id=current_user.id,
        label=data.label or "Home",
        full_name=data.full_name,
        phone=data.phone,
        address_line_1=data.address_line_1,
        address_line_2=data.address_line_2,
        city=data.city,
        state=data.state,
        postal_code=data.postal_code,
        country=data.country or "India",
        is_default=is_default,
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address


@router.put("/{id}", response_model=AddressResponse)
def update_saved_address(
    id: str,
    data: AddressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Updates an existing delivery address for the authenticated customer."""
    address = (
        db.query(Address)
        .filter(Address.id == id, Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found in your saved addresses.",
        )

    if data.is_default is True and not address.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(address, field, val)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{id}", response_model=MessageResponse)
def delete_saved_address(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Deletes or disassociates an address from the customer's saved addresses.
    Preserves historical order associations if this address was used in previous orders.
    """
    address = (
        db.query(Address)
        .filter(Address.id == id, Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found in your saved addresses.",
        )

    was_default = address.is_default
    has_orders = len(address.orders) > 0

    if has_orders:
        # Preserve record for historical invoicing, detach from active profile
        address.user_id = None
        address.is_default = False
        db.commit()
    else:
        db.delete(address)
        db.commit()

    # If the deleted address was default, promote another address to default
    if was_default:
        next_addr = (
            db.query(Address)
            .filter(Address.user_id == current_user.id)
            .order_by(desc(Address.created_at))
            .first()
        )
        if next_addr:
            next_addr.is_default = True
            db.commit()

    return {"message": "Saved address removed successfully.", "success": True}


@router.post("/{id}/default", response_model=AddressResponse)
def set_default_address(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Sets a specified address as the default delivery address."""
    address = (
        db.query(Address)
        .filter(Address.id == id, Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found in your saved addresses.",
        )

    db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    address.is_default = True
    db.commit()
    db.refresh(address)
    return address
