import { type ApiData } from "@vercel/flags";
import type { NextApiRequest, NextApiResponse } from "next";

import { vercelFlagDefinitions } from "@lib/feature-flags/generated";

export async function handler(request: NextApiRequest, response: NextApiResponse) {
  const apiData = {
    definitions: vercelFlagDefinitions,
  };
  return response.status(200).json(apiData satisfies ApiData);
}
