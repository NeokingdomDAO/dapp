import { renderToBuffer } from "@react-pdf/renderer";
import { withIronSessionApiRoute } from "iron-session/next";
import kebabCase from "lodash.kebabcase";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser, ResolutionEntity, ResolutionEntityEnhanced } from "types";

import React from "react";

import { fetcherWithParams } from "@graphql/client";
import odooClient from "@graphql/odoo";
import { getResolutionQuery } from "@graphql/queries/get-resolution.query";
import { getUsersQuery } from "@graphql/queries/get-users.query";

import { getEnhancedResolutionMapper } from "@lib/resolutions/common";
import { sessionOptions } from "@lib/session";

import ResolutionPdf from "@components/resolutions/Pdf";

const getResolutionPdf = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const cookie = req.session.cookie;
  if (!cookie) {
    return res.status(401).end("Unauthorised");
  }

  try {
    const graphQlResolutionData: any = await fetcherWithParams([getResolutionQuery, { id }]);

    if (graphQlResolutionData.resolution === null) {
      return res.status(404).send("resolution not found");
    }

    const usersData = await odooClient(cookie, getUsersQuery);
    const odooUsersData = (usersData.ResUsers as OdooUser[]).map((user) => ({
      ethereumAddress: user.ethereum_address,
      name: user.display_name,
      email: user.email,
    }));

    const currentTimestamp = +new Date();
    const resolutionData: ResolutionEntityEnhanced = getEnhancedResolutionMapper(currentTimestamp)(
      graphQlResolutionData?.resolution as ResolutionEntity,
      true,
    );

    const pdf = await renderToBuffer(
      // @ts-ignore
      React.createElement(ResolutionPdf, {
        resolution: resolutionData,
        usersData: odooUsersData,
        resolutionUrl: `${
          process.env.NEXT_PUBLIC_PROJECT_KEY === "teledisko"
            ? "https://dao.teledisko.com"
            : "https://dao.neokingdom.org"
        }/resolutions/${resolutionData.id}`,
      }),
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="#${resolutionData.id}-${kebabCase(resolutionData.title)}.pdf"`,
    );
    res.setHeader("Content-Type", "application/pdf");

    return res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("failed to generate resolution pdf, please try again later");
  }
};

export default withIronSessionApiRoute(getResolutionPdf, sessionOptions);
