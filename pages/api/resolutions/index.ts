import { getResolutions } from "drizzle/db";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "@lib/session";

async function getResolutionsIndex(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  try {
    const resolutions = await getResolutions(["title", "hash", "isRewards"]);

    return res.status(200).json(resolutions);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

export default withIronSessionApiRoute(getResolutionsIndex, sessionOptions);
