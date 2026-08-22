// @vitest-environment jsdom
import React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mutationState = vi.hoisted(() => ({ options: null as any }));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    newsletter: {
      subscriberCount: { useQuery: () => ({ data: 1026 }) },
      subscribe: {
        useMutation: (options: any) => {
          mutationState.options = options;
          return { isPending: false, mutate: vi.fn() };
        },
      },
    },
  },
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import MidArticleNewsletter from "./MidArticleNewsletter";

describe("MidArticleNewsletter", () => {
  it("shows the Resend-aware confirmation and preference guidance after a successful subscription", () => {
    render(<MidArticleNewsletter />);
    act(() => mutationState.options.onSuccess({ success: true, welcomeEmailRequested: true }));
    expect(screen.getByRole("heading", { name: "You’re subscribed." })).toBeTruthy();
    expect(screen.getByText(/Resend welcome email is on its way/i)).toBeTruthy();
    expect(screen.getByText(/manage preferences or unsubscribe/i)).toBeTruthy();
  });
});
