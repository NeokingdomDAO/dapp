import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";
import useSWR, { SWRResponse } from "swr";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "");

export const fetcherGraphqlPublic = <T, V>([query, params]: [TypedDocumentNode<T, V>, any]): Promise<T> =>
  client.request(query, params);

// TODO: add SWR params type
export function useSubgraphGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables> | null,
  params?: any,
  variables?: TVariables extends Record<string, never> ? [] : [TVariables],
): SWRResponse<TResult> {
  const doc = document !== null ? [document, ...(variables || [])] : null;
  return useSWR<TResult>(doc, fetcherGraphqlPublic, params);
}
