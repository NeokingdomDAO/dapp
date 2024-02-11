/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any };
};

export type BlockChangedFilter = {
  number_gte: Scalars["Int"]["input"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DaoManager = {
  __typename?: "DaoManager";
  contributorsAddresses: Array<Scalars["Bytes"]["output"]>;
  id: Scalars["ID"]["output"];
  investorsAddresses: Array<Scalars["Bytes"]["output"]>;
  managingBoardAddresses: Array<Scalars["Bytes"]["output"]>;
  resolutionTypes: Array<ResolutionType>;
  shareholdersAddresses: Array<Scalars["Bytes"]["output"]>;
  totalVotingPower: Scalars["BigInt"]["output"];
};

export type DaoManagerResolutionTypesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionType_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<ResolutionType_Filter>;
};

export type DaoManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DaoManager_Filter>>>;
  contributorsAddresses?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  contributorsAddresses_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  contributorsAddresses_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  contributorsAddresses_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  contributorsAddresses_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  contributorsAddresses_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  investorsAddresses?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  investorsAddresses_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  investorsAddresses_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  investorsAddresses_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  investorsAddresses_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  investorsAddresses_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  managingBoardAddresses_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<DaoManager_Filter>>>;
  resolutionTypes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionTypes_?: InputMaybe<ResolutionType_Filter>;
  resolutionTypes_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionTypes_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionTypes_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionTypes_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionTypes_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  shareholdersAddresses?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  shareholdersAddresses_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  shareholdersAddresses_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  shareholdersAddresses_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  shareholdersAddresses_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  shareholdersAddresses_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  totalVotingPower?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalVotingPower_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum DaoManager_OrderBy {
  ContributorsAddresses = "contributorsAddresses",
  Id = "id",
  InvestorsAddresses = "investorsAddresses",
  ManagingBoardAddresses = "managingBoardAddresses",
  ResolutionTypes = "resolutionTypes",
  ShareholdersAddresses = "shareholdersAddresses",
  TotalVotingPower = "totalVotingPower",
}

export type DaoUser = {
  __typename?: "DaoUser";
  activeOffers: Array<Offer>;
  address: Scalars["Bytes"]["output"];
  governanceBalance: Scalars["BigInt"]["output"];
  governanceOfferedTempBalance: Scalars["BigInt"]["output"];
  governanceVaultedBalance: Scalars["BigInt"]["output"];
  governanceVestingBalance: Scalars["BigInt"]["output"];
  governanceWithdrawableTempBalance: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  neokigdomTokenBalance: Scalars["BigInt"]["output"];
  shareholderRegistryBalance: Scalars["BigInt"]["output"];
  votingPower: Scalars["BigInt"]["output"];
};

export type DaoUserActiveOffersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Offer_Filter>;
};

export type DaoUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeOffers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeOffers_?: InputMaybe<Offer_Filter>;
  activeOffers_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeOffers_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeOffers_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeOffers_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  activeOffers_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<DaoUser_Filter>>>;
  governanceBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceOfferedTempBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceOfferedTempBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceOfferedTempBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceVaultedBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceVaultedBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVaultedBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceVestingBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceVestingBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceVestingBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceWithdrawableTempBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  governanceWithdrawableTempBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  governanceWithdrawableTempBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  neokigdomTokenBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  neokigdomTokenBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  neokigdomTokenBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<DaoUser_Filter>>>;
  shareholderRegistryBalance?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  shareholderRegistryBalance_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  shareholderRegistryBalance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPower?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPower_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum DaoUser_OrderBy {
  ActiveOffers = "activeOffers",
  Address = "address",
  GovernanceBalance = "governanceBalance",
  GovernanceOfferedTempBalance = "governanceOfferedTempBalance",
  GovernanceVaultedBalance = "governanceVaultedBalance",
  GovernanceVestingBalance = "governanceVestingBalance",
  GovernanceWithdrawableTempBalance = "governanceWithdrawableTempBalance",
  Id = "id",
  NeokigdomTokenBalance = "neokigdomTokenBalance",
  ShareholderRegistryBalance = "shareholderRegistryBalance",
  VotingPower = "votingPower",
}

export type DelegationUser = {
  __typename?: "DelegationUser";
  address: Scalars["Bytes"]["output"];
  delegated: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
};

export type DelegationUser_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<DelegationUser_Filter>>>;
  delegated?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  delegated_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<DelegationUser_Filter>>>;
};

export enum DelegationUser_OrderBy {
  Address = "address",
  Delegated = "delegated",
  Id = "id",
}

export type Deposit = {
  __typename?: "Deposit";
  amount: Scalars["BigInt"]["output"];
  createTimestamp: Scalars["BigInt"]["output"];
  from: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  settleTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  settled: Scalars["Boolean"]["output"];
  settlementTimestamp: Scalars["BigInt"]["output"];
};

export type Deposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  createTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  from?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  from_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  settleTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  settleTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  settleTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  settled?: InputMaybe<Scalars["Boolean"]["input"]>;
  settled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  settled_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  settled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  settlementTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  settlementTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  settlementTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Deposit_OrderBy {
  Amount = "amount",
  CreateTimestamp = "createTimestamp",
  From = "from",
  Id = "id",
  SettleTimestamp = "settleTimestamp",
  Settled = "settled",
  SettlementTimestamp = "settlementTimestamp",
}

export type Offer = {
  __typename?: "Offer";
  amount: Scalars["BigInt"]["output"];
  createTimestamp: Scalars["BigInt"]["output"];
  expirationTimestamp: Scalars["BigInt"]["output"];
  expiredOnTransfer: Scalars["Boolean"]["output"];
  from: Scalars["Bytes"]["output"];
  id: Scalars["ID"]["output"];
  matches: Array<OfferMatch>;
};

export type OfferMatchesArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<OfferMatch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<OfferMatch_Filter>;
};

export type OfferMatch = {
  __typename?: "OfferMatch";
  amount: Scalars["BigInt"]["output"];
  createTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  matchedFrom: Scalars["Bytes"]["output"];
};

export type OfferMatch_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<OfferMatch_Filter>>>;
  createTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  matchedFrom?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  matchedFrom_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  matchedFrom_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<OfferMatch_Filter>>>;
};

export enum OfferMatch_OrderBy {
  Amount = "amount",
  CreateTimestamp = "createTimestamp",
  Id = "id",
  MatchedFrom = "matchedFrom",
}

export type Offer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Offer_Filter>>>;
  createTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  expirationTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  expirationTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  expirationTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  expiredOnTransfer?: InputMaybe<Scalars["Boolean"]["input"]>;
  expiredOnTransfer_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  expiredOnTransfer_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  expiredOnTransfer_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  from?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  from_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  from_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  matches?: InputMaybe<Array<Scalars["String"]["input"]>>;
  matches_?: InputMaybe<OfferMatch_Filter>;
  matches_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  matches_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  matches_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  matches_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  matches_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Offer_Filter>>>;
};

export enum Offer_OrderBy {
  Amount = "amount",
  CreateTimestamp = "createTimestamp",
  ExpirationTimestamp = "expirationTimestamp",
  ExpiredOnTransfer = "expiredOnTransfer",
  From = "from",
  Id = "id",
  Matches = "matches",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  daoManager?: Maybe<DaoManager>;
  daoManagers: Array<DaoManager>;
  daoUser?: Maybe<DaoUser>;
  daoUsers: Array<DaoUser>;
  delegationUser?: Maybe<DelegationUser>;
  delegationUsers: Array<DelegationUser>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  offer?: Maybe<Offer>;
  offerMatch?: Maybe<OfferMatch>;
  offerMatches: Array<OfferMatch>;
  offers: Array<Offer>;
  redemption?: Maybe<Redemption>;
  redemptionHistories: Array<RedemptionHistory>;
  redemptionHistory?: Maybe<RedemptionHistory>;
  redemptions: Array<Redemption>;
  resolution?: Maybe<Resolution>;
  resolutionMetadata: Array<ResolutionMetadata>;
  resolutionType?: Maybe<ResolutionType>;
  resolutionTypes: Array<ResolutionType>;
  resolutionVoter?: Maybe<ResolutionVoter>;
  resolutionVoters: Array<ResolutionVoter>;
  resolutions: Array<Resolution>;
  tokenMinting?: Maybe<TokenMinting>;
  tokenMintings: Array<TokenMinting>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryDaoManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDaoManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DaoManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DaoManager_Filter>;
};

export type QueryDaoUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDaoUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DaoUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DaoUser_Filter>;
};

export type QueryDelegationUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDelegationUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DelegationUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegationUser_Filter>;
};

export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};

export type QueryOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOfferMatchArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOfferMatchesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<OfferMatch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferMatch_Filter>;
};

export type QueryOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};

export type QueryRedemptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRedemptionHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RedemptionHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedemptionHistory_Filter>;
};

export type QueryRedemptionHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRedemptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redemption_Filter>;
};

export type QueryResolutionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryResolutionMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionMetadata_Filter>;
};

export type QueryResolutionTypeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryResolutionTypesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionType_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionType_Filter>;
};

export type QueryResolutionVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryResolutionVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionVoter_Filter>;
};

export type QueryResolutionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Resolution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolution_Filter>;
};

export type QueryTokenMintingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenMintingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenMinting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenMinting_Filter>;
};

export type Redemption = {
  __typename?: "Redemption";
  amount: Scalars["BigInt"]["output"];
  createBy: Scalars["Bytes"]["output"];
  createTimestamp: Scalars["BigInt"]["output"];
  endTimestamp: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  redemptionHistory: Array<RedemptionHistory>;
  startTimestamp: Scalars["BigInt"]["output"];
  updateTimestamp: Scalars["BigInt"]["output"];
};

export type RedemptionRedemptionHistoryArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RedemptionHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<RedemptionHistory_Filter>;
};

export type RedemptionHistory = {
  __typename?: "RedemptionHistory";
  amount: Scalars["BigInt"]["output"];
  id: Scalars["ID"]["output"];
  timestamp: Scalars["BigInt"]["output"];
};

export type RedemptionHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<RedemptionHistory_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<RedemptionHistory_Filter>>>;
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum RedemptionHistory_OrderBy {
  Amount = "amount",
  Id = "id",
  Timestamp = "timestamp",
}

export type Redemption_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amount_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  amount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Redemption_Filter>>>;
  createBy?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  createBy_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  createTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  endTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  endTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<Redemption_Filter>>>;
  redemptionHistory?: InputMaybe<Array<Scalars["String"]["input"]>>;
  redemptionHistory_?: InputMaybe<RedemptionHistory_Filter>;
  redemptionHistory_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  redemptionHistory_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  redemptionHistory_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  redemptionHistory_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  redemptionHistory_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  startTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updateTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updateTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Redemption_OrderBy {
  Amount = "amount",
  CreateBy = "createBy",
  CreateTimestamp = "createTimestamp",
  EndTimestamp = "endTimestamp",
  Id = "id",
  RedemptionHistory = "redemptionHistory",
  StartTimestamp = "startTimestamp",
  UpdateTimestamp = "updateTimestamp",
}

export type Resolution = {
  __typename?: "Resolution";
  addressedContributor?: Maybe<Scalars["Bytes"]["output"]>;
  approveBy?: Maybe<Scalars["Bytes"]["output"]>;
  approveTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  content: Scalars["String"]["output"];
  createBy: Scalars["Bytes"]["output"];
  createTimestamp: Scalars["BigInt"]["output"];
  executionData: Array<Scalars["Bytes"]["output"]>;
  executionTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  executionTo: Array<Scalars["Bytes"]["output"]>;
  hasQuorum?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  ipfsDataURI: Scalars["String"]["output"];
  isNegative: Scalars["Boolean"]["output"];
  metadata?: Maybe<ResolutionMetadata>;
  rejectBy?: Maybe<Scalars["Bytes"]["output"]>;
  rejectTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  resolutionType: ResolutionType;
  snapshotId: Scalars["BigInt"]["output"];
  title: Scalars["String"]["output"];
  totalVotingPower?: Maybe<Scalars["BigInt"]["output"]>;
  updateBy?: Maybe<Scalars["Bytes"]["output"]>;
  updateTimestamp?: Maybe<Scalars["BigInt"]["output"]>;
  voters?: Maybe<Array<ResolutionVoter>>;
  yesVotesTotal?: Maybe<Scalars["BigInt"]["output"]>;
};

export type ResolutionVotersArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<ResolutionVoter_Filter>;
};

export type ResolutionMetadata = {
  __typename?: "ResolutionMetadata";
  id: Scalars["ID"]["output"];
  isMonthlyRewards: Scalars["Boolean"]["output"];
  month: Scalars["String"]["output"];
};

export type ResolutionMetadata_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ResolutionMetadata_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isMonthlyRewards?: InputMaybe<Scalars["Boolean"]["input"]>;
  isMonthlyRewards_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isMonthlyRewards_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isMonthlyRewards_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  month?: InputMaybe<Scalars["String"]["input"]>;
  month_contains?: InputMaybe<Scalars["String"]["input"]>;
  month_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  month_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  month_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  month_gt?: InputMaybe<Scalars["String"]["input"]>;
  month_gte?: InputMaybe<Scalars["String"]["input"]>;
  month_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  month_lt?: InputMaybe<Scalars["String"]["input"]>;
  month_lte?: InputMaybe<Scalars["String"]["input"]>;
  month_not?: InputMaybe<Scalars["String"]["input"]>;
  month_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  month_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  month_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  month_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  month_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  month_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  month_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  month_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  month_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<ResolutionMetadata_Filter>>>;
};

export enum ResolutionMetadata_OrderBy {
  Id = "id",
  IsMonthlyRewards = "isMonthlyRewards",
  Month = "month",
}

export type ResolutionType = {
  __typename?: "ResolutionType";
  canBeNegative: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  noticePeriod: Scalars["BigInt"]["output"];
  quorum: Scalars["BigInt"]["output"];
  votingPeriod: Scalars["BigInt"]["output"];
};

export type ResolutionType_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ResolutionType_Filter>>>;
  canBeNegative?: InputMaybe<Scalars["Boolean"]["input"]>;
  canBeNegative_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  canBeNegative_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  canBeNegative_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  name_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_gt?: InputMaybe<Scalars["String"]["input"]>;
  name_gte?: InputMaybe<Scalars["String"]["input"]>;
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_lt?: InputMaybe<Scalars["String"]["input"]>;
  name_lte?: InputMaybe<Scalars["String"]["input"]>;
  name_not?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  noticePeriod?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  noticePeriod_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  noticePeriod_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<ResolutionType_Filter>>>;
  quorum?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  quorum_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  quorum_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPeriod?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPeriod_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPeriod_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum ResolutionType_OrderBy {
  CanBeNegative = "canBeNegative",
  Id = "id",
  Name = "name",
  NoticePeriod = "noticePeriod",
  Quorum = "quorum",
  VotingPeriod = "votingPeriod",
}

export type ResolutionVoter = {
  __typename?: "ResolutionVoter";
  address: Scalars["Bytes"]["output"];
  delegated: Scalars["Bytes"]["output"];
  hasVoted: Scalars["Boolean"]["output"];
  hasVotedYes: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  votingPower: Scalars["BigInt"]["output"];
};

export type ResolutionVoter_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<ResolutionVoter_Filter>>>;
  delegated?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  delegated_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  delegated_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hasVoted?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasVotedYes?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasVotedYes_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  hasVotedYes_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasVotedYes_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  hasVoted_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  hasVoted_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasVoted_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<ResolutionVoter_Filter>>>;
  votingPower?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  votingPower_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  votingPower_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum ResolutionVoter_OrderBy {
  Address = "address",
  Delegated = "delegated",
  HasVoted = "hasVoted",
  HasVotedYes = "hasVotedYes",
  Id = "id",
  VotingPower = "votingPower",
}

export type Resolution_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addressedContributor?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  addressedContributor_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  addressedContributor_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<Resolution_Filter>>>;
  approveBy?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  approveBy_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  approveBy_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  approveTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  approveTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  approveTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  content?: InputMaybe<Scalars["String"]["input"]>;
  content_contains?: InputMaybe<Scalars["String"]["input"]>;
  content_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  content_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  content_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  content_gt?: InputMaybe<Scalars["String"]["input"]>;
  content_gte?: InputMaybe<Scalars["String"]["input"]>;
  content_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  content_lt?: InputMaybe<Scalars["String"]["input"]>;
  content_lte?: InputMaybe<Scalars["String"]["input"]>;
  content_not?: InputMaybe<Scalars["String"]["input"]>;
  content_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  content_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  content_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  content_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  content_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  content_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  content_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  content_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  content_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  createBy?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  createBy_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  createBy_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  createTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  createTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  createTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionData?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionData_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionData_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionData_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionData_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionData_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  executionTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  executionTo?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTo_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTo_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTo_not?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTo_not_contains?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  executionTo_not_contains_nocase?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  hasQuorum?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasQuorum_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  hasQuorum_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasQuorum_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  ipfsDataURI?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_contains?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_gt?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_gte?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ipfsDataURI_lt?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_lte?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  ipfsDataURI_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  ipfsDataURI_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  isNegative?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNegative_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  isNegative_not?: InputMaybe<Scalars["Boolean"]["input"]>;
  isNegative_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  metadata?: InputMaybe<Scalars["String"]["input"]>;
  metadata_?: InputMaybe<ResolutionMetadata_Filter>;
  metadata_contains?: InputMaybe<Scalars["String"]["input"]>;
  metadata_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  metadata_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  metadata_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  metadata_gt?: InputMaybe<Scalars["String"]["input"]>;
  metadata_gte?: InputMaybe<Scalars["String"]["input"]>;
  metadata_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadata_lt?: InputMaybe<Scalars["String"]["input"]>;
  metadata_lte?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  metadata_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  metadata_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  metadata_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  metadata_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Resolution_Filter>>>;
  rejectBy?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  rejectBy_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  rejectBy_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  rejectTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  rejectTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  rejectTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  resolutionType?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_?: InputMaybe<ResolutionType_Filter>;
  resolutionType_contains?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_gt?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_gte?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionType_lt?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_lte?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  resolutionType_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  resolutionType_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  snapshotId?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  snapshotId_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  snapshotId_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  title_contains?: InputMaybe<Scalars["String"]["input"]>;
  title_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  title_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  title_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  title_gt?: InputMaybe<Scalars["String"]["input"]>;
  title_gte?: InputMaybe<Scalars["String"]["input"]>;
  title_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title_lt?: InputMaybe<Scalars["String"]["input"]>;
  title_lte?: InputMaybe<Scalars["String"]["input"]>;
  title_not?: InputMaybe<Scalars["String"]["input"]>;
  title_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  title_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  title_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  title_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  title_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  title_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  title_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  title_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  title_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  totalVotingPower?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalVotingPower_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalVotingPower_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updateBy?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  updateBy_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  updateBy_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  updateTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  updateTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  updateTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  voters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voters_?: InputMaybe<ResolutionVoter_Filter>;
  voters_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voters_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voters_not?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voters_not_contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
  voters_not_contains_nocase?: InputMaybe<Array<Scalars["String"]["input"]>>;
  yesVotesTotal?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  yesVotesTotal_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  yesVotesTotal_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum Resolution_OrderBy {
  AddressedContributor = "addressedContributor",
  ApproveBy = "approveBy",
  ApproveTimestamp = "approveTimestamp",
  Content = "content",
  CreateBy = "createBy",
  CreateTimestamp = "createTimestamp",
  ExecutionData = "executionData",
  ExecutionTimestamp = "executionTimestamp",
  ExecutionTo = "executionTo",
  HasQuorum = "hasQuorum",
  Id = "id",
  IpfsDataUri = "ipfsDataURI",
  IsNegative = "isNegative",
  Metadata = "metadata",
  MetadataId = "metadata__id",
  MetadataIsMonthlyRewards = "metadata__isMonthlyRewards",
  MetadataMonth = "metadata__month",
  RejectBy = "rejectBy",
  RejectTimestamp = "rejectTimestamp",
  ResolutionType = "resolutionType",
  ResolutionTypeCanBeNegative = "resolutionType__canBeNegative",
  ResolutionTypeId = "resolutionType__id",
  ResolutionTypeName = "resolutionType__name",
  ResolutionTypeNoticePeriod = "resolutionType__noticePeriod",
  ResolutionTypeQuorum = "resolutionType__quorum",
  ResolutionTypeVotingPeriod = "resolutionType__votingPeriod",
  SnapshotId = "snapshotId",
  Title = "title",
  TotalVotingPower = "totalVotingPower",
  UpdateBy = "updateBy",
  UpdateTimestamp = "updateTimestamp",
  Voters = "voters",
  YesVotesTotal = "yesVotesTotal",
}

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  daoManager?: Maybe<DaoManager>;
  daoManagers: Array<DaoManager>;
  daoUser?: Maybe<DaoUser>;
  daoUsers: Array<DaoUser>;
  delegationUser?: Maybe<DelegationUser>;
  delegationUsers: Array<DelegationUser>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  offer?: Maybe<Offer>;
  offerMatch?: Maybe<OfferMatch>;
  offerMatches: Array<OfferMatch>;
  offers: Array<Offer>;
  redemption?: Maybe<Redemption>;
  redemptionHistories: Array<RedemptionHistory>;
  redemptionHistory?: Maybe<RedemptionHistory>;
  redemptions: Array<Redemption>;
  resolution?: Maybe<Resolution>;
  resolutionMetadata: Array<ResolutionMetadata>;
  resolutionType?: Maybe<ResolutionType>;
  resolutionTypes: Array<ResolutionType>;
  resolutionVoter?: Maybe<ResolutionVoter>;
  resolutionVoters: Array<ResolutionVoter>;
  resolutions: Array<Resolution>;
  tokenMinting?: Maybe<TokenMinting>;
  tokenMintings: Array<TokenMinting>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionDaoManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDaoManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DaoManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DaoManager_Filter>;
};

export type SubscriptionDaoUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDaoUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DaoUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DaoUser_Filter>;
};

export type SubscriptionDelegationUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDelegationUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<DelegationUser_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DelegationUser_Filter>;
};

export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};

export type SubscriptionOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOfferMatchArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOfferMatchesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<OfferMatch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferMatch_Filter>;
};

export type SubscriptionOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};

export type SubscriptionRedemptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRedemptionHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<RedemptionHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedemptionHistory_Filter>;
};

export type SubscriptionRedemptionHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRedemptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redemption_Filter>;
};

export type SubscriptionResolutionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionResolutionMetadataArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionMetadata_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionMetadata_Filter>;
};

export type SubscriptionResolutionTypeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionResolutionTypesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionType_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionType_Filter>;
};

export type SubscriptionResolutionVoterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionResolutionVotersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ResolutionVoter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ResolutionVoter_Filter>;
};

export type SubscriptionResolutionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Resolution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Resolution_Filter>;
};

export type SubscriptionTokenMintingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenMintingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<TokenMinting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenMinting_Filter>;
};

export type TokenMinting = {
  __typename?: "TokenMinting";
  amounts: Array<Scalars["BigInt"]["output"]>;
  id: Scalars["ID"]["output"];
  mintedTimestamp: Scalars["BigInt"]["output"];
};

export type TokenMinting_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amounts?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amounts_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amounts_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amounts_not?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amounts_not_contains?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  amounts_not_contains_nocase?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  and?: InputMaybe<Array<InputMaybe<TokenMinting_Filter>>>;
  id?: InputMaybe<Scalars["ID"]["input"]>;
  id_gt?: InputMaybe<Scalars["ID"]["input"]>;
  id_gte?: InputMaybe<Scalars["ID"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  id_lt?: InputMaybe<Scalars["ID"]["input"]>;
  id_lte?: InputMaybe<Scalars["ID"]["input"]>;
  id_not?: InputMaybe<Scalars["ID"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  mintedTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  mintedTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  mintedTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  or?: InputMaybe<Array<InputMaybe<TokenMinting_Filter>>>;
};

export enum TokenMinting_OrderBy {
  Amounts = "amounts",
  Id = "id",
  MintedTimestamp = "mintedTimestamp",
}

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"]["output"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type GetLegacyResolutionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetLegacyResolutionsQuery = {
  __typename?: "Query";
  resolutions: Array<{
    __typename?: "Resolution";
    id: string;
    title: string;
    content: string;
    isNegative: boolean;
    yesVotesTotal?: any | null;
    createTimestamp: any;
    updateTimestamp?: any | null;
    approveTimestamp?: any | null;
    rejectTimestamp?: any | null;
    executionTimestamp?: any | null;
    createBy: any;
    updateBy?: any | null;
    approveBy?: any | null;
    rejectBy?: any | null;
    hasQuorum?: boolean | null;
    executionTo: Array<any>;
    executionData: Array<any>;
    resolutionType: {
      __typename?: "ResolutionType";
      id: string;
      name: string;
      quorum: any;
      noticePeriod: any;
      votingPeriod: any;
      canBeNegative: boolean;
    };
    voters?: Array<{
      __typename?: "ResolutionVoter";
      id: string;
      address: any;
      votingPower: any;
      hasVoted: boolean;
      hasVotedYes: boolean;
      delegated: any;
    }> | null;
  }>;
};

export type GetResolutionQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetResolutionQuery = {
  __typename?: "Query";
  resolution?: {
    __typename?: "Resolution";
    id: string;
    title: string;
    content: string;
    isNegative: boolean;
    yesVotesTotal?: any | null;
    createTimestamp: any;
    updateTimestamp?: any | null;
    approveTimestamp?: any | null;
    rejectTimestamp?: any | null;
    executionTimestamp?: any | null;
    createBy: any;
    updateBy?: any | null;
    approveBy?: any | null;
    rejectBy?: any | null;
    hasQuorum?: boolean | null;
    executionTo: Array<any>;
    executionData: Array<any>;
    addressedContributor?: any | null;
    resolutionType: {
      __typename?: "ResolutionType";
      id: string;
      name: string;
      quorum: any;
      noticePeriod: any;
      votingPeriod: any;
      canBeNegative: boolean;
    };
    voters?: Array<{
      __typename?: "ResolutionVoter";
      id: string;
      address: any;
      votingPower: any;
      hasVoted: boolean;
      hasVotedYes: boolean;
      delegated: any;
    }> | null;
  } | null;
};

export type GetResolutionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetResolutionsQuery = {
  __typename?: "Query";
  resolutions: Array<{
    __typename?: "Resolution";
    id: string;
    title: string;
    content: string;
    isNegative: boolean;
    yesVotesTotal?: any | null;
    createTimestamp: any;
    updateTimestamp?: any | null;
    approveTimestamp?: any | null;
    rejectTimestamp?: any | null;
    executionTimestamp?: any | null;
    createBy: any;
    updateBy?: any | null;
    approveBy?: any | null;
    rejectBy?: any | null;
    hasQuorum?: boolean | null;
    executionTo: Array<any>;
    executionData: Array<any>;
    addressedContributor?: any | null;
    resolutionType: {
      __typename?: "ResolutionType";
      id: string;
      name: string;
      quorum: any;
      noticePeriod: any;
      votingPeriod: any;
      canBeNegative: boolean;
    };
    voters?: Array<{
      __typename?: "ResolutionVoter";
      id: string;
      address: any;
      votingPower: any;
      hasVoted: boolean;
      hasVotedYes: boolean;
      delegated: any;
    }> | null;
  }>;
};

export type GetSubgraphStateQueryVariables = Exact<{ [key: string]: never }>;

export type GetSubgraphStateQuery = {
  __typename?: "Query";
  state?: {
    __typename?: "_Meta_";
    hasIndexingErrors: boolean;
    block: { __typename?: "_Block_"; hash?: any | null; timestamp?: number | null; number: number };
  } | null;
};

export type ResolutionFragmentFragment = {
  __typename?: "Resolution";
  id: string;
  title: string;
  content: string;
  isNegative: boolean;
  yesVotesTotal?: any | null;
  createTimestamp: any;
  updateTimestamp?: any | null;
  approveTimestamp?: any | null;
  rejectTimestamp?: any | null;
  executionTimestamp?: any | null;
  createBy: any;
  updateBy?: any | null;
  approveBy?: any | null;
  rejectBy?: any | null;
  hasQuorum?: boolean | null;
  executionTo: Array<any>;
  executionData: Array<any>;
  addressedContributor?: any | null;
  resolutionType: {
    __typename?: "ResolutionType";
    id: string;
    name: string;
    quorum: any;
    noticePeriod: any;
    votingPeriod: any;
    canBeNegative: boolean;
  };
  voters?: Array<{
    __typename?: "ResolutionVoter";
    id: string;
    address: any;
    votingPower: any;
    hasVoted: boolean;
    hasVotedYes: boolean;
    delegated: any;
  }> | null;
};

export type LegacyResolutionFragmentFragment = {
  __typename?: "Resolution";
  id: string;
  title: string;
  content: string;
  isNegative: boolean;
  yesVotesTotal?: any | null;
  createTimestamp: any;
  updateTimestamp?: any | null;
  approveTimestamp?: any | null;
  rejectTimestamp?: any | null;
  executionTimestamp?: any | null;
  createBy: any;
  updateBy?: any | null;
  approveBy?: any | null;
  rejectBy?: any | null;
  hasQuorum?: boolean | null;
  executionTo: Array<any>;
  executionData: Array<any>;
  resolutionType: {
    __typename?: "ResolutionType";
    id: string;
    name: string;
    quorum: any;
    noticePeriod: any;
    votingPeriod: any;
    canBeNegative: boolean;
  };
  voters?: Array<{
    __typename?: "ResolutionVoter";
    id: string;
    address: any;
    votingPower: any;
    hasVoted: boolean;
    hasVotedYes: boolean;
    delegated: any;
  }> | null;
};

export type ResolutionTypeFragmentFragment = {
  __typename?: "ResolutionType";
  id: string;
  name: string;
  quorum: any;
  noticePeriod: any;
  votingPeriod: any;
  canBeNegative: boolean;
};

export const ResolutionTypeFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResolutionTypeFragmentFragment, unknown>;
export const ResolutionFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Resolution" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "isNegative" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutionType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionTypeFragment" } }],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "yesVotesTotal" } },
          { kind: "Field", name: { kind: "Name", value: "createTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "updateTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "approveTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "rejectTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "executionTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "createBy" } },
          { kind: "Field", name: { kind: "Name", value: "updateBy" } },
          { kind: "Field", name: { kind: "Name", value: "approveBy" } },
          { kind: "Field", name: { kind: "Name", value: "rejectBy" } },
          { kind: "Field", name: { kind: "Name", value: "hasQuorum" } },
          { kind: "Field", name: { kind: "Name", value: "executionTo" } },
          { kind: "Field", name: { kind: "Name", value: "executionData" } },
          { kind: "Field", name: { kind: "Name", value: "addressedContributor" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "voters" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "votingPower" } },
                { kind: "Field", name: { kind: "Name", value: "hasVoted" } },
                { kind: "Field", name: { kind: "Name", value: "hasVotedYes" } },
                { kind: "Field", name: { kind: "Name", value: "delegated" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ResolutionFragmentFragment, unknown>;
export const LegacyResolutionFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "legacyResolutionFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Resolution" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "isNegative" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutionType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionTypeFragment" } }],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "yesVotesTotal" } },
          { kind: "Field", name: { kind: "Name", value: "createTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "updateTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "approveTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "rejectTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "executionTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "createBy" } },
          { kind: "Field", name: { kind: "Name", value: "updateBy" } },
          { kind: "Field", name: { kind: "Name", value: "approveBy" } },
          { kind: "Field", name: { kind: "Name", value: "rejectBy" } },
          { kind: "Field", name: { kind: "Name", value: "hasQuorum" } },
          { kind: "Field", name: { kind: "Name", value: "executionTo" } },
          { kind: "Field", name: { kind: "Name", value: "executionData" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "voters" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "votingPower" } },
                { kind: "Field", name: { kind: "Name", value: "hasVoted" } },
                { kind: "Field", name: { kind: "Name", value: "hasVotedYes" } },
                { kind: "Field", name: { kind: "Name", value: "delegated" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LegacyResolutionFragmentFragment, unknown>;
export const GetLegacyResolutionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetLegacyResolutions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "createTimestamp" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "EnumValue", value: "desc" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "legacyResolutionFragment" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "legacyResolutionFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Resolution" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "isNegative" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutionType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionTypeFragment" } }],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "yesVotesTotal" } },
          { kind: "Field", name: { kind: "Name", value: "createTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "updateTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "approveTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "rejectTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "executionTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "createBy" } },
          { kind: "Field", name: { kind: "Name", value: "updateBy" } },
          { kind: "Field", name: { kind: "Name", value: "approveBy" } },
          { kind: "Field", name: { kind: "Name", value: "rejectBy" } },
          { kind: "Field", name: { kind: "Name", value: "hasQuorum" } },
          { kind: "Field", name: { kind: "Name", value: "executionTo" } },
          { kind: "Field", name: { kind: "Name", value: "executionData" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "voters" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "votingPower" } },
                { kind: "Field", name: { kind: "Name", value: "hasVoted" } },
                { kind: "Field", name: { kind: "Name", value: "hasVotedYes" } },
                { kind: "Field", name: { kind: "Name", value: "delegated" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLegacyResolutionsQuery, GetLegacyResolutionsQueryVariables>;
export const GetResolutionDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetResolution" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resolution" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionFragment" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Resolution" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "isNegative" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutionType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionTypeFragment" } }],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "yesVotesTotal" } },
          { kind: "Field", name: { kind: "Name", value: "createTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "updateTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "approveTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "rejectTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "executionTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "createBy" } },
          { kind: "Field", name: { kind: "Name", value: "updateBy" } },
          { kind: "Field", name: { kind: "Name", value: "approveBy" } },
          { kind: "Field", name: { kind: "Name", value: "rejectBy" } },
          { kind: "Field", name: { kind: "Name", value: "hasQuorum" } },
          { kind: "Field", name: { kind: "Name", value: "executionTo" } },
          { kind: "Field", name: { kind: "Name", value: "executionData" } },
          { kind: "Field", name: { kind: "Name", value: "addressedContributor" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "voters" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "votingPower" } },
                { kind: "Field", name: { kind: "Name", value: "hasVoted" } },
                { kind: "Field", name: { kind: "Name", value: "hasVotedYes" } },
                { kind: "Field", name: { kind: "Name", value: "delegated" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetResolutionQuery, GetResolutionQueryVariables>;
export const GetResolutionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetResolutions" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "createTimestamp" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "EnumValue", value: "desc" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionFragment" } }],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionTypeFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ResolutionType" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "quorum" } },
          { kind: "Field", name: { kind: "Name", value: "noticePeriod" } },
          { kind: "Field", name: { kind: "Name", value: "votingPeriod" } },
          { kind: "Field", name: { kind: "Name", value: "canBeNegative" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "resolutionFragment" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Resolution" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "content" } },
          { kind: "Field", name: { kind: "Name", value: "isNegative" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "resolutionType" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "resolutionTypeFragment" } }],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "yesVotesTotal" } },
          { kind: "Field", name: { kind: "Name", value: "createTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "updateTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "approveTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "rejectTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "executionTimestamp" } },
          { kind: "Field", name: { kind: "Name", value: "createBy" } },
          { kind: "Field", name: { kind: "Name", value: "updateBy" } },
          { kind: "Field", name: { kind: "Name", value: "approveBy" } },
          { kind: "Field", name: { kind: "Name", value: "rejectBy" } },
          { kind: "Field", name: { kind: "Name", value: "hasQuorum" } },
          { kind: "Field", name: { kind: "Name", value: "executionTo" } },
          { kind: "Field", name: { kind: "Name", value: "executionData" } },
          { kind: "Field", name: { kind: "Name", value: "addressedContributor" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "voters" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                { kind: "Field", name: { kind: "Name", value: "votingPower" } },
                { kind: "Field", name: { kind: "Name", value: "hasVoted" } },
                { kind: "Field", name: { kind: "Name", value: "hasVotedYes" } },
                { kind: "Field", name: { kind: "Name", value: "delegated" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetResolutionsQuery, GetResolutionsQueryVariables>;
export const GetSubgraphStateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetSubgraphState" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            alias: { kind: "Name", value: "state" },
            name: { kind: "Name", value: "_meta" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "hasIndexingErrors" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "block" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hash" } },
                      { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                      { kind: "Field", name: { kind: "Name", value: "number" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSubgraphStateQuery, GetSubgraphStateQueryVariables>;
