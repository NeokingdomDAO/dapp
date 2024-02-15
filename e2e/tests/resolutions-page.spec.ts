import { getResolutionsOneMock } from "../fixtures/get-resolutions";
import { expect, test } from "../testWithMock";

test("should show at least one resolution", async ({ page, worker }) => {
  await worker.use(getResolutionsOneMock);

  await page.goto("/");
  await page.getByRole("link", { name: "Resolutions" }).click();

  await expect(page.getByRole("link", { name: "Title resolution 2" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Title resolution 1" })).not.toBeVisible();
});
