import { addResolution, getResolution } from "drizzle/db";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { withIronSessionApiRoute } from "iron-session/next";
import stringifyDeterministic from "json-stringify-deterministic";
import { NextApiRequest, NextApiResponse } from "next";

import { ResolutionData } from "@lib/resolutions/validation";
import { sessionOptions } from "@lib/session";

async function createNewResolution(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const result = ResolutionData.safeParse(req.body);

  if (!req.body || req.method !== "POST" || !result.success) {
    return res.status(400).end();
  }

  try {
    const hash = keccak256(toUtf8Bytes(stringifyDeterministic(result.data)));

    const existingResolution = await getResolution(hash);

    if (!existingResolution) {
      await addResolution({
        ...result.data,
        hash,
      });
    } else {
      console.log("Creating a resolution that already exists, returning the hash: ", hash);
    }

    return res.status(200).json({ hash });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

export default withIronSessionApiRoute(createNewResolution, sessionOptions);
