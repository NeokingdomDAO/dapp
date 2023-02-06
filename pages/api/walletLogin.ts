import { withIronSessionApiRoute } from "iron-session/next";
import { decodeJwt } from "jose";
import { NextApiRequest, NextApiResponse } from "next";

import { sessionOptions } from "@lib/session";

// Login with Wallet+Odoo
const loginRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const r = await fetch("https://odoo.neokingdom.org/auth_jwt_w3", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await r.json();
    const claims = decodeJwt(json.signing_token);
    res.json({
      signingToken: json.signing_token,
      message: claims.message,
    });
  } else {
    const { signingToken, address, sig } = req.body as { signingToken: string; address: string; sig: string };
    const login = address;
    const password = btoa(JSON.stringify({ signing_token: signingToken, signature: sig }));

    let csrfToken: string;
    let cookie: string | null;

    // Get CSRF Token and cookie
    const csrfReq = await fetch("https://odoo.neokingdom.org/web/login", {
      credentials: "omit",
      referrer: "https://odoo.neokingdom.org/web",
    });

    cookie = csrfReq.headers.get("Set-Cookie");

    if (!cookie) {
      console.log("Cannot get cookie");
      return res.status(500);
    }

    const body = await csrfReq.text();
    // Forgive me father for I've sinned
    const match = body.match(/\s+csrf_token:\s+"([^"]+)"/);
    if (match && match[1]) {
      csrfToken = match[1];
    } else {
      console.log("Cannot get CSRF token");
      return res.status(500).json({});
    }

    const loginResp = await fetch("https://odoo.neokingdom.org/web/login", {
      method: "POST",
      referrer: "https://odoo.neokingdom.org/web/login",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
      },
      // Do not follow the redirect, we need to grab that cookie before the 303
      redirect: "manual",
      credentials: "include",
      mode: "cors",
      body: new URLSearchParams({
        login,
        password,
        csrf_token: csrfToken,
        redirect: "",
      }),
    });

    cookie = loginResp.headers.get("Set-Cookie");

    if (!cookie) {
      console.log("Cannot get cookie");
      return res.status(500).json({});
    }

    req.session.cookie = cookie;
    await req.session.save();

    return res.status(200).json({ loggedIn: true });
  }
};

export default withIronSessionApiRoute(loginRoute, sessionOptions);
