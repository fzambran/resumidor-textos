// Debe coincidir con backend/app/schemas/summarize.py
export const MIN_WORDS = 1;
export const MAX_WORDS = 100;
export const DEFAULT_WORDS = 10;

export interface SummarizeRequest {
  text: string;
  max_words: number;
}

export interface SummarizeResponse {
  summary: string;
}
