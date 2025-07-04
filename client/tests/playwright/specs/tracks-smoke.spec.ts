import { test, expect } from "../base/base-test";
import { mockTracks } from "../fixtures/track-data";

test.describe("Tracks Page Smoke Tests", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockTracksApi();
    await apiMock.mockArtistsAndGenres();
  });

  test("should load and display tracks page", async ({ tracksPage }) => {
    await tracksPage.open();

    await expect(tracksPage.heading).toBeVisible();
    await expect(tracksPage.newTrackBtn).toBeVisible();
    await expect(tracksPage.trackTable).toBeVisible();

    const footer = tracksPage.page.getByRole("contentinfo");
    await expect(footer).toContainText("© 2025 HummingTrack");
  });

  test("should display correct number of tracks", async ({ tracksPage }) => {
    await tracksPage.open();

    const trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(mockTracks.length);
  });

  test("should display expected track titles", async ({ tracksPage }) => {
    await tracksPage.open();

    const trackTitles = await tracksPage.getTrackTitles();
    expect(trackTitles).toContain("Bohemian Rhapsody");
    expect(trackTitles).toContain("Hotel California");
    expect(trackTitles).toContain("Imagine");
  });

  test("should have functional search input", async ({ tracksPage }) => {
    await tracksPage.open();

    await expect(tracksPage.searchInput).toBeVisible();
    await expect(tracksPage.searchInput).toBeEditable();
  });

  test("should have functional filter dropdowns", async ({ tracksPage }) => {
    await tracksPage.open();

    await expect(tracksPage.artistFilter).toBeVisible();
    await expect(tracksPage.genreFilter).toBeVisible();
  });
});
