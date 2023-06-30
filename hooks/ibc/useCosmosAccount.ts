import { AccountResponse, generateEndpointAccount } from "@evmos/provider";
import useSWR from "swr";

import { fetcher } from "@lib/net";

import { COSMOS_NODE_URL } from "./utils";

// Find node urls for either mainnet or testnet here:
// https://docs.evmos.org/develop/api/networks.

export default function useCosmosAccount(senderAddress: string) {
  const nodeUrl = COSMOS_NODE_URL["evmos"];
  const queryEndpoint = `${nodeUrl}${generateEndpointAccount(senderAddress)}`;
  const { data, error, isLoading } = useSWR(
    senderAddress && senderAddress.startsWith("evmos") ? queryEndpoint : null,
    fetcher,
  );
  if (!data || error) console.log("Error fetching account", data, error);
  return { account: data?.account as AccountResponse["account"] | null, isLoading };
}
