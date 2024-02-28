import { renderToBuffer } from "@react-pdf/renderer";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

import React from "react";

import { sessionOptions } from "@lib/session";

import Invoice from "@components/redemption-pdf/Invoice";

const getRedemptionInvoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;

  if (!cookie) {
    return res.status(401).end("Unauthorised");
  }

  const invoiceNumber = req.body["invoice-number"];
  const companyInfo = req.body["company-info"];
  const vatNumber = req.body["vat-number"];
  const total = req.body.neok;
  const usdt = req.body.usdt;
  const walletAddress = req.body["wallet-address"];

  try {
    const pdf = await renderToBuffer(
      // @ts-ignore
      React.createElement(Invoice, {
        companyInfo,
        vatNumber,
        total,
        usdt,
        invoiceNumber,
        walletAddress,
      }),
    );

    res.setHeader("Content-Disposition", `inline; filename="#${invoiceNumber}-redemption.pdf"`);
    res.setHeader("Content-Type", "application/pdf");

    return res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("failed to generate resolution pdf, please try again later");
  }
};

export default withIronSessionApiRoute(getRedemptionInvoice, sessionOptions);
