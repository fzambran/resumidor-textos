from app.utils.text import clean_text


def test_clean_text_normaliza_espacios():
    assert clean_text("  hola   mundo \r\n\n\n\nfin  ") == "hola mundo \n\nfin"
