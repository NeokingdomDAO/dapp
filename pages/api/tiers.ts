// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser } from "types";

import odooGraphQLClient from "@lib/graphql/odoo";
import { getTiersQuery } from "@lib/graphql/queries/get-tiers.query";
import { sessionOptions } from "@lib/session";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const data = await odooGraphQLClient(cookie, getTiersQuery, { userId: user.id });
  res.status(200).json(data.AccountAnalyticTier);
};

export default withIronSessionApiRoute(getUsers, sessionOptions);
