"""
Payment verification and webhook schemas.
"""
from typing import Optional, Dict, Any
from pydantic import BaseModel


class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class PaymentVerifyResponse(BaseModel):
    success: bool
    order_id: str
    order_number: str
    payment_status: str
    message: str


class WebhookPayload(BaseModel):
    event: str
    payload: Dict[str, Any]
