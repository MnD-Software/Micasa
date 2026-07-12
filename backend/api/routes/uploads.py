from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from backend.api.deps import require_role
from backend.core.config import get_settings
from backend.models.user import User

router = APIRouter(prefix="/uploads", tags=["Uploads"])

allowed_content_types = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
}
max_upload_bytes = 8 * 1024 * 1024


def upload_root() -> Path:
    root = Path(get_settings().upload_dir)
    root.mkdir(parents=True, exist_ok=True)
    return root


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    user: User = Depends(require_role("host", "admin"))
):
    extension = allowed_content_types.get(file.content_type or "")
    if not extension:
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, WEBP, or GIF image.")

    content = await file.read()
    if len(content) > max_upload_bytes:
        raise HTTPException(status_code=400, detail="Image must be 8MB or smaller.")

    filename = f"{uuid4().hex}{extension}"
    path = upload_root() / filename
    path.write_bytes(content)

    return {
        "filename": filename,
        "url": f"/api/backend/api/uploads/{filename}",
        "backend_url": f"/api/uploads/{filename}",
        "content_type": file.content_type,
        "size": len(content),
        "uploaded_by": user.id
    }


@router.get("/{filename}")
def get_upload(filename: str):
    safe_name = Path(filename).name
    path = upload_root() / safe_name
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="Upload not found")
    return FileResponse(path)
