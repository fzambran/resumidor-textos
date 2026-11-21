interface Props {
  summary: string | null;
  error: string | null;
}

export default function SummaryView({ summary, error }: Props) {
  if (error) return <p className="error">{error}</p>;
  if (!summary) return null;
  return (
    <section className="summary">
      <h2>Resumen</h2>
      <p>{summary}</p>
    </section>
  );
}
