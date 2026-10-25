"""
Routes package initialization and aggregation.
"""
from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.products import router as products_router
from app.api.routes.categories import router as categories_router
from app.api.routes.orders import router as orders_router
from app.api.routes.payments import router as payments_router
from app.api.routes.wishlist import router as wishlist_router
from app.api.routes.admin import router as admin_router
from app.api.routes.contact import router as contact_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(products_router)
api_router.include_router(categories_router)
api_router.include_router(orders_router)
api_router.include_router(payments_router)
api_router.include_router(wishlist_router)
api_router.include_router(admin_router)
api_router.include_router(contact_router)

__all__ = ["api_router"]
