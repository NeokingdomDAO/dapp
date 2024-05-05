import { addResolution, getResolution } from "drizzle/db";
import { NextApiRequest, NextApiResponse } from "next";

import { getLegacyResolutionsQuery } from "@graphql/subgraph/queries/get-legacy-resolutions-query";
import { getResolutionsQuery } from "@graphql/subgraph/queries/get-resolutions-query";
import { fetcherGraphqlPublic, legacyFetcherGraphqlPublic } from "@graphql/subgraph/subgraph-client";

const sleep = (ms = 50) => new Promise((r) => setTimeout(r, ms));

async function migrateResolutions(req: NextApiRequest, res: NextApiResponse) {
  // get all the resolutions and legacy resolutions
  const graphQlResolutions: any = await fetcherGraphqlPublic([getResolutionsQuery, null]);
  const legacyGraphQlResolutions: any = await legacyFetcherGraphqlPublic([getLegacyResolutionsQuery, null]);

  for (const resolution of graphQlResolutions.resolutions) {
    const dbResolution = await getResolution(resolution.ipfsDataURI);
    if (!dbResolution) {
      await addResolution({
        hash: resolution.ipfsDataURI,
        title: resolution.title || "unknown",
        content: resolution.content || "unknown",
        isRewards: !!resolution.metadata?.isMonthlyRewards,
      });
    }
    await sleep();
  }

  for (const resolution of legacyGraphQlResolutions.resolutions) {
    const dbResolution = await getResolution(resolution.ipfsDataURI);
    if (!dbResolution) {
      await addResolution({
        hash: resolution.ipfsDataURI,
        title: resolution.title || "unknown",
        content: resolution.content || "unknown",
        isRewards: !!resolution.metadata?.isMonthlyRewards,
      });
    }
    await sleep();
  }

  return res.status(200).json({ ok: true });
}

export default migrateResolutions;
