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

  const {
    query: { id },
    body,
  } = req;
  const { username, password } = user;
  const session = await getSession(ODOO_ENDPOINT, ODOO_DB_NAME, username, password);

  if (req.method === "DELETE") {
    // Remove Time Entry
    const removed = await session.remove("account.analytic.line", [Number(id)]);
    return res.status(removed ? 200 : 500).json({ removed });
  }

  if (req.method === "PUT") {
    // Update Time Entry
    try {
      // TODO: Validate body params
      const newTimeEntry = await session.update("account.analytic.line", Number(id), JSON.parse(body));
      res.status(200).json(newTimeEntry);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
