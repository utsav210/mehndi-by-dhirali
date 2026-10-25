"""
Admin Management routes.
Strictly restricted to users with role='admin'.
Hiding buttons on frontend is not security — backend authorization enforced for all operations.
"""
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.user import User
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.models.order import Order
from app.models.audit import AuditLog
from app.core.deps import get_admin_user
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate, CategoryResponse, CategoryCreate
from app.schemas.order import OrderResponse
from app.schemas.common import MessageResponse, PaginatedResponse
from app.integrations.storage.client import storage_client

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def get_dashboard_stats(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    total_orders = db.query(Order).count()
    paid_orders = db.query(Order).filter(Order.status == "paid").count()
    total_revenue_minor = sum(
        o.total_minor for o in db.query(Order).filter(Order.status.in_(["paid", "processing", "shipped", "delivered"])).all()
    )
    total_products = db.query(Product).count()
    total_categories = db.query(Category).count()

    return {
        "total_revenue_minor": total_revenue_minor,
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "total_products": total_products,
        "total_categories": total_categories,
    }


# ── Product CRUD ─────────────────────────────────────────────────────────────

@router.get("/products", response_model=List[ProductResponse])
def admin_list_products(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    products = db.query(Product).order_by(desc(Product.created_at)).all()
    results = []
    for p in products:
        cat = db.query(Category).filter(Category.id == p.category_id).first()
        results.append(
            ProductResponse(
                id=p.id,
                name=p.name,
                slug=p.slug,
                category_id=p.category_id,
                category_name=cat.name if cat else "General",
                category_slug=cat.slug if cat else "general",
                description=p.description,
                specifications=p.specifications,
                price_minor=p.price_minor,
                compare_at_price_minor=p.compare_at_price_minor,
                stock_quantity=p.stock_quantity,
                is_active=p.is_active,
                is_featured=p.is_featured,
                sku=p.sku,
                weight_grams=p.weight_grams,
                images=p.images,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )
    return results


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_product(
    data: ProductCreate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    # Ensure SKU uniqueness
    existing_sku = db.query(Product).filter(Product.sku == data.sku).first()
    if existing_sku:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"SKU '{data.sku}' already exists.")

    slug = data.slug or data.name.lower().replace(" ", "-")

    product = Product(
        name=data.name,
        slug=slug,
        category_id=data.category_id,
        description=data.description,
        specifications=data.specifications,
        price_minor=data.price_minor,
        compare_at_price_minor=data.compare_at_price_minor,
        stock_quantity=data.stock_quantity,
        is_active=data.is_active,
        is_featured=data.is_featured,
        sku=data.sku,
        weight_grams=data.weight_grams,
    )
    db.add(product)

    # Audit log
    audit = AuditLog(
        user_id=admin.id,
        action="product.create",
        resource_type="product",
        resource_id=product.id,
        details=f"Created product '{data.name}' with SKU '{data.sku}'",
    )
    db.add(audit)

    db.commit()
    db.refresh(product)

    cat = db.query(Category).filter(Category.id == product.category_id).first()
    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        category_id=product.category_id,
        category_name=cat.name if cat else "General",
        category_slug=cat.slug if cat else "general",
        description=product.description,
        specifications=product.specifications,
        price_minor=product.price_minor,
        compare_at_price_minor=product.compare_at_price_minor,
        stock_quantity=product.stock_quantity,
        is_active=product.is_active,
        is_featured=product.is_featured,
        sku=product.sku,
        weight_grams=product.weight_grams,
        images=[],
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


@router.put("/products/{id}", response_model=ProductResponse)
def admin_update_product(
    id: str,
    data: ProductUpdate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

    update_dict = data.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(product, field, val)

    audit = AuditLog(
        user_id=admin.id,
        action="product.update",
        resource_type="product",
        resource_id=product.id,
        details=f"Updated fields: {list(update_dict.keys())}",
    )
    db.add(audit)

    db.commit()
    db.refresh(product)

    cat = db.query(Category).filter(Category.id == product.category_id).first()
    return ProductResponse(
        id=product.id,
        name=product.name,
        slug=product.slug,
        category_id=product.category_id,
        category_name=cat.name if cat else "General",
        category_slug=cat.slug if cat else "general",
        description=product.description,
        specifications=product.specifications,
        price_minor=product.price_minor,
        compare_at_price_minor=product.compare_at_price_minor,
        stock_quantity=product.stock_quantity,
        is_active=product.is_active,
        is_featured=product.is_featured,
        sku=product.sku,
        weight_grams=product.weight_grams,
        images=product.images,
        created_at=product.created_at,
        updated_at=product.updated_at,
    )


# ── Categories ───────────────────────────────────────────────────────────────

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def admin_create_category(
    data: CategoryCreate,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    slug = data.slug or data.name.lower().replace(" ", "-")
    cat = Category(
        name=data.name,
        slug=slug,
        description=data.description,
        image_url=data.image_url,
        sort_order=data.sort_order,
        is_active=data.is_active,
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


# ── Orders ──────────────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[OrderResponse])
def admin_list_orders(
    status_filter: Optional[str] = None,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(Order).order_by(desc(Order.created_at))
    if status_filter:
        query = query.filter(Order.status == status_filter)
    return query.all()


@router.put("/orders/{id}/status", response_model=OrderResponse)
def admin_update_order_status(
    id: str,
    new_status: str = Query(..., pattern="^(pending_payment|paid|processing|shipped|delivered|cancelled|refunded)$"),
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found.")

    old_status = order.status
    order.status = new_status

    audit = AuditLog(
        user_id=admin.id,
        action="order.status_update",
        resource_type="order",
        resource_id=order.id,
        details=f"Status transitioned from '{old_status}' to '{new_status}'",
    )
    db.add(audit)

    db.commit()
    db.refresh(order)
    return order
