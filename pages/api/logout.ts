import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import userFactory, { User } from "../../lib/userFactory";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json(userFactory());
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
