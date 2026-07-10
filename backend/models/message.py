from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from backend.db.session import Base
from backend.models.base import TimestampMixin


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"))
    message: Mapped[str] = mapped_column(Text, nullable=False)
