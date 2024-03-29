import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

import { useCallback, useMemo } from "react";

import { getShareholdersInfo } from "@graphql/subgraph/queries/get-shareholders-info-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import { ShareholderStatus } from "../types";

const bigIntToNum = (bigIntNum: BigInt) => Number(formatEther(BigNumber.from(bigIntNum)));

export default function useShareholderStatus() {
  const { data, isLoading, error } = useSubgraphGraphQL(getShareholdersInfo);

  const getShareholderStatus: (address: string) => ShareholderStatus[] = useCallback(
    (address: string) => {
      if (!data || !address) {
        return [];
      }
      return [
        data.daoManager?.managingBoardAddresses.includes(address.toLowerCase()) && "ManagingBoard",
        data.daoManager?.shareholdersAddresses.includes(address.toLowerCase()) && "Shareholder",
        data.daoManager?.contributorsAddresses.includes(address.toLowerCase()) && "Contributor",
        data.daoManager?.investorsAddresses.includes(address.toLowerCase()) && "Investor",
      ].filter(Boolean) as ShareholderStatus[];
    },
    [data],
  );

  const [daoUsers, daoUsersAddresses] = useMemo(() => {
    if (!data) {
      return [];
    }

    const totalVotingPower = bigIntToNum(data?.daoManager?.totalVotingPower || BigInt(0));

    const users = data?.daoUsers.reduce((computed: { [id: string]: { power: string } }, daoUser) => {
      const userVotingPower = bigIntToNum(daoUser.votingPower);
      computed[daoUser.address] = {
        power: ((100 * userVotingPower) / totalVotingPower).toFixed(2),
      };
      return computed;
    }, {});

    const addresses = Object.keys(users)
      .filter((address) => getShareholderStatus(address).length > 0)
      .sort((userA, userB) => Number(users[userB].power) - Number(users[userA].power));

    return [users, addresses];
  }, [data, getShareholderStatus]);

  return {
    daoUsers,
    daoUsersAddresses,
    getShareholderStatus,
    isLoading,
    error,
  };
}
