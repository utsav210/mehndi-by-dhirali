"""
Contact Us and Newsletter subscription routes.
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from app.schemas.common import MessageResponse

router = APIRouter(tags=["Support"])


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(default="", max_length=20)
    subject: str = Field(default="", max_length=150)
    message: str = Field(min_length=5, max_length=2000)


class NewsletterRequest(BaseModel):
    email: EmailStr


@router.post("/contact", response_model=MessageResponse)
def submit_contact_form(data: ContactRequest):
    # In production, dispatches email to support team
    return {
        "message": f"Thank you {data.name}. We have received your inquiry and will respond within 24 hours.",
        "success": True,
    }


@router.post("/newsletter/subscribe", response_model=MessageResponse)
def subscribe_newsletter(data: NewsletterRequest):
    return {
        "message": f"Successfully subscribed {data.email} to Mehndi By Dhirali updates.",
        "success": True,
    }
