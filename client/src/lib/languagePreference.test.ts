// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { clearPreferredLocale, getPreferredLocale, savePreferredLocale } from "./languagePreference";

afterEach(() => clearPreferredLocale());

describe("language preference", () => {
  it("stores a reader-selected supported locale without forcing navigation", () => {
    savePreferredLocale("zh");
    expect(getPreferredLocale()).toBe("zh");
  });

  it("ignores malformed stored locale values", () => {
    window.localStorage.setItem("xtz_preferred_locale", "not-a-locale");
    expect(getPreferredLocale()).toBeNull();
  });
});
