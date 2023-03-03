import produce from "immer";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { getProjectsTasksQuery } from "@graphql/queries/get-projects-tasks.query";

import odooGraphQLClient from "@lib/graphql/odoo";
import { ODOO_DB_NAME, ODOO_ENDPOINT, getSession as odooJrpcClient } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";

const mergeProjectTimeEntries = (projects: any[], timeEntries: any[]) => {
  return produce(projects, (draftProjects) => {
    draftProjects.forEach((project) => {
      project.tasks.forEach((task: any) => {
        task.timesheet_ids.forEach((timesheet: any) => {
          const timeEntry = timeEntries.find((te) => Number(te.id) === Number(timesheet.id));
          if (timeEntry) {
            timesheet.start = timeEntry.start;
            timesheet.end = timeEntry.end;
          }
        });
        task.child_ids?.forEach((child: any) => {
          child.timesheet_ids.forEach((timesheet: any) => {
            const timeEntry = timeEntries.find((te) => Number(te.id) === Number(timesheet.id));
            if (timeEntry) {
              timesheet.start = timeEntry.start;
              timesheet.end = timeEntry.end;
            }
          });
        });
      });
    });
  });
};

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const { username, password } = user;
  const session = await odooJrpcClient(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);
  const timeEntries = await session.search("account.analytic.line", { user_id: user.id });

  const data = await odooGraphQLClient(cookie, getProjectsTasksQuery, { userId: user.id });
  const projectsWithTimeEntries = mergeProjectTimeEntries(data.ProjectProject, timeEntries);
  res.status(200).json(projectsWithTimeEntries);
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
