import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LengthSlider from "./LengthSlider";

describe("LengthSlider", () => {
  it("muestra el valor actual y el rango 1-100", () => {
    render(<LengthSlider value={25} disabled={false} onChange={() => {}} />);
    const slider = screen.getByRole("slider", { name: "Largo del resumen 25 palabras" });
    expect(slider).toHaveValue("25");
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "100");
  });

  it("usa el singular con una palabra", () => {
    render(<LengthSlider value={1} disabled={false} onChange={() => {}} />);
    expect(screen.getByText("Largo del resumen 1 palabra")).toBeInTheDocument();
  });

  it("notifica el nuevo valor como número", () => {
    const onChange = vi.fn();
    render(<LengthSlider value={10} disabled={false} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "42" } });
    expect(onChange).toHaveBeenCalledWith(42);
  });

  it("se deshabilita", () => {
    render(<LengthSlider value={10} disabled onChange={() => {}} />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
