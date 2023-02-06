import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "@lib/session";

async function graphql(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  if (!cookie) {
    return res.status(403);
  }

  const proxy = await fetch("https://odoo.neokingdom.org/graphql", {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    credentials: "include",
    body: req.body,
  });
  res.json(await proxy.json());
}

export default withIronSessionApiRoute(graphql, sessionOptions);
