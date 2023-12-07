import { Signer, providers } from "ethers";
import { SUPPORTED_CHAINS } from "pages/_app";
import { WalletClient, useAccount, useDisconnect, useNetwork, useWalletClient } from "wagmi";

import { useEffect, useState } from "react";

import { useSnackbar } from "@hooks/useSnackbar";

import { ContractsContextType } from "../contexts/ContractsContext";
import {
  GovernanceToken,
  GovernanceToken__factory,
  InternalMarket,
  InternalMarket__factory,
  NeokingdomToken,
  NeokingdomToken__factory,
  ResolutionManager,
  ResolutionManager__factory,
  TokenMock,
  TokenMock__factory,
  Voting,
  Voting__factory,
} from "../contracts/typechain";
import networksCrowdpunk from "../networks/crowdpunk.json";
import networksNeoKingdom from "../networks/neokingdom.json";
import networksTeledisko from "../networks/teledisko.json";

export const networks: Record<string, any> = {
  neokingdom: networksNeoKingdom,
  teledisko: networksTeledisko,
  crowdpunk: networksCrowdpunk,
  vanilla: networksNeoKingdom,
}[process.env.NEXT_PUBLIC_PROJECT_KEY];

const getResolutionManagerContract = (chainId: string, signer: Signer): ResolutionManager => {
  const address = networks[chainId]["ResolutionManager"]?.address;
  return ResolutionManager__factory.connect(address, signer);
};

const getNeokingdomTokenContract = (chainId: string, signer: Signer): NeokingdomToken => {
  const address = networks[chainId]["NeokingdomToken"]?.address;
  return NeokingdomToken__factory.connect(address, signer);
};

export const getNeokingdomTokenContractAddress = (chainId: string): string => {
  return networks[chainId]["NeokingdomToken"]?.address;
};

const getVotingContract = (chainId: string, signer: Signer): Voting => {
  const address = networks[chainId]["Voting"]?.address;
  return Voting__factory.connect(address, signer);
};

const getInternalMarketContract = (chainId: string, signer: Signer): InternalMarket => {
  const address = networks[chainId]["InternalMarket"]?.address;
  return InternalMarket__factory.connect(address, signer);
};

const getInternalMarketContractAddress = (chainId: string): string => {
  return networks[chainId]["InternalMarket"]?.address;
};

const getGovernanceTokenContract = (chainId: string, signer: Signer): GovernanceToken => {
  const address = networks[chainId]["GovernanceToken"]?.address;
  return GovernanceToken__factory.connect(address, signer);
};

const getGovernanceTokenContractAddress = (chainId: string): string => {
  return networks[chainId]["GovernanceToken"]?.address;
};

// todo use ERC20?
const getUsdcContract = (chainId: string, signer: Signer): TokenMock => {
  const address = networks[chainId]["TokenMock"]?.address;
  return TokenMock__factory.connect(address, signer);
};

function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useContracts() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();
  const { enqueueSnackbar } = useSnackbar();

  const [contracts, setContracts] = useState<ContractsContextType>({});

  useEffect(() => {
    if (address && walletClient) {
      try {
        const chainId = String(chain?.id);
        const signer = walletClientToSigner(walletClient);

        if (!SUPPORTED_CHAINS.map((chain) => String(chain.id)).includes(chainId)) {
          throw new Error(`You're connected to an unsupported network, please connect to ${SUPPORTED_CHAINS[0].name}`);
        }

        setContracts({
          resolutionManagerContract: getResolutionManagerContract(chainId, signer),
          neokingdomTokenContract: getNeokingdomTokenContract(chainId, signer),
          votingContract: getVotingContract(chainId, signer),
          internalMarketContract: getInternalMarketContract(chainId, signer),
          internalMarketContractAddress: getInternalMarketContractAddress(chainId),
          governanceTokenContract: getGovernanceTokenContract(chainId, signer),
          governanceTokenContractAddress: getGovernanceTokenContractAddress(chainId),
          usdcContract: getUsdcContract(chainId, signer),
        });
      } catch (error) {
        console.error(error);
        // @ts-ignore
        enqueueSnackbar(error?.message, {
          variant: "error",
        });
        disconnect();
      }
    }
  }, [address, walletClient, chain?.id]);

  return contracts;
}
