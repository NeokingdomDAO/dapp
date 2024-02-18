import { expect, test } from "@playwright/test";
import { MetaMask, testWithSynpress, unlockForFixture } from "@synthetixio/synpress";

import BasicSetup from "../wallet-setup/basic.setup";

const walletTest = testWithSynpress(BasicSetup, unlockForFixture);
const { expect: walletExpect } = test;

test("login with just Odoo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in with username and password" }).click();

  await page.getByLabel("Odoo Username *").fill(process.env.E2E_ODOO_USERNAME);
  await page.getByLabel("Odoo Password *").fill(process.env.E2E_ODOO_PASSWORD);

  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.getByText(
      "You are currently just connected through Odoo. Please connect your wallet for seamless interaction within the dapp.",
    ),
  ).toBeVisible();
});

walletTest("login just with the wallet (account in DAO)", async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Connect wallet" }).click();
  await page.getByRole("button", { name: "MetaMask MetaMask" }).first().click();
  await metamask.connectToDapp();

  await walletExpect(page.getByRole("button", { name: "Log in to odoo with wallet" })).toBeVisible();
  await walletExpect(page.getByRole("button", { name: "Log in with username and" })).toBeVisible();
});

walletTest("login with both the wallet and Odoo", async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Connect wallet" }).click();
  await page.getByRole("button", { name: "MetaMask MetaMask" }).first().click();
  await metamask.connectToDapp();

  page.getByRole("button", { name: "Log in with username and password" }).click();
  await page.getByLabel("Odoo Username *").fill(process.env.E2E_ODOO_USERNAME);
  await page.getByLabel("Odoo Password *").fill(process.env.E2E_ODOO_PASSWORD);

  await page.getByRole("button", { name: "Log in" }).click();
  await walletExpect(page.getByRole("heading", { name: "Resolutions stats" })).toBeVisible();
});
