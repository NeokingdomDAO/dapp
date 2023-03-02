import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const cookie = req.session.cookie;
    const user = req.session.user;
    if (!(cookie && user)) {
      return res.status(401).end();
    }
    const { body, query } = req;
    res.status(200).json({});
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
