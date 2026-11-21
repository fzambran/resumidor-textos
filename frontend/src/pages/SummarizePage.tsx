import TextInput from "../components/TextInput";
import SummaryView from "../components/SummaryView";
import { useSummarize } from "../hooks/useSummarize";

export default function SummarizePage() {
  const { summary, error, loading, summarize } = useSummarize();

  return (
    <main className="page">
      <h1>Resumidor de textos</h1>
      <TextInput loading={loading} onSubmit={summarize} />
      <SummaryView summary={summary} error={error} />
    </main>
  );
}
