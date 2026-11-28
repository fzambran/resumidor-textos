import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SummaryOutput from "./SummaryOutput";

const base = { summary: "", loading: false, error: null, onDismissError: () => {} };

describe("SummaryOutput", () => {
  it("muestra el placeholder sin resumen", () => {
    render(<SummaryOutput {...base} />);
    const output = screen.getByRole("textbox", { name: "Resumen del texto" });
    expect(output).toHaveValue("");
    expect(output).toHaveAttribute("placeholder", "Ver resumen aquí");
    expect(output).toHaveAttribute("readonly");
  });

  it("muestra el resumen", () => {
    render(<SummaryOutput {...base} summary="Un resumen corto." />);
    expect(screen.getByRole("textbox")).toHaveValue("Un resumen corto.");
  });

  it("muestra el overlay de carga", () => {
    render(<SummaryOutput {...base} loading />);
    expect(screen.getByText("Resumiendo…")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("muestra el error y permite descartarlo", async () => {
    const onDismissError = vi.fn();
    render(<SummaryOutput {...base} error="fallo" onDismissError={onDismissError} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Hubo un error al procesar el texto: fallo",
    );
    await userEvent.click(screen.getByRole("button", { name: "Descartar error" }));
    expect(onDismissError).toHaveBeenCalledOnce();
  });
});
