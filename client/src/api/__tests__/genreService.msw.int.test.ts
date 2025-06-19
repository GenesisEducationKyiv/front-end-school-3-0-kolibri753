import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import axios from "axios";
import { server } from "../../../test/msw/server";
import { AxiosHttpClient } from "@/api/httpClient";
import { GenreService } from "@/api/genreService";

const makeSut = () =>
  new GenreService(
    new AxiosHttpClient(axios.create({ baseURL: "http://localhost" }))
  );

describe("GenreService real HTTP via MSW", () => {
  it("list() returns data from the network", async () => {
    server.use(
      http.get("http://localhost/api/genres", () =>
        HttpResponse.json(["rock", "pop", "jazz"])
      )
    );

    const res = await makeSut().list();
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap()).toEqual(["rock", "pop", "jazz"]);
  });
});
