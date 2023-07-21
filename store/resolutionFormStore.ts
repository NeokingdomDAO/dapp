import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  title: "",
  content: "",
  typeId: "",
  exclusionAddress: "",
};

export interface ResolutionFormBase {
  title: string;
  content: string;
  typeId: string;
  exclusionAddress: string;
}

interface ResolutionForm extends ResolutionFormBase {
  onUpdateTitle: (evt: any) => void;
  onUpdateContent: (content: string) => void;
  onUpdateType: (evt: any) => void;
  onUpdateExclusionAddress: (address: string) => void;
  reset: (state?: ResolutionFormBase) => void;
}

export type ResolutionFormStore = ReturnType<typeof createResolutionFormStore>;

export const createResolutionFormStore = (initProps?: Partial<ResolutionFormBase>, shouldPersist = false) => {
  const DEFAULT_PROPS: ResolutionFormBase = {
    ...INITIAL_STATE,
  };
  return shouldPersist
    ? create<ResolutionForm>()(
        persist(
          (set) => ({
            ...DEFAULT_PROPS,
            ...initProps,
            onUpdateTitle: (evt: any) => set({ title: evt.target.value }),
            onUpdateContent: (content: string) => set({ content }),
            onUpdateType: (evt: any) => set({ typeId: String(evt.target.value) }),
            onUpdateExclusionAddress: (exclusionAddress: string) => set({ exclusionAddress }),
            reset: (state: ResolutionFormBase = INITIAL_STATE) => set({ ...state }),
          }),
          { name: "resolution-form" },
        ),
      )
    : create<ResolutionForm>()((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        onUpdateTitle: (evt: any) => set({ title: evt.target.value }),
        onUpdateContent: (content: string) => set({ content }),
        onUpdateType: (evt: any) => set({ typeId: String(evt.target.value) }),
        onUpdateExclusionAddress: (exclusionAddress: string) => set({ exclusionAddress }),
        reset: (state: ResolutionFormBase = INITIAL_STATE) => set({ ...state }),
      }));
};
