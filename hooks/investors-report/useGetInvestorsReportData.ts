import { format, getMonth, getYear } from "date-fns";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

import { getTokenMintings } from "@graphql/subgraph/queries/get-tokens-mintings-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import { bigIntToBigNum } from "@hooks/useUserBalanceAndOffers";

const REFETCH_AFTER_MS = 10000;

type DATA_POINT = {
  minted: number;
  sortIndex: number;
  month: string;
  year: number;
};

const INITIAL_MONTHS_DATA =
  process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom"
    ? [
        {
          minted: 730,
          month: "Jan",
          sortIndex: 202301,
          year: 2023,
        },
        {
          minted: 55294.8313,
          month: "Feb",
          sortIndex: 202302,
          year: 2023,
        },
        {
          minted: 44581.361,
          month: "Mar",
          sortIndex: 202303,
          year: 2023,
        },
        {
          minted: 39986.6669,
          month: "Apr",
          sortIndex: 202304,
          year: 2023,
        },
      ]
    : [];

export default function useGetInvestorsReportData(): {
  data: DATA_POINT[];
  isLoading: boolean;
  dataAccumulated: DATA_POINT[];
  error: any;
} {
  const { data, isLoading, error } = useSubgraphGraphQL(getTokenMintings, { refreshInterval: REFETCH_AFTER_MS });

  if (isLoading || !data || error) {
    return { data: [], isLoading, dataAccumulated: [], error };
  }

  const { tokenMintings } = data;

  const monthsData = tokenMintings.reduce(
    (allData: any, { mintedTimestamp, amounts }: { mintedTimestamp: number; amounts: BigInt[] }) => {
      const mintedTimestampDate = new Date(mintedTimestamp * 1000);
      const month = format(mintedTimestampDate, "MMM");
      const monthIndex = getMonth(mintedTimestampDate);
      const yearIndex = getYear(mintedTimestampDate);
      const totalMinted = amounts.reduce((sum, amount) => {
        return sum.add(bigIntToBigNum(amount));
      }, BigNumber.from(BigInt(0)));
      allData[yearIndex] = allData[yearIndex] || {};
      allData[yearIndex][month] = {
        minted: (allData[yearIndex][month]?.minted || BigNumber.from(BigInt(0))).add(totalMinted),
        sortIndex: Number(`${yearIndex}${monthIndex < 10 ? `0${monthIndex}` : monthIndex}`),
        year: yearIndex,
        month: `${month} '${String(yearIndex).slice(2)}`,
      };
      return allData;
    },
    {},
  );

  // @ts-ignore
  const finalData = Object.values(monthsData)
    // @ts-ignore
    .reduce((all, yearData) => [...all, ...Object.values(yearData)], [])
    .sort((a: any, b: any) => a.sortIndex - b.sortIndex)
    .map((item: any) => ({
      minted: Number(formatEther(item.minted)),
      month: item.month,
      sortIndex: item.sortIndex,
      year: item.year,
    })) as DATA_POINT[];

  const results = INITIAL_MONTHS_DATA.concat(INITIAL_MONTHS_DATA.length > 0 ? finalData.slice(1) : finalData);

  return {
    data: results,
    dataAccumulated: results.map((item, index) => {
      return {
        ...item,
        minted: results.slice(0, index + 1).reduce((acc, item) => acc + item.minted, 0),
      };
    }),
    isLoading,
    error,
  };
}
