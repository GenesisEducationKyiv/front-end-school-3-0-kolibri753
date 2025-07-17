import { describe, it, expect, vi } from "vitest";
import { parseSearchParams } from "./index";
import { R } from "@mobily/ts-belt";
import { ZodError } from "zod";

vi.mock("@/schemas", () => ({
  trackQuerySchema: {
    safeParse: vi.fn(),
  },
}));

import { trackQuerySchema } from "@/schemas";

describe("parseSearchParams", () => {
  it("returns success result for valid params", () => {
    const mockData = {
      page: 1,
      limit: 10 as const,
      artist: "",
      sort: "title" as const,
      order: "asc" as const,
      genre: "",
      search: "test",
    };
    vi.mocked(trackQuerySchema.safeParse).mockReturnValue({
      success: true,
      data: mockData,
    });

    const params = new URLSearchParams("search=test&page=1");
    const result = parseSearchParams(params);

    expect(result).toEqual(R.Ok(mockData));
  });

  it("returns error result for invalid params", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["search"],
        message: "Invalid query format",
      },
    ]);

    vi.mocked(trackQuerySchema.safeParse).mockReturnValue({
      success: false,
      error: zodError,
    });

    const params = new URLSearchParams("invalid=param");
    const result = parseSearchParams(params);

    expect(result).toEqual(R.Error(zodError.message));
  });
});
