// Debe coincidir con backend/app/schemas/summarize.py
export type SummaryLength = "corto" | "medio" | "largo";

export interface SummarizeRequest {
  text: string;
  length: SummaryLength;
}

export interface SummarizeResponse {
  summary: string;
}
