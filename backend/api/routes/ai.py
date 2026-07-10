from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.property import Property
from backend.repositories.property_repository import PropertyRepository
from backend.services.recommendations import RecommendationEngine

router = APIRouter(prefix="/ai", tags=["AI-ready marketplace intelligence"])


@router.get("/properties/{property_id}/similar")
def similar_properties(property_id: int, db: Session = Depends(get_db)):
    source = db.get(Property, property_id)
    if not source:
        raise HTTPException(status_code=404, detail="Property not found")
    candidates = PropertyRepository(db).list()
    return RecommendationEngine().similar_properties(source, candidates)


@router.get("/properties/{property_id}/score")
def property_score(property_id: int, db: Session = Depends(get_db)):
    property = db.get(Property, property_id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"property_id": property_id, "score": RecommendationEngine().performance_score(property)}
