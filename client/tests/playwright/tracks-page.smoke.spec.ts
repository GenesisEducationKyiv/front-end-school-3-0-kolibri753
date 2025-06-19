import { test, expect } from "@playwright/test";
import { TracksPage } from "./pages/tracks-page";

test.describe("Smoke / Tracks page", () => {
  test("chrome renders", async ({ page }) => {
    const tracks = new TracksPage(page);
    await tracks.open();

    await expect(tracks.header).toBeVisible();
    await expect(tracks.newTrackBtn).toBeVisible();
    await expect(tracks.footer).toContainText(TracksPage.copyright);
  });
});
