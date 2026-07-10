from fastapi import APIRouter, Depends, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.message import Message
from backend.models.user import User
from backend.schemas.message import MessageCreate, MessageOut

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("", response_model=list[MessageOut])
def list_messages(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    stmt = (
        select(Message)
        .where(or_(Message.sender_id == user.id, Message.receiver_id == user.id))
        .order_by(Message.created_at.desc())
    )
    return list(db.scalars(stmt))


@router.post("", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(payload: MessageCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    message = Message(sender_id=user.id, **payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
