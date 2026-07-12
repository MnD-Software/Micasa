import json
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from backend.api.deps import require_role
from backend.db.session import get_db
from backend.models.site_setting import SiteSetting
from backend.models.user import User

router = APIRouter(prefix="/site-settings", tags=["Site settings"])

DEFAULT_PUBLIC_SETTINGS = {
    "nav_badges": {
        "experiences": False,
        "services": False
    }
}


class PublicSettings(BaseModel):
    nav_badges: dict[str, bool] = Field(default_factory=lambda: DEFAULT_PUBLIC_SETTINGS["nav_badges"].copy())


def _read_public_settings(db: Session) -> dict[str, Any]:
    record = db.get(SiteSetting, "public")
    if not record:
        return DEFAULT_PUBLIC_SETTINGS
    try:
        data = json.loads(record.value)
    except json.JSONDecodeError:
        return DEFAULT_PUBLIC_SETTINGS
    return {
        "nav_badges": {
            **DEFAULT_PUBLIC_SETTINGS["nav_badges"],
            **data.get("nav_badges", {})
        }
    }


@router.get("/public", response_model=PublicSettings)
def get_public_settings(db: Session = Depends(get_db)):
    return _read_public_settings(db)


@router.put("/public", response_model=PublicSettings)
def update_public_settings(
    payload: PublicSettings,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin"))
):
    settings = {
        "nav_badges": {
            "experiences": bool(payload.nav_badges.get("experiences")),
            "services": bool(payload.nav_badges.get("services"))
        }
    }
    record = db.get(SiteSetting, "public")
    if record:
        record.value = json.dumps(settings)
    else:
        db.add(SiteSetting(key="public", value=json.dumps(settings)))
    db.commit()
    return settings
