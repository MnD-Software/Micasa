from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from backend.db.session import Base
from backend.models.base import TimestampMixin


class Wishlist(Base, TimestampMixin):
    __tablename__ = "wishlist"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    read_status: Mapped[bool] = mapped_column(Boolean, default=False)
