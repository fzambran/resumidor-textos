import anthropic

from app.config import settings
from app.utils.text import clean_text

SYSTEM_PROMPT = (
    "Eres un asistente que resume textos. Responde solo con el resumen, en el mismo "
    "idioma del texto original, sin introducciones ni comentarios adicionales."
)



class SummarizerError(Exception):
    """Error de negocio al generar un resumen (se traduce a HTTP en la capa de rutas)."""


# El cliente toma la credencial del entorno (ANTHROPIC_API_KEY o `ant auth login`).
_client: anthropic.AsyncAnthropic | None = None


def get_client() -> anthropic.AsyncAnthropic:
    global _client
    if _client is None:
        _client = anthropic.AsyncAnthropic()
    return _client


async def summarize(text: str, max_words: int = 10) -> str:
    prompt = (
        f"Resume el texto en {max_words} palabras como máximo.\n\n"
        f"<texto>\n{clean_text(text)}\n</texto>"
    )

    # Streaming evita timeouts HTTP con textos largos; fallbacks="default" reintenta
    # en otro modelo si el principal rechaza la petición por política de seguridad.
    async with get_client().beta.messages.stream(
        model=settings.claude_model,
        max_tokens=64000,
        system=SYSTEM_PROMPT,
        output_config={"effort": settings.summary_effort},
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        message = await stream.get_final_message()

    if message.stop_reason == "refusal":
        raise SummarizerError("El modelo no pudo resumir este texto.")

    summary = "".join(block.text for block in message.content if block.type == "text").strip()
    if not summary:
        raise SummarizerError("El modelo devolvió un resumen vacío.")
    return summary
