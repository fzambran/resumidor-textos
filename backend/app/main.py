from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import summarize
from app.config import settings

app = FastAPI(title="Resumidor de textos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(summarize.router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
