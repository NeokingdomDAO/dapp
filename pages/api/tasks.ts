import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import odooClient from "@lib/graphql/odoo";
import { getTasksQuery } from "@lib/graphql/queries/get-tasks.query";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const data = await odooClient(cookie, getTasksQuery, { userId: user.id });

  res.status(200).json(data);
  // let tasks = groupBy(
  //   await session.search("project.task", [
  //     ["user_id", "=", session.uid],
  //     ["stage_id", "in", [29, 30, 31]],
  //   ]),
  // );
  // const taskIds = Object.values(tasks).map(({ id }) => id);
  // const durations = groupBy(await session.search("account.analytic.line", [["task_id", "in", taskIds]]));

  // const projectIds = Object.values(tasks).reduce((acc, curr) => acc.add(curr.project_id[0]), new Set());

  // const projects = groupBy(await session.read("project.project", Array.from(projectIds)));
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
