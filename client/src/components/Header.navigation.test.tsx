import { describe, expect, it } from "vitest";
import { ADVERTISE_HEADER_LINK, MOBILE_SECTIONS, NAV_ITEMS, OPTIMISED_MARKETING_HEADER_LINK, OPTIMISED_MARKETING_REFERRAL } from "./Header";

describe("primary navigation", () => {
  it("keeps Home as the first desktop navigation destination", () => {
    expect(NAV_ITEMS[0]).toMatchObject({ label: "HOME", href: "/" });
  });

  it("includes Home in the mobile Read navigation section", () => {
    const readSection = MOBILE_SECTIONS.find((section) => section.label === "Read");
    expect(readSection?.items[0]).toMatchObject({ label: "Home", href: "/" });
  });

  it("keeps Community Services discoverable in desktop and mobile navigation", () => {
    const readSection = MOBILE_SECTIONS.find((section) => section.label === "Read");

    expect(NAV_ITEMS).toEqual(expect.arrayContaining([{ label: "COMMUNITY SERVICES", href: "/community-services" }]));
    expect(readSection?.items).toEqual(expect.arrayContaining([{ label: "Community Services", href: "/community-services" }]));
  });

  it("promotes Events to the first-view desktop and mobile Read navigation", () => {
    const readSection = MOBILE_SECTIONS.find((section) => section.label === "Read");

    expect(NAV_ITEMS).toEqual(expect.arrayContaining([{ label: "EVENTS", href: "/events" }]));
    expect(readSection?.items).toEqual(expect.arrayContaining([{ label: "Events", href: "/events" }]));
    expect(MOBILE_SECTIONS.find((section) => section.label === "Explore")?.items).not.toEqual(expect.arrayContaining([{ label: "Tezos Events", href: "/events" }]));
  });

  it("keeps the Etherlink hub discoverable in desktop and mobile Explore navigation", () => {
    const desktopExplore = NAV_ITEMS.find((item) => item.label === "EXPLORE");
    const mobileExplore = MOBILE_SECTIONS.find((section) => section.label === "Explore");

    expect(desktopExplore?.children).toEqual(expect.arrayContaining([{ label: "ETHERLINK HUB", href: "/etherlink" }]));
    expect(mobileExplore?.items).toEqual(expect.arrayContaining([{ label: "Etherlink Hub", href: "/etherlink" }]));
  });

  it("keeps the Tezos wallet starter discoverable in desktop and mobile Explore navigation", () => {
    const desktopExplore = NAV_ITEMS.find((item) => item.label === "EXPLORE");
    const mobileExplore = MOBILE_SECTIONS.find((section) => section.label === "Explore");

    expect(desktopExplore?.children).toEqual(expect.arrayContaining([{ label: "TEZOS WALLET STARTER", href: "/wallets" }]));
    expect(mobileExplore?.items).toEqual(expect.arrayContaining([{ label: "Tezos Wallet Starter", href: "/wallets" }]));
  });

  it("keeps the Art on Tezos hub discoverable in desktop and mobile Explore navigation", () => {
    const desktopExplore = NAV_ITEMS.find((item) => item.label === "EXPLORE");
    const mobileExplore = MOBILE_SECTIONS.find((section) => section.label === "Explore");

    expect(desktopExplore?.children).toEqual(expect.arrayContaining([{ label: "ART ON TEZOS HUB", href: "/art-on-tezos" }]));
    expect(mobileExplore?.items).toEqual(expect.arrayContaining([{ label: "Art on Tezos Hub", href: "/art-on-tezos" }]));
  });

  it("keeps the Optimised Marketing utility destination configured for the shared header", () => {
    expect(OPTIMISED_MARKETING_HEADER_LINK).toEqual({
      label: "Optimised Marketing",
      href: "https://optimised.marketing",
    });
    expect(OPTIMISED_MARKETING_REFERRAL).toEqual({
      message: "Get 25% websites & Marketing",
      code: "XTZ2026",
    });
  });

  it("keeps the advertising destination configured for the shared header", () => {
    expect(ADVERTISE_HEADER_LINK).toEqual({
      label: "ADVERTISE WITH US",
      href: "/advertise",
    });
  });
});
