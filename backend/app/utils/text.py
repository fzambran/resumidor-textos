import re


def clean_text(text: str) -> str:
    """Normaliza espacios y saltos de línea sin alterar el contenido."""
    text = text.replace("\r\n", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
