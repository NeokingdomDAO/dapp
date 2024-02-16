import type { NeokingdomToken } from "@contracts/typechain";
import { addSeconds, format, formatRelative, isBefore } from "date-fns";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";

import type {
  MonthlyRewardsUserData,
  ResolutionEntity,
  ResolutionState,
  ResolutionStates,
  ResolutionTypeInfo,
  ResolutionVoterEnhanced,
  ResolutionsAcl,
  RewardsResponse,
} from "../../types";

export const RESOLUTION_STATES: ResolutionStates = {
  PRE_DRAFT: "pre-draft", // default state
  // transition to when approved
  NOTICE: "notice",
  // transition to when notice period ends
  VOTING: "voting",
  // transition to when voting period ends
  ENDED: "ended",
  // rejected
  REJECTED: "rejected",
};

export const RESOLUTION_ACTIONS = {
  [RESOLUTION_STATES.PRE_DRAFT]: ($acl?: ResolutionsAcl) => ({
    label: $acl?.canUpdate ? "Edit or Approve" : "View",
    disabled: false,
    icon: $acl?.canUpdate ? "eye" : "eye",
  }),
  [RESOLUTION_STATES.NOTICE]: () => ({
    label: "View",
    disabled: false,
    icon: "eye",
  }),
  [RESOLUTION_STATES.REJECTED]: () => ({
    label: "View",
    disabled: true,
    icon: "eye",
  }),
  [RESOLUTION_STATES.VOTING]: ($acl: ResolutionsAcl, resolutionVoters: ResolutionVoterEnhanced[]) => ({
    label: $acl?.canVote(resolutionVoters) ? "View and vote" : "View",
    disabled: false,
    icon: $acl?.canVote(resolutionVoters) ? "eye" : "eye",
  }),
  [RESOLUTION_STATES.ENDED]: () => ({
    label: "View",
    disabled: false,
    icon: "eye",
  }),
};

export const getDateFromUnixTimestamp = (unixTs: string) => new Date(Number(unixTs) * 1000);

export const getRelativeDateFromUnixTimestamp = (unixTs: string, forceAbsolute = false) => {
  const date = getDateFromUnixTimestamp(unixTs);
  if (forceAbsolute) {
    return format(date, "dd LLL yyyy, H:mm");
  }
  return formatRelative(date, new Date());
};

export const getResolutionTypeInfo = (resolution: ResolutionEntity): ResolutionTypeInfo => {
  if (resolution.approveTimestamp === null) {
    return {
      noticePeriodEnds: null,
      noticePeriodEndsAt: null,
      votingEnds: null,
      votingEndsAt: null,
    };
  }
  const noticePeriodEnds = addSeconds(
    getDateFromUnixTimestamp(resolution.approveTimestamp),
    Number(resolution.resolutionType.noticePeriod),
  );

  const votingEnds = addSeconds(noticePeriodEnds, Number(resolution.resolutionType.votingPeriod));

  return {
    noticePeriodEnds,
    noticePeriodEndsAt: format(noticePeriodEnds, "dd LLL yyyy, H:mm"),
    votingEnds,
    votingEndsAt: format(votingEnds, "dd LLL yyyy, H:mm"),
  };
};

export const getResolutionState = (
  resolution: ResolutionEntity,
  $currentTimestamp: number,
  resolutionTypeInfo: ResolutionTypeInfo,
): ResolutionState => {
  if (resolution.rejectTimestamp !== null && resolution.rejectTimestamp !== "0") {
    return RESOLUTION_STATES.REJECTED;
  }
  if (resolution.approveTimestamp !== null && resolution.approveTimestamp !== "0") {
    const { noticePeriodEnds, votingEnds } = resolutionTypeInfo;
    if (isBefore(new Date($currentTimestamp), noticePeriodEnds as Date)) {
      return RESOLUTION_STATES.NOTICE;
    }
    if (isBefore(new Date($currentTimestamp), votingEnds as Date)) {
      return RESOLUTION_STATES.VOTING;
    }
    return RESOLUTION_STATES.ENDED;
  }
  return RESOLUTION_STATES.PRE_DRAFT;
};

export const e18ToInt = (n: string) => {
  return BigNumber.from(n).div(BigNumber.from(10).pow(18)).toNumber();
};

export const getResolutionVoters = (resolution: ResolutionEntity): ResolutionVoterEnhanced[] | undefined => {
  const voters = resolution.voters;

  return voters?.map((voter: NonNullable<ResolutionEntity["voters"]>["0"]) => {
    const delegatingVoter = voters.find(({ address }) => voter.delegated === address);
    const voterBeingDelegated = voters.filter(
      ({ delegated, address }) => delegated === voter.address && address !== voter.address,
    );
    return {
      ...voter,
      votingPowerInt: e18ToInt(voter.votingPower),
      hasVoted: delegatingVoter?.hasVoted || false,
      hasVotedYes: delegatingVoter?.hasVotedYes || false,
      usedPoa: voter.delegated !== voter.address || voterBeingDelegated.length > 0,
      beingDelegatedBy: voterBeingDelegated,
      delegating: delegatingVoter?.address !== voter.address ? delegatingVoter : null,
    };
  });
};

export const getEnhancedResolutionMapper =
  ($currentTimestamp: number, $acl?: ResolutionsAcl) =>
  (resolution: ResolutionEntity, forceAbsolute = false) => {
    const resolutionTypeInfo = getResolutionTypeInfo(resolution);
    const state = getResolutionState(resolution, $currentTimestamp, resolutionTypeInfo);
    const resolutionVoters = getResolutionVoters(resolution);
    return {
      ...resolution,
      voters: resolutionVoters,
      state,
      createdAt: getRelativeDateFromUnixTimestamp(resolution.createTimestamp, forceAbsolute),
      rejectedAt:
        resolution.rejectTimestamp !== null && resolution.rejectTimestamp !== "0"
          ? getRelativeDateFromUnixTimestamp(resolution.rejectTimestamp, forceAbsolute)
          : null,
      updatedAt:
        resolution.updateTimestamp !== null && resolution.updateTimestamp !== "0"
          ? getRelativeDateFromUnixTimestamp(resolution.updateTimestamp, forceAbsolute)
          : null,
      approvedAt:
        resolution.approveTimestamp !== null && resolution.approveTimestamp !== "0"
          ? getRelativeDateFromUnixTimestamp(resolution.approveTimestamp, forceAbsolute)
          : null,
      executedAt:
        resolution.executionTimestamp && resolution.executionTimestamp !== null && resolution.executionTimestamp !== "0"
          ? getRelativeDateFromUnixTimestamp(resolution.executionTimestamp, forceAbsolute)
          : null,
      href:
        state === RESOLUTION_STATES.PRE_DRAFT && $acl?.canUpdate
          ? `#/resolutions/${resolution.id}/edit`
          : `#/resolutions/${resolution.id}`,
      action: RESOLUTION_ACTIONS[state]($acl!, resolutionVoters!),
      resolutionTypeInfo,
      votingStatus: {
        votersHaveNotVoted: resolutionVoters?.filter((v) => !v.hasVoted),
        votersHaveVoted: resolutionVoters?.filter((v) => v.hasVoted),
        votersHaveVotedYes: resolutionVoters?.filter((v) => v.hasVoted && v.hasVotedYes),
        votersHaveVotedNo: resolutionVoters?.filter((v) => v.hasVoted && !v.hasVotedYes),
      },
    };
  };

export const getEnhancedResolutions = (
  resolutions: ResolutionEntity[],
  $currentTimestamp: number,
  $acl: ResolutionsAcl,
) => {
  const mapper = getEnhancedResolutionMapper($currentTimestamp, $acl);
  return resolutions?.map((resolution) => mapper(resolution, false)) || [];
};

export const getExecutionPayload = async (
  $tokenContract: NeokingdomToken,
  rewardsInfo: RewardsResponse,
): Promise<MonthlyRewardsUserData[]> => {
  const {
    rewards: { token_allocations },
  } = rewardsInfo;

  return Promise.all(
    token_allocations.map(async (allocation) => ({
      address: allocation.user.ethereum_address,
      tokens: allocation.token_amount,
      executionData:
        (
          await $tokenContract.populateTransaction.mint(
            allocation.user.ethereum_address,
            parseEther(String(allocation.token_amount)),
          )
        )?.data || "",
    })),
  );
};

export const getPreviousMonth = () => {
  const currentDate = new Date();
  currentDate.setDate(0);

  return currentDate.toLocaleString("en-us", { month: "long" });
};

export const getCurrentMonth = () => {
  const currentDate = new Date();

  return currentDate.toLocaleString("en-us", { month: "long" });
};
