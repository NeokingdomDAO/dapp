import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { getSession } from "../../lib/odoo";
import { sessionOptions } from "../../lib/session";
import userFactory from "../../lib/userFactory";

// Login with Odoo
const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).end();
  }

  try {
    const session = await getSession(process.env.ODOO_ENDPOINT!, process.env.ODOO_DB_NAME!, username, password);

    if (session.uid) {
      const user = userFactory({ uid: session.uid, username, password, isLoggedIn: true });
      req.session.user = user;
      await req.session.save();

      return res.status(200).json(user);
    }
    res.status(403).json({});
  } catch (error) {
    res.status(500).json(error);
  }
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
