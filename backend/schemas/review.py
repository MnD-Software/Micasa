from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    property_id: int
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=3, max_length=2000)


class ReviewOut(BaseModel):
    id: int
    property_id: int
    user_id: int
    rating: int
    comment: str

    model_config = {"from_attributes": True}
