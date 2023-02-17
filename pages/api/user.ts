import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "@lib/session";
import userFactory, { User } from "@lib/userFactory";

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (!req.session.user) {
    return res.json(userFactory());
  }
  res.json({
    ...req.session.user,
    isLoggedIn: true,
  });
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
