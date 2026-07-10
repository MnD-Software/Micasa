from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from backend.models.property import Property


class PropertyRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, location: str | None = None, featured: bool | None = None) -> list[Property]:
        stmt = select(Property).options(selectinload(Property.images)).order_by(Property.created_at.desc())
        if location:
            stmt = stmt.where(Property.location.ilike(f"%{location}%"))
        if featured is not None:
            stmt = stmt.where(Property.featured == featured)
        return list(self.db.scalars(stmt))

    def get(self, property_id: int) -> Property | None:
        return self.db.get(Property, property_id)
