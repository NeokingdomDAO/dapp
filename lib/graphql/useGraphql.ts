import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import useSWR, { SWRResponse } from "swr";

import { fetcher, isLegacyClientEnabled, legacyFetcher } from "./client";

//TODO Andrea: handle params

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables> | null,
  params: any, // TODO
  // ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): SWRResponse<TResult> {
  // return useQuery({queryKey: [(document.definitions[0] as any).name.value,
  //   variables],
  //   queryFn: async ({ queryKey }) =>
  //   fetcherRQ(
  //     document,
  //     queryKey[1] ? queryKey[1] : undefined
  //   )}
  // )

  return useSWR<TResult>(document, fetcher, params);
}

export function useLegacyGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables> | null,
  params: any, // TODO
  // ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): SWRResponse<TResult> {
  const doc = !isLegacyClientEnabled ? document : null;

  // return useQuery({queryKey: [(document.definitions[0] as any).name.value,
  //   variables],
  //   queryFn: async ({ queryKey }) =>
  //   fetcherRQ(
  //     document,
  //     queryKey[1] ? queryKey[1] : undefined
  //   )}
  // )

  return useSWR<TResult>(doc, legacyFetcher, params);
}
