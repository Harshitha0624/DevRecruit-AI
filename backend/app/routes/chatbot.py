from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.auth.dependencies import get_current_user
from app.models.user import User

from app.services.chatbot_service import (
    generate_chatbot_response
)


router = APIRouter(
    prefix="/api/chatbot",
    tags=["Chatbot"]
)


class ChatbotRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000
    )


@router.post("")
def chatbot(
    data: ChatbotRequest,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in {"candidate", "recruiter"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates and recruiters can use the chatbot."
        )

    return generate_chatbot_response(data.message)