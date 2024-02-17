import { GetLegacyResolutionsDocument, GetResolutionsDocument } from "@graphql/subgraph/generated/graphql";

import { resolutionsMock } from "../fixtures/get-resolutions";
import { legacyResolutionsMock } from "../fixtures/get-resolutions-legacy";
import { expect, test } from "../testWithMock";

test("should show at least one resolution", async ({ page, interceptGQL }) => {
  await interceptGQL(page, GetResolutionsDocument, resolutionsMock);
  await interceptGQL(page, GetLegacyResolutionsDocument, legacyResolutionsMock, true);

  await page.goto("/");
  await page.getByRole("link", { name: "Resolutions" }).click();

  await expect(page.getByRole("link", { name: "Title resolution 2" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Title resolution 1" })).not.toBeVisible();

  // legacy resolutions
  await expect(page.getByRole("link", { name: "Title Legacy Resolution 2" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Title Legacy Resolution 1" })).not.toBeVisible();
});
