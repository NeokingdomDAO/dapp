import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Page, Route, test as baseTest, expect } from "@playwright/test";

// Registers a client-side interception to our BFF (presumes all `graphql`
// requests are to us). Interceptions are per-operation, so multiple can be
// registered for different operations without overwriting one-another.
export async function interceptGQL<TResult, TVariables>(
  page: Page,
  document: TypedDocumentNode<TResult, TVariables>,
  resp: TResult,
  isLegacy?: boolean,
): Promise<TVariables[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: TVariables[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route(
    isLegacy ? process.env.NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT || "" : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    function (route: Route) {
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
    },
  );

  return reqs;
}

const test = baseTest.extend<{ interceptGQL: typeof interceptGQL }>({
  interceptGQL: async ({}, use) => {
    await use(interceptGQL);
  },
  page: async ({ page }, use) => {
    // Block all BFF requests from making it through to the 'real'
    // dependency. If we get this far it means we've forgotten to register a
    // handler, and (at least locally) we're using a real dependency.
    await page.route(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, function (route: Route) {
      const req = route.request().postDataJSON();
      console.warn(`No mock provided for public graphql request: ${req.operationName}`);
      route.continue();
    });

    await use(page);
  },
});

export { test, expect };
