/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { EventFragment, FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";

import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from "../../common";

export interface InternalMarketBaseInterface extends utils.Interface {
  functions: {
    "erc20()": FunctionFragment;
    "offerDuration()": FunctionFragment;
    "offeredBalanceOf(address)": FunctionFragment;
    "withdrawableBalanceOf(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "erc20" | "offerDuration" | "offeredBalanceOf" | "withdrawableBalanceOf",
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "erc20", values?: undefined): string;
  encodeFunctionData(functionFragment: "offerDuration", values?: undefined): string;
  encodeFunctionData(functionFragment: "offeredBalanceOf", values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: "withdrawableBalanceOf", values: [PromiseOrValue<string>]): string;

  decodeFunctionResult(functionFragment: "erc20", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "offerDuration", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "offeredBalanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdrawableBalanceOf", data: BytesLike): Result;

  events: {
    "OfferCreated(uint128,address,uint256,uint256)": EventFragment;
    "OfferMatched(uint128,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OfferCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OfferMatched"): EventFragment;
}

export interface OfferCreatedEventObject {
  id: BigNumber;
  from: string;
  amount: BigNumber;
  createdAt: BigNumber;
}
export type OfferCreatedEvent = TypedEvent<[BigNumber, string, BigNumber, BigNumber], OfferCreatedEventObject>;

export type OfferCreatedEventFilter = TypedEventFilter<OfferCreatedEvent>;

export interface OfferMatchedEventObject {
  id: BigNumber;
  from: string;
  to: string;
  amount: BigNumber;
}
export type OfferMatchedEvent = TypedEvent<[BigNumber, string, string, BigNumber], OfferMatchedEventObject>;

export type OfferMatchedEventFilter = TypedEventFilter<OfferMatchedEvent>;

export interface InternalMarketBase extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: InternalMarketBaseInterface;

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
    erc20(overrides?: CallOverrides): Promise<[string]>;

    offerDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    offeredBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    withdrawableBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  erc20(overrides?: CallOverrides): Promise<string>;

  offerDuration(overrides?: CallOverrides): Promise<BigNumber>;

  offeredBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  withdrawableBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    erc20(overrides?: CallOverrides): Promise<string>;

    offerDuration(overrides?: CallOverrides): Promise<BigNumber>;

    offeredBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    withdrawableBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "OfferCreated(uint128,address,uint256,uint256)"(
      id?: null,
      from?: null,
      amount?: null,
      createdAt?: null,
    ): OfferCreatedEventFilter;
    OfferCreated(id?: null, from?: null, amount?: null, createdAt?: null): OfferCreatedEventFilter;

    "OfferMatched(uint128,address,address,uint256)"(
      id?: null,
      from?: null,
      to?: null,
      amount?: null,
    ): OfferMatchedEventFilter;
    OfferMatched(id?: null, from?: null, to?: null, amount?: null): OfferMatchedEventFilter;
  };

  estimateGas: {
    erc20(overrides?: CallOverrides): Promise<BigNumber>;

    offerDuration(overrides?: CallOverrides): Promise<BigNumber>;

    offeredBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    withdrawableBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    erc20(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    offerDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    offeredBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawableBalanceOf(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
