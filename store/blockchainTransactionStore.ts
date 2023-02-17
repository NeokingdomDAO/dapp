import { create } from "zustand";

interface BlockchainTransaction {
  isLoading: boolean;
  isAwaitingConfirmation: boolean;
  type: string;
  reset: () => void;
  set: (isLoading: boolean, isAwaitingConfirmation: boolean, type?: string) => void;
}

const useBlockchainTransactionStore = create<BlockchainTransaction>((set) => ({
  isLoading: false,
  isAwaitingConfirmation: false,
  type: "",
  reset: () => set({ isLoading: false, isAwaitingConfirmation: false, type: "" }),
  set: (isLoading, isAwaitingConfirmation, type) =>
    type ? set({ isLoading, isAwaitingConfirmation, type }) : set({ isLoading, isAwaitingConfirmation }),
}));

export default useBlockchainTransactionStore;
