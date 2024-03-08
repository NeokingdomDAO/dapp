import { format } from "date-fns";
import { download, generateCsv, mkConfig } from "export-to-csv";

import { getDateFromUnixTimestamp } from "@lib/resolutions/common";

import { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

import { OdooUser, Offer, OfferMatch } from "../types";
import { formatTimestampToDate } from "./utils";

type GetUser = (address: string) => OdooUser | undefined;

const formatOfferMatch = (getUser: GetUser) => (match: OfferMatch, index: number) => {
  const fromUser = getUser(match.matchedFrom);

  let matchString = [
    match.matchedFrom,
    fromUser?.display_name || "",
    bigIntToNum(match.amount),
    formatTimestampToDate(match.createTimestamp),
  ].join(" - ");
  return [`Match ${index + 1} - From Address - From Name - Amount - Date`, matchString];
};

const formatOffersToExport = (offers: Offer[], getUser: GetUser) => {
  const formattedOffers = offers.map((o) => {
    const fromUser = getUser(o.from);
    const matchesObject = Object.fromEntries(o.matches.map(formatOfferMatch(getUser)));

    return {
      "From Address": o.from,
      "From Name": fromUser?.display_name || "",
      Amount: bigIntToNum(o.amount),
      Expiration: formatTimestampToDate(o.expirationTimestamp),
      Creation: formatTimestampToDate(o.createTimestamp),
      ...matchesObject,
    };
  });
  return formattedOffers;
};

export const downloadOffersCsv = (filteredOffers: Offer[], getUser: GetUser) => {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: `token-export-${format(new Date(), "yyyy-MM-dd-HHmmss")}`,
  });
  const csv = generateCsv(csvConfig)(formatOffersToExport(filteredOffers, getUser));
  download(csvConfig)(csv);
};
