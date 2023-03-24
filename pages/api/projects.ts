// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { STAGE_TO_ID_MAP } from "@lib/constants";
import odooGraphQLClient from "@lib/graphql/odoo";
import { getProjectsTasksQuery } from "@lib/graphql/queries/get-projects-tasks.query";
import { getUserTasksQuery } from "@lib/graphql/queries/get-user-tasks.query";
import { sessionOptions } from "@lib/session";

import { ProjectTask } from "@store/projectTaskStore";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const getUserProjectIds = async (userId: number) => {
    const projectIds = new Set<number>([]);
    const userTasks = await odooGraphQLClient(cookie, getUserTasksQuery, { user_id: userId });
    userTasks.ProjectTask.forEach(
      (task: ProjectTask) => task.stage_id.id !== STAGE_TO_ID_MAP["approved"] && projectIds.add(task.project_id.id),
    );
    return Array.from(projectIds);
  };

  const userId = user.id;
  const projectIds = await getUserProjectIds(userId);
  const data = await odooGraphQLClient(cookie, getProjectsTasksQuery, {
    projectIds,
    userId,
    approvedId: STAGE_TO_ID_MAP["approved"],
  });
  res.status(200).json(data.ProjectProject);
};

export default withIronSessionApiRoute(getUsers, sessionOptions);
