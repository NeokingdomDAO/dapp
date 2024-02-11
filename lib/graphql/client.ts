import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "");
const clientLegacyGraph = new GraphQLClient(process.env.NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT || "");

export const isLegacyClientEnabled = !!process.env.NEXT_PUBLIC_LEGACY_GRAPHQL_ENDPOINT;

export const legacyFetcher = <T>(doc: TypedDocumentNode<T>): Promise<T> => clientLegacyGraph?.request(doc);
export const fetcher = <T>(doc: TypedDocumentNode<T>): Promise<T> => client.request(doc);
export const legacyFetcherWithParams = ([query, params]: [string, any]) =>
  clientLegacyGraph ? clientLegacyGraph.request(query, params) : null;
export const fetcherWithParams = <T>([query, params]: [TypedDocumentNode<T>, any]) => client.request(query, params);
