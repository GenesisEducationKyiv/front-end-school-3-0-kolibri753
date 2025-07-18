import { test, expect } from "../base/base-test";
import { mockTracks } from "../fixtures/track-data";

test.describe("Tracks Page Smoke Tests", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockWebSocket();
    await apiMock.mockTracksApi();
    await apiMock.mockArtistsAndGenres();
  });

  test("should load page with all essential elements", async ({
    tracksPage,
    page,
  }) => {
    await tracksPage.open();

    await expect(tracksPage.heading).toBeVisible();
    await expect(tracksPage.newTrackBtn).toBeVisible();
    await expect(tracksPage.trackTable).toBeVisible();
    await expect(tracksPage.searchInput).toBeVisible();
    await expect(tracksPage.artistFilter).toBeVisible();
    await expect(tracksPage.genreFilter).toBeVisible();

    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText("© 2025 HummingTrack");
  });

  test("should display correct track data", async ({ tracksPage }) => {
    await tracksPage.open();

    const trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(mockTracks.length);

    const trackTitles = await tracksPage.getTrackTitles();
    expect(trackTitles).toContain("Bohemian Rhapsody");
    expect(trackTitles).toContain("Hotel California");
    expect(trackTitles).toContain("Imagine");
  });

  test("should handle basic interactions", async ({ tracksPage }) => {
    await tracksPage.open();

    await expect(tracksPage.searchInput).toBeEditable();
    await tracksPage.searchInput.fill("test");
    await expect(tracksPage.searchInput).toHaveValue("test");
    await tracksPage.searchInput.clear();

    await tracksPage.newTrackBtn.click();
    await expect(tracksPage.trackFormModal).toBeVisible();
    await tracksPage.cancelBtn.click();
    await expect(tracksPage.trackFormModal).not.toBeVisible();
  });

  test("should work on different screen sizes", async ({
    page,
    tracksPage,
  }) => {
    await tracksPage.open();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(tracksPage.heading).toBeVisible();
    await expect(tracksPage.newTrackBtn).toBeVisible();
    await expect(tracksPage.trackTable).toBeVisible();

    await page.setViewportSize({ width: 1366, height: 900 });
    await expect(tracksPage.artistFilter).toBeVisible();
    await expect(tracksPage.genreFilter).toBeVisible();
  });

  test("should load without errors", async ({ page, tracksPage }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await tracksPage.open();
    await tracksPage.waitForLoaded();

    expect(errors).toHaveLength(0);
  });

  test("should handle navigation and page state", async ({
    tracksPage,
    page,
  }) => {
    await tracksPage.open();

    await expect(page).toHaveURL("/tracks");
    await expect(page).toHaveTitle(/HummingTrack/);

    await page.reload();
    await tracksPage.waitForLoaded();

    const trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBeGreaterThan(0);
  });

  test("should render action buttons for each track", async ({
    tracksPage,
  }) => {
    await tracksPage.open();

    const firstTrackRow = tracksPage.trackRows.first();
    await expect(firstTrackRow.getByTestId(/^edit-track-\d+$/)).toBeVisible();
    await expect(firstTrackRow.getByTestId(/^delete-track-\d+$/)).toBeVisible();
  });

  test("should have working filter dropdown options", async ({
    tracksPage,
  }) => {
    await tracksPage.open();

    await expect(tracksPage.artistFilter).toBeVisible();
    const artistOptions = await tracksPage.artistFilter
      .locator("option")
      .count();
    expect(artistOptions).toBeGreaterThan(1);

    await expect(tracksPage.genreFilter).toBeVisible();
    const genreOptions = await tracksPage.genreFilter.locator("option").count();
    expect(genreOptions).toBeGreaterThan(1);
  });
});
