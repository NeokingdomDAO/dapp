import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { ODOO_DB_NAME, ODOO_ENDPOINT, getSession } from "@lib/odooClient";
import { sessionOptions } from "@lib/session";

async function tasksRoute(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const { body } = req;
  const { username, password } = user;
  let session;
  try {
    session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);
  } catch (err) {
    await req.session.destroy();
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    // Create New Time Entry
    try {
      // TODO: Validate body params
      const newTimeEntryId = await session.create("account.analytic.line", JSON.parse(body));
      if (newTimeEntryId) {
        const [newTimeEntry] = await session.read("account.analytic.line", [Number(newTimeEntryId)]);
        res.status(200).json(newTimeEntry);
      } else {
        throw new Error("Unable to create time entry");
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
