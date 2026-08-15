// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForYouEmptyState, TopicSelectionChip } from "./ForYouControls";

describe("For You reader-facing controls", () => {
  it("renders the signed-in no-matching-stories state as a polite status message", () => {
    render(<ForYouEmptyState />);
    expect(screen.getByRole("status").textContent).toContain("New stories from your followed topics will appear here");
  });

  it("exposes follow and unfollow states through an interactive, labelled topic chip", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const { rerender } = render(<TopicSelectionChip name="Tokenization" following={false} onToggle={onToggle} />);

    const follow = screen.getByRole("button", { name: "Follow Tokenization" });
    expect(follow.getAttribute("aria-pressed")).toBe("false");
    await user.click(follow);
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(<TopicSelectionChip name="Tokenization" following={true} onToggle={onToggle} />);
    const unfollow = screen.getByRole("button", { name: "Unfollow Tokenization" });
    expect(unfollow.getAttribute("aria-pressed")).toBe("true");
  });
});
