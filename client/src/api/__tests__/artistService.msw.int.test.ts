import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import axios from "axios";
import { server } from "../../../tests/msw/server";
import { AxiosHttpClient } from "@/api/httpClient";
import { ArtistService } from "@/api/artistService";

const makeSut = () =>
  new ArtistService(
    new AxiosHttpClient(axios.create({ baseURL: "http://localhost" }))
  );

describe("ArtistService real HTTP via MSW", () => {
  it("list() returns data from the network", async () => {
    server.use(
      http.get("http://localhost/api/artists", () =>
        HttpResponse.json(["Foo", "Bar", "Baz"])
      )
    );

    const res = await makeSut().list();
    expect(res.isOk()).toBe(true);
    expect(res._unsafeUnwrap()).toEqual(["Foo", "Bar", "Baz"]);
  });
});
