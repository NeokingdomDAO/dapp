import { useSnackbar } from "notistack";
import { useAccount } from "wagmi";

import { addToIpfs } from "@lib/ipfs";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import { useContractsContext } from "../contexts/ContractsContext";
import { ResolutionFormBase } from "../store/resolutionFormStore";

type SubmitParams = {
  vetoTypeId: string | null;
  resolutionId: string;
  currentResolution: ResolutionFormBase;
};

export default function useResolutionUpdate() {
  const { address } = useAccount();
  const { set: setBlockchainTransactionState, reset } = useBlockchainTransactionStore();
  const { resolutionContract } = useContractsContext();
  const { enqueueSnackbar } = useSnackbar();

  if (!address) {
    enqueueSnackbar("Please connect your wallet", { variant: "error" });
    return {
      onSubmit: () => {},
    };
  }

  return {
    onSubmit: async ({ vetoTypeId, resolutionId, currentResolution }: SubmitParams) => {
      setBlockchainTransactionState(true, false);

      try {
        const ipfsId = await addToIpfs(currentResolution);
        const resolutionTypeId = Number(vetoTypeId || currentResolution.typeId);
        const tx = await resolutionContract?.updateResolution(
          resolutionId,
          ipfsId,
          resolutionTypeId,
          !!vetoTypeId,
          [],
          [],
        );
        setBlockchainTransactionState(true, true);
        enqueueSnackbar("Transaction is being executed, hold tight", { variant: "info" });
        await tx?.wait();
        setBlockchainTransactionState(true, false);
        enqueueSnackbar("Pre draft resolution correctly updated", { variant: "success" });
        reset();
        return true;
      } catch (err) {
        enqueueSnackbar("Error updating pre draft resolution", { variant: "error" });
        console.error(err);
        reset();
        return false;
      }
    },
  };
}
