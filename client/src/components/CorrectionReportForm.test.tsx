// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CorrectionReportForm from "./CorrectionReportForm";

const mutate = vi.fn();
vi.mock("@/lib/trpc", () => ({ trpc: { correctionReports: { create: { useMutation: () => ({ mutate, isPending: false }) } } } }));
afterEach(() => { cleanup(); mutate.mockClear(); });

describe("CorrectionReportForm", () => {
  it("requires explicit editorial-review consent before submitting a private correction report", async () => {
    render(<CorrectionReportForm />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Careful Reader" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } });
    fireEvent.change(screen.getByLabelText("Article URL"), { target: { value: "https://xtz.news/example" } });
    fireEvent.change(screen.getByLabelText("What should be corrected?"), { target: { value: "Please verify the stated date against the official source." } });
    fireEvent.click(screen.getByRole("button", { name: /send correction report/i }));
    expect(await screen.findByText(/Please confirm the review statement/i)).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits only after explicit consent", async () => {
    render(<CorrectionReportForm />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Careful Reader" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } });
    fireEvent.change(screen.getByLabelText("Article URL"), { target: { value: "https://xtz.news/example" } });
    fireEvent.change(screen.getByLabelText("What should be corrected?"), { target: { value: "Please verify the stated date against the official source." } });
    fireEvent.click(screen.getByLabelText(/I confirm this is a good-faith correction report/i));
    fireEvent.click(screen.getByRole("button", { name: /send correction report/i }));
    await waitFor(() => expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ agreedToReview: true, reporterEmail: "reader@example.com" })));
  });
});
