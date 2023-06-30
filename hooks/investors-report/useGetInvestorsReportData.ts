import { format, getMonth, getYear } from "date-fns";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import useSWR from "swr";

import { fetcher } from "@graphql/client";
import { getTokenMintings } from "@graphql/queries/get-tokens-mintings.query";

import { bigIntToBigNum } from "@hooks/useUserBalanceAndOffers";

const REFETCH_AFTER_MS = 10000;

type DATA_POINT = {
  minted: number;
  monthIndex: number;
  month: string;
};

export default function useGetInvestorsReportData(): {
  data: DATA_POINT[];
  isLoading: boolean;
  dataAccumulated: DATA_POINT[];
} {
  const { data, isLoading } = useSWR<any>(getTokenMintings, fetcher, { refreshInterval: REFETCH_AFTER_MS });

  if (isLoading) {
    return { data, isLoading, dataAccumulated: [] };
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
      monthIndex: item.monthIndex,
    })) as DATA_POINT[];

  return {
    data: finalData,
    dataAccumulated: finalData.map((item, index) => {
      return {
        ...item,
        minted: finalData.slice(0, index + 1).reduce((acc, item) => acc + item.minted, 0),
      };
    }),
    isLoading,
  };
}
