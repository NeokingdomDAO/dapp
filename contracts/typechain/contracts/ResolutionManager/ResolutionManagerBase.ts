/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { EventFragment, FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";

import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from "../../common";

export interface ResolutionManagerBaseInterface extends utils.Interface {
  functions: {
    "getExecutionDetails(uint256)": FunctionFragment;
    "getResolutionResult(uint256)": FunctionFragment;
    "getVoterVote(uint256,address)": FunctionFragment;
    "resolutionTypes(uint256)": FunctionFragment;
    "resolutions(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getExecutionDetails"
      | "getResolutionResult"
      | "getVoterVote"
      | "resolutionTypes"
      | "resolutions",
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "getExecutionDetails", values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: "getResolutionResult", values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: "getVoterVote",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: "resolutionTypes", values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: "resolutions", values: [PromiseOrValue<BigNumberish>]): string;

  decodeFunctionResult(functionFragment: "getExecutionDetails", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getResolutionResult", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getVoterVote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "resolutionTypes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "resolutions", data: BytesLike): Result;

  events: {
    "DelegateLostVotingPower(address,uint256,uint256)": EventFragment;
    "ResolutionApproved(address,uint256)": EventFragment;
    "ResolutionCreated(address,uint256)": EventFragment;
    "ResolutionExecuted(address,uint256)": EventFragment;
    "ResolutionRejected(address,uint256)": EventFragment;
    "ResolutionTypeCreated(address,uint256)": EventFragment;
    "ResolutionUpdated(address,uint256)": EventFragment;
    "ResolutionVoted(address,uint256,uint256,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DelegateLostVotingPower"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionApproved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionExecuted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionRejected"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionTypeCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ResolutionVoted"): EventFragment;
}

export interface DelegateLostVotingPowerEventObject {
  from: string;
  resolutionId: BigNumber;
  amount: BigNumber;
}
export type DelegateLostVotingPowerEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  DelegateLostVotingPowerEventObject
>;

export type DelegateLostVotingPowerEventFilter = TypedEventFilter<DelegateLostVotingPowerEvent>;

export interface ResolutionApprovedEventObject {
  from: string;
  resolutionId: BigNumber;
}
export type ResolutionApprovedEvent = TypedEvent<[string, BigNumber], ResolutionApprovedEventObject>;

export type ResolutionApprovedEventFilter = TypedEventFilter<ResolutionApprovedEvent>;

export interface ResolutionCreatedEventObject {
  from: string;
  resolutionId: BigNumber;
}
export type ResolutionCreatedEvent = TypedEvent<[string, BigNumber], ResolutionCreatedEventObject>;

export type ResolutionCreatedEventFilter = TypedEventFilter<ResolutionCreatedEvent>;

export interface ResolutionExecutedEventObject {
  from: string;
  resolutionId: BigNumber;
}
export type ResolutionExecutedEvent = TypedEvent<[string, BigNumber], ResolutionExecutedEventObject>;

export type ResolutionExecutedEventFilter = TypedEventFilter<ResolutionExecutedEvent>;

export interface ResolutionRejectedEventObject {
  from: string;
  resolutionId: BigNumber;
}
export type ResolutionRejectedEvent = TypedEvent<[string, BigNumber], ResolutionRejectedEventObject>;

export type ResolutionRejectedEventFilter = TypedEventFilter<ResolutionRejectedEvent>;

export interface ResolutionTypeCreatedEventObject {
  from: string;
  typeIndex: BigNumber;
}
export type ResolutionTypeCreatedEvent = TypedEvent<[string, BigNumber], ResolutionTypeCreatedEventObject>;

export type ResolutionTypeCreatedEventFilter = TypedEventFilter<ResolutionTypeCreatedEvent>;

export interface ResolutionUpdatedEventObject {
  from: string;
  resolutionId: BigNumber;
}
export type ResolutionUpdatedEvent = TypedEvent<[string, BigNumber], ResolutionUpdatedEventObject>;

export type ResolutionUpdatedEventFilter = TypedEventFilter<ResolutionUpdatedEvent>;

export interface ResolutionVotedEventObject {
  from: string;
  resolutionId: BigNumber;
  votingPower: BigNumber;
  isYes: boolean;
}
export type ResolutionVotedEvent = TypedEvent<[string, BigNumber, BigNumber, boolean], ResolutionVotedEventObject>;

export type ResolutionVotedEventFilter = TypedEventFilter<ResolutionVotedEvent>;

export interface ResolutionManagerBase extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ResolutionManagerBaseInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getExecutionDetails(
      resolutionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string[], string[]]>;

    getResolutionResult(resolutionId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;

    getVoterVote(
      resolutionId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [boolean, boolean, BigNumber] & {
        isYes: boolean;
        hasVoted: boolean;
        votingPower: BigNumber;
      }
    >;

    resolutionTypes(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, boolean] & {
        name: string;
        quorum: BigNumber;
        noticePeriod: BigNumber;
        votingPeriod: BigNumber;
        canBeNegative: boolean;
      }
    >;

    resolutions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber, BigNumber, string] & {
        dataURI: string;
        resolutionTypeId: BigNumber;
        approveTimestamp: BigNumber;
        snapshotId: BigNumber;
        yesVotesTotal: BigNumber;
        isNegative: boolean;
        rejectionTimestamp: BigNumber;
        executionTimestamp: BigNumber;
        addressedContributor: string;
      }
    >;
  };

  getExecutionDetails(
    resolutionId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<[string[], string[]]>;

  getResolutionResult(resolutionId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;

  getVoterVote(
    resolutionId: PromiseOrValue<BigNumberish>,
    voter: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<
    [boolean, boolean, BigNumber] & {
      isYes: boolean;
      hasVoted: boolean;
      votingPower: BigNumber;
    }
  >;

  resolutionTypes(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, boolean] & {
      name: string;
      quorum: BigNumber;
      noticePeriod: BigNumber;
      votingPeriod: BigNumber;
      canBeNegative: boolean;
    }
  >;

  resolutions(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber, BigNumber, string] & {
      dataURI: string;
      resolutionTypeId: BigNumber;
      approveTimestamp: BigNumber;
      snapshotId: BigNumber;
      yesVotesTotal: BigNumber;
      isNegative: boolean;
      rejectionTimestamp: BigNumber;
      executionTimestamp: BigNumber;
      addressedContributor: string;
    }
  >;

  callStatic: {
    getExecutionDetails(
      resolutionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string[], string[]]>;

    getResolutionResult(resolutionId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;

    getVoterVote(
      resolutionId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [boolean, boolean, BigNumber] & {
        isYes: boolean;
        hasVoted: boolean;
        votingPower: BigNumber;
      }
    >;

    resolutionTypes(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, boolean] & {
        name: string;
        quorum: BigNumber;
        noticePeriod: BigNumber;
        votingPeriod: BigNumber;
        canBeNegative: boolean;
      }
    >;

    resolutions(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber, boolean, BigNumber, BigNumber, string] & {
        dataURI: string;
        resolutionTypeId: BigNumber;
        approveTimestamp: BigNumber;
        snapshotId: BigNumber;
        yesVotesTotal: BigNumber;
        isNegative: boolean;
        rejectionTimestamp: BigNumber;
        executionTimestamp: BigNumber;
        addressedContributor: string;
      }
    >;
  };

  filters: {
    "DelegateLostVotingPower(address,uint256,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
    ): DelegateLostVotingPowerEventFilter;
    DelegateLostVotingPower(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
    ): DelegateLostVotingPowerEventFilter;

    "ResolutionApproved(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionApprovedEventFilter;
    ResolutionApproved(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionApprovedEventFilter;

    "ResolutionCreated(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionCreatedEventFilter;
    ResolutionCreated(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionCreatedEventFilter;

    "ResolutionExecuted(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionExecutedEventFilter;
    ResolutionExecuted(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionExecutedEventFilter;

    "ResolutionRejected(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionRejectedEventFilter;
    ResolutionRejected(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionRejectedEventFilter;

    "ResolutionTypeCreated(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      typeIndex?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionTypeCreatedEventFilter;
    ResolutionTypeCreated(
      from?: PromiseOrValue<string> | null,
      typeIndex?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionTypeCreatedEventFilter;

    "ResolutionUpdated(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionUpdatedEventFilter;
    ResolutionUpdated(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
    ): ResolutionUpdatedEventFilter;

    "ResolutionVoted(address,uint256,uint256,bool)"(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
      votingPower?: null,
      isYes?: null,
    ): ResolutionVotedEventFilter;
    ResolutionVoted(
      from?: PromiseOrValue<string> | null,
      resolutionId?: PromiseOrValue<BigNumberish> | null,
      votingPower?: null,
      isYes?: null,
    ): ResolutionVotedEventFilter;
  };

  estimateGas: {
    getExecutionDetails(resolutionId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getResolutionResult(resolutionId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getVoterVote(
      resolutionId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    resolutionTypes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    resolutions(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getExecutionDetails(
      resolutionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getResolutionResult(
      resolutionId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getVoterVote(
      resolutionId: PromiseOrValue<BigNumberish>,
      voter: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    resolutionTypes(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    resolutions(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
