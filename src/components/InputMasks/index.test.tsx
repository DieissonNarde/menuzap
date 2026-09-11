// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputCpf, InputPhone } from ".";

describe("InputMasks", () => {
  it("formata CPF sem depender de APIs removidas do ReactDOM", async () => {
    const user = userEvent.setup();
    render(<InputCpf />);

    const input = screen.getByRole("textbox", { name: "CPF" });
    await user.type(input, "12345678901");

    expect(input).toHaveValue("123.456.789-01");
  });

  it("formata telefone celular", async () => {
    const user = userEvent.setup();
    render(<InputPhone />);

    const input = screen.getByRole("textbox", { name: "Celular" });
    await user.type(input, "69999999999");

    expect(input).toHaveValue("(69) 9 9999-9999");
  });
});
