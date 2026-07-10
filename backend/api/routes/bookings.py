from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.booking import Booking
from backend.models.property import Property
from backend.models.user import User
from backend.schemas.booking import BookingCreate, BookingOut, BookingUpdate
from backend.services.pricing import calculate_booking_total

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=list[BookingOut])
def list_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role == "admin":
        return list(db.scalars(select(Booking).order_by(Booking.created_at.desc())))
    return list(db.scalars(select(Booking).where(Booking.guest_id == user.id).order_by(Booking.created_at.desc())))


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    property = db.get(Property, payload.property_id)
    if not property or property.status not in {"active", "published"}:
        raise HTTPException(status_code=404, detail="Property unavailable")
    total = calculate_booking_total(property, payload.check_in, payload.check_out, payload.coupon)
    booking = Booking(
        guest_id=user.id,
        property_id=payload.property_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        total_amount=total
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.put("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.guest_id != user.id and user.role not in {"host", "admin"}:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(booking, key, value)
    db.commit()
    db.refresh(booking)
    return booking
