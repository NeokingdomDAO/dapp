import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "");
const clientLegacyGraph = new GraphQLClient(process.env.NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT || "");

export const isLegacyClientEnabled = !!process.env.NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT;

export const fetcherGraphqlPublic = <T, V>([query, params]: [TypedDocumentNode<T, V>, any]): Promise<T> =>
  client.request(query, params);
export const legacyFetcherGraphqlPublic = <T, V>([query, params]: [TypedDocumentNode<T, V>, any]): Promise<T> =>
  clientLegacyGraph?.request(query, params);
