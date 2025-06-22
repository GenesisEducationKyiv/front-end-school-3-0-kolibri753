import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ok, err } from "neverthrow";
import { ArtistService } from "@/api/artistService";
import type { IHttpClient } from "@/api/httpClient";
import type { ListParams } from "@/types";
import type { AppError } from "@/api/errors";

function mockHttp(): IHttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as IHttpClient;
}

describe("ArtistService integration with IHttpClient", () => {
  let http: IHttpClient;
  let svc: ArtistService;

  beforeEach(() => {
    http = mockHttp();
    svc = new ArtistService(http);
    vi.clearAllMocks();
  });

  it("list() forwards params & hits /api/artists", async () => {
    const params: ListParams = { page: 1, custom: "x" };
    (http.get as Mock).mockResolvedValue(ok<string[], AppError>(["Foo"]));

    await svc.list(params);

    expect(http.get).toHaveBeenCalledWith("/api/artists", { params });
  });

  it("list() no params `{ params: undefined }`", async () => {
    (http.get as Mock).mockResolvedValue(ok<string[], AppError>([]));

    await svc.list();

    expect(http.get).toHaveBeenCalledWith("/api/artists", {
      params: undefined,
    });
  });

  it("propagates underlying IHttpClient error untouched", async () => {
    const boom: AppError = { type: "Network", message: "offline" };
    (http.get as Mock).mockResolvedValue(err(boom));

    const res = await svc.list();

    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr()).toBe(boom);
  });
});
