import { useEffect, useRef, useState } from "react";

const FEEDBACK_DISPLAY_MS = 3000;

export type CopyStatus = "idle" | "copied" | "failed";

export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), FEEDBACK_DISPLAY_MS);
  }

  return { status, copy };
}
