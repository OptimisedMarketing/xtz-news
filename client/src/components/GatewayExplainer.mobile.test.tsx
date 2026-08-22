// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import GatewayExplainer from "./GatewayExplainer";

const originalWidth = window.innerWidth;

afterEach(() => {
  Object.defineProperty(window, "innerWidth", { value: originalWidth, configurable: true });
});

describe("Gateway explainer at a mobile viewport", () => {
  it("keeps the Michelson-to-EVM control usable at 390px", async () => {
    Object.defineProperty(window, "innerWidth", { value: 390, configurable: true });
    const user = userEvent.setup();
    render(<GatewayExplainer />);

    const control = screen.getByRole("button", { name: "Michelson → EVM" });
    await user.click(control);

    expect(control.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/Tezos account or Michelson contract/)).toBeTruthy();
  });
});
