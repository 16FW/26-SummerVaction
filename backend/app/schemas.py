from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PostCreate(BaseModel):
    title: str
    author: str
    content: str


class PostUpdate(BaseModel):
    # 모든 필드 Optional — PATCH 방식 부분 수정 지원
    title: str | None = None
    author: str | None = None
    content: str | None = None


class PostResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    content: str
    created_at: datetime
    updated_at: datetime
