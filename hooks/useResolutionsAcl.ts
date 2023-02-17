import useSWR from "swr";
import { ResolutionVoter, ResolutionsAcl } from "types";
import { useAccount } from "wagmi";

import { fetcher } from "@graphql/client";
import { getDaoManagerQuery } from "@graphql/queries/get-dao-manager.query";

const DEFAULT_ACL = {
  canCreate: Boolean(false),
  canUpdate: Boolean(false),
  canApprove: Boolean(false),
  canVote: (_: ResolutionVoter[]) => Boolean(false),
  isShareholder: Boolean(false),
  isManagingBoard: Boolean(false),
  isContributor: Boolean(false),
};

export default function useResolutionsAcl(): { acl: ResolutionsAcl; error?: boolean; isLoading?: boolean } {
  const { address } = useAccount();
  const { data, error, isLoading } = useSWR(address ? getDaoManagerQuery : null, fetcher);

  if (!data || error || !address || isLoading) {
    return { acl: DEFAULT_ACL, error, isLoading };
  }

  const isContributor = data.daoManager.contributorsAddresses.includes(address.toLowerCase());
  const isManagingBoard = data.daoManager.managingBoardAddresses.includes(address.toLowerCase());
  const acl = {
    canCreate: isContributor,
    canUpdate: isManagingBoard,
    canApprove: isManagingBoard,
    canVote: (resolutionVoters: ResolutionVoter[]) =>
      resolutionVoters.map((voter) => voter.address.toLowerCase()).includes(address.toLowerCase()),
    isShareholder: data.daoManager.shareholdersAddresses.includes(address.toLowerCase()),
    isManagingBoard,
    isContributor,
  };

  return { acl, error, isLoading };
}
