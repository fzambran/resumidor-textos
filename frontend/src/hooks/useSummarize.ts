import { useState } from "react";
import { summarizeText } from "../services/api";
import type { SummaryLength } from "../types/summary";

export function useSummarize() {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function summarize(text: string, length: SummaryLength) {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await summarizeText({ text, length });
      setSummary(result.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return { summary, error, loading, summarize };
}
