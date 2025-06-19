import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ok, err } from "neverthrow";
import { TrackService } from "@/api/trackService";
import type { IHttpClient } from "@/api/httpClient";
import type { Track, Meta } from "@/types";
import type { AppError } from "@/api/errors";
import type { TrackFormData, TrackQueryInput } from "@/schemas";

const sampleTrack: Track = {
  id: "1",
  slug: "t-1",
  title: "Foo",
  artist: "Bar",
  genres: [],
  createdAt: "",
};

function mockHttp(): IHttpClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as IHttpClient;
}
describe("TrackService integration with IHttpClient", () => {
  let http: IHttpClient;
  let svc: TrackService;

  beforeEach(() => {
    http = mockHttp();
    svc = new TrackService(http);
    vi.clearAllMocks();
  });

  it("list() hits /api/tracks and returns an empty list", async () => {
    (http.get as Mock).mockResolvedValue(ok<Track[], AppError>([]));

    await svc.list();

    expect(http.get).toHaveBeenCalledWith("/api/tracks", { params: undefined });
  });

  it("getById() hits /api/tracks/:id and returns a track", async () => {
    (http.get as Mock).mockResolvedValue(ok(sampleTrack));

    await svc.getById("123");

    expect(http.get).toHaveBeenCalledWith("/api/tracks/123");
  });

  it("create() posts body to /api/tracks and returns the created track", async () => {
    const dto: TrackFormData = {
      title: "New",
      artist: "X",
      genres: ["rock"],
      album: "",
      coverImage: "",
    };
    (http.post as Mock).mockResolvedValue(ok(sampleTrack));

    await svc.create(dto);

    expect(http.post).toHaveBeenCalledWith("/api/tracks", dto);
  });

  it("update() puts body to /api/tracks/:id and returns the updated track", async () => {
    const dto: TrackFormData = {
      title: "Tokyo Nite",
      artist: "Senza Cri",
      genres: ["pop"],
      album: "",
      coverImage: "",
    };
    (http.put as Mock).mockResolvedValue(ok(sampleTrack));

    await svc.update("1", dto);

    expect(http.put).toHaveBeenCalledWith("/api/tracks/1", dto);
  });

  it("delete() hits /api/tracks/:id and resolves with void", async () => {
    (http.delete as Mock).mockResolvedValue(ok<void, AppError>(undefined));

    await svc.delete("2");

    expect(http.delete).toHaveBeenCalledWith("/api/tracks/2");
  });

  it("fetchTracks() uses schema defaults when opts omitted", async () => {
    (http.get as Mock).mockResolvedValue(
      ok({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } })
    );

    await svc.fetchTracks();

    expect(http.get).toHaveBeenCalledWith("/api/tracks", {
      params: {
        page: 1,
        limit: 10,
        sort: "title",
        order: "asc",
        genre: "",
        artist: "",
        search: "",
      },
      signal: undefined,
    });
  });

  it("fetchTracks() passes parsed params & signal", async () => {
    const meta: Meta = { total: 0, page: 2, limit: 5, totalPages: 0 };
    (http.get as Mock).mockResolvedValue(ok({ data: [], meta }));

    const ctrl = new AbortController();
    const good: TrackQueryInput = { page: 2, limit: 5 };

    await svc.fetchTracks(good, ctrl.signal);

    expect(http.get).toHaveBeenCalledWith("/api/tracks", {
      params: {
        page: 2,
        limit: 5,
        sort: "title",
        order: "asc",
        genre: "",
        artist: "",
        search: "",
      },
      signal: ctrl.signal,
    });
  });

  it("getBySlug() hits /api/tracks/:slug and returns a track", async () => {
    (http.get as Mock).mockResolvedValue(ok(sampleTrack));

    await svc.getBySlug("some-slug");

    expect(http.get).toHaveBeenCalledWith("/api/tracks/some-slug");
  });

  it("bubbles up IHttpClient errors unchanged", async () => {
    const netErr: AppError = { type: "Network", message: "offline" };
    (http.get as Mock).mockResolvedValue(err(netErr));

    const res = await svc.getById("fail");

    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr()).toBe(netErr);
  });

  it("deleteTrackFile() succeeds - 200", async () => {
    (http.delete as Mock).mockResolvedValue(ok(sampleTrack));

    const res = await svc.deleteTrackFile("1");

    expect(http.delete).toHaveBeenCalledWith("/api/tracks/1/file");
    expect(res.isOk()).toBe(true);
  });

  it("deleteTrackFile() - 404 fallback to GET", async () => {
    (http.delete as Mock).mockResolvedValue(
      err({ type: "NotFound", resource: "tracks", message: "n/a" })
    );
    (http.get as Mock).mockResolvedValue(ok(sampleTrack));

    const res = await svc.deleteTrackFile("1");

    expect(http.delete).toHaveBeenCalledWith("/api/tracks/1/file");
    expect(http.get).toHaveBeenCalledWith("/api/tracks/1");
    expect(res.isOk()).toBe(true);
  });

  it("uploadTrackFile() posts FormData with multipart header", async () => {
    (http.post as Mock).mockResolvedValue(ok(sampleTrack));

    const fakeFile = new File(["dummy"], "track.mp3", { type: "audio/mpeg" });
    await svc.uploadTrackFile("1", fakeFile);

    const [url, body, cfg] = (http.post as Mock).mock.calls[0];

    expect(url).toBe("/api/tracks/1/upload");
    expect(body).toBeInstanceOf(FormData);
    const fileInBody = (body as FormData).get("file");
    expect(fileInBody).toBeInstanceOf(Blob);
    expect((fileInBody as Blob).type).toBe("audio/mpeg");
    expect(cfg).toEqual({ headers: { "Content-Type": "multipart/form-data" } });
  });

  it("deleteMultipleTracks() sends ids array in POST body", async () => {
    (http.post as Mock).mockResolvedValue(
      ok({ success: ["1", "2"], failed: [] })
    );

    await svc.deleteMultipleTracks(["1", "2"]);

    expect(http.post).toHaveBeenCalledWith("/api/tracks/delete", {
      ids: ["1", "2"],
    });
  });
});
