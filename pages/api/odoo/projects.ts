// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "../../../lib/odoo/client";

function groupBy(arr: { [key: string]: any }[], key: string = "id") {
  return arr.reduce((acc, item) => {
    if (!item[key]) throw new Error("Key not defined in object", item);
    acc[item[key]] = item;
    return acc;
  }, {});
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //const { username, password } = req.body;
  const username = process.env.ODOO_USERNAME!;
  const password = process.env.ODOO_PASSWORD!;

  const session = await getClient(
    process.env.ODOO_ENDPOINT!,
    process.env.ODOO_DB_NAME!,
    username,
    password
  );

  let tasks = groupBy(
    await session.search("project.task", [
      ["user_id", "=", session.uid],
      ["stage_id", "in", [29, 30, 31]],
    ])
  );
  const taskIds = Object.values(tasks).map(({ id }) => id);
  const durations = groupBy(
    await session.search("account.analytic.line", [["task_id", "in", taskIds]])
  );

  const projectIds = Object.values(tasks).reduce(
    (acc, curr) => acc.add(curr.project_id[0]),
    new Set()
  );

  const projects = groupBy(
    await session.read("project.project", Array.from(projectIds))
  );
  return res.status(200).json({ projects, tasks });
};
