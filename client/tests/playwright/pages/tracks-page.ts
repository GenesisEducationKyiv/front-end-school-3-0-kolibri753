import type { Locator, Page } from "@playwright/test";

export class TracksPage {
  readonly heading: Locator;
  readonly header: Locator;
  readonly newTrackBtn: Locator;
  readonly footer: Locator;

  static readonly url = "/tracks";
  static readonly copyright = "© 2025 HummingTrack";

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { name: "Tracks" });
    this.header = page.getByTestId("tracks-header");
    this.newTrackBtn = page.getByTestId("create-track-button");
    this.footer = page.getByRole("contentinfo");
  }

  async open(): Promise<void> {
    await this.page.goto(TracksPage.url);
    await this.heading.waitFor();
  }
}
