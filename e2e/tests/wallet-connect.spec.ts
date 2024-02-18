import { MetaMask, testWithSynpress, unlockForFixture } from "@synthetixio/synpress";

import BasicSetup from "../wallet-setup/basic.setup";

const test = testWithSynpress(BasicSetup, unlockForFixture);

const { expect } = test;

test("connect to Metamask with an address that is not part of the DAO", async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Connect wallet" }).click();
  await page.getByRole("button", { name: "MetaMask MetaMask" }).first().click();
  await metamask.connectToDapp();

  // the address is not part of DAO user addresses, we expect a warning with a logout button
  await expect(page.getByRole("button", { name: "Log Out" })).toBeVisible();
});
