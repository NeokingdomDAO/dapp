/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";

import type { PromiseOrValue } from "../../../common";
import type {
  ResolutionExecutorMock,
  ResolutionExecutorMockInterface,
} from "../../../contracts/mocks/ResolutionExecutorMock";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "a",
        type: "uint256[]",
      },
    ],
    name: "MockExecutionArray",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
    ],
    name: "MockExecutionSimple",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "a",
        type: "uint256[]",
      },
    ],
    name: "mockExecuteArray",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
    ],
    name: "mockExecuteSimple",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610234806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063512a2b1e1461003b578063c483365c14610050575b600080fd5b61004e6100493660046100e3565b610063565b005b61004e61005e3660046101a1565b61009d565b7fe6b194458da41429e33d7efe6dd19c75c7cbf96a6e720826a67f2a52b237366b8160405161009291906101ba565b60405180910390a150565b6040518181527f88b6ed3c0b7067d180bf961760a89454ade4db89b0bd308e926c612aa1b7f17890602001610092565b634e487b7160e01b600052604160045260246000fd5b600060208083850312156100f657600080fd5b823567ffffffffffffffff8082111561010e57600080fd5b818501915085601f83011261012257600080fd5b813581811115610134576101346100cd565b8060051b604051601f19603f83011681018181108582111715610159576101596100cd565b60405291825284820192508381018501918883111561017757600080fd5b938501935b828510156101955784358452938501939285019261017c565b98975050505050505050565b6000602082840312156101b357600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b818110156101f2578351835292840192918401916001016101d6565b5090969550505050505056fea2646970667358221220c1c6bdc09b29d516726beae7b21388721c14427a0bc630049e01ca001d309e4764736f6c63430008130033";

type ResolutionExecutorMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ResolutionExecutorMockConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ResolutionExecutorMock__factory extends ContractFactory {
  constructor(...args: ResolutionExecutorMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ResolutionExecutorMock> {
    return super.deploy(overrides || {}) as Promise<ResolutionExecutorMock>;
  }
  override getDeployTransaction(overrides?: Overrides & { from?: PromiseOrValue<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ResolutionExecutorMock {
    return super.attach(address) as ResolutionExecutorMock;
  }
  override connect(signer: Signer): ResolutionExecutorMock__factory {
    return super.connect(signer) as ResolutionExecutorMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ResolutionExecutorMockInterface {
    return new utils.Interface(_abi) as ResolutionExecutorMockInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ResolutionExecutorMock {
    return new Contract(address, _abi, signerOrProvider) as ResolutionExecutorMock;
  }
}
