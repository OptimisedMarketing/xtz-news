// @vitest-environment jsdom

import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BakerComparisonChecklist } from "./TezosStakingStarterPage";

describe("BakerComparisonChecklist", () => {
  it("tracks reviewed criteria without scoring or ranking bakers", () => {
    render(<BakerComparisonChecklist />);
    expect(screen.getByText("0 / 6")).toBeTruthy();
    expect(screen.getByText(/does not score, rank, recommend/i)).toBeTruthy();

    fireEvent.click(screen.getByLabelText(/accepts delegation/i));
    fireEvent.click(screen.getByLabelText(/has current capacity/i));
    expect(screen.getByText("2 / 6")).toBeTruthy();
    expect((screen.getByRole("button", { name: "Clear checklist" }) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Clear checklist" }));
    expect(screen.getByText("0 / 6")).toBeTruthy();
  });
});
