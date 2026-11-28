import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { summarizeText } from "../services/api";
import SummarizePage from "./SummarizePage";

vi.mock("../services/api", () => ({ summarizeText: vi.fn() }));
const mockSummarize = vi.mocked(summarizeText);

const input = () => screen.getByRole("textbox", { name: "Texto a resumir" });
const output = () => screen.getByRole("textbox", { name: "Resumen del texto" });
const button = (name: string | RegExp) => screen.getByRole("button", { name });

describe("SummarizePage", () => {
  // Con llaves: si el hook devolviera el mock, Vitest lo ejecutaría como limpieza.
  beforeEach(() => {
    mockSummarize.mockReset();
  });

  it("deshabilita los controles con la entrada vacía", () => {
    render(<SummarizePage />);
    expect(screen.getByRole("slider")).toBeDisabled();
    expect(button("Resumir")).toBeDisabled();
    expect(button("Pegar")).toBeDisabled();
    expect(button("Borrar")).toBeDisabled();
  });

  it("resume con el largo elegido y muestra el resultado", async () => {
    mockSummarize.mockResolvedValue({ summary: "Resumen listo." });
    const user = userEvent.setup();
    render(<SummarizePage />);

    await user.type(input(), "Un texto largo");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "25" } });
    await user.click(button("Resumir"));

    expect(mockSummarize).toHaveBeenCalledWith({ text: "Un texto largo", max_words: 25 });
    expect(await screen.findByDisplayValue("Resumen listo.")).toBe(output());
  });

  it("copia el resumen al portapapeles con Pegar", async () => {
    mockSummarize.mockResolvedValue({ summary: "Resumen listo." });
    const user = userEvent.setup(); // instala un portapapeles simulado
    render(<SummarizePage />);

    await user.type(input(), "texto");
    await user.click(button("Resumir"));
    await screen.findByDisplayValue("Resumen listo.");
    await user.click(button("Pegar"));

    expect(await navigator.clipboard.readText()).toBe("Resumen listo.");
    expect(button("😄 Copiado")).toBeInTheDocument();
  });

  it("vuelve al placeholder si se vacía la entrada", async () => {
    mockSummarize.mockResolvedValue({ summary: "Resumen listo." });
    const user = userEvent.setup();
    render(<SummarizePage />);

    await user.type(input(), "texto");
    await user.click(button("Resumir"));
    await screen.findByDisplayValue("Resumen listo.");
    await user.clear(input());

    expect(output()).toHaveValue("");
  });

  it("Borrar limpia la entrada y el resumen", async () => {
    mockSummarize.mockResolvedValue({ summary: "Resumen listo." });
    const user = userEvent.setup();
    render(<SummarizePage />);

    await user.type(input(), "texto");
    await user.click(button("Resumir"));
    await screen.findByDisplayValue("Resumen listo.");
    await user.click(button("Borrar"));

    expect(input()).toHaveValue("");
    expect(output()).toHaveValue("");
  });

  it("bloquea la entrada mientras carga", async () => {
    mockSummarize.mockReturnValue(new Promise(() => {})); // nunca termina
    const user = userEvent.setup();
    render(<SummarizePage />);

    await user.type(input(), "texto");
    await user.click(button("Resumir"));

    expect(screen.getByText("Resumiendo…")).toBeInTheDocument();
    expect(input()).toBeDisabled();
    expect(button("Resumir")).toBeDisabled();
  });

  it("muestra el error, bloquea la entrada y al descartarlo limpia todo", async () => {
    mockSummarize.mockRejectedValue(new Error("fallo del servidor"));
    const user = userEvent.setup();
    render(<SummarizePage />);

    await user.type(input(), "texto");
    await user.click(button("Resumir"));

    expect(await screen.findByRole("alert")).toHaveTextContent("fallo del servidor");
    expect(input()).toBeDisabled();

    await user.click(button("Descartar error"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input()).toHaveValue("");
    expect(input()).toBeEnabled();
  });
});
