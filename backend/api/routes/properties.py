from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.api.deps import get_current_user, require_role
from backend.db.session import get_db
from backend.models.property import Property, PropertyImage
from backend.models.user import User
from backend.repositories.property_repository import PropertyRepository
from backend.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.get("", response_model=list[PropertyOut])
def list_properties(
    location: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
    db: Session = Depends(get_db)
):
    return PropertyRepository(db).list(location=location, featured=featured)


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(property_id: int, db: Session = Depends(get_db)):
    property = PropertyRepository(db).get(property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property


@router.post("", response_model=PropertyOut, status_code=status.HTTP_201_CREATED)
def create_property(
    payload: PropertyCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("host", "admin"))
):
    property = Property(owner_id=user.id, **payload.model_dump(exclude={"image_urls"}))
    db.add(property)
    db.flush()
    for order, url in enumerate(payload.image_urls):
        db.add(PropertyImage(property_id=property.id, image_url=url, display_order=order))
    db.commit()
    db.refresh(property)
    return property


@router.put("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: int,
    payload: PropertyUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    property = db.get(Property, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    if property.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(property, key, value)
    db.commit()
    db.refresh(property)
    return property


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    property = db.get(Property, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    if property.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db.delete(property)
    db.commit()
    return None
