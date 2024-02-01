import { renderToBuffer } from "@react-pdf/renderer";
import { withIronSessionApiRoute } from "iron-session/next";
import kebabCase from "lodash.kebabcase";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser, ResolutionEntity, ResolutionEntityEnhanced } from "types";

import React from "react";

import { clientLegacyGraph, fetcherWithParams, legacyFetcherWithParams } from "@graphql/client";
import odooClient from "@graphql/odoo";
import { getLegacyResolutionQuery } from "@graphql/queries/get-legacy-resolution.query";
import { getResolutionQuery } from "@graphql/queries/get-resolution.query";
import { getUsersQuery } from "@graphql/queries/get-users.query";

import { getEnhancedResolutionMapper } from "@lib/resolutions/common";
import { sessionOptions } from "@lib/session";

import Invoice from "@components/redemption-pdf/Invoice";
import ResolutionPdf from "@components/resolutions/Pdf";

const getRedemptionInvoice = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userInfo, total, invoiceNumber } = req.query as { userInfo: string; total: string; invoiceNumber: string };
  const cookie = req.session.cookie;

  if (!cookie) {
    return res.status(401).end("Unauthorised");
  }

  try {
    const pdf = await renderToBuffer(
      // @ts-ignore
      React.createElement(Invoice, {
        userInfo,
        total,
        invoiceNumber: Number(invoiceNumber),
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
