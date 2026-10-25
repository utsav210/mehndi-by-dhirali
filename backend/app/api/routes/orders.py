"""
Order creation, listing, and lifecycle management routes.
Enforces strict server-side price calculation and atomic stock verification.
"""
import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.address import Address
from app.models.user import User
from app.core.deps import get_optional_user, get_current_user
from app.schemas.order import OrderCreateRequest, OrderResponse
from app.integrations.razorpay.client import razorpay_client

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    if not data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one product item.",
        )

    # 1. Server-authoritative price & stock calculation from DB
    subtotal_minor = 0
    order_items_to_create = []

    for item_req in data.items:
        product = db.query(Product).filter(
            Product.id == item_req.product_id,
            Product.is_active == True,
        ).with_for_update().first() if not db.bind.url.drivername.startswith("sqlite") else db.query(Product).filter(
            Product.id == item_req.product_id,
            Product.is_active == True,
        ).first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID '{item_req.product_id}' is unavailable or out of stock.",
            )

        if product.stock_quantity < item_req.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}, requested: {item_req.quantity}.",
            )

        line_total_minor = product.price_minor * item_req.quantity
        subtotal_minor += line_total_minor

        # Primary image URL
        primary_img = ""
        if product.images:
            for img in product.images:
                if img.is_primary:
                    primary_img = img.url
                    break
            if not primary_img and product.images:
                primary_img = product.images[0].url

        order_items_to_create.append(
            {
                "product_id": product.id,
                "product_name": product.name,
                "product_image": primary_img,
                "sku": product.sku,
                "quantity": item_req.quantity,
                "unit_price_minor": product.price_minor,
                "total_price_minor": line_total_minor,
            }
        )

    # 2. Shipping calculation: Free on orders >= ₹999 (99900 paise), else ₹70 (7000 paise)
    shipping_minor = 0 if subtotal_minor >= 99900 else 7000
    discount_minor = 0
    final_total_minor = subtotal_minor + shipping_minor - discount_minor

    # 3. Create or bind shipping address
    shipping_addr = Address(
        user_id=current_user.id if current_user else "guest_" + uuid.uuid4().hex[:8],
        label=data.shipping_address.label,
        full_name=data.shipping_address.full_name,
        phone=data.shipping_address.phone,
        address_line_1=data.shipping_address.address_line_1,
        address_line_2=data.shipping_address.address_line_2,
        city=data.shipping_address.city,
        state=data.shipping_address.state,
        postal_code=data.shipping_address.postal_code,
        country=data.shipping_address.country,
    )
    db.add(shipping_addr)
    db.flush()

    # 4. Generate unique internal order number (e.g. MBD-202410-XXXX)
    order_number = f"MBD-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    # 5. Create Razorpay order on server
    rzp_order = razorpay_client.create_order(
        amount_minor=final_total_minor,
        currency="INR",
        receipt=order_number,
    )

    # 6. Create pending local order
    new_order = Order(
        order_number=order_number,
        user_id=current_user.id if current_user else None,
        shipping_address_id=shipping_addr.id,
        status="pending_payment",
        subtotal_minor=subtotal_minor,
        shipping_minor=shipping_minor,
        discount_minor=discount_minor,
        total_minor=final_total_minor,
        currency="INR",
        razorpay_order_id=rzp_order.get("id"),
        guest_email=data.email if not current_user else current_user.email,
        guest_name=data.shipping_address.full_name,
        guest_phone=data.phone,
        notes=data.notes,
    )
    db.add(new_order)
    db.flush()

    # 7. Add order items
    for item_dict in order_items_to_create:
        oi = OrderItem(
            order_id=new_order.id,
            **item_dict,
        )
        db.add(oi)

    db.commit()
    db.refresh(new_order)

    return new_order


@router.get("", response_model=List[OrderResponse])
def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{id}", response_model=OrderResponse)
def get_order_detail(
    id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    # Authorization check: only owner or admin can view order
    if order.user_id:
        if not current_user or (current_user.id != order.user_id and current_user.role != "admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this order.",
            )

    return order
