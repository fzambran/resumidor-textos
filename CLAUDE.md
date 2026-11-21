# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Aplicación web que resume textos con la API de Claude. Monorepo con dos partes independientes:
- `backend/`: Python + FastAPI, dependencias gestionadas con `uv`.
- `frontend/`: React + TypeScript + Vite, con npm.

## Comandos

Backend (ejecutar desde `backend/`):
```bash
uv sync                                         # instalar dependencias (incluye grupo dev)
uv run uvicorn app.main:app --reload --port 8000  # servidor de desarrollo
uv run pytest                                   # todos los tests
uv run pytest tests/test_summarize_api.py::test_summarize_ok  # un test
uv run ruff check .                             # lint
```

Frontend (ejecutar desde `frontend/`):
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc -b) + build
npm test         # vitest (todos)
npx vitest run src/services/api.test.ts  # un archivo de test
```

Credenciales: copiar `.env.example` a `.env` en la raíz y definir `ANTHROPIC_API_KEY` (o usar un perfil de `ant auth login`). `backend/app/config.py` lee `../.env` y `.env`.

## Arquitectura

Flujo de una petición: `TextInput` → hook `useSummarize` → `services/api.ts` → `POST /api/summarize` → `api/routes/summarize.py` → `services/summarizer.py` → API de Claude.

- **Capas del backend:** las rutas (`app/api/routes/`) solo validan y traducen errores a HTTP; la lógica y la llamada a Claude viven en `app/services/summarizer.py`. Los errores de negocio se lanzan como `SummarizerError` (→ 422); los errores del SDK `anthropic` se mapean a 429/500/502 en la ruta.
- **Contrato API compartido:** `backend/app/schemas/summarize.py` (Pydantic) y `frontend/src/types/summary.ts` deben mantenerse sincronizados a mano. Ojo: los valores de `length` están en español (`"corto" | "medio" | "largo"`).
- **Proxy en desarrollo:** `vite.config.ts` redirige `/api` a `localhost:8000`, así que el frontend usa rutas relativas. En producción se puede fijar `VITE_API_URL`. CORS del backend se configura con `CORS_ORIGINS`.
- **La credencial de Claude solo vive en el backend**; el frontend nunca llama a Claude directamente.

## Llamada a Claude (`services/summarizer.py`)

- Usa `AsyncAnthropic` con `beta.messages.stream(...)` + `get_final_message()` para no tener timeouts con textos largos.
- Modelo por defecto `claude-opus-5-5` y `effort` `low`, configurables con `CLAUDE_MODEL` y `SUMMARY_EFFORT`. En este modelo el thinking no se puede desactivar (`thinking: disabled` o `budget_tokens` dan 400); la profundidad se controla solo con `effort`.
- Tiene activado el fallback del lado del servidor (`betas=["server-side-fallback-2026-07-01"]`, `fallbacks="default"`); si aun así `stop_reason == "refusal"`, se lanza `SummarizerError`.
- No se puede prellenar el mensaje del asistente (prefill): da 400. Para controlar el formato, usar el system prompt.
- Los tests nunca llaman a la API real: hacen `monkeypatch` de `summarizer.summarize`.
