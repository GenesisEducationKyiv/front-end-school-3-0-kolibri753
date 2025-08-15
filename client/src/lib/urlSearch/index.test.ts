import { describe, it, expect, vi } from "vitest";
import { buildSearchParams } from "./index";

vi.mock("@/constants", () => ({
  TRACK_QUERY_DEFAULTS: {
    page: 1,
    limit: 10,
    artist: "",
    sort: "title",
    order: "asc",
    genre: "",
    search: "",
  },
}));

describe("buildSearchParams", () => {
  it("excludes default values and empty strings", () => {
    const params = {
      page: 1,
      limit: 10 as const,
      artist: "",
      sort: "title" as const,
      order: "asc" as const,
      genre: "",
      search: "",
    };

    const result = buildSearchParams(params);

    expect(result.toString()).toBe("");
  });

  it("includes non-default values", () => {
    const params = {
      page: 2,
      limit: 20 as const,
      artist: "Beatles",
      sort: "artist" as const,
      order: "desc" as const,
      genre: "rock",
      search: "help",
    };

    const result = buildSearchParams(params);

    expect(result.get("page")).toBe("2");
    expect(result.get("limit")).toBe("20");
    expect(result.get("artist")).toBe("Beatles");
    expect(result.get("sort")).toBe("artist");
    expect(result.get("order")).toBe("desc");
    expect(result.get("genre")).toBe("rock");
    expect(result.get("search")).toBe("help");
  });

  it("converts values to strings", () => {
    const params = {
      page: 5,
      limit: 5 as const,
      artist: "",
      sort: "title" as const,
      order: "asc" as const,
      genre: "",
      search: "",
    };

    const result = buildSearchParams(params);

    expect(result.get("page")).toBe("5");
    expect(result.get("limit")).toBe("5");
  });
});
