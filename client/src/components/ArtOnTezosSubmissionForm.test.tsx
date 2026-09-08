/** @vitest-environment jsdom */
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ArtOnTezosSubmissionForm, { ART_PROJECT_SUBMISSION_COPY } from "./ArtOnTezosSubmissionForm";

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock("@/lib/trpc", () => ({
  trpc: { artProjectSubmissions: { create: { useMutation: () => ({ mutate, isPending: false }) } } },
}));

afterEach(() => cleanup());

describe("Art on Tezos editorial submission form", () => {
  it("states that submissions are reviewed and does not imply automatic publication", () => {
    render(<ArtOnTezosSubmissionForm />);
    expect(screen.getByText(ART_PROJECT_SUBMISSION_COPY.reviewNote)).toBeTruthy();
  });

  it("sends a complete, consented artist submission to the reviewed submission API", () => {
    render(<ArtOnTezosSubmissionForm />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Ada Artist" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Project name"), { target: { value: "Ada Studio" } });
    fireEvent.change(screen.getByLabelText("Project website"), { target: { value: "https://ada.example" } });
    fireEvent.change(screen.getByLabelText("What should readers know?"), { target: { value: "A source-grounded Tezos art profile that gives readers an official starting point." } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Send for editorial review" }));
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ projectName: "Ada Studio", submitterType: "artist", agreedToReview: true }));
  });
});
