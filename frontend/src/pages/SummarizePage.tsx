import { useState } from "react";
import LengthSlider from "../components/LengthSlider";
import SummaryOutput from "../components/SummaryOutput";
import TextInput from "../components/TextInput";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { useSummarize } from "../hooks/useSummarize";
import { DEFAULT_WORDS } from "../types/summary";

const COPY_LABELS = { idle: "Pegar", copied: "😄 Copiado", failed: "😔 Falló" } as const;

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [maxWords, setMaxWords] = useState(DEFAULT_WORDS);
  const { summary, error, loading, summarize, reset } = useSummarize();
  const { status: copyStatus, copy } = useCopyToClipboard();

  const hasText = text.trim() !== "";
  // Con el cuadro de entrada vacío se vuelve a mostrar "Ver resumen aquí".
  const visibleSummary = hasText ? summary : "";
  const busy = loading || error !== null;

  function clear() {
    setText("");
    reset();
  }

  return (
    <main className="page">
      <h1 className="title">Resumidor</h1>

      <TextInput value={text} disabled={busy} onChange={setText} />

      <div className="row">
        <LengthSlider value={maxWords} disabled={!hasText || busy} onChange={setMaxWords} />
        <button
          type="button"
          className="button button-primary"
          disabled={!hasText || busy}
          onClick={() => summarize(text, maxWords)}
        >
          Resumir
        </button>
      </div>

      <SummaryOutput summary={visibleSummary} loading={loading} error={error} onDismissError={clear} />

      <div className="row">
        <button
          type="button"
          className={`button button-secondary ${copyStatus}`}
          disabled={!visibleSummary || busy}
          onClick={() => copy(visibleSummary)}
        >
          {COPY_LABELS[copyStatus]}
        </button>
        <button
          type="button"
          className="button button-danger"
          disabled={!hasText || busy}
          onClick={clear}
        >
          Borrar
        </button>
      </div>
    </main>
  );
}
