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
          return { isPending: false, isError: false, mutate: vi.fn() };
        },
      },
    },
  },
}));

import { NewsletterCTABanner } from "./Home";

describe("NewsletterCTABanner", () => {
  it("uses the same Resend-aware confirmation copy after homepage subscription success", () => {
    render(<NewsletterCTABanner />);
    act(() => mutationState.options.onSuccess({ success: true, welcomeEmailRequested: true }));
    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText(/Resend welcome email is on its way/i)).toBeTruthy();
    expect(screen.getByText(/manage preferences or unsubscribe/i)).toBeTruthy();
  });
});
