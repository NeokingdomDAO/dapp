import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "");

export const fetcher = (query: string) => client.request(query);
export const fetcherWithParams = ([query, params]: [string, any]) => client.request(query, params);
