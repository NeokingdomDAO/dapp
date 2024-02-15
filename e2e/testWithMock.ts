import { test as base, expect } from "@playwright/test";
import { http } from "msw";
import type { Config, MockServiceWorker } from "playwright-msw";
import { createWorkerFixture } from "playwright-msw";

const testFactory = (config?: Config) =>
  base.extend<{
    worker: MockServiceWorker;
    http: typeof http;
  }>({
    worker: createWorkerFixture([], config),
    http,
  });

// TODO: handle different graphql endpoints
const test = testFactory({
  graphqlUrl: "https://api.thegraph.com/subgraphs/name/neokingdomdao/neokingdom-whitelabel-testnet/",
});

export { testFactory, test, expect };
