import { test, expect } from "../base/base-test";
import { mockTracks } from "../fixtures/track-data";

test.describe("Tracks Search and Filter", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockTracksApi({ enableSearch: true, enableFilters: true });
    await apiMock.mockArtistsAndGenres();
  });

  test("should search tracks by title", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.searchTracks("Bohemian");

    const trackTitles = await tracksPage.getTrackTitles();
    expect(trackTitles).toContain("Bohemian Rhapsody");
    expect(trackTitles).not.toContain("Hotel California");
  });

  test("should filter tracks by artist", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.filterByArtist("Queen");

    const trackTitles = await tracksPage.getTrackTitles();
    expect(trackTitles).toContain("Bohemian Rhapsody");
    expect(trackTitles).not.toContain("Hotel California");
  });

  test("should filter tracks by genre", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.filterByGenre("Pop");

    const trackTitles = await tracksPage.getTrackTitles();
    expect(trackTitles).toContain("Imagine");
    expect(trackTitles).toContain("Billie Jean");
    expect(trackTitles).not.toContain("Bohemian Rhapsody");
  });

  test("should clear search and show all tracks", async ({ tracksPage }) => {
    await tracksPage.open();

    await tracksPage.searchTracks("Bohemian");
    let trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(1);

    await tracksPage.searchTracks("");
    await tracksPage.page.waitForTimeout(400);
    trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(mockTracks.length);
  });

  test("should show no results for non-existent search", async ({
    tracksPage,
    apiMock,
  }) => {
    // Mock empty response for non-existent search
    await tracksPage.page.route("/api/tracks*", async (route) => {
      const url = new URL(route.request().url());
      const search = url.searchParams.get("search");

      if (search === "NonExistentTrack") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [],
            meta: { totalPages: 0, currentPage: 1, totalCount: 0, limit: 10 },
          }),
        });
      } else {
        await apiMock.mockTracksApi({ enableSearch: true });
      }
    });

    await tracksPage.open();
    await tracksPage.searchTracks("NonExistentTrack");

    const trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(0);
  });
});
