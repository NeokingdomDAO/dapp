// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../lib/odoo";

export type OdooUser = {
  email: string;
  ethereum_address: string;
  display_name: string;
  image: string;
};

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const username = "";
  const password = "";

  const session = await getSession(process.env.ODOO_ENDPOINT!, process.env.ODOO_DB_NAME!, username, password);

  const data: OdooUser[] = await session.search("res.users", [], {
    fields: ["display_name", "email", "ethereum_address"],
  });

  res.status(200).json(data);
};

export default users;
