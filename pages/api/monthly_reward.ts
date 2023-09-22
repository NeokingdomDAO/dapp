import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import odooGraphQLClient from "@lib/graphql/odoo";
import { getMonthlyRewardQuery } from "@lib/graphql/queries/get-monthly-reward.query";
import { sessionOptions } from "@lib/session";

import { Timesheet } from "../../store/projectTaskStore";

type AccountAnalyticLine = Timesheet & {
  user_id: { id: number; name: string; email: string; ethereum_address: string };
  token_amount: number;
};

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

    const data = await odooGraphQLClient.query(cookie, getMonthlyRewardQuery, {
      startDate: startDayOfMonth,
      endDate: lastDayOfMonth,
    });

    const tokenAllocations = groupTimeEntriesByUser(data?.AccountAnalyticLine || []);

    const getResolution = () => {
      const fullMonth = format(lastMonth, "MMMM");
      const startDate = format(new Date(startDayOfMonth), "dd.MM.yyyy");
      const endDate = format(new Date(lastDayOfMonth), "dd.MM.yyyy");
      const title = `Rewarding Contributors for ${fullMonth} ${lastMonth.getFullYear()}`;
      let content = `1. Object the confirmation of the contributed time by Contributors to the DAO from ${startDate} to ${endDate} or the minting of the corresponding number of tokens to them in the following manner:\n`;
      tokenAllocations.forEach((tokenAllocation, index) => {
        const { user, hours_amount, token_amount } = tokenAllocation;
        content += `${index + 1}. ${user.name}, ${hours_amount.toFixed(2)} hours, ${token_amount.toFixed(2)} tokens;\n`;
      });
      return {
        title,
        content,
      };
    };

    const rewards = {
      rewards: {
        interval: {
          start: new Date(startDayOfMonth).toISOString(),
          end: new Date(lastDayOfMonth).toISOString(),
        },
        token_allocations: tokenAllocations,
      },
      resolution: getResolution(),
    };

    return res.status(200).json(rewards);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default withIronSessionApiRoute(getMonthlyReward, sessionOptions);

function groupTimeEntriesByUser(timeEntries: AccountAnalyticLine[]) {
  const total = timeEntries.reduce((acc, timeEntry) => {
    const { user_id, unit_amount, token_amount } = timeEntry;
    const { id } = user_id;
    if (!acc[id]) {
      acc[id] = { user: user_id, hours_amount: 0, token_amount: 0 };
    }
    acc[id].hours_amount += unit_amount;
    acc[id].token_amount += token_amount;
    return acc;
  }, {} as Record<number, { user: AccountAnalyticLine["user_id"]; hours_amount: number; token_amount: number }>);
  return Object.values(total);
}
