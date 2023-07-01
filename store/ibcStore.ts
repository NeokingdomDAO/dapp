import { create } from "zustand";

interface Ibc {
  evmosBalance: number;
  crescentBalance: number;
  prevEvmosBalance: number;
  prevCrescentBalance: number;
  isLoadingBalanceAfterSend: boolean;
  stopEvmosInterval: boolean;
  stopCrescentInterval: boolean;
  setEvmosBalance: (value: number) => void;
  setCrescentBalance: (value: number) => void;
  setPrevEvmosBalance: (value: number) => void;
  setPrevCrescentBalance: (value: number) => void;
  setIsLoadingBalanceAfterSend: (value: boolean) => void;
  resetStore: () => void;
}

const defaultState = {
  evmosBalance: 0,
  crescentBalance: 0,
  prevEvmosBalance: 0,
  prevCrescentBalance: 0,
  isLoadingBalanceAfterSend: false,
  stopEvmosInterval: false,
  stopCrescentInterval: false,
};

const useIbcStore = create<Ibc>((set, get) => ({
  ...defaultState,
  setEvmosBalance: (evmosBalance: number) => {
    set({ evmosBalance });
    if (get().prevEvmosBalance !== evmosBalance) {
      set({ stopEvmosInterval: true });
      if (get().stopCrescentInterval) {
        set({ isLoadingBalanceAfterSend: false });
      }
    }
  },
  setCrescentBalance: (crescentBalance: number) => {
    set({ crescentBalance });
    if (get().prevCrescentBalance !== crescentBalance) {
      set({ stopCrescentInterval: true });
      if (get().stopEvmosInterval) {
        set({ isLoadingBalanceAfterSend: false });
      }
    }
  },
  setPrevEvmosBalance: (prevEvmosBalance: number) => set({ prevEvmosBalance }),
  setPrevCrescentBalance: (prevCrescentBalance: number) => set({ prevCrescentBalance }),
  setIsLoadingBalanceAfterSend: (isLoadingBalanceAfterSend: boolean) => set({ isLoadingBalanceAfterSend }),
  resetStore: () => set({ ...defaultState }),
}));

export default useIbcStore;
