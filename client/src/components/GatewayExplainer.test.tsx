// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import GatewayExplainer from "./GatewayExplainer";

describe("Gateway explainer", () => {
  it("switches its accessible flow explanation when a reader selects Michelson to EVM", async () => {
    const user = userEvent.setup();
    render(<GatewayExplainer />);

    expect(screen.getByText(/EVM account or contract/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Michelson → EVM" }));

    expect(screen.getByText(/Michelson native gateway/)).toBeTruthy();
    expect(screen.getByText("KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Michelson → EVM" }).getAttribute("aria-pressed")).toBe("true");
  });
});
