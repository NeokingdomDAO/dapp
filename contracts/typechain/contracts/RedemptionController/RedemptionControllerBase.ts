/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";

import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from "../../common";

export interface RedemptionControllerBaseInterface extends utils.Interface {
  functions: {
    "activityWindow()": FunctionFragment;
    "afterMint(address,uint256)": FunctionFragment;
    "afterOffer(address,uint256)": FunctionFragment;
    "afterRedeem(address,uint256)": FunctionFragment;
    "maxDaysInThePast()": FunctionFragment;
    "redeemableBalance(address)": FunctionFragment;
    "redemptionStart()": FunctionFragment;
    "redemptionWindow()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "activityWindow"
      | "afterMint"
      | "afterOffer"
      | "afterRedeem"
      | "maxDaysInThePast"
      | "redeemableBalance"
      | "redemptionStart"
      | "redemptionWindow",
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "activityWindow", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "afterMint",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "afterOffer",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "afterRedeem",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: "maxDaysInThePast", values?: undefined): string;
  encodeFunctionData(functionFragment: "redeemableBalance", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "redemptionStart", values?: undefined): string;
  encodeFunctionData(functionFragment: "redemptionWindow", values?: undefined): string;

  decodeFunctionResult(functionFragment: "activityWindow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "afterMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "afterOffer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "afterRedeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxDaysInThePast", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeemableBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redemptionStart", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redemptionWindow", data: BytesLike): Result;

  events: {};
}

export interface RedemptionControllerBase extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RedemptionControllerBaseInterface;

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
    activityWindow(overrides?: CallOverrides): Promise<[BigNumber]>;

    afterMint(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    afterOffer(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    afterRedeem(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    maxDaysInThePast(overrides?: CallOverrides): Promise<[BigNumber]>;

    redeemableBalance(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { redeemableAmount: BigNumber }>;

    redemptionStart(overrides?: CallOverrides): Promise<[BigNumber]>;

    redemptionWindow(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  activityWindow(overrides?: CallOverrides): Promise<BigNumber>;

  afterMint(
    account: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  afterOffer(
    account: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  afterRedeem(
    account: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  maxDaysInThePast(overrides?: CallOverrides): Promise<BigNumber>;

  redeemableBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  redemptionStart(overrides?: CallOverrides): Promise<BigNumber>;

  redemptionWindow(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    activityWindow(overrides?: CallOverrides): Promise<BigNumber>;

    afterMint(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    afterOffer(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    afterRedeem(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    maxDaysInThePast(overrides?: CallOverrides): Promise<BigNumber>;

    redeemableBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    redemptionStart(overrides?: CallOverrides): Promise<BigNumber>;

    redemptionWindow(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    activityWindow(overrides?: CallOverrides): Promise<BigNumber>;

    afterMint(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    afterOffer(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    afterRedeem(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    maxDaysInThePast(overrides?: CallOverrides): Promise<BigNumber>;

    redeemableBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    redemptionStart(overrides?: CallOverrides): Promise<BigNumber>;

    redemptionWindow(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    activityWindow(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    afterMint(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    afterOffer(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    afterRedeem(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    maxDaysInThePast(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemableBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redemptionStart(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redemptionWindow(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}