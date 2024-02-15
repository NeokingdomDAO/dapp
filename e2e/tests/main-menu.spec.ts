import { expect, test } from "@playwright/test";

test("get shareholders link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Shareholders" })).toBeVisible();
});

test("get resolutions link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resolutions" })).toBeVisible();
});

test("get IBC tool link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "IBC tool" })).toBeVisible();
});
