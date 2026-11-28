import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TextInput from "./TextInput";

describe("TextInput", () => {
  it("muestra el placeholder y recibe el foco al montarse", () => {
    render(<TextInput value="" disabled={false} onChange={() => {}} />);
    const input = screen.getByRole("textbox", { name: "Texto a resumir" });
    expect(input).toHaveAttribute("placeholder", "Pegar el texto aquí");
    expect(input).toHaveFocus();
  });

  it("notifica cada cambio del texto", async () => {
    const onChange = vi.fn();
    render(<TextInput value="" disabled={false} onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("se deshabilita", () => {
    render(<TextInput value="hola" disabled onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
