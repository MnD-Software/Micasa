from pydantic import BaseModel, Field


class MessageCreate(BaseModel):
    receiver_id: int
    booking_id: int | None = None
    message: str = Field(min_length=1, max_length=4000)


class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    booking_id: int | None
    message: str

    model_config = {"from_attributes": True}
