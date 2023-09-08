// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser } from "types";

import odooClient from "@lib/graphql/odoo";
import { getUsersQuery } from "@lib/graphql/queries/get-users.query";
import { sessionOptions } from "@lib/session";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;
  if (!cookie) {
    return res.status(401).end();
  }
  const data = await odooClient.query(cookie, getUsersQuery);
  const users = data.ResUsers as OdooUser[];
  return res.status(200).json(users.map((user) => ({ ...user, image: user.avatar_256 })));
};

export default withIronSessionApiRoute(getUsers, sessionOptions);
