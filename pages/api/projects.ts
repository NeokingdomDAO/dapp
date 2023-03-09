// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser } from "types";

import odooGraphQLClient from "@lib/graphql/odoo";
import { getProjectsTasksQuery } from "@lib/graphql/queries/get-projects-tasks.query";
import { sessionOptions } from "@lib/session";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const data = await odooGraphQLClient(cookie, getProjectsTasksQuery, { userId: user.id });
  res.status(200).json(data.ProjectProject);
};

export default withIronSessionApiRoute(getUsers, sessionOptions);
