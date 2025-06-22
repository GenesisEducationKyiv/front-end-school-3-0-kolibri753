import { test, expect } from "../base/base-test";

test.describe("Tracks Error Handling", () => {
  test("should handle network errors when loading tracks", async ({
    tracksPage,
    apiMock,
  }) => {
    await apiMock.mockErrorResponses();

    await tracksPage.open();

    const trackCount = await tracksPage.getTrackCount();
    expect(trackCount).toBe(0);
  });

  test("should handle API errors when deleting track", async ({
    tracksPage,
    apiMock,
  }) => {
    await apiMock.mockTracksApi();
    await apiMock.mockArtistsAndGenres();

    await tracksPage.page.route("/api/tracks/*", async (route) => {
      if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Internal server error",
            message: "Failed to delete track",
          }),
        });
      }
    });

    await tracksPage.open();
    await tracksPage.deleteTrack("Bohemian Rhapsody");

    await tracksPage.waitForToast("error");
  });

  test("should handle form validation errors", async ({
    tracksPage,
    apiMock,
  }) => {
    await apiMock.mockTracksApi();
    await apiMock.mockArtistsAndGenres();

    await tracksPage.open();
    await tracksPage.newTrackBtn.click();

    await tracksPage.submitBtn.click();

    await expect(tracksPage.trackFormModal).toBeVisible();
  });
});
