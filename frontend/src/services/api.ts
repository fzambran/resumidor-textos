import type { SummarizeRequest, SummarizeResponse } from "../types/summary";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function summarizeText(request: SummarizeRequest): Promise<SummarizeResponse> {
  const response = await fetch(`${API_BASE}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = typeof body?.detail === "string" ? body.detail : "No se pudo generar el resumen.";
    throw new Error(detail);
  }

  return response.json();
}
