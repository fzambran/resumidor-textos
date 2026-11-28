import { useState } from "react";
import { summarizeText } from "../services/api";

export function useSummarize() {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function summarize(text: string, maxWords: number) {
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeText({ text, max_words: maxWords });
      setSummary(result.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSummary("");
    setError(null);
  }

  return { summary, error, loading, summarize, reset };
}
