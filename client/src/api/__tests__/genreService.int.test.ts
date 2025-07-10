import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ok, err } from "neverthrow";
import { GenreService } from "@/api/genreService";
import type { IHttpClient } from "@/api/httpClient";
import type { AppError } from "@/api/errors";

function mockHttp(): IHttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as IHttpClient;
}

describe("GenreService integration with IHttpClient", () => {
  let http: IHttpClient;
  let svc: GenreService;

  beforeEach(() => {
    http = mockHttp();
    svc = new GenreService(http);
    vi.clearAllMocks();
  });

  it("list() hits /api/genres and returns data", async () => {
    (http.get as Mock).mockResolvedValue(ok<string[], AppError>(["rock"]));

    const res = await svc.list();

    expect(http.get).toHaveBeenCalledWith("/api/genres", {
      params: undefined,
    });
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap()).toEqual(["rock"]);
  });

  it("bubbles up IHttpClient errors unchanged", async () => {
    const apiErr: AppError = { type: "Network", message: "boom" };
    (http.get as Mock).mockResolvedValue(err(apiErr));

    const res = await svc.list();

    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr()).toBe(apiErr);
  });
});
