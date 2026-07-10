from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.property import Property
from backend.models.review import Review
from backend.models.user import User
from backend.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("", response_model=list[ReviewOut])
def list_reviews(property_id: int | None = None, db: Session = Depends(get_db)):
    stmt = select(Review).order_by(Review.created_at.desc())
    if property_id:
        stmt = stmt.where(Review.property_id == property_id)
    return list(db.scalars(stmt))


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not db.get(Property, payload.property_id):
        raise HTTPException(status_code=404, detail="Property not found")
    review = Review(user_id=user.id, **payload.model_dump())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
