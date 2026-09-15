// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Header from "./Header";

const clipboardWriteText = vi.fn().mockResolvedValue(undefined);

vi.mock("wouter", () => ({
  Link: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => <a href={href} {...props}>{children}</a>,
  useLocation: () => ["/", vi.fn()],
}));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user: null, isAuthenticated: false, loading: false, logout: vi.fn() }) }));
vi.mock("@/lib/readerAuth", () => ({ getReaderLoginUrl: () => "/login" }));
vi.mock("@/lib/mediaUrl", () => ({ getMediaUrl: (url: string) => url }));
vi.mock("@/components/DonateButton", () => ({ default: () => <button type="button">Donate</button> }));

afterEach(() => {
  cleanup();
  clipboardWriteText.mockClear();
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: clipboardWriteText } });
});

describe("Header referral attribution", () => {
  it("exposes the stated offer and copies the XTZ2026 referral code", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: clipboardWriteText } });
    const { container } = render(<Header />);

    const referralLink = screen.getByRole("link", { name: /visit optimised marketing/i });
    fireEvent.focus(referralLink);
    expect(screen.getByText("Get 25% websites & Marketing")).toBeTruthy();
    expect(screen.getByText("XTZ2026")).toBeTruthy();

    const copyButton = container.querySelector<HTMLButtonElement>(".optimised-referral-copy");
    expect(copyButton).toBeTruthy();
    fireEvent.click(copyButton!);
    await waitFor(() => expect(clipboardWriteText).toHaveBeenCalledWith("XTZ2026"));
    expect(await screen.findByText("Copied")).toBeTruthy();
  });
});
