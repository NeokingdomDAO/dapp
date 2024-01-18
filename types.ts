import { Window as KeplrWindow } from "@keplr-wallet/types";

export type ResolutionVoter = {
  id: string;
  votingPower: string;
  votingPowerInt: number;
  address: string;
  hasVoted: boolean;
  hasVotedYes: boolean;
  delegated: string;
  usedPoa: boolean;
  beingDelegatedBy: ResolutionVoter[];
  delegating: ResolutionVoter | null;
};

export type ResolutionsAcl = {
  canCreate: boolean;
  canUpdate: boolean;
  canApprove: boolean;
  canVote: (voters: ResolutionVoter[]) => boolean;
  isShareholder: boolean;
  isManagingBoard: boolean;
  isContributor: boolean;
  isExtraneous: boolean;
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

export type ResolutionEntity = {
  id: string;
  title: string;
  content: string;
  isNegative: boolean;
  resolutionType: ResolutionTypeEntity;
  yesVotesTotal: string;
  createTimestamp: string;
  updateTimestamp: string;
  approveTimestamp: string;
  rejectTimestamp: string;
  addressedContributor: string;
  createBy: string;
  updateBy: string;
  approveBy: string;
  rejectBy: string;
  voters: ResolutionVoter[];
  hasQuorum: boolean;
  executionTimestamp?: string;
  executionData?: string[];
  executionTo?: string[];
  totalVotingPower: BigInt;
  isLegacy?: boolean;
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

export type ResolutionEntityEnhanced = ResolutionEntity & {
  state: ResolutionState;
  href: string;
  createdAt: string;
  rejectedAt: string | null;
  updatedAt: string | null;
  approvedAt: string | null;
  executedAt: string | null;
  action: ResolutionAction;
  resolutionTypeInfo: ResolutionTypeInfo;
  votingStatus: {
    votersHaveNotVoted: ResolutionVoter[];
    votersHaveVoted: ResolutionVoter[];
    votersHaveVotedYes: ResolutionVoter[];
    votersHaveVotedNo: ResolutionVoter[];
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

export type DaoUser = {
  id: string;
  address: string;

  governanceBalance: BigInt;
  governanceOfferedTempBalance: BigInt;
  governanceVestingBalance: BigInt;
  governanceVaultedBalance: BigInt;
  governanceWithdrawableTempBalance: BigInt;
  votingPower: BigInt;
  shareholderRegistryBalance: BigInt;
  neokigdomTokenBalance: BigInt;

  activeOffers: Offer[];
};

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

export type RedemptionHistory = {
  id: string;
  amount: BigInt;
  timestamp: string;
};

export type Redemption = {
  id: string;
  amount: BigInt;
  redemptionHistory: RedemptionHistory[];
  createTimestamp: string;
  updateTimestamp: string;
  createBy: string;
  startTimestamp: string;
  endTimestamp: string;
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
