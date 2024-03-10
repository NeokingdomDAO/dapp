import { v4 as uuid } from "uuid";

export const ODOO_ENDPOINT = `${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/jsonrpc`;
export const ODOO_AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_ODOO_ENDPOINT}/web/session/authenticate`;
export const ODOO_DB_NAME = {
  neokingdom: "neokingdomdao",
  teledisko: "odoo",
  crowdpunk: "neok_test_psql",
  vanilla: "odoo",
}[process.env.NEXT_PUBLIC_PROJECT_KEY];

async function jsonRpc(url: string, method: string, params: any) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: uuid(),
    }),
  });
  const resBody = await response.json();
  if (response.ok && resBody.result) {
    return resBody.result;
  } else {
    console.log("🐞 > Odoo Error:", resBody);
    const message = resBody.error?.data?.message || "Unknown error";
    throw new Error(message);
  }
}

async function call(
  url: string,
  service: string,
  method: string,
  db: string,
  uid: string | number,
  password: string,
  ...args: any
) {
  return await jsonRpc(url, "call", {
    service,
    method,
    args: [db, uid, password, ...args],
  });
}

function tuplify(query: Record<string, string> | string[] = {}) {
  if (Array.isArray(query)) {
    return query;
  }
  const params = [];
  for (let key of Object.keys(query)) {
    params.push([key, "=", query[key]]);
  }
  return params;
}

export async function getSession(url: string, db: string, username: string, password: string) {
  const user = await jsonRpc(ODOO_AUTH_ENDPOINT, "call", { db, login: username, password });
  const model = (...args: any[]) => call(url, "object", "execute_kw", db, user.uid, password, ...args);
  return {
    create: async (name: string, object: any) => model(name, "create", [object]),
    read: async (name: string, ids: number[]) => model(name, "read", [ids]),
    search: async (name: string, query: any, fields?: any) => model(name, "search_read", [tuplify(query)], fields),
    update: async (name: string, id: number, object: any) => model(name, "write", [[id], object]),
    remove: async (name: string, ids: number[]) => model(name, "unlink", [ids]),
    uid: user.uid,
  };
}
