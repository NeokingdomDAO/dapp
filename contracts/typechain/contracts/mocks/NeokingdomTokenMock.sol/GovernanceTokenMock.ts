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

import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from "../../../common";

export interface GovernanceTokenMockInterface extends utils.Interface {
  functions: {
    "balanceOfAt(address,uint256)": FunctionFragment;
    "mock_balanceOfAt(address,uint256)": FunctionFragment;
    "snapshot()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "balanceOfAt" | "mock_balanceOfAt" | "snapshot"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "balanceOfAt",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: "mock_balanceOfAt",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: "snapshot", values?: undefined): string;

  decodeFunctionResult(functionFragment: "balanceOfAt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mock_balanceOfAt", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "snapshot", data: BytesLike): Result;

  events: {};
}

export interface GovernanceTokenMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GovernanceTokenMockInterface;

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
    balanceOfAt(
      account: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    mock_balanceOfAt(
      account: PromiseOrValue<string>,
      mockResult: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    snapshot(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  balanceOfAt(
    account: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  mock_balanceOfAt(
    account: PromiseOrValue<string>,
    mockResult: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  snapshot(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    balanceOfAt(
      account: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    mock_balanceOfAt(
      account: PromiseOrValue<string>,
      mockResult: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    snapshot(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    balanceOfAt(
      account: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    mock_balanceOfAt(
      account: PromiseOrValue<string>,
      mockResult: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    snapshot(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOfAt(
      account: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    mock_balanceOfAt(
      account: PromiseOrValue<string>,
      mockResult: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    snapshot(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
