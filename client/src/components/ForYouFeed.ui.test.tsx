// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  preferenceData: {
    followedCategories: [{ id: 1, name: "Etherlink", slug: "etherlink" }],
    posts: [] as Array<never>,
  },
  toggle: vi.fn(),
  invalidate: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true, loading: false }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ preferences: { followedCategories: { invalidate: mocks.invalidate }, forYou: { invalidate: mocks.invalidate } } }),
    categories: {
      all: {
        useQuery: () => ({
          data: [
            { id: 1, name: "Etherlink", slug: "etherlink", postCount: 9 },
            { id: 2, name: "Tokenization", slug: "tokenization", postCount: 7 },
            { id: 3, name: "Museums", slug: "museums", postCount: 2 },
          ],
        }),
      },
    },
    preferences: {
      forYou: { useQuery: () => ({ data: mocks.preferenceData, isLoading: false }) },
      toggleCategory: { useMutation: () => ({ mutate: mocks.toggle, isPending: false }) },
    },
  },
}));
vi.mock("wouter", () => ({ Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a> }));

import ForYouFeed from "./ForYouFeed";

describe("ForYouFeed signed-in reader journey", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    mocks.preferenceData = { followedCategories: [{ id: 1, name: "Etherlink", slug: "etherlink" }], posts: [] };
    mocks.toggle.mockReset();
  });

  it("renders the signed-in no-matching-stories status while retaining topic management", async () => {
    const user = userEvent.setup();
    render(<ForYouFeed />);

    expect(screen.getByRole("status").textContent).toContain("New stories from your followed topics will appear here");
    await user.click(screen.getByText(/Manage crypto topics/));
    expect(screen.getByRole("button", { name: "Unfollow Etherlink" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("lets the reader select and deselect an expanded topic in the real manager", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ForYouFeed />);

    await user.click(screen.getByText(/Manage crypto topics/));
    await user.click(screen.getByRole("button", { name: "Follow Tokenization" }));
    expect(mocks.toggle).toHaveBeenCalledWith({ categoryId: 2, following: true });

    mocks.preferenceData = {
      followedCategories: [
        { id: 1, name: "Etherlink", slug: "etherlink" },
        { id: 2, name: "Tokenization", slug: "tokenization" },
      ],
      posts: [],
    };
    rerender(<ForYouFeed />);
    await user.click(screen.getByRole("button", { name: "Unfollow Tokenization" }));
    expect(mocks.toggle).toHaveBeenLastCalledWith({ categoryId: 2, following: false });
  });
});
