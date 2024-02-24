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
  if (!session.uid) {
    await req.session.destroy();
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "PUT") {
    // Update Time Entry
    try {
      // TODO: Validate body params
      // @ts-expect-error Cannot invoke an object which is possibly 'undefined'
      const updated = await session.update("account.analytic.line", Number(id), JSON.parse(body));
      if (updated) {
        // @ts-expect-error Cannot invoke an object which is possibly 'undefined'
        const [newTimeEntry] = await session.read("account.analytic.line", [Number(id)]);
        res.status(200).json(newTimeEntry);
      } else {
        throw new Error("Unable to update time entry");
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  if (req.method === "DELETE") {
    // Remove Time Entry
    // @ts-expect-error Cannot invoke an object which is possibly 'undefined'
    const removed = await session.remove("account.analytic.line", [Number(id)]);
    return res.status(removed ? 200 : 500).json({ removed });
  }
}

export default withIronSessionApiRoute(tasksRoute, sessionOptions);
