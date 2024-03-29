import { formatInTimeZone } from "date-fns-tz";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { ODOO_DATE_FORMAT, getStageId } from "@lib/constants";
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
  let session;
  try {
    session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);
  } catch (err) {
    await req.session.destroy();
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    // START TASK - Create new Time Entry
    try {
      const start = formatInTimeZone(new Date(), "UTC", ODOO_DATE_FORMAT);
      const timeEntry = { task_id: Number(taskId), start };
      // Move task to In progress
      await session.update("project.task", Number(taskId), {
        stage_id: getStageId("in progress"),
      });
      const timeEntryId = await session.create("account.analytic.line", timeEntry);
      const [newTimeEntry] = await session.read("account.analytic.line", [timeEntryId]);
      res.status(200).json(newTimeEntry);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
