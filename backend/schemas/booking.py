from datetime import date
from pydantic import BaseModel, Field, model_validator


class BookingCreate(BaseModel):
    property_id: int
    check_in: date
    check_out: date
    coupon: str | None = None

    @model_validator(mode="after")
    def check_dates(self):
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        return self


class BookingUpdate(BaseModel):
    booking_status: str | None = None
    payment_status: str | None = None


class BookingOut(BaseModel):
    id: int
    guest_id: int
    property_id: int
    check_in: date
    check_out: date
    total_amount: float
    booking_status: str
    payment_status: str

    model_config = {"from_attributes": True}
