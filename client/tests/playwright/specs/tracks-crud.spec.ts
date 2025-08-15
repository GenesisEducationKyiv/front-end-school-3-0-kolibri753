import { test, expect } from "../base/base-test";
import { newTrackData, updatedTrackData } from "../fixtures/track-data";

test.describe("Tracks CRUD Operations", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockTracksApi({ enableCrud: true });
    await apiMock.mockArtistsAndGenres();
  });

  test("should create a new track", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.createTrack(newTrackData);

    await tracksPage.waitForToast("success");
    await expect(tracksPage.trackFormModal).not.toBeVisible();
  });

  test("should edit an existing track", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.editTrack("Bohemian Rhapsody", updatedTrackData);

    await tracksPage.waitForToast("success");
    await expect(tracksPage.trackFormModal).not.toBeVisible();
  });

  test("should delete a track", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.deleteTrack("Bohemian Rhapsody");

    await tracksPage.waitForToast("success");
    await expect(tracksPage.deleteConfirmModal).not.toBeVisible();
  });

  test("should cancel track creation", async ({ tracksPage }) => {
    await tracksPage.open();
    await tracksPage.newTrackBtn.click();

    await expect(tracksPage.trackFormModal).toBeVisible();
    await tracksPage.cancelBtn.click();
    await expect(tracksPage.trackFormModal).not.toBeVisible();
  });

  test("should cancel track deletion", async ({ tracksPage }) => {
    await tracksPage.open();

    const deleteBtn = tracksPage
      .getTrackRow("Bohemian Rhapsody")
      .getByTestId(/^delete-track-\d+$/);
    await deleteBtn.click();

    await expect(tracksPage.deleteConfirmModal).toBeVisible();
    await tracksPage.page.getByTestId("cancel-delete").click();
    await expect(tracksPage.deleteConfirmModal).not.toBeVisible();

    expect(await tracksPage.trackExists("Bohemian Rhapsody")).toBe(true);
  });
});
