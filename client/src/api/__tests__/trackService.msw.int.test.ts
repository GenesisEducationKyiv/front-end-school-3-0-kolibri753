import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import axios from "axios";
import { server } from "../../../tests/msw/server";
import { AxiosHttpClient } from "@/api/httpClient";
import { TrackService } from "@/api/trackService";
import type { Track } from "@/types";

const makeSut = () =>
  new TrackService(
    new AxiosHttpClient(axios.create({ baseURL: "http://localhost" }))
  );

const mkTrack = (over: Partial<Track> = {}): Track => ({
  id: "1",
  slug: "t-1",
  title: "Foo",
  artist: "Bar",
  genres: [],
  createdAt: "",
  ...over,
});

describe("TrackService real HTTP via MSW", () => {
  it("list() returns data from the network", async () => {
    server.use(
      http.get("http://localhost/api/tracks", () =>
        HttpResponse.json([mkTrack({ id: "42" })])
      )
    );

    const res = await makeSut().list();
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap()).toEqual([mkTrack({ id: "42" })]);
  });

  it("create() posts body and returns created track", async () => {
    const dto = {
      title: "New",
      artist: "X",
      genres: ["rock"],
      album: "",
      coverImage: "",
    };

    server.use(
      http.post("http://localhost/api/tracks", async ({ request }) => {
        const body = (await request.json()) as typeof dto;
        expect(body).toEqual(dto);
        return HttpResponse.json(mkTrack({ id: "99", ...body }), {
          status: 201,
        });
      })
    );

    const res = await makeSut().create(dto);
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap().id).toBe("99");
  });

  it("fetchTracks() sends schema-default query params when called with no opts", async () => {
    server.use(
      http.get("http://localhost/api/tracks", ({ request }) => {
        const qs = new URL(request.url).searchParams;
        expect(qs.get("page")).toBe("1");
        expect(qs.get("limit")).toBe("10");
        expect(qs.get("sort")).toBe("title");
        expect(qs.get("order")).toBe("asc");
        expect(qs.get("genre")).toBe("");
        expect(qs.get("artist")).toBe("");
        expect(qs.get("search")).toBe("");

        return HttpResponse.json({
          data: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
        });
      })
    );

    const res = await makeSut().fetchTracks();
    expect(res.isOk()).toBe(true);
  });

  it("fetchTracks() passes validated query params", async () => {
    server.use(
      http.get("http://localhost/api/tracks", ({ request }) => {
        const qs = new URL(request.url).searchParams;
        expect(qs.get("page")).toBe("2");
        expect(qs.get("limit")).toBe("5");
        return HttpResponse.json({
          data: [],
          meta: { total: 0, page: 2, limit: 5, totalPages: 0 },
        });
      })
    );

    const res = await makeSut().fetchTracks({ page: 2, limit: 5 });
    expect(res.isOk()).toBe(true);
  });

  it("getBySlug() returns data from the network", async () => {
    server.use(
      http.get("http://localhost/api/tracks/:slug", ({ params }) =>
        HttpResponse.json(mkTrack({ slug: params.slug as string }))
      )
    );

    const res = await makeSut().getBySlug("my-song");

    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap().slug).toBe("my-song");
  });

  it("propagates backend 500 errors as Network AppError", async () => {
    server.use(
      http.get(
        "http://localhost/api/tracks/:slug",
        () => new HttpResponse(null, { status: 500 })
      )
    );

    const res = await makeSut().getBySlug("boom");

    expect(res.isErr()).toBe(true);
    expect(res._unsafeUnwrapErr().type).toBe("Network");
  });

  it("deleteTrackFile() falls back to GET when backend returns 404", async () => {
    server.use(
      http.delete(
        "http://localhost/api/tracks/:id/file",
        () => new HttpResponse(null, { status: 404 })
      ),
      http.get("http://localhost/api/tracks/:id", ({ params }) =>
        HttpResponse.json(mkTrack({ id: params.id as string }))
      )
    );

    const res = await makeSut().deleteTrackFile("1");
    expect(res.isOk()).toBe(true);
  });

  it("deleteMultipleTracks() returns mixed result", async () => {
    server.use(
      http.post("http://localhost/api/tracks/delete", async ({ request }) => {
        const { ids } = (await request.json()) as { ids: string[] };
        expect(ids).toEqual(["1", "2"]);
        return HttpResponse.json({ success: ["1"], failed: ["2"] });
      })
    );

    const res = await makeSut().deleteMultipleTracks(["1", "2"]);
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap()).toEqual({ success: ["1"], failed: ["2"] });
  });
});
