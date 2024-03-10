import { format } from "date-fns";
import { download, generateCsv, mkConfig } from "export-to-csv";

import { bigIntToNum } from "@hooks/useUserBalanceAndOffers";

import { OdooUser, Offer, OfferMatch } from "../types";
import { formatTimestampToDate } from "./utils";

type GetUserInfo = (address: string) => OdooUser | undefined;

const getMatchHeader = (index: number) => `Match ${index + 1} - From Address - From Name - Amount - Date`;

const formatOfferMatch = (getUserInfo: GetUserInfo) => (match: OfferMatch, index: number) => {
  const fromUser = getUserInfo(match.matchedFrom);

  let matchString = [
    match.matchedFrom,
    fromUser?.display_name || "",
    bigIntToNum(match.amount),
    formatTimestampToDate(match.createTimestamp),
  ].join(" - ");
  return [getMatchHeader(index), matchString];
};

const formatOffersToExport = (offers: Offer[], getUserInfo: GetUserInfo) => {
  let maxNumberOfMatches = 0;
  const formattedOffers = offers.map((o) => {
    const fromUser = getUserInfo(o.from);
    const matchesObject = Object.fromEntries(o.matches.map(formatOfferMatch(getUserInfo)));
    maxNumberOfMatches = Math.max(maxNumberOfMatches, o.matches.length);

    // On older offers the final amount is decreased on each match. This is an hack to fix older offers that were fully matched.
    let amount = bigIntToNum(o.amount);
    if (amount === 0) {
      amount = o.matches.reduce((acc, curr) => acc + bigIntToNum(curr.amount), 0);
    }

    return {
      "From Address": o.from,
      "From Name": fromUser?.display_name || "",
      Amount: amount,
      Expiration: formatTimestampToDate(o.expirationTimestamp),
      Creation: formatTimestampToDate(o.createTimestamp),
      ...matchesObject,
    };
  });

  const headers = ["From Address", "From Name", "Amount", "Expiration", "Creation"];
  for (let i = 0; i < maxNumberOfMatches; i++) headers.push(getMatchHeader(i));

  return { offers: formattedOffers, headers };
};

export const downloadOffersCsv = ({
  offers,
  currentUserAddress,
  getUserInfo,
}: {
  offers: Offer[];
  currentUserAddress?: string;
  getUserInfo: GetUserInfo;
}) => {
  const filteredOffers = offers.filter((offer) => !currentUserAddress || offer.from === currentUserAddress);
  const { offers: formattedOffers, headers } = formatOffersToExport(filteredOffers, getUserInfo);
  const csvConfig = mkConfig({
    columnHeaders: headers,
    filename: `token-export-${format(new Date(), "yyyy-MM-dd-HHmmss")}`,
  });
  const csv = generateCsv(csvConfig)(formattedOffers);
  download(csvConfig)(csv);
};
