import { test, expect } from "../base/base-test";

test.describe("Tracks Bulk Operations", () => {
  test.beforeEach(async ({ apiMock }) => {
    await apiMock.mockTracksApi({ enableCrud: true });
    await apiMock.mockArtistsAndGenres();
  });

  test("should bulk delete multiple tracks", async ({ tracksPage }) => {
    await tracksPage.open();

    const tracksToDelete = ["Bohemian Rhapsody", "Hotel California"];
    await tracksPage.bulkDeleteTracks(tracksToDelete);

    await tracksPage.waitForToast("success");
    await expect(tracksPage.deleteConfirmModal).not.toBeVisible();
  });

  test("should enable select mode when bulk delete button is clicked", async ({
    tracksPage,
  }) => {
    await tracksPage.open();

    const firstCheckbox = tracksPage.trackRows
      .first()
      .locator('input[type="checkbox"]');
    await expect(firstCheckbox).not.toBeVisible();

    await tracksPage.selectModeToggle.click();

    await expect(firstCheckbox).toBeVisible();
  });

  test("should select and deselect tracks for bulk operations", async ({
    tracksPage,
  }) => {
    await tracksPage.open();

    await tracksPage.selectModeToggle.click();

    const firstCheckbox = tracksPage.trackRows
      .first()
      .locator('input[type="checkbox"]');
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();
  });

  test("should disable bulk delete button when no tracks selected", async ({
    tracksPage,
  }) => {
    await tracksPage.open();

    await tracksPage.selectModeToggle.click();

    await expect(tracksPage.bulkDeleteButton).toBeDisabled();
  });
});
