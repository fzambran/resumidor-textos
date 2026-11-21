import anthropic
from fastapi import APIRouter, HTTPException

from app.schemas.summarize import SummarizeRequest, SummarizeResponse
from app.services import summarizer

router = APIRouter(prefix="/api", tags=["summarize"])


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest) -> SummarizeResponse:
    try:
        summary = await summarizer.summarize(request.text, request.length)
    except summarizer.SummarizerError as e:
        raise HTTPException(status_code=422, detail=str(e)) from e
    except anthropic.RateLimitError as e:
        raise HTTPException(status_code=429, detail="Demasiadas solicitudes. Intenta más tarde.") from e
    except anthropic.AuthenticationError as e:
        raise HTTPException(status_code=500, detail="Credencial de Claude inválida o ausente.") from e
    except (anthropic.APIStatusError, anthropic.APIConnectionError) as e:
        raise HTTPException(status_code=502, detail="Error al contactar el servicio de resumen.") from e
    return SummarizeResponse(summary=summary)
