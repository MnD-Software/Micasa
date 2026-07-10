from datetime import date
from backend.models.property import Property


def calculate_booking_total(property: Property, check_in: date, check_out: date, coupon: str | None = None) -> float:
    nights = max(1, (check_out - check_in).days)
    subtotal = nights * float(property.price_per_night)
    discount = subtotal * 0.1 if coupon and coupon.upper() == "WELCOME10" else 0
    return round(subtotal + float(property.cleaning_fee) + float(property.service_fee) - discount, 2)
