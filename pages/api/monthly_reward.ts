import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import odooGraphQLClient from "@lib/graphql/odoo";
import { getMonthlyRewardQuery } from "@lib/graphql/queries/get-monthly-reward.query";
import { sessionOptions } from "@lib/session";

import { Timesheet } from "../../store/projectTaskStore";

export const getMonthlyReward = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  try {
    const lastMonth = subMonths(new Date(), 1);
    const startDayOfMonth = format(startOfMonth(lastMonth), "yyyy-MM-dd");
    const lastDayOfMonth = format(endOfMonth(lastMonth), "yyyy-MM-dd");

    const data = await odooGraphQLClient(cookie, getMonthlyRewardQuery, {
      startDate: startDayOfMonth,
      endDate: lastDayOfMonth,
    });
    const rewards = groupTimeEntriesByUser(data.AccountAnalyticLine);
    console.log("🐞 > total:", rewards);
    return res.status(200).json(rewards);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default withIronSessionApiRoute(getMonthlyReward, sessionOptions);

function groupTimeEntriesByUser(timeEntries: Timesheet[]) {
  const total = timeEntries.reduce((acc, timeEntry) => {
    const { user_id, unit_amount } = timeEntry;
    if (!user_id) return acc;
    const { id, name } = user_id;
    if (!acc[id]) {
      acc[id] = { id, name, hours_amount: 0, token_amount: 0 };
    }
    acc[id].hours_amount += unit_amount;
    acc[id].token_amount += token_amount;
    return acc;
  }, {} as Record<number, { id: number; name: string; hours_amount: number; token_amount: number }>);
  return Object.values(total);
}

// Tassilo Nils Boßmann, 66.87 hours, 4965.00 tokens;
// Marko Talur, 29.50 hours, 2950.00 tokens;
// Stefano Ceschi Berrini, 13.78 hours, 1378.33 tokens;
// Peter Schwarz, 8.22 hours, 821.67 tokens;
// Benjamin von Uphues, 22.95 hours, 2295.00 tokens;
// Ayesha Hana Yoosuf, 107.32 hours, 7448.75 tokens;
// Ragnar Reindoff, 31.92 hours, 2393.75 tokens;
// Nicola Miotto, 53.00 hours, 5300.00 tokens;
// Alberto Granzotto, 67.42 hours, 6512.50 tokens;
