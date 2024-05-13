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
  "\n  fragment daoManagerFragment on DaoManager {\n    id\n    managingBoardAddresses\n    contributorsAddresses\n    investorsAddresses\n    shareholdersAddresses\n    totalVotingPower\n  }\n":
    types.DaoManagerFragmentFragmentDoc,
  "\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n":
    types.ResolutionTypeFragmentFragmentDoc,
  "\n  fragment resolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n":
    types.ResolutionFragmentFragmentDoc,
  "\n  fragment legacyResolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n":
    types.LegacyResolutionFragmentFragmentDoc,
  '\n  query GetDaoManager {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n  }\n':
    types.GetDaoManagerDocument,
  "\n  query GetDelegationUsers {\n    delegationUsers {\n      id\n      address\n      delegated\n    }\n  }\n":
    types.GetDelegationUsersDocument,
  "\n  query GetLegacyResolution($id: ID!) {\n    resolution(id: $id) {\n      ...legacyResolutionFragment\n    }\n  }\n":
    types.GetLegacyResolutionDocument,
  "\n  query GetLegacyResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...legacyResolutionFragment\n    }\n  }\n":
    types.GetLegacyResolutionsDocument,
  "\n  query GetResolution($id: ID!) {\n    resolution(id: $id) {\n      ...resolutionFragment\n    }\n  }\n":
    types.GetResolutionDocument,
  "\n  query GetResolutionTypes {\n    resolutionTypes {\n      ...resolutionTypeFragment\n    }\n  }\n":
    types.GetResolutionTypesDocument,
  "\n  query GetResolutions {\n    resolutions(orderBy: createTimestamp, orderDirection: desc) {\n      ...resolutionFragment\n    }\n  }\n":
    types.GetResolutionsDocument,
  '\n  query GetShareholdersInfo {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n\n    daoUsers {\n      address\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n    }\n  }\n':
    types.GetShareholdersInfoDocument,
  "\n  query GetSubgraphState {\n    state: _meta {\n      hasIndexingErrors\n      block {\n        hash\n        timestamp\n        number\n      }\n    }\n  }\n":
    types.GetSubgraphStateDocument,
  "\n  query GetTokenMintings {\n    tokenMintings {\n      id\n      amounts\n      mintedTimestamp\n    }\n  }\n":
    types.GetTokenMintingsDocument,
  "\n  query GetTokensPageData($userId: ID!) {\n    daoUser(id: $userId) {\n      address\n      id\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n      activeOffers {\n        id\n        amount\n        expiredOnTransfer\n        expirationTimestamp\n      }\n    }\n    offers(orderBy: createTimestamp, orderDirection: desc, first: 1000) {\n      id\n      from\n      amount\n      expirationTimestamp\n      expiredOnTransfer\n      createTimestamp\n      matches {\n        id\n        matchedFrom\n        amount\n        createTimestamp\n      }\n    }\n  }\n":
    types.GetTokensPageDataDocument,
  "\n  query GetUserRedemption($userId: Bytes!) {\n    redemptions(where: { createBy: $userId }) {\n      id\n      amount\n      createBy\n      updateTimestamp\n      endTimestamp\n      startTimestamp\n      redemptionHistory {\n        id\n        amount\n        timestamp\n      }\n    }\n  }\n":
    types.GetUserRedemptionDocument,
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
  source: "\n  fragment daoManagerFragment on DaoManager {\n    id\n    managingBoardAddresses\n    contributorsAddresses\n    investorsAddresses\n    shareholdersAddresses\n    totalVotingPower\n  }\n",
): (typeof documents)["\n  fragment daoManagerFragment on DaoManager {\n    id\n    managingBoardAddresses\n    contributorsAddresses\n    investorsAddresses\n    shareholdersAddresses\n    totalVotingPower\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n",
): (typeof documents)["\n  fragment resolutionTypeFragment on ResolutionType {\n    id\n    name\n    quorum\n    noticePeriod\n    votingPeriod\n    canBeNegative\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment resolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n",
): (typeof documents)["\n  fragment resolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    addressedContributor\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  fragment legacyResolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n",
): (typeof documents)["\n  fragment legacyResolutionFragment on Resolution {\n    id\n    ipfsDataURI\n    isNegative\n    resolutionType {\n      ...resolutionTypeFragment\n    }\n    yesVotesTotal\n    createTimestamp\n    updateTimestamp\n    approveTimestamp\n    rejectTimestamp\n    executionTimestamp\n    createBy\n    updateBy\n    approveBy\n    rejectBy\n    hasQuorum\n    executionTo\n    executionData\n    voters {\n      id\n      address\n      votingPower\n      hasVoted\n      hasVotedYes\n      delegated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetDaoManager {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n  }\n',
): (typeof documents)['\n  query GetDaoManager {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetDelegationUsers {\n    delegationUsers {\n      id\n      address\n      delegated\n    }\n  }\n",
): (typeof documents)["\n  query GetDelegationUsers {\n    delegationUsers {\n      id\n      address\n      delegated\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetLegacyResolution($id: ID!) {\n    resolution(id: $id) {\n      ...legacyResolutionFragment\n    }\n  }\n",
): (typeof documents)["\n  query GetLegacyResolution($id: ID!) {\n    resolution(id: $id) {\n      ...legacyResolutionFragment\n    }\n  }\n"];
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
  source: "\n  query GetResolutionTypes {\n    resolutionTypes {\n      ...resolutionTypeFragment\n    }\n  }\n",
): (typeof documents)["\n  query GetResolutionTypes {\n    resolutionTypes {\n      ...resolutionTypeFragment\n    }\n  }\n"];
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
  source: '\n  query GetShareholdersInfo {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n\n    daoUsers {\n      address\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n    }\n  }\n',
): (typeof documents)['\n  query GetShareholdersInfo {\n    daoManager(id: "0") {\n      ...daoManagerFragment\n    }\n\n    daoUsers {\n      address\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n    }\n  }\n'];
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
  source: "\n  query GetTokenMintings {\n    tokenMintings {\n      id\n      amounts\n      mintedTimestamp\n    }\n  }\n",
): (typeof documents)["\n  query GetTokenMintings {\n    tokenMintings {\n      id\n      amounts\n      mintedTimestamp\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetTokensPageData($userId: ID!) {\n    daoUser(id: $userId) {\n      address\n      id\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n      activeOffers {\n        id\n        amount\n        expiredOnTransfer\n        expirationTimestamp\n      }\n    }\n    offers(orderBy: createTimestamp, orderDirection: desc, first: 1000) {\n      id\n      from\n      amount\n      expirationTimestamp\n      expiredOnTransfer\n      createTimestamp\n      matches {\n        id\n        matchedFrom\n        amount\n        createTimestamp\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetTokensPageData($userId: ID!) {\n    daoUser(id: $userId) {\n      address\n      id\n      governanceBalance\n      governanceOfferedTempBalance\n      governanceVestingBalance\n      governanceVaultedBalance\n      governanceWithdrawableTempBalance\n      votingPower\n      shareholderRegistryBalance\n      neokigdomTokenBalance\n      activeOffers {\n        id\n        amount\n        expiredOnTransfer\n        expirationTimestamp\n      }\n    }\n    offers(orderBy: createTimestamp, orderDirection: desc, first: 1000) {\n      id\n      from\n      amount\n      expirationTimestamp\n      expiredOnTransfer\n      createTimestamp\n      matches {\n        id\n        matchedFrom\n        amount\n        createTimestamp\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetUserRedemption($userId: Bytes!) {\n    redemptions(where: { createBy: $userId }) {\n      id\n      amount\n      createBy\n      updateTimestamp\n      endTimestamp\n      startTimestamp\n      redemptionHistory {\n        id\n        amount\n        timestamp\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetUserRedemption($userId: Bytes!) {\n    redemptions(where: { createBy: $userId }) {\n      id\n      amount\n      createBy\n      updateTimestamp\n      endTimestamp\n      startTimestamp\n      redemptionHistory {\n        id\n        amount\n        timestamp\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
