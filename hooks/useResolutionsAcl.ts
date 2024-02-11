import useSWR from "swr";
import { ResolutionsAcl } from "types";
import { useAccount } from "wagmi";

import { fetcher } from "@graphql/client";
import { getDaoManagerQuery } from "@graphql/queries/get-dao-manager.query";

import { ResolutionVoter } from "../gql/graphql";
import useShareholderStatus from "./useShareholderStatus";

const DEFAULT_ACL = {
  canCreate: false,
  canUpdate: false,
  canApprove: false,
  canVote: (_: ResolutionVoter[]) => false,
  isShareholder: false,
  isManagingBoard: false,
  isContributor: false,
  isExtraneous: true,
};

export default function useResolutionsAcl(): { acl: ResolutionsAcl; error?: boolean; isLoading?: boolean } {
  const { address } = useAccount();
  const { data, error, isLoading } = useSWR<any>(address ? getDaoManagerQuery : null, fetcher);
  const { daoUsers, isLoading: isLoadingShareholderStatus, getShareholderStatus } = useShareholderStatus();

  if (!data || error || !address || isLoading || isLoadingShareholderStatus) {
    return { acl: DEFAULT_ACL, error, isLoading: isLoading || isLoadingShareholderStatus };
  }

  const isContributor = data.daoManager?.contributorsAddresses.includes(address.toLowerCase());
  const isManagingBoard = data.daoManager?.managingBoardAddresses.includes(address.toLowerCase());

  const isExtraneous = daoUsers ? getShareholderStatus(address).length === 0 : true;

  const acl = {
    canCreate: isContributor,
    canUpdate: isManagingBoard,
    canApprove: isManagingBoard,
    canVote: (resolutionVoters: ResolutionVoter[]) =>
      resolutionVoters.map((voter) => voter.address.toLowerCase()).includes(address.toLowerCase()),
    isShareholder: data.daoManager?.shareholdersAddresses.includes(address.toLowerCase()),
    isManagingBoard,
    isContributor,
    isExtraneous,
  };

  return { acl, error, isLoading };
}
