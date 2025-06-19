import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/artists", () => HttpResponse.json(["Foo", "Bar", "Baz"])),

  http.get("/api/genres", () => HttpResponse.json(["rock", "pop"])),

  http.get("http://localhost/api/tracks", () =>
    HttpResponse.json({
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    })
  ),
  http.get("http://localhost/api/tracks/:id", ({ params }) =>
    HttpResponse.json({
      id: params.id,
      slug: "",
      title: "",
      artist: "",
      genres: [],
      createdAt: "",
    })
  ),
  http.post("http://localhost/api/tracks", () => HttpResponse.json({})),
  http.put("http://localhost/api/tracks/:id", () => HttpResponse.json({})),
  http.delete(
    "http://localhost/api/tracks/:id",
    () => new HttpResponse(null, { status: 204 })
  ),

  http.post("http://localhost/api/tracks/:id/upload", () =>
    HttpResponse.json({})
  ),
  http.delete(
    "http://localhost/api/tracks/:id/file",
    () => new HttpResponse(null, { status: 204 })
  ),

  http.post("http://localhost/api/tracks/delete", () =>
    HttpResponse.json({ success: [], failed: [] })
  ),
];
