from sqlalchemy import Boolean, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.session import Base
from backend.models.base import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))
    avatar: Mapped[str | None] = mapped_column(String(500))
    role: Mapped[str] = mapped_column(Enum("guest", "host", "admin", name="user_role"), default="guest")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    two_factor_enabled: Mapped[bool] = mapped_column(Boolean, default=False)

    properties = relationship("Property", back_populates="owner")
    bookings = relationship("Booking", back_populates="guest")
