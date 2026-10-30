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
from app.schemas.order import (
    OrderCreateRequest,
    OrderResponse,
    OrderTrackingResponse,
    TrackingTimelineStep,
    OrderItemResponse,
)
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
    total_weight_grams = 0
    has_free_shipping_item = False
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

        prod_weight = product.weight_grams or 100
        total_weight_grams += prod_weight * item_req.quantity
        if product.slug == "mehndi-artist-kit" or "free shipping" in product.name.lower():
            has_free_shipping_item = True

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

    # 2. Shipping calculation based on product weight starting at ₹80 (8000 paise)
    if has_free_shipping_item:
        shipping_minor = 0
    elif total_weight_grams <= 500:
        shipping_minor = 8000  # ₹80.00 base up to 0.5 kg
    else:
        # Every additional 0.5 kg adds ₹30 (3000 paise)
        extra_500g_units = (total_weight_grams - 500 + 499) // 500
        shipping_minor = 8000 + (extra_500g_units * 3000)

    # 3. Payment method & Cash on Delivery handling fee (₹30)
    is_cod = (data.payment_method or "").lower() == "cod"
    cod_fee_minor = 3000 if is_cod else 0
    discount_minor = 0
    final_total_minor = subtotal_minor + shipping_minor + cod_fee_minor - discount_minor

    # 4. Create or bind shipping address
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

    # 5. Generate unique internal order number (e.g. MBD-202410-XXXX)
    order_number = f"MBD-{datetime.now(timezone.utc).strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    # 6. Payment initiation (Prepaid generates Razorpay order, COD confirms immediately)
    rzp_order_id = None
    if not is_cod:
        rzp_order = razorpay_client.create_order(
            amount_minor=final_total_minor,
            currency="INR",
            receipt=order_number,
        )
        rzp_order_id = rzp_order.get("id")
        initial_status = "pending_payment"
    else:
        initial_status = "confirmed"

    # 7. Create local order record
    new_order = Order(
        order_number=order_number,
        user_id=current_user.id if current_user else None,
        shipping_address_id=shipping_addr.id,
        status=initial_status,
        subtotal_minor=subtotal_minor,
        shipping_minor=shipping_minor,
        cod_fee_minor=cod_fee_minor,
        discount_minor=discount_minor,
        total_minor=final_total_minor,
        currency="INR",
        payment_method="cod" if is_cod else "prepaid",
        razorpay_order_id=rzp_order_id,
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


def generate_order_timeline(order: Order) -> List[TrackingTimelineStep]:
    """Generates sequential tracking steps matching boutique fulfillment."""
    stages = [
        ("confirmed", "Order Confirmed", "Payment verified and order scheduled for fresh batch preparation."),
        ("processing", "Fresh Batch Prep", "Artisanal organic Sojat henna paste mixed and fresh cones rolled."),
        ("shipped", "Dispatched", f"Package sealed in insulated pouch and handed to {order.courier_partner or 'courier partner'}."),
        ("in_transit", "In Transit", "Package moving through distribution and logistics transit hub."),
        ("out_for_delivery", "Out for Delivery", "Courier executive assigned for doorstep delivery today."),
        ("delivered", "Delivered", "Shipment safely delivered to recipient."),
    ]

    status_alias = {
        "pending_payment": -1,
        "paid": 0,
        "confirmed": 0,
        "processing": 1,
        "shipped": 2,
        "in_transit": 3,
        "out_for_delivery": 4,
        "delivered": 5,
    }

    if order.status == "cancelled":
        return [
            TrackingTimelineStep(
                step_key="cancelled",
                title="Order Cancelled",
                description="This order was cancelled.",
                timestamp=order.updated_at,
                is_completed=True,
                is_current=True,
            )
        ]

    current_idx = status_alias.get(order.status, 0)
    timeline: List[TrackingTimelineStep] = []

    for i, (key, title, desc) in enumerate(stages):
        is_completed = i <= current_idx
        is_current = i == current_idx

        ts = None
        if key == "confirmed":
            ts = order.created_at
        elif key == "shipped" and is_completed:
            ts = order.shipped_at or order.updated_at
        elif key == "delivered" and is_completed:
            ts = order.delivered_at or order.updated_at
        elif is_current:
            ts = order.updated_at

        timeline.append(
            TrackingTimelineStep(
                step_key=key,
                title=title,
                description=desc,
                timestamp=ts,
                is_completed=is_completed,
                is_current=is_current,
            )
        )

    return timeline


def normalize_contact_identifier(val: Optional[str]) -> str:
    """Normalizes phone numbers and email addresses for resilient privacy verification."""
    if not val:
        return ""
    v = val.strip().lower().replace(" ", "").replace("-", "").replace("+", "")
    if v.startswith("91") and len(v) == 12 and v.isdigit():
        return v[2:]
    return v


@router.get("/track", response_model=OrderTrackingResponse)
def track_order(
    order_number: Optional[str] = None,
    tracking_number: Optional[str] = None,
    email_or_phone: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    Public and customer order tracking lookup.
    Verifies either order_number or tracking_number, with privacy verification.
    """
    if not order_number and not tracking_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide an Order Number or Tracking Number.",
        )

    query = db.query(Order)
    if order_number:
        clean_num = order_number.strip()
        query = query.filter(Order.order_number.ilike(clean_num))
    elif tracking_number:
        clean_track = tracking_number.strip()
        query = query.filter(Order.tracking_number.ilike(clean_track))

    order = query.first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No order found matching the provided reference. Please double-check your order or tracking number.",
        )

    # Privacy verification: owner, admin, or contact matcher
    is_authorized = False
    if current_user:
        if current_user.role == "admin" or current_user.id == order.user_id:
            is_authorized = True

    if not is_authorized and email_or_phone:
        normalized_input = normalize_contact_identifier(email_or_phone)
        valid_identifiers = set()
        if order.guest_email:
            valid_identifiers.add(normalize_contact_identifier(order.guest_email))
        if order.guest_phone:
            valid_identifiers.add(normalize_contact_identifier(order.guest_phone))
        if order.user:
            if order.user.email:
                valid_identifiers.add(normalize_contact_identifier(order.user.email))
            if order.user.phone:
                valid_identifiers.add(normalize_contact_identifier(order.user.phone))
        if order.shipping_address and order.shipping_address.phone:
            valid_identifiers.add(normalize_contact_identifier(order.shipping_address.phone))

        if normalized_input in valid_identifiers:
            is_authorized = True

    if not is_authorized:
        has_contact = bool(order.guest_email or order.guest_phone or (order.user and order.user.email))
        if has_contact and not email_or_phone:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="For privacy & security, please enter the email address or phone number used during checkout.",
            )
        elif has_contact:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The email or phone number entered does not match our records for this order.",
            )

    status_labels = {
        "pending_payment": "Payment Pending",
        "paid": "Order Confirmed",
        "confirmed": "Order Confirmed",
        "processing": "Fresh Batch Prep",
        "shipped": "Dispatched",
        "in_transit": "In Transit",
        "out_for_delivery": "Out for Delivery",
        "delivered": "Delivered",
        "cancelled": "Cancelled",
        "refunded": "Refunded",
    }

    timeline = generate_order_timeline(order)

    city = order.shipping_address.city if order.shipping_address else None
    state = order.shipping_address.state if order.shipping_address else None
    recipient = order.shipping_address.full_name if order.shipping_address else order.guest_name

    items_res = [
        OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_image=item.product_image,
            sku=item.sku,
            quantity=item.quantity,
            unit_price_minor=item.unit_price_minor,
            total_price_minor=item.total_price_minor,
        )
        for item in order.items
    ]

    return OrderTrackingResponse(
        order_number=order.order_number,
        status=order.status,
        status_label=status_labels.get(order.status, order.status.replace("_", " ").title()),
        tracking_number=order.tracking_number,
        courier_partner=order.courier_partner,
        tracking_url=order.tracking_url,
        estimated_delivery=order.estimated_delivery,
        created_at=order.created_at,
        shipped_at=order.shipped_at,
        delivered_at=order.delivered_at,
        tracking_notes=order.tracking_notes,
        timeline=timeline,
        items=items_res,
        recipient_name=recipient,
        destination_city=city,
        destination_state=state,
        total_minor=order.total_minor,
        currency=order.currency,
    )


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
