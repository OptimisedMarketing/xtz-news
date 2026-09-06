import { describe, expect, it } from "vitest";
import { MOBILE_SECTIONS, NAV_ITEMS } from "./Header";

describe("primary navigation", () => {
  it("keeps Home as the first desktop navigation destination", () => {
    expect(NAV_ITEMS[0]).toMatchObject({ label: "HOME", href: "/" });
  });

  it("includes Home in the mobile Read navigation section", () => {
    const readSection = MOBILE_SECTIONS.find((section) => section.label === "Read");
    expect(readSection?.items[0]).toMatchObject({ label: "Home", href: "/" });
  });
});
