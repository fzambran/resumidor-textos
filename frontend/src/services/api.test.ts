import { afterEach, describe, expect, it, vi } from "vitest";
import { summarizeText } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("summarizeText", () => {
  it("devuelve el resumen cuando la respuesta es correcta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ summary: "ok" }), { status: 200 })),
    );
    await expect(summarizeText({ text: "hola", length: "corto" })).resolves.toEqual({ summary: "ok" });
  });

  it("propaga el detalle de error del backend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail: "fallo" }), { status: 422 })),
    );
    await expect(summarizeText({ text: "hola", length: "corto" })).rejects.toThrow("fallo");
  });
});
