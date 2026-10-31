"""
Public Product Catalogue routes.
Provides paginated listings, category filtering, search, and detail lookup.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status, Response
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import or_, desc, asc
from app.db.session import get_db
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductResponse
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=PaginatedResponse[ProductResponse])
def list_products(
    response: Response,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = Query("featured", pattern="^(featured|price-asc|price-desc|newest)$"),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Product)
        .filter(Product.is_active == True)
        .options(selectinload(Product.images), joinedload(Product.category))
    )

    # Filter by category
    if category_slug and category_slug != "all":
        category = db.query(Category).filter(Category.slug == category_slug).first()
        if category:
            query = query.filter(Product.category_id == category.id)
        else:
            return PaginatedResponse(items=[], total=0, page=page, page_size=page_size, total_pages=0)

    # Search filter
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.description.ilike(search_filter),
                Product.sku.ilike(search_filter),
            )
        )

    # Sorting
    if sort == "price-asc":
        query = query.order_by(asc(Product.price_minor))
    elif sort == "price-desc":
        query = query.order_by(desc(Product.price_minor))
    elif sort == "newest":
        query = query.order_by(desc(Product.created_at))
    else:  # featured
        query = query.order_by(desc(Product.is_featured), desc(Product.created_at))

    total = query.count()
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    # Cache for 60s in browser, 300s in Vercel Edge CDN, revalidate in background
    response.headers["Cache-Control"] = "public, max-age=60, s-maxage=300, stale-while-revalidate=600"

    # Enrich product with category name/slug (zero extra DB round-trips via joinedload)
    results = []
    for p in products:
        cat = p.category
        p_data = ProductResponse(
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
        results.append(p_data)

    return PaginatedResponse(
        items=results,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, response: Response, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(selectinload(Product.images), joinedload(Product.category))
        .filter(Product.slug == slug, Product.is_active == True)
        .first()
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{slug}' not found.",
        )

    # Cache detail view
    response.headers["Cache-Control"] = "public, max-age=120, s-maxage=600, stale-while-revalidate=1200"

    cat = product.category
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
