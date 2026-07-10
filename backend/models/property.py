from sqlalchemy import Boolean, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.session import Base
from backend.models.base import TimestampMixin


class Property(Base, TimestampMixin):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str] = mapped_column(String(80), nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, default=1)
    bathrooms: Mapped[int] = mapped_column(Integer, default=1)
    guests: Mapped[int] = mapped_column(Integer, default=1)
    price_per_night: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    cleaning_fee: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    service_fee: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    location: Mapped[str] = mapped_column(String(180), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(40), default="draft")

    owner = relationship("User", back_populates="properties")
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="property", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="property", cascade="all, delete-orphan")


class PropertyImage(Base):
    __tablename__ = "property_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(800), nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    property = relationship("Property", back_populates="images")
