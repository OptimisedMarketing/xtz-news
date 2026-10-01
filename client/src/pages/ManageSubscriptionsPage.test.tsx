// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mutationState = vi.hoisted(() => ({
  options: null as any,
  mutate: vi.fn(),
  preferences: { email: "reader@example.test", status: "active", govAlerts: false, eventsOnly: false },
}));

vi.mock("wouter", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <a {...props}>{children}</a>,
  useSearch: () => "?token=preferences-token",
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    newsletter: {
      getPreferences: {
        useQuery: () => ({ data: mutationState.preferences, isLoading: false, error: null }),
      },
      updatePreferences: {
        useMutation: (options: any) => {
          mutationState.options = options;
          return { isPending: false, mutate: mutationState.mutate };
        },
      },
    },
  },
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import ManageSubscriptionsPage from "./ManageSubscriptionsPage";

describe("ManageSubscriptionsPage", () => {
  it("allows a reader to opt into the events-only monthly digest", () => {
    render(<ManageSubscriptionsPage />);

    const eventsOnly = screen.getByRole("checkbox", { name: /events-only monthly digest/i }) as HTMLInputElement;
    expect(eventsOnly.checked).toBe(false);
    fireEvent.click(eventsOnly);
    expect(eventsOnly.checked).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /save preferences/i }));
    expect(mutationState.mutate).toHaveBeenCalledWith({
      token: "preferences-token",
      govAlerts: false,
      eventsOnly: true,
      status: "active",
    });
  });
});
