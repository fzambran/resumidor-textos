from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración leída de variables de entorno (o del .env en la raíz del repo)."""

    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    claude_model: str = "claude-opus-5-5"
    # low | medium | high | xhigh | max. Resumir es una tarea sencilla: "low" basta.
    summary_effort: str = "low"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
