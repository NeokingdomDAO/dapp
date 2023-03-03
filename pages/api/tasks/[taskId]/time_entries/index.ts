import { add, differenceInMinutes, format } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { ODOO_DB_NAME, ODOO_ENDPOINT, STAGE_TO_ID_MAP, getSession } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";
import { findActiveTimeEntry, replaceTaskTimeEntry } from "@lib/utils";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const {
    query: { taskId },
    body: task,
  } = req;
  const { username, password } = user;
  const session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);

  if (req.method === "POST") {
    // START TASK - Create new Time Entry
    const timeEntry = { task_id: Number(taskId), start: format(new Date(), "yyyy-MM-dd HH:mm:ss") };
    const timeEntryId = await session.create("account.analytic.line", timeEntry);
    const [newTimeEntry] = await session.read("account.analytic.line", [timeEntryId]);
    // Move task to In progress
    await session.update("project.task", Number(taskId), {
      stage_id: STAGE_TO_ID_MAP["progress"],
    });
    res.status(200).json(newTimeEntry);
  }

  if (req.method === "PUT") {
    // STOP TASK
    const [activeTimeEntry, activeTask] = findActiveTimeEntry(JSON.parse(task));
    if (!activeTimeEntry || !activeTask) return res.status(404).json({ message: "Active time entry not found" });

    const isSameMin = differenceInMinutes(new Date(activeTimeEntry.start), new Date()) === 0;
    if (isSameMin) {
      // Delete time entry
      await session.remove("account.analytic.line", [Number(activeTimeEntry.id)]);
      const newTask = replaceTaskTimeEntry(activeTask, activeTimeEntry, { delete: true });
      res.status(200).json(newTask);
    } else {
      // Update time entry
      await session.update("account.analytic.line", Number(activeTimeEntry.id), {
        end: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      });
      const [updatedTimeEntry] = await session.read("account.analytic.line", [Number(activeTimeEntry.id)]);
      const newTask = replaceTaskTimeEntry(activeTask, updatedTimeEntry);
      res.status(200).json(newTask);
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
