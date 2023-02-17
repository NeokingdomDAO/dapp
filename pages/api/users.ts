// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { request } from "graphql-request";
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
  const data = await odooClient(cookie, getUsersQuery);
  const users = data.ResUsers as OdooUser[];
  if (process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom") {
    return res.status(200).json(users.map((user) => ({ ...user, image: user.avatar_256 })));
  }

  res.status(200).json(data);
};

export default withIronSessionApiRoute(getUsers, sessionOptions);
