import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import useSWR, { SWRConfig, SWRResponse } from "swr";

import { fetcherGraphqlPublic, isLegacyClientEnabled, legacyFetcher } from "./client";

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables> | null,
  params?: any,
  variables?: TVariables extends Record<string, never> ? [] : [TVariables],
): SWRResponse<TResult> {
  return useSWR<TResult>([document, ...(variables || [])], fetcherGraphqlPublic, params);
}

export function useLegacyGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables> | null,
  params: any,
  variables?: TVariables extends Record<string, never> ? [] : [TVariables],
): SWRResponse<TResult> {
  const doc = !isLegacyClientEnabled ? document : null;
  return useSWR<TResult>([doc, ...(variables || [])], legacyFetcher, params);
}
