import { v4 as uuidv4 } from "uuid";

export const ODOO_ENDPOINT = "https://odoo.neokingdom.org/jsonrpc";
export const ODOO_DB_NAME = "neokingdomdao";
export const STAGE_TO_ID_MAP = {
  backlog: 29,
  progress: 30,
  done: 31,
  approved: 32,
};

async function jsonRpc(url: string, method: string, params: any) {
  const data = {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: uuidv4(),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (json.result !== undefined) {
    return json.result;
  } else if (json.error.data.message !== undefined) {
    throw new Error(json.error.data.message);
  } else {
    console.error(response);
    throw new Error("Unknown error");
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

function tuplify(query: { [key: string]: string } | string[] = {}) {
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
  const uid: number = await call(url, "common", "login", db, username, password);
  const model = (...args: any[]) => call(url, "object", "execute_kw", db, uid, password, ...args);
  return {
    create: async (name: string, object: any) => model(name, "create", [object]),
    read: async (name: string, ids: number[]) => model(name, "read", [ids]),
    search: async (name: string, query: any, fields?: any) => model(name, "search_read", [tuplify(query)], fields),
    update: async (name: string, id: number, object: any) => model(name, "write", [[id], object]),
    remove: async (name: string, ids: number[]) => model(name, "unlink", [ids]),
    uid,
  };
}
