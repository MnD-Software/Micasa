from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from backend.api.router import api_router
from backend.core.config import get_settings
from backend.core.security import hash_password
from backend.db.session import Base, SessionLocal, engine
from backend.middleware.security_headers import SecurityHeadersMiddleware
from backend.models.user import User
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
    if settings.admin_initial_email and settings.admin_initial_password:
        with SessionLocal() as db:
            existing = db.scalar(select(User).where(User.email == settings.admin_initial_email.lower()))
            if not existing:
                db.add(User(
                    full_name=settings.admin_initial_name,
                    email=settings.admin_initial_email.lower(),
                    hashed_password=hash_password(settings.admin_initial_password),
                    role="admin",
                    verified=True
                ))
                db.commit()


@app.get("/health")
def health():
    return {"status": "ok", "service": "stayforge-api"}
