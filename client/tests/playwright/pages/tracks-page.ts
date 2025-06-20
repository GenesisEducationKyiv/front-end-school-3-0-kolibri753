import type { Locator, Page } from "@playwright/test";

export interface TrackFormData {
  title: string;
  artist: string;
  genres: string[];
  album?: string;
}

export class TracksPage {
  // Main elements
  readonly heading: Locator;
  readonly newTrackBtn: Locator;
  readonly trackTable: Locator;
  readonly trackRows: Locator;

  // Search and filters
  readonly searchInput: Locator;
  readonly artistFilter: Locator;
  readonly genreFilter: Locator;

  // Bulk operations
  readonly selectModeToggle: Locator;
  readonly bulkDeleteButton: Locator;

  // Modals
  readonly trackFormModal: Locator;
  readonly deleteConfirmModal: Locator;
  readonly uploadModal: Locator;

  // Form fields
  readonly titleInput: Locator;
  readonly artistInput: Locator;
  readonly albumInput: Locator;
  readonly genresSelect: Locator;
  readonly submitBtn: Locator;
  readonly cancelBtn: Locator;
  readonly confirmDeleteBtn: Locator;

  // Toast messages
  readonly successToast: Locator;
  readonly errorToast: Locator;

  static readonly url = "/tracks";

  constructor(public readonly page: Page) {
    // Main elements
    this.heading = page.getByRole("heading", { name: "Tracks" });
    this.newTrackBtn = page.getByTestId("create-track-button");
    this.trackTable = page.getByTestId("tracks-table");
    this.trackRows = this.trackTable.locator("tbody tr");

    // Search and filters
    this.searchInput = page.getByTestId("search-input");
    this.artistFilter = page.getByTestId("filter-artist");
    this.genreFilter = page.getByTestId("filter-genre");

    // Bulk operations
    this.selectModeToggle = page.getByTestId("select-mode-toggle");
    this.bulkDeleteButton = page.getByTestId("bulk-delete-button");

    // Modals
    this.trackFormModal = page.getByTestId("track-form");
    this.deleteConfirmModal = page.getByTestId("confirm-dialog");
    this.uploadModal = page.getByTestId("upload-dialog");

    // Form fields
    this.titleInput = page.getByTestId("track-form-title");
    this.artistInput = page.getByTestId("track-form-artist");
    this.albumInput = page.getByTestId("track-form-album");
    this.genresSelect = page.getByTestId("track-form-genres-select");
    this.submitBtn = page.getByTestId("submit-button");
    this.cancelBtn = page.getByTestId("cancel-button");
    this.confirmDeleteBtn = page.getByTestId("confirm-delete");

    // Toast messages
    this.successToast = page.getByTestId("toast-success");
    this.errorToast = page.getByTestId("toast-error");
  }

  // Navigation
  async open(): Promise<void> {
    await this.page.goto(TracksPage.url);
    await this.heading.waitFor();
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.trackTable.waitFor();
  }

  // Track operations
  async createTrack(data: TrackFormData): Promise<void> {
    await this.newTrackBtn.click();
    await this.trackFormModal.waitFor();
    await this.fillTrackForm(data);
    await this.submitBtn.click();
  }

  async editTrack(
    trackTitle: string,
    data: Partial<TrackFormData>
  ): Promise<void> {
    const editBtn =
      this.getTrackRow(trackTitle).getByTestId(/^edit-track-\d+$/);
    await editBtn.click();
    await this.trackFormModal.waitFor();
    await this.fillTrackForm(data);
    await this.submitBtn.click();
  }

  async deleteTrack(trackTitle: string): Promise<void> {
    const deleteBtn =
      this.getTrackRow(trackTitle).getByTestId(/^delete-track-\d+$/);
    await deleteBtn.click();
    await this.deleteConfirmModal.waitFor();
    await this.confirmDeleteBtn.click();
  }

  // Search and filter operations
  async searchTracks(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.waitForLoaded();
  }

  async filterByArtist(artist: string): Promise<void> {
    await this.artistFilter.selectOption(artist);
    await this.waitForLoaded();
  }

  async filterByGenre(genre: string): Promise<void> {
    await this.genreFilter.selectOption(genre);
    await this.waitForLoaded();
  }

  // Bulk operations
  async selectTracksForBulkDelete(trackTitles: string[]): Promise<void> {
    if (await this.selectModeToggle.isVisible()) {
      await this.selectModeToggle.click();
    }

    for (const title of trackTitles) {
      const checkbox = this.getTrackRow(title).locator(
        'input[type="checkbox"]'
      );
      await checkbox.check();
    }
  }

  async bulkDeleteTracks(trackTitles: string[]): Promise<void> {
    await this.selectTracksForBulkDelete(trackTitles);
    await this.bulkDeleteButton.click();
    await this.deleteConfirmModal.waitFor();
    await this.confirmDeleteBtn.click();
  }

  // Helper methods
  getTrackRow(title: string): Locator {
    return this.trackRows.filter({ hasText: title });
  }

  async getTrackTitles(): Promise<string[]> {
    await this.waitForLoaded();
    return await this.page.locator('[data-testid$="-title"]').allTextContents();
  }

  async getTrackCount(): Promise<number> {
    await this.waitForLoaded();
    return await this.trackRows.count();
  }

  async trackExists(title: string): Promise<boolean> {
    return (await this.getTrackRow(title).count()) > 0;
  }

  async waitForToast(
    type: "success" | "error",
    message?: string
  ): Promise<void> {
    const toast = type === "success" ? this.successToast : this.errorToast;
    const targetToast = message ? toast.filter({ hasText: message }) : toast;
    await targetToast.waitFor({ state: "visible" });
  }

  private async fillTrackForm(data: Partial<TrackFormData>): Promise<void> {
    if (data.title) await this.titleInput.fill(data.title);
    if (data.artist) await this.artistInput.fill(data.artist);
    if (data.album !== undefined) await this.albumInput.fill(data.album);

    if (data.genres) {
      await this.genresSelect.waitFor({ state: "visible" });
      await this.page.waitForTimeout(1000);

      await this.page.waitForFunction(
        () => {
          const select = document.querySelector(
            '[data-testid="track-form-genres-select"]'
          ) as HTMLSelectElement;
          return select && select.options.length > 1;
        },
        { timeout: 15000 }
      );

      for (const genre of data.genres) {
        try {
          await this.genresSelect.selectOption(genre, { timeout: 3000 });
        } catch (error) {
          console.warn(`Skipping genre: ${genre}`);
        }
      }
    }
  }
}
