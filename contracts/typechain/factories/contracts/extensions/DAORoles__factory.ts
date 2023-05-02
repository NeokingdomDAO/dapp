/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";

import type { PromiseOrValue } from "../../../common";
import type { DAORoles, DAORolesInterface } from "../../../contracts/extensions/DAORoles";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001c600033610021565b6100c0565b6000828152602081815260408083206001600160a01b038516845290915290205460ff166100bc576000828152602081815260408083206001600160a01b03851684529091529020805460ff1916600117905561007b3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b61076b806100cf6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c806336568abe1161005b57806336568abe146100f057806391d1485414610103578063a217fddf14610116578063d547741f1461011e57600080fd5b806301ffc9a714610082578063248a9ca3146100aa5780632f2ff15d146100db575b600080fd5b610095610090366004610567565b610131565b60405190151581526020015b60405180910390f35b6100cd6100b8366004610591565b60009081526020819052604090206001015490565b6040519081526020016100a1565b6100ee6100e93660046105aa565b610168565b005b6100ee6100fe3660046105aa565b610192565b6100956101113660046105aa565b610215565b6100cd600081565b6100ee61012c3660046105aa565b61023e565b60006001600160e01b03198216637965db0b60e01b148061016257506301ffc9a760e01b6001600160e01b03198316145b92915050565b60008281526020819052604090206001015461018381610263565b61018d8383610270565b505050565b6001600160a01b03811633146102075760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61021182826102f4565b5050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60008281526020819052604090206001015461025981610263565b61018d83836102f4565b61026d8133610359565b50565b61027a8282610215565b610211576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556102b03390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6102fe8282610215565b15610211576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6103638282610215565b61021157610370816103b2565b61037b8360206103c4565b60405160200161038c92919061060a565b60408051601f198184030181529082905262461bcd60e51b82526101fe9160040161067f565b60606101626001600160a01b03831660145b606060006103d38360026106c8565b6103de9060026106df565b67ffffffffffffffff8111156103f6576103f66106f2565b6040519080825280601f01601f191660200182016040528015610420576020820181803683370190505b509050600360fc1b8160008151811061043b5761043b610708565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061046a5761046a610708565b60200101906001600160f81b031916908160001a905350600061048e8460026106c8565b6104999060016106df565b90505b6001811115610511576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106104cd576104cd610708565b1a60f81b8282815181106104e3576104e3610708565b60200101906001600160f81b031916908160001a90535060049490941c9361050a8161071e565b905061049c565b5083156105605760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016101fe565b9392505050565b60006020828403121561057957600080fd5b81356001600160e01b03198116811461056057600080fd5b6000602082840312156105a357600080fd5b5035919050565b600080604083850312156105bd57600080fd5b8235915060208301356001600160a01b03811681146105db57600080fd5b809150509250929050565b60005b838110156106015781810151838201526020016105e9565b50506000910152565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516106428160178501602088016105e6565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516106738160288401602088016105e6565b01602801949350505050565b602081526000825180602084015261069e8160408501602087016105e6565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610162576101626106b2565b80820180821115610162576101626106b2565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b60008161072d5761072d6106b2565b50600019019056fea26469706673582212204b9472275852dae20b33a9c4e046765369a9acf2e05a6804604f85bdcf13ee9264736f6c63430008130033";

type DAORolesConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: DAORolesConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class DAORoles__factory extends ContractFactory {
  constructor(...args: DAORolesConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<DAORoles> {
    return super.deploy(overrides || {}) as Promise<DAORoles>;
  }
  override getDeployTransaction(overrides?: Overrides & { from?: PromiseOrValue<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DAORoles {
    return super.attach(address) as DAORoles;
  }
  override connect(signer: Signer): DAORoles__factory {
    return super.connect(signer) as DAORoles__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DAORolesInterface {
    return new utils.Interface(_abi) as DAORolesInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DAORoles {
    return new Contract(address, _abi, signerOrProvider) as DAORoles;
  }
}
