import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  uid: number;
  username: string;
  password: string;
  isLoggedIn: boolean;
};

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (!req.session.user) {
    return res.json({ uid: -1, username: "", password: "", isLoggedIn: false });
  }
  res.json({
    ...req.session.user,
    isLoggedIn: true,
  });
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
