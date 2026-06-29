from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import posts


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 앱 기동 시 테이블 자동 생성 — 이미 있으면 무시(checkfirst)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Board API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)


@app.get("/health")
def health():
    """로드밸런서 헬스체크용 — 200 응답만 확인"""
    return {"status": "ok"}
