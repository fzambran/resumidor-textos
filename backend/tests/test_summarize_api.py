from fastapi.testclient import TestClient

from app.main import app
from app.services import summarizer

client = TestClient(app)


def test_health():
    assert client.get("/api/health").json() == {"status": "ok"}


def test_summarize_ok(monkeypatch):
    async def fake_summarize(text, length):
        return f"resumen {length}"

    monkeypatch.setattr(summarizer, "summarize", fake_summarize)
    response = client.post("/api/summarize", json={"text": "Hola mundo", "length": "corto"})
    assert response.status_code == 200
    assert response.json() == {"summary": "resumen corto"}


def test_summarize_rechaza_texto_vacio():
    response = client.post("/api/summarize", json={"text": ""})
    assert response.status_code == 422


def test_summarize_error_de_negocio(monkeypatch):
    async def failing(text, length):
        raise summarizer.SummarizerError("no se pudo")

    monkeypatch.setattr(summarizer, "summarize", failing)
    response = client.post("/api/summarize", json={"text": "Hola"})
    assert response.status_code == 422
    assert response.json()["detail"] == "no se pudo"
