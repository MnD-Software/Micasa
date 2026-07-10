from pydantic import BaseModel, Field


class PropertyImageOut(BaseModel):
    id: int
    image_url: str
    display_order: int

    model_config = {"from_attributes": True}


class PropertyBase(BaseModel):
    title: str = Field(min_length=4, max_length=180)
    slug: str = Field(min_length=4, max_length=220)
    description: str = Field(min_length=20)
    property_type: str
    bedrooms: int = Field(ge=0)
    bathrooms: int = Field(ge=0)
    guests: int = Field(ge=1)
    price_per_night: float = Field(gt=0)
    cleaning_fee: float = Field(ge=0, default=0)
    service_fee: float = Field(ge=0, default=0)
    location: str
    latitude: float | None = None
    longitude: float | None = None
    featured: bool = False
    status: str = "draft"


class PropertyCreate(PropertyBase):
    image_urls: list[str] = []


class PropertyUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    price_per_night: float | None = None
    featured: bool | None = None


class PropertyOut(PropertyBase):
    id: int
    owner_id: int
    images: list[PropertyImageOut] = []

    model_config = {"from_attributes": True}
