import { ResolutionVoterEnhanced, ResolutionsAcl } from "types";
import { useAccount } from "wagmi";

import { ResolutionVoter } from "@graphql/subgraph/generated/graphql";
import { getDaoManagerQuery } from "@graphql/subgraph/queries/get-dao-manager-query";
import { useSubgraphGraphQL } from "@graphql/subgraph/subgraph-client";

import useShareholderStatus from "./useShareholderStatus";

const DEFAULT_ACL = {
  canCreate: false,
  canUpdate: false,
  canApprove: false,
  canVote: (_: ResolutionVoterEnhanced[]) => false,
  isShareholder: false,
  isManagingBoard: false,
  isContributor: false,
  isExtraneous: true,
};

export default function useResolutionsAcl(): { acl: ResolutionsAcl; error?: boolean; isLoading?: boolean } {
  const { address } = useAccount();
  const { data, error, isLoading } = useSubgraphGraphQL(address ? getDaoManagerQuery : null);
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
    canVote: (resolutionVoters: ResolutionVoterEnhanced[]) =>
      resolutionVoters.map((voter) => voter.address.toLowerCase()).includes(address.toLowerCase()),
    isShareholder: data.daoManager?.shareholdersAddresses.includes(address.toLowerCase()),
    isManagingBoard,
    isContributor,
    isExtraneous,
  };

  return { acl, error, isLoading };
}
