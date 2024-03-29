/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";

import type { PromiseOrValue } from "../../../common";
import type {
  ShareholderRegistryBase,
  ShareholderRegistryBaseInterface,
} from "../../../contracts/ShareholderRegistry/ShareholderRegistryBase";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "previous",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "current",
        type: "bytes32",
      },
    ],
    name: "StatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "CONTRIBUTOR_STATUS",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVESTOR_STATUS",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MANAGING_BOARD_STATUS",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SHAREHOLDER_STATUS",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getStatus",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "status",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isAtLeast",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610cde806100206000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c806339509351116100a2578063a9059cbb11610071578063a9059cbb14610221578063dd62ed3e14610234578063ed76fff314610247578063efbc89bc14610250578063fe4c7da81461025957600080fd5b806339509351146101ca57806370a08231146101dd57806395d89b4114610206578063a457c2d71461020e57600080fd5b806318160ddd116100de57806318160ddd1461017757806323b872dd1461017f57806330ccebb514610192578063313ce567146101bb57600080fd5b806306c1c03b1461011057806306fdde031461012c578063095ea7b3146101415780630ea018f714610164575b600080fd5b61011960685481565b6040519081526020015b60405180910390f35b610134610262565b6040516101239190610acb565b61015461014f366004610b35565b6102f4565b6040519015158152602001610123565b610154610172366004610b5f565b61030e565b603554610119565b61015461018d366004610b8b565b610344565b6101196101a0366004610bc7565b6001600160a01b03166000908152606a602052604090205490565b60405160128152602001610123565b6101546101d8366004610b35565b610368565b6101196101eb366004610bc7565b6001600160a01b031660009081526033602052604090205490565b61013461038a565b61015461021c366004610b35565b610399565b61015461022f366004610b35565b610419565b610119610242366004610be2565b610427565b61011960655481565b61011960675481565b61011960665481565b60606036805461027190610c0c565b80601f016020809104026020016040519081016040528092919081815260200182805461029d90610c0c565b80156102ea5780601f106102bf576101008083540402835291602001916102ea565b820191906000526020600020905b8154815290600101906020018083116102cd57829003601f168201915b5050505050905090565b600033610302818585610452565b60019150505b92915050565b6001600160a01b038116600090815260336020908152604080832054606a90925282205461033d919085610576565b9392505050565b6000336103528582856105bd565b61035d858585610637565b506001949350505050565b60003361030281858561037b8383610427565b6103859190610c5c565b610452565b60606037805461027190610c0c565b600033816103a78286610427565b90508381101561040c5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61035d8286868403610452565b600033610302818585610637565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b6001600160a01b0383166104b45760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610403565b6001600160a01b0382166105155760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610403565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600080841180156105b55750606654821480610593575060655482145b8061059d57508282145b806105b55750606754821480156105b5575060685483145b949350505050565b60006105c98484610427565b9050600019811461063157818110156106245760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610403565b6106318484848403610452565b50505050565b6001600160a01b03831661069b5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610403565b6001600160a01b0382166106fd5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610403565b6107088383836107f3565b6001600160a01b038316600090815260336020526040902054818110156107805760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610403565b6001600160a01b0380851660008181526033602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906107e09086815260200190565b60405180910390a361063184848461087c565b610805670de0b6b3a764000082610c6f565b61081790670de0b6b3a7640000610c91565b81146108775760405162461bcd60e51b815260206004820152602960248201527f5368617265686f6c64657252656769737472793a204e6f206672616374696f6e604482015268616c20746f6b656e7360b81b6064820152608401610403565b505050565b6001600160a01b0383166000908152603360205260409020546000036108a7576108a760008461091b565b606954604051636fb12c5f60e11b81526001600160a01b0385811660048301528481166024830152604482018490529091169063df6258be906064015b600060405180830381600087803b1580156108fe57600080fd5b505af1158015610912573d6000803e3d6000fd5b50505050505050565b81158061092f575061092f6065548261030e565b61098e5760405162461bcd60e51b815260206004820152602a60248201527f5368617265686f6c64657252656769737472793a206164647265737320686173604482015269206e6f20746f6b656e7360b01b6064820152608401610403565b6001600160a01b0381166000818152606a602090815260409182902054825181815291820186905292917f63d1f3ab699618c7d6d972a3c28f0d08fa090bebc96a34c3a30e5fcda6397ab2910160405180910390a26109ee828285610a14565b6001600160a01b0382166000908152606a60205260409020839055610877828285610a70565b610a22600183606754610576565b8015610a395750610a37600182606754610576565b155b156108775760695460405163d86f5a0760e01b81526001600160a01b0385811660048301529091169063d86f5a07906024016108e4565b610a7e600183606754610576565b158015610a945750610a94600182606754610576565b1561087757606954604051634693feab60e01b81526001600160a01b03858116600483015290911690634693feab906024016108e4565b600060208083528351808285015260005b81811015610af857858101830151858201604001528201610adc565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610b3057600080fd5b919050565b60008060408385031215610b4857600080fd5b610b5183610b19565b946020939093013593505050565b60008060408385031215610b7257600080fd5b82359150610b8260208401610b19565b90509250929050565b600080600060608486031215610ba057600080fd5b610ba984610b19565b9250610bb760208501610b19565b9150604084013590509250925092565b600060208284031215610bd957600080fd5b61033d82610b19565b60008060408385031215610bf557600080fd5b610bfe83610b19565b9150610b8260208401610b19565b600181811c90821680610c2057607f821691505b602082108103610c4057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561030857610308610c46565b600082610c8c57634e487b7160e01b600052601260045260246000fd5b500490565b808202811582820484141761030857610308610c4656fea264697066735822122066a0e162bfba9f63a579cd6b1fa593a59464686813fecb7e0e18197e641f859164736f6c63430008130033";

type ShareholderRegistryBaseConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ShareholderRegistryBaseConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ShareholderRegistryBase__factory extends ContractFactory {
  constructor(...args: ShareholderRegistryBaseConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ShareholderRegistryBase> {
    return super.deploy(overrides || {}) as Promise<ShareholderRegistryBase>;
  }
  override getDeployTransaction(overrides?: Overrides & { from?: PromiseOrValue<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ShareholderRegistryBase {
    return super.attach(address) as ShareholderRegistryBase;
  }
  override connect(signer: Signer): ShareholderRegistryBase__factory {
    return super.connect(signer) as ShareholderRegistryBase__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ShareholderRegistryBaseInterface {
    return new utils.Interface(_abi) as ShareholderRegistryBaseInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ShareholderRegistryBase {
    return new Contract(address, _abi, signerOrProvider) as ShareholderRegistryBase;
  }
}
