from typing import Literal

from pydantic import BaseModel, Field

SummaryLength = Literal["corto", "medio", "largo"]


class SummarizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500_000)
    length: SummaryLength = "medio"


class SummarizeResponse(BaseModel):
    summary: str
