import { request } from "graphql-request";

const odooClient = {
  async query(cookie: string, query: any, variables = {}) {
    try {
      await request({
        url: process.env.ODOO_GRAPHQL_ENDPOINT,
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
  },
};

export default odooClient;
