import { renderToBuffer } from "@react-pdf/renderer";
import { withIronSessionApiRoute } from "iron-session/next";
import kebabCase from "lodash.kebabcase";
import { NextApiRequest, NextApiResponse } from "next";
import { OdooUser, ResolutionEntity, ResolutionEntityEnhanced } from "types";

import React from "react";

import odooClient from "@graphql/odoo";
import { getUsersQuery } from "@graphql/queries/get-users.query";
import { getLegacyResolutionQuery } from "@graphql/queries/subgraph/get-legacy-resolution-query";
import { getResolutionQuery } from "@graphql/queries/subgraph/get-resolution-query";
import { fetcherGraphqlPublic, isLegacyClientEnabled, legacyFetcherGraphqlPublic } from "@graphql/subgraph";

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
    const graphQlResolutionData: any = await fetcherGraphqlPublic([getResolutionQuery, { id: id as string }]);
    const legacyGraphQlResolutionData: any =
      graphQlResolutionData.resolution === null && isLegacyClientEnabled
        ? await legacyFetcherGraphqlPublic([getLegacyResolutionQuery, { id: id as string }])
        : null;

    if (graphQlResolutionData.resolution === null && legacyGraphQlResolutionData.resolution === null) {
      return res.status(404).send("resolution not found");
    }

    const usersData = await odooClient.query(cookie, getUsersQuery);
    const odooUsersData = (usersData.ResUsers as OdooUser[]).map((user) => ({
      ethereumAddress: user.ethereum_address,
      name: user.display_name,
      email: user.email,
    }));

    const currentTimestamp = +new Date();
    const resolutionData: ResolutionEntityEnhanced = getEnhancedResolutionMapper(currentTimestamp)(
      graphQlResolutionData?.resolution || (legacyGraphQlResolutionData?.resolution as ResolutionEntity),
      true,
    );

    const pdf = await renderToBuffer(
      // @ts-ignore
      React.createElement(ResolutionPdf, {
        resolution: resolutionData,
        usersData: odooUsersData,
        resolutionUrl: `${
          {
            teledisko: "https://dao.teledisko.com",
            neokingdom: "https://dao.neokingdom.org",
            crowdpunk: "https://dao.crowdpunk.love",
            vanilla: "https://dao.vanilla.org",
          }[process.env.NEXT_PUBLIC_PROJECT_KEY]
        }/resolutions/${resolutionData.id}`,
      }),
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="#${resolutionData.id}-${kebabCase(resolutionData.title)}.pdf"`,
    );
    res.setHeader("Content-Type", "application/pdf");

    return res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).send("failed to generate resolution pdf, please try again later");
  }
};

export default withIronSessionApiRoute(getResolutionPdf, sessionOptions);
