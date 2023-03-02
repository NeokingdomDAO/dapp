import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser } from "types";

import { getOdooCookie } from "@lib/getOdooCookie";
import odooClient from "@lib/graphql/odoo";
import { getUserQuery } from "@lib/graphql/queries/get-user.query";
import { sessionOptions } from "@lib/session";
import userFactory from "@lib/userFactory";

// Login with Odoo
const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).end();
  }

  try {
    const cookie = await getOdooCookie(username, password);
    const data = await odooClient(cookie, getUserQuery, { email: username });
    const userData = data.ResUsers[0] as OdooUser;
    const user = userFactory({ ...userData, username, password, isLoggedIn: true });
    req.session.cookie = cookie;
    req.session.user = user;
    await req.session.save();
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.isBoom) {
      return res.status(error.output.statusCode).json(error.output.payload);
    }
    return res.status(500).json({ error: JSON.stringify(error) });
  }
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
