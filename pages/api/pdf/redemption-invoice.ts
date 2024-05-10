import { renderToBuffer } from "@react-pdf/renderer";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import React from "react";

import { sessionOptions } from "@lib/session";

import Invoice from "@components/redemption-pdf/Invoice";

const VatRegion = z.enum(["estonia", "eu", "non-eu"]);

const InvoiceData = z.object({
  invoiceNumber: z.string(),
  companyInfo: z.string(),
  walletAddress: z.string(),
  vatNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  vatRegion: VatRegion.optional(),
  total: z.string(),
  usdt: z.string(),
});

export type InvoiceData = z.infer<typeof InvoiceData>;
export type VatRegion = z.infer<typeof VatRegion>;

const getInvoiceObject = (req: NextApiRequest) => {
  const invoiceNumber = req.body["invoice-number"];
  const companyInfo = req.body["company-info"];
  const vatNumber = req.body["vat-number"];
  const registrationNumber = req.body["registration-number"];
  const vatRegion = req.body["vat-region"];
  const total = req.body.neok;
  const usdt = req.body.usdt;
  const walletAddress = req.body["wallet-address"];

  const obj = {
    invoiceNumber,
    companyInfo,
    vatNumber,
    registrationNumber,
    vatRegion,
    total,
    usdt,
    walletAddress,
  };

  return InvoiceData.parse(obj);
};

const getRedemptionInvoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookie = req.session.cookie;

  if (!cookie) {
    return res.status(401).end("Unauthorised");
  }

  let invoiceObj;

  try {
    invoiceObj = getInvoiceObject(req);
  } catch (error) {
    res.status(500).json(error);
  }

  try {
    const pdf = await renderToBuffer(
      // @ts-ignore
      React.createElement(Invoice, invoiceObj),
    );

    res.setHeader("Content-Disposition", `inline; filename="#${invoiceObj?.invoiceNumber}-redemption.pdf"`);
    res.setHeader("Content-Type", "application/pdf");

    return res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: "failed to generate resolution pdf, please try again later" });
  }
};

export default withIronSessionApiRoute(getRedemptionInvoice, sessionOptions);
