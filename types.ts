import { Window as KeplrWindow } from "@keplr-wallet/types";

import { GetLegacyResolutionsQuery, GetResolutionsQuery, ResolutionVoter } from "@graphql/subgraph/generated/graphql";

export type ResolutionVoterEnhanced = NonNullable<ResolutionEntity["voters"]>["0"] & {
  votingPowerInt: number;
  usedPoa: boolean;
  beingDelegatedBy: ResolutionVoter[];
  delegating: ResolutionVoter | undefined | null;
};

export type ResolutionsAcl = {
  canCreate?: boolean;
  canUpdate?: boolean;
  canApprove?: boolean;
  canVote: (voters: ResolutionVoterEnhanced[]) => boolean;
  isShareholder?: boolean;
  isManagingBoard?: boolean;
  isContributor?: boolean;
  isExtraneous?: boolean;
};

export type ResolutionTypeEntity = {
  id: string;
  name: string;
  quorum: string;
  noticePeriod: string;
  votingPeriod: string;
  canBeNegative: boolean;
};

export type DaoManagerEntity = {
  id: string;
  contributorsAddresses: string[];
  managingBoardAddresses: string[];
  shareholdersAddresses: string[];
  investorsAddresses: string[];
  resolutionTypes: ResolutionTypeEntity[];
  totalVotingPower: BigInt;
};

export type ResolutionEntity = GetResolutionsQuery["resolutions"]["0"] &
  GetLegacyResolutionsQuery["resolutions"]["0"] & {
    isLegacy?: boolean;
    title: string;
    content: string;
    isRewards: boolean;
  };

export type ResolutionAction = {
  label: string;
  disabled: boolean;
  icon: string;
};

export type ResolutionTypeInfo = {
  noticePeriodEnds: Date | null;
  noticePeriodEndsAt: string | null;
  votingEnds: Date | null;
  votingEndsAt: string | null;
};

export type ResolutionEntityEnhanced = Omit<ResolutionEntity, "voters"> & {
  state: ResolutionState;
  href: string;
  createdAt: string;
  rejectedAt: string | null;
  updatedAt: string | null;
  approvedAt: string | null;
  executedAt: string | null;
  action: ResolutionAction;
  resolutionTypeInfo: ResolutionTypeInfo;
  voters: ResolutionVoterEnhanced[];
  votingStatus: {
    votersHaveNotVoted: ResolutionVoterEnhanced[];
    votersHaveVoted: ResolutionVoterEnhanced[];
    votersHaveVotedYes: ResolutionVoterEnhanced[];
    votersHaveVotedNo: ResolutionVoterEnhanced[];
  };
};

export type ResolutionState = "pre-draft" | "notice" | "voting" | "ended" | "rejected";

export type ResolutionStateKeys = "PRE_DRAFT" | "NOTICE" | "VOTING" | "ENDED" | "REJECTED";

export type ResolutionStates = Record<ResolutionStateKeys, ResolutionState>;

export type ResolutionFormState = {
  title: string;
  content: string;
  typeId: string | null;
};

export type OdooUser = {
  id: number;
  email: string;
  ethereum_address: string;
  name: string;
  display_name: string;
  image?: string;
  avatar_256?: string;
};

export type OdooUserTransformed = {
  email: string;
  ethereumAddress: string;
  displayName: string;
  image: string;
};

export type UsersWithEthereumAddress = Record<string, OdooUserTransformed>;

export type DelegationUser = {
  id: string;
  address: string;
  delegated: string;
};

export type DelegationStatus = {
  signerDelegatedBy: DelegationUser[];
  signerDelegationStatus: DelegationUser | null;
  usersList: Array<DelegationUser & { canBeDelegated: boolean }>;
};

export type OfferMatch = {
  id: string;
  matchedFrom: string;
  amount: BigInt;
  createTimestamp: string;
};

export type Offer = {
  id: string;
  from: string;
  amount: BigInt;
  expirationTimestamp: string;
  createTimestamp: string;
  expiredOnTransfer: boolean;
  matches: OfferMatch[];
};

export type ShareholderStatus = "ManagingBoard" | "Investor" | "Contributor" | "Shareholder";

export type ComputedBalances = {
  governanceTokens: number;
  neokTokens: number;
  lockedTokens: number;
  offeredTokens: number;
  unlockedTokens: number;
  vestingTokens: number;
  votingPower: number;
};

export type MonthlyRewardsUserData = {
  address: string;
  tokens: string | number;
  executionData?: string;
};

export type RewardsResponseEntry = {
  user: {
    ethereum_address: string;
  };
  token_amount: number;
};

export type RewardsResponse = {
  rewards: {
    token_allocations: RewardsResponseEntry[];
  };
  resolution: {
    title: string;
    content: string;
  };
};

export type Task = {
  id: number;
  subtask_effective_hours: number;
  effective_hours: number;
  name: string;
  write_date: number;
  project_id: {
    id: number;
    name: string;
  };
  child_ids: {
    id: number;
    name: string;
    timesheet_ids: {
      name: string;
    }[];
  }[];
  user_id?: {
    id: number;
    name: string;
    ethereum_address: string;
  };
  timesheet_ids: {
    name: string;
  }[];
  parent_id: {
    name: string;
  } | null;
};

declare global {
  interface Window extends KeplrWindow {
    leap?: KeplrWindow["keplr"];
  }
}
