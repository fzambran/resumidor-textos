interface Props {
  summary: string;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
}

export default function SummaryOutput({ summary, loading, error, onDismissError }: Props) {
  return (
    <section className="summary-output">
      <textarea
        className="text-area summary-area"
        value={summary}
        readOnly
        placeholder="Ver resumen aquí"
        aria-label="Resumen del texto"
      />
      {loading && (
        <div className="overlay" aria-live="polite">
          <div className="spinner" />
          <p className="overlay-message">Resumiendo…</p>
        </div>
      )}
      {error && (
        <div className="overlay" role="alert">
          <p className="overlay-message">Hubo un error al procesar el texto: {error}</p>
          <button type="button" className="button button-secondary" onClick={onDismissError}>
            Descartar error
          </button>
        </div>
      )}
    </section>
  );
}
