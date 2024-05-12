import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Page, Route, test as baseTest, expect } from "@playwright/test";

// original from https://www.jayfreestone.com/writing/stubbing-graphql-playwright/
export async function interceptGQL<TResult, TVariables>(
  page: Page,
  document: TypedDocumentNode<TResult, TVariables>,
  resp: TResult,
): Promise<TVariables[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: TVariables[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, function (route: Route) {
    const req = route.request().postDataJSON();
    // @ts-ignore wrong types from library
    const documentOperationName = document.definitions[0]["name"]["value"] as string;

    // Pass along to the previous handler in the chain if the request
    // is for a different operation.
    if (req.operationName !== documentOperationName) {
      return route.fallback();
    }

    // Store what variables we called the API with.
    reqs.push(req.variables);
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: resp }),
    });
  });

  return reqs;
}

const test = baseTest.extend<{ interceptGQL: typeof interceptGQL }>({
  interceptGQL: async ({}, use) => {
    await use(interceptGQL);
  },
  page: async ({ page }, use) => {
    await page.route(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, function (route: Route) {
      const req = route.request().postDataJSON();
      console.warn(`No mock provided for public graphql request: ${req.operationName}`);
      route.continue();
    });

    await use(page);
  },
});

export { test, expect };
