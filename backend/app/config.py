from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración leída de variables de entorno (o del .env en la raíz del repo)."""

    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    # pydantic-settings no exporta el .env a os.environ, así que la clave se pasa
    # explícitamente al cliente. Si falta, el SDK usa el entorno o `ant auth login`.
    anthropic_api_key: SecretStr | None = None

    claude_model: str = "claude-opus-5-5"
    # low | medium | high | xhigh | max. Resumir es una tarea sencilla: "low" basta.
    summary_effort: str = "low"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
