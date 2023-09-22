import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { getCurrentTasks } from "@graphql/queries/get-current-tasks.query";

import odooGraphQLClient from "@lib/graphql/odoo";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const data = await odooGraphQLClient.query(cookie, getCurrentTasks, { userId: user.id });
  res.status(200).json(data.ProjectTask);
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
