from fastapi import APIRouter
from backend.api.routes import ai, auth, bookings, messages, properties, reviews, site_settings

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(properties.router)
api_router.include_router(bookings.router)
api_router.include_router(reviews.router)
api_router.include_router(messages.router)
api_router.include_router(ai.router)
api_router.include_router(site_settings.router)
