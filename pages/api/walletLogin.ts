import { withIronSessionApiRoute } from "iron-session/next";
import { decodeJwt } from "jose";
import { NextApiRequest, NextApiResponse } from "next";

import { getOdooCookie } from "@lib/getOdooCookie";
import odooClient from "@lib/graphql/odoo";
import { getUserByAddressQuery } from "@lib/graphql/queries/get-user-by-address.query";
import { sessionOptions } from "@lib/session";
import userFactory from "@lib/userFactory";

import { OdooUser } from "../../types";

// Login with Wallet+Odoo
const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const response = await fetch(process.env.ODOO_JWT_TOKEN_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const { signing_token } = await response.json();
      const claims = decodeJwt(signing_token);
      res.json({
        signingToken: signing_token,
        message: claims.message,
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
  }

  if (req.method === "POST") {
    const { signingToken, address, sig } = req.body as { signingToken: string; address: string; sig: string };
    const password = JSON.stringify({ signing_token: signingToken, signature: sig });
    const pwdB64 = Buffer.from(password, "utf8").toString("base64");
    try {
      const cookie = await getOdooCookie(address.toLowerCase(), pwdB64);
      const data = await odooClient.query(cookie, getUserByAddressQuery, { address: address.toLowerCase() });
      const userData = data.ResUsers[0] as OdooUser;
      const user = userFactory({ ...userData, username: address.toLowerCase(), password: pwdB64, isLoggedIn: true });
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
  }
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
