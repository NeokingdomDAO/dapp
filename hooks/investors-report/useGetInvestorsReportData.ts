import { format, getMonth, getYear } from "date-fns";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

import { getTokenMintings } from "@graphql/queries/subgraph/get-tokens-mintings-query";
import { useSubgraphGraphQL } from "@graphql/subgraph";

import { bigIntToBigNum } from "@hooks/useUserBalanceAndOffers";

const REFETCH_AFTER_MS = 10000;

type DATA_POINT = {
  minted: number;
  monthIndex: number;
  month: string;
};

const INITIAL_MONTHS_DATA =
  process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom"
    ? [
        {
          minted: 730,
          month: "Jan",
          monthIndex: 2023,
        },
        {
          minted: 55294.8313,
          month: "Feb",
          monthIndex: 2024,
        },
        {
          minted: 44581.361,
          month: "Mar",
          monthIndex: 2025,
        },
        {
          minted: 39986.6669,
          month: "Apr",
          monthIndex: 2026,
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
      const month = format(new Date(mintedTimestamp * 1000), "MMM");
      const monthIndex = getMonth(new Date(mintedTimestamp * 1000));
      const yearIndex = getYear(new Date(mintedTimestamp * 1000));
      const totalMinted = amounts.reduce((sum, amount) => {
        return sum.add(bigIntToBigNum(amount));
      }, BigNumber.from(BigInt(0)));
      allData[month] = {
        minted: (allData[month]?.minted || BigNumber.from(BigInt(0))).add(totalMinted),
        sortIndex: yearIndex + monthIndex,
        month,
      };
      return allData;
    },
    {},
  );

  const finalData = Object.values(monthsData)
    .sort((a: any, b: any) => a.sortIndex - b.sortIndex)
    .map((item: any) => ({
      minted: Number(formatEther(item.minted)),
      month: item.month,
      monthIndex: item.sortIndex,
    })) as DATA_POINT[];

  const results = INITIAL_MONTHS_DATA.concat(finalData.slice(1));

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
