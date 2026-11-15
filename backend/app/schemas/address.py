"""
Address Pydantic schemas for customer saved addresses and checkout addresses.
"""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class AddressBase(BaseModel):
    label: str = Field(default="Home", max_length=50)
    full_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=10, max_length=20)
    address_line_1: str = Field(min_length=5, max_length=255)
    address_line_2: Optional[str] = Field(default=None, max_length=255)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    postal_code: str = Field(min_length=4, max_length=20)
    country: str = Field(default="India", max_length=100)
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    label: Optional[str] = Field(default=None, max_length=50)
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    phone: Optional[str] = Field(default=None, min_length=10, max_length=20)
    address_line_1: Optional[str] = Field(default=None, min_length=5, max_length=255)
    address_line_2: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, min_length=2, max_length=100)
    state: Optional[str] = Field(default=None, min_length=2, max_length=100)
    postal_code: Optional[str] = Field(default=None, min_length=4, max_length=20)
    country: Optional[str] = Field(default="India", max_length=100)
    is_default: Optional[bool] = None


class AddressResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    label: str = "Home"
    full_name: str
    phone: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
