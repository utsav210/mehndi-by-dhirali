"""
Razorpay Payment Verification and Webhook Processing routes.
Enforces cryptographic signature checks, state machine transitions, and idempotency.
"""
import json
from fastapi import APIRouter, Depends, HTTPException, Request, Header, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order
from app.models.payment import Payment, PaymentEvent
from app.models.product import Product
from app.schemas.payment import PaymentVerifyRequest, PaymentVerifyResponse
from app.integrations.razorpay.client import razorpay_client

router = APIRouter(tags=["Payments"])


@router.post("/payments/verify", response_model=PaymentVerifyResponse)
def verify_payment(
    data: PaymentVerifyRequest,
    db: Session = Depends(get_db),
):
    # 1. Retrieve the local order matching razorpay_order_id
    order = db.query(Order).filter(Order.razorpay_order_id == data.razorpay_order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order associated with Razorpay order '{data.razorpay_order_id}' was not found.",
        )

    # 2. Check if already marked as paid (idempotency guard)
    if order.status in ["paid", "processing", "shipped", "delivered"]:
        return PaymentVerifyResponse(
            success=True,
            order_id=order.id,
            order_number=order.order_number,
            payment_status=order.status,
            message="Payment already verified.",
        )

    # 3. Cryptographic signature check
    is_valid = razorpay_client.verify_payment_signature(
        razorpay_order_id=data.razorpay_order_id,
        razorpay_payment_id=data.razorpay_payment_id,
        razorpay_signature=data.razorpay_signature,
    )

    if not is_valid:
        order.status = "payment_failed"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed: Invalid cryptographic signature.",
        )

    # 4. Record payment in ledger
    payment = Payment(
        order_id=order.id,
        razorpay_payment_id=data.razorpay_payment_id,
        razorpay_order_id=data.razorpay_order_id,
        razorpay_signature=data.razorpay_signature,
        status="captured",
        amount_minor=order.total_minor,
        currency=order.currency,
    )
    db.add(payment)

    # 5. Decrement inventory atomically for confirmed items
    for item in order.items:
        if item.product_id:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock_quantity = max(0, product.stock_quantity - item.quantity)

    # 6. Update order status to paid
    order.status = "paid"
    db.commit()
    db.refresh(order)

    return PaymentVerifyResponse(
        success=True,
        order_id=order.id,
        order_number=order.order_number,
        payment_status="paid",
        message="Payment verified successfully. Order confirmed.",
    )


@router.post("/webhooks/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: Session = Depends(get_db),
):
    """
    Webhook handler for Razorpay server events.
    Verifies raw body signature, guarantees deduplicated processing via event_id.
    """
    raw_body = await request.body()

    if not x_razorpay_signature:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing signature header.")

    # 1. Verify webhook signature
    is_valid = razorpay_client.verify_webhook_signature(raw_body, x_razorpay_signature)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature.")

    # 2. Parse payload
    try:
        event_payload = json.loads(raw_body.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Malformed JSON.")

    event_id = event_payload.get("event_id") or f"evt_{hash(raw_body)}"
    event_type = event_payload.get("event")

    # 3. Webhook idempotency guard: check if event was already recorded
    existing_event = db.query(PaymentEvent).filter(PaymentEvent.event_id == event_id).first()
    if existing_event and existing_event.processed:
        return {"status": "already_processed"}

    # 4. Handle payment.captured
    if event_type == "payment.captured":
        payment_entity = event_payload.get("payload", {}).get("payment", {}).get("entity", {})
        rzp_order_id = payment_entity.get("order_id")
        rzp_payment_id = payment_entity.get("id")

        if rzp_order_id:
            order = db.query(Order).filter(Order.razorpay_order_id == rzp_order_id).first()
            if order and order.status == "pending_payment":
                order.status = "paid"
                # Record payment if not already present
                existing_payment = db.query(Payment).filter(Payment.razorpay_payment_id == rzp_payment_id).first()
                if not existing_payment:
                    pay = Payment(
                        order_id=order.id,
                        razorpay_payment_id=rzp_payment_id,
                        razorpay_order_id=rzp_order_id,
                        status="captured",
                        amount_minor=payment_entity.get("amount", order.total_minor),
                        currency=payment_entity.get("currency", "INR"),
                        method=payment_entity.get("method"),
                    )
                    db.add(pay)

                # Inventory update
                for item in order.items:
                    if item.product_id:
                        p = db.query(Product).filter(Product.id == item.product_id).first()
                        if p:
                            p.stock_quantity = max(0, p.stock_quantity - item.quantity)

    # 5. Record processed event
    if not existing_event:
        p_event = PaymentEvent(
            event_id=event_id,
            event_type=event_type,
            payload=json.dumps(event_payload),
            processed=True,
        )
        db.add(p_event)
    else:
        existing_event.processed = True

    db.commit()
    return {"status": "success"}
