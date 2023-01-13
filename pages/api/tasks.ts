import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getSession } from "../../lib/odoo";
import { sessionOptions } from "../../lib/session";

function groupBy(arr: { [key: string]: any }[], key: string = "id") {
  return arr.reduce((acc, item) => {
    if (!item[key]) throw new Error("Key not defined in object", item);
    acc[item[key]] = item;
    return acc;
  }, {});
}

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user;
  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  const { username, password } = user;
  const session = await getSession(process.env.ODOO_ENDPOINT!, process.env.ODOO_DB_NAME!, username, password);

  let tasks = groupBy(
    await session.search("project.task", [
      ["user_id", "=", session.uid],
      ["stage_id", "in", [29, 30, 31]],
    ]),
  );
  const taskIds = Object.values(tasks).map(({ id }) => id);
  const durations = groupBy(await session.search("account.analytic.line", [["task_id", "in", taskIds]]));

  const projectIds = Object.values(tasks).reduce((acc, curr) => acc.add(curr.project_id[0]), new Set());

  const projects = groupBy(await session.read("project.project", Array.from(projectIds)));
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
