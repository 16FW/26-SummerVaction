from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Post
from app.schemas import PostCreate, PostUpdate


def get_posts(db: Session, skip: int = 0, limit: int = 20) -> list[Post]:
    stmt = select(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).all())


def get_post(db: Session, post_id: int) -> Post | None:
    return db.get(Post, post_id)


def create_post(db: Session, data: PostCreate) -> Post:
    post = Post(**data.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_post(db: Session, post: Post, data: PostUpdate) -> Post:
    # exclude_unset: 클라이언트가 보낸 필드만 반영 (부분 수정)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


def delete_post(db: Session, post: Post) -> None:
    db.delete(post)
    db.commit()
