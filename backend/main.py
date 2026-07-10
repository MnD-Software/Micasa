from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.router import api_router
from backend.core.config import get_settings
from backend.db.session import Base, engine
from backend.middleware.security_headers import SecurityHeadersMiddleware
from backend import models  # noqa: F401

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Production-ready property rental marketplace API."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.add_middleware(SecurityHeadersMiddleware)
app.include_router(api_router, prefix=settings.api_prefix)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "service": "stayforge-api"}
