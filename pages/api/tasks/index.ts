import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { getProjectsTasksQuery } from "@graphql/queries/get-projects-tasks.query";

import odooGraphQLClient from "@lib/graphql/odoo";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const data = await odooGraphQLClient(cookie, getProjectsTasksQuery, { userId: user.id });
  res.status(200).json(data.ProjectProject);
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
