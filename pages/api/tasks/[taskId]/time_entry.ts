import { format } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { ODOO_DB_NAME, ODOO_ENDPOINT, STAGE_TO_ID_MAP, getSession } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
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
    // Create new time entry
    const timeEntry = { task_id: Number(taskId), start: format(new Date(), "yyyy-MM-dd HH:mm:ss") };
    const timeEntryId = await session.create("account.analytic.line", timeEntry);
    const [newTimeEntry] = await session.read("account.analytic.line", [timeEntryId]);
    // Move te task to in progress
    await session.update("project.task", Number(taskId), {
      stage_id: STAGE_TO_ID_MAP["progress"],
    });

    res.status(200).json(newTimeEntry);
  }
}

// ("%Y-%m-%d %H:%M:%S");

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
