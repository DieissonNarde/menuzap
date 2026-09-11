// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from ".";

describe("Button", () => {
  it("encaminha eventos ao botão do MUI", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Gerar PDF</Button>);

    await user.click(screen.getByRole("button", { name: "Gerar PDF" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
