import { request } from "graphql-request";

export default async function odooClient(cookie: string, query: any, variables = {}) {
  try {
    await request({
      url: process.env.ODOO_GRAPHQL_ENPOINT,
      document: query,
      variables,
      requestHeaders: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
    });
  } catch (error: any) {
    const err = JSON.parse(error.response.error);
    return err.data;
  }
}
