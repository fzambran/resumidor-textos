import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copia el texto y vuelve a idle a los 3 segundos", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    const { result } = renderHook(() => useCopyToClipboard());

    await act(() => result.current.copy("hola"));
    expect(writeText).toHaveBeenCalledWith("hola");
    expect(result.current.status).toBe("copied");

    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.status).toBe("idle");
  });

  it("marca failed si el portapapeles rechaza la escritura", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denegado")));
    const { result } = renderHook(() => useCopyToClipboard());

    await act(() => result.current.copy("hola"));
    expect(result.current.status).toBe("failed");
  });
});
