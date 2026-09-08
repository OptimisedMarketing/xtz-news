/** @vitest-environment jsdom */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import AdminArtProjectSubmissions from "./AdminArtProjectSubmissions";

const { mutate, invalidate, useAuthMock } = vi.hoisted(() => ({ mutate: vi.fn(), invalidate: vi.fn(), useAuthMock: vi.fn() }));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: useAuthMock }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ artProjectSubmissions: { list: { invalidate } } }),
    artProjectSubmissions: {
      list: { useQuery: () => ({ data: [{ id: 8, projectName: "Signal Garden", submitterName: "A. Artist", submitterEmail: "artist@example.com", submitterType: "artist", projectType: "exhibition", websiteUrl: "https://example.com", description: "A sufficiently detailed Tezos art-project description for the editorial review workspace.", agreedToReview: true, status: "pending", adminNotes: null, createdAt: new Date("2026-09-01") }], isLoading: false, isError: false }) },
      updateStatus: { useMutation: () => ({ mutate, mutateAsync: vi.fn(), isPending: false }) },
    },
  },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("Admin Art on Tezos submissions", () => {
  it("blocks non-administrators before querying the review queue", () => {
    useAuthMock.mockReturnValue({ user: { role: "user" }, loading: false });
    render(<AdminArtProjectSubmissions />);
    expect(screen.getByText("Access denied")).toBeTruthy();
  });

  it("lets an administrator review the submitted project and records the selected status", () => {
    useAuthMock.mockReturnValue({ user: { role: "admin" }, loading: false });
    render(<AdminArtProjectSubmissions />);
    expect(screen.getByText("Signal Garden")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(mutate).toHaveBeenCalledWith({ id: 8, status: "approved", notes: undefined });
  });
});
