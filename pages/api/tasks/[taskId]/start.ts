import { format } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { STAGE_TO_ID_MAP } from "@lib/constants";
import { ODOO_DB_NAME, ODOO_ENDPOINT, getSession } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const {
    query: { taskId },
  } = req;
  const { username, password } = user;
  const session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);

  if (req.method === "POST") {
    // START TASK - Create new Time Entry
    try {
      const timeEntry = { task_id: Number(taskId), start: format(new Date(), "yyyy-MM-dd HH:mm:ss") };
      const timeEntryId = await session.create("account.analytic.line", timeEntry);
      const [newTimeEntry] = await session.read("account.analytic.line", [timeEntryId]);
      // Move task to In progress
      await session.update("project.task", Number(taskId), {
        stage_id: STAGE_TO_ID_MAP["progress"],
      });
      res.status(200).json(newTimeEntry);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
