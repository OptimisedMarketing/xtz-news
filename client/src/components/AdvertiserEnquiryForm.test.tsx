// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AdvertiserEnquiryForm, { ADVERTISING_PLACEMENT_OPTIONS } from "./AdvertiserEnquiryForm";

const mutate = vi.fn();
vi.mock("@/lib/trpc", () => ({ trpc: { advertiserEnquiries: { create: { useMutation: () => ({ mutate, isPending: false }) } } } }));
afterEach(() => { cleanup(); mutate.mockClear(); });

describe("AdvertiserEnquiryForm", () => {
  it("exposes the supported advertising placement options", () => {
    expect(ADVERTISING_PLACEMENT_OPTIONS.map(([value]) => value)).toEqual(expect.arrayContaining(["homepage_banner", "article_banner", "newsletter", "sponsored_article", "directory_feature"]));
  });

  it("requires contact consent before sending a private enquiry", async () => {
    render(<AdvertiserEnquiryForm />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Alex Partner" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText("Company or project"), { target: { value: "Tezos Example" } });
    fireEvent.change(screen.getByLabelText("Campaign details"), { target: { value: "We would like a clearly labelled homepage campaign for our Tezos product launch." } });
    fireEvent.click(screen.getByRole("button", { name: /send advertising enquiry/i }));
    expect(await screen.findByText(/Please confirm that the team may contact you/i)).toBeTruthy();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits a selected placement only after consent", async () => {
    render(<AdvertiserEnquiryForm />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Alex Partner" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alex@example.com" } });
    fireEvent.change(screen.getByLabelText("Company or project"), { target: { value: "Tezos Example" } });
    fireEvent.change(screen.getByLabelText("Placement of interest"), { target: { value: "article_banner" } });
    fireEvent.change(screen.getByLabelText("Campaign details"), { target: { value: "We would like a clearly labelled article companion campaign for our Tezos product launch." } });
    fireEvent.click(screen.getByLabelText(/I agree that XTZ.News may contact me/i));
    fireEvent.click(screen.getByRole("button", { name: /send advertising enquiry/i }));
    await waitFor(() => expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ agreedToContact: true, placementInterest: "article_banner", contactEmail: "alex@example.com" })));
  });
});
