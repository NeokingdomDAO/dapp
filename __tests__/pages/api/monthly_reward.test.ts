import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, createRequest, createResponse } from "node-mocks-http";

import { getMonthlyReward } from "../../../pages/api/monthly_reward";

type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

describe("/api/monthly_reward", () => {
  test("returns a list of projects", async () => {
    const { req, res } = createMocks<ApiRequest, ApiResponse>({
      method: "GET",
      session: {
        cookie:
          "session_id=eeb307e1213dd165e43cb5da6caeef0343ef689a; Expires=Wed, 29 Nov 2023 14:07:19 GMT; Max-Age=7776000; HttpOnly; Path=/",
        user: { id: 17, name: "Gianluca Donato" },
      },
    });

    await getMonthlyReward(req, res);
    const data = res._getData();
    console.log("🐞 > data:", data);

    expect(res.statusCode).toBe(200);
    // expect(data).toEqual([
    //   { id: 1, name: "Alice" },
    //   { id: 2, name: "Bob" },
    // ]);
  });
});
