// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../lib/odoo";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // Login with Odoo
  const { username, password } = req.body;

  try {
    const session = await getSession(process.env.ODOO_ENDPOINT!, process.env.ODOO_DB_NAME!, username, password);

    if (session.uid) {
      return res.status(200).json({ uid: session.uid });
    }
    res.status(403).json({});
  } catch (error) {
    res.status(500).json(error);
  }
};

export default login;
