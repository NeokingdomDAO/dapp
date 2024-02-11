/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  query GetLegacyResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...legacyResolutionFragment\n    }\n  }\n":
    types.GetLegacyResolutionsDocument,
  "\n  query GetResolution($id: ID!) {\n    resolution(id: $id) {\n      ...resolutionFragment\n    }\n  }\n":
    types.GetResolutionDocument,
  "\n  query GetResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...resolutionFragment\n    }\n  }\n":
    types.GetResolutionsDocument,
  "\n  query GetSubgraphState {\n    state: _meta {\n      hasIndexingErrors\n      block {\n        hash\n        timestamp\n        number\n      }\n    }\n  }\n":
    types.GetSubgraphStateDocument,
  "\n  fragment resolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n":
    types.ResolutionFragmentFragmentDoc,
  "\n  fragment legacyResolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n":
    types.LegacyResolutionFragmentFragmentDoc,
  "\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n":
    types.ResolutionTypeFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetLegacyResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...legacyResolutionFragment\n    }\n  }\n",
): (typeof documents)["\n  query GetLegacyResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...legacyResolutionFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetResolution($id: ID!) {\n    resolution(id: $id) {\n      ...resolutionFragment\n    }\n  }\n",
): (typeof documents)["\n  query GetResolution($id: ID!) {\n    resolution(id: $id) {\n      ...resolutionFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...resolutionFragment\n    }\n  }\n",
): (typeof documents)["\n  query GetResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...resolutionFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetSubgraphState {\n    state: _meta {\n      hasIndexingErrors\n      block {\n        hash\n        timestamp\n        number\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetSubgraphState {\n    state: _meta {\n      hasIndexingErrors\n      block {\n        hash\n        timestamp\n        number\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment resolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n",
): (typeof documents)["\n  fragment resolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment legacyResolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n",
): (typeof documents)["\n  fragment legacyResolutionFragment on Resolution {\n    id\n    title\n    content\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n",
): (typeof documents)["\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
