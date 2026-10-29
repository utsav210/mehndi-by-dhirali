"""
Order Pydantic schemas.
Calculations are always server-authoritative.
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(gt=0, le=100)


class AddressCreate(BaseModel):
    label: str = "Home"
    full_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=10, max_length=20)
    address_line_1: str = Field(min_length=5, max_length=255)
    address_line_2: Optional[str] = None
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    postal_code: str = Field(min_length=4, max_length=20)
    country: str = "India"


class OrderCreateRequest(BaseModel):
    items: List[OrderItemCreate] = Field(min_length=1)
    shipping_address: AddressCreate
    email: EmailStr
    phone: str
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: str
    product_id: Optional[str] = None
    product_name: str
    product_image: str
    sku: str
    quantity: int
    unit_price_minor: int
    total_price_minor: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    order_number: str
    status: str
    subtotal_minor: int
    shipping_minor: int
    discount_minor: int
    total_minor: int
    currency: str
    razorpay_order_id: Optional[str] = None
    items: List[OrderItemResponse] = []
    created_at: datetime
    # Fulfillment & Tracking fields
    tracking_number: Optional[str] = None
    courier_partner: Optional[str] = None
    tracking_url: Optional[str] = None
    estimated_delivery: Optional[str] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    tracking_notes: Optional[str] = None
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None

    class Config:
        from_attributes = True


class OrderTrackingUpdate(BaseModel):
    status: Optional[str] = None  # e.g. paid, processing, shipped, in_transit, out_for_delivery, delivered, cancelled
    tracking_number: Optional[str] = None
    courier_partner: Optional[str] = None
    tracking_url: Optional[str] = None
    estimated_delivery: Optional[str] = None
    tracking_notes: Optional[str] = None


class TrackingTimelineStep(BaseModel):
    step_key: str
    title: str
    description: str
    timestamp: Optional[datetime] = None
    is_completed: bool
    is_current: bool


class OrderTrackingResponse(BaseModel):
    order_number: str
    status: str
    status_label: str
    tracking_number: Optional[str] = None
    courier_partner: Optional[str] = None
    tracking_url: Optional[str] = None
    estimated_delivery: Optional[str] = None
    created_at: datetime
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    tracking_notes: Optional[str] = None
    timeline: List[TrackingTimelineStep] = []
    items: List[OrderItemResponse] = []
    recipient_name: Optional[str] = None
    destination_city: Optional[str] = None
    destination_state: Optional[str] = None
    total_minor: int
    currency: str = "INR"
