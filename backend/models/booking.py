from datetime import date
from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.db.session import Base
from backend.models.base import TimestampMixin


class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    guest_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    booking_status: Mapped[str] = mapped_column(String(40), default="pending")
    payment_status: Mapped[str] = mapped_column(String(40), default="unpaid")

    guest = relationship("User", back_populates="bookings")
    property = relationship("Property", back_populates="bookings")
