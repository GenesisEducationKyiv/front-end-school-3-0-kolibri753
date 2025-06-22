import type { Page } from "@playwright/test";
import { mockTracks, mockApiResponses } from "../fixtures/track-data";

export class ApiMockHelper {
  constructor(private page: Page) {}

  async mockTracksApi(
    options: {
      enableSearch?: boolean;
      enableFilters?: boolean;
      enableCrud?: boolean;
    } = {}
  ) {
    const {
      enableSearch = true,
      enableFilters = true,
      enableCrud = true,
    } = options;

    await this.page.route("/api/tracks*", async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (method === "GET") {
        let filteredTracks = mockTracks;

        if (enableSearch || enableFilters) {
          const urlObj = new URL(url);
          const search = urlObj.searchParams.get("search");
          const artist = urlObj.searchParams.get("artist");
          const genre = urlObj.searchParams.get("genre");

          if (search && enableSearch) {
            filteredTracks = filteredTracks.filter((t) =>
              t.title.toLowerCase().includes(search.toLowerCase())
            );
          }
          if (artist && enableFilters) {
            filteredTracks = filteredTracks.filter((t) => t.artist === artist);
          }
          if (genre && enableFilters) {
            filteredTracks = filteredTracks.filter((t) =>
              t.genres.includes(genre)
            );
          }
        }

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: filteredTracks,
            meta: {
              totalPages: Math.ceil(filteredTracks.length / 10),
              currentPage: 1,
              totalCount: filteredTracks.length,
              limit: 10,
            },
          }),
        });
      } else if (method === "POST" && enableCrud) {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockApiResponses.createTrack.success),
        });
      }
    });

    if (enableCrud) {
      await this.mockTrackCrudOperations();
    }
  }

  async mockTrackCrudOperations() {
    await this.page.route("/api/tracks/*", async (route) => {
      const method = route.request().method();

      if (method === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockApiResponses.updateTrack.success),
        });
      } else if (method === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockApiResponses.deleteTrack.success),
        });
      }
    });

    await this.page.route("/api/tracks/delete", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockApiResponses.bulkDelete.success),
        });
      }
    });
  }

  async mockArtistsAndGenres() {
    await this.page.route("/api/artists*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockApiResponses.artists.success),
      });
    });

    await this.page.route("/api/genres*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockApiResponses.genres.success),
      });
    });
  }

  async mockFileOperations() {
    await this.page.route("/api/tracks/*/upload", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockApiResponses.uploadFile.success),
      });
    });

    await this.page.route("/api/tracks/*/file", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ message: "File deleted successfully" }),
        });
      }
    });
  }

  async mockErrorResponses() {
    await this.page.route("/api/tracks*", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify(mockApiResponses.tracks.error),
      });
    });
  }
}
