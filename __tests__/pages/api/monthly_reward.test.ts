import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, createRequest, createResponse } from "node-mocks-http";

import odooGraphQLClient from "@lib/graphql/odoo";

import { getMonthlyReward } from "../../../pages/api/monthly_reward";
import ApiMonthlyRewardResult from "../../fixtures/api_monthly_reward_result.json";
import OdooMonthlyRewardQueryResult from "../../fixtures/odoo_monthly_reward_query_result.json";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

describe("/api/monthly_reward", () => {
  test("returns the monthly reward data", async () => {
    const { req, res } = createMocks<ApiRequest, ApiResponse>({
      method: "GET",
      session: {
        cookie: "cookie",
        user: { id: 17, name: "Barbara" },
      },
    });

    odooGraphQLClient.query = jest.fn().mockReturnValue(OdooMonthlyRewardQueryResult);

    await getMonthlyReward(req, res);
    const data = JSON.parse(res._getData());

    expect(res.statusCode).toBe(200);
    expect(data).toMatchObject(ApiMonthlyRewardResult);
  });
});
