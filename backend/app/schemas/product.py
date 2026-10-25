"""
Product and Category Pydantic schemas.
All monetary fields are strictly typed as integer paise.
"""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ProductImageResponse(BaseModel):
    id: str
    url: str
    alt_text: str
    sort_order: int
    is_primary: bool

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    category_id: str
    category_name: Optional[str] = None
    category_slug: Optional[str] = None
    description: str
    specifications: Optional[str] = None
    price_minor: int
    compare_at_price_minor: Optional[int] = None
    stock_quantity: int
    is_active: bool
    is_featured: bool
    sku: str
    weight_grams: Optional[int] = None
    images: List[ProductImageResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    slug: Optional[str] = None
    category_id: str
    description: str
    specifications: Optional[str] = None
    price_minor: int = Field(gt=0)
    compare_at_price_minor: Optional[int] = None
    stock_quantity: int = Field(ge=0, default=0)
    is_active: bool = True
    is_featured: bool = False
    sku: str = Field(min_length=2, max_length=50)
    weight_grams: Optional[int] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    price_minor: Optional[int] = Field(default=None, gt=0)
    compare_at_price_minor: Optional[int] = None
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    sku: Optional[str] = None
    weight_grams: Optional[int] = None
