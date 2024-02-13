import { useAccount } from "wagmi";

import { getDelegationUsers } from "@graphql/queries/subgraph/get-delegation-users-query";
import { useGraphQL } from "@graphql/useGraphql";

import { isSameAddress } from "@lib/utils";

import { DelegationUser } from "../types";

const REFRESH_INTERVAL_MS = 10000;

export default function useDelegationStatus() {
  const { address } = useAccount();

  const { data, error, isLoading } = useGraphQL(address ? getDelegationUsers : null, {
    refreshInterval: REFRESH_INTERVAL_MS,
  });

  if (error || isLoading || !data) {
    return {
      data: {
        signerDelegatedBy: [],
        signerDelegationStatus: null,
        usersList: [],
      },
      error,
      isLoading,
    };
  }

  const delegationUsers = (data?.delegationUsers || []) as DelegationUser[];

  const signerDelegationStatus = delegationUsers.find((user) => isSameAddress(user.address, address as string));

  // if this is null it means noone has delegated current user, and therefore they can delegate
  const signerDelegatedBy = delegationUsers.filter(
    (user) => !isSameAddress(user.address, address as string) && isSameAddress(user.delegated, address as string),
  );

  return {
    data: {
      signerDelegatedBy,
      signerDelegationStatus: {
        ...signerDelegationStatus,
        isDelegating: !isSameAddress(
          signerDelegationStatus?.address as string,
          signerDelegationStatus?.delegated as string,
        ),
      },
      usersList: delegationUsers
        .filter((user) => !isSameAddress(user.address, address as string))
        .map((user) => ({
          ...user,
          canBeDelegated: isSameAddress(user.address, user.delegated) && signerDelegatedBy.length === 0,
        })),
    },
  };
}
