import { describe, expect, it } from "vitest";
import { editorialAuthors, getEditorialAuthor, getEditorialAuthorFromPath } from "./editorialAuthors";

describe("editorial author profiles", () => {
  it("contains only the declared Lee Evans and Rossa Browne editorial details", () => {
    expect(editorialAuthors.map((author) => author.name)).toEqual(["Lee Evans", "Rossa Browne"]);
    expect(getEditorialAuthor("lee-evans")).toMatchObject({ jobTitle: "Writer", location: "United Kingdom", websiteUrl: "https://optimised.marketing" });
    expect(getEditorialAuthor("rossa-browne")).toMatchObject({ jobTitle: "Writer", location: "Ireland", initials: "RB" });
    expect(getEditorialAuthorFromPath("/authors/rossa-browne")?.name).toBe("Rossa Browne");
  });
});
