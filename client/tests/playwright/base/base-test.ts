import { test as base, expect } from "@playwright/test";
import { TracksPage } from "../pages/tracks-page";
import { ApiMockHelper } from "../helpers/api-mock";

type TestFixtures = {
  tracksPage: TracksPage;
  apiMock: ApiMockHelper;
};

export const test = base.extend<TestFixtures>({
  tracksPage: async ({ page }, use) => {
    const tracksPage = new TracksPage(page);
    await use(tracksPage);
  },

  apiMock: async ({ page }, use) => {
    const apiMock = new ApiMockHelper(page);
    await use(apiMock);
  },
});

export { expect };
