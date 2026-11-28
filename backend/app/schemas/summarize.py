from pydantic import BaseModel, Field


class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500_000)
    max_words: int = Field(10, ge=1, le=100)


class SummarizeResponse(BaseModel):
    summary: str
