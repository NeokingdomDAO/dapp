import { FlagValuesType } from "@vercel/flags";

import { createContext, useContext } from "react";
import React, { useEffect, useMemo } from "react";
import { Cookies } from "react-cookie";

import { RootNode, initializeHypertune } from "./generated";

type UseFeatureFlagsProps = {
  erpId?: string;
  walletAddress?: string;
  name?: string;
  email?: string;
  children: React.ReactNode;
};

const hypertune = initializeHypertune(
  {},
  {
    token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN,
  },
);

export const FeatureFlagContext = createContext(
  hypertune.root({
    context: {
      environment: process.env.NEXT_PUBLIC_ENV === "production" ? "PRODUCTION" : "STAGING",
      user: { erpId: "", walletAddress: "", email: "", name: "" },
    },
  }),
);

export const FeatureFlagContextProvider = ({ erpId, walletAddress, email, children }: UseFeatureFlagsProps) => {
  const cookies = new Cookies();
  hypertune.setOverride({ root: cookies.get("vercel-flag-overrides") });

  // Trigger a re-render when flags are updated
  const [, setCommitHash] = React.useState<string | null>(hypertune.getStateHash());
  useEffect(() => {
    hypertune.addUpdateListener(setCommitHash);
    return () => {
      hypertune.removeUpdateListener(setCommitHash);
    };
  }, []);

  // Return the Hypertune root node initialized with the current user
  const hypertuneRoot = useMemo(
    () =>
      hypertune.root({
        context: {
          environment: process.env.NEXT_PUBLIC_ENV === "production" ? "PRODUCTION" : "STAGING",
          user: { erpId: erpId || "", walletAddress: walletAddress || "", email: email || "", name: "" },
        },
      }),
    [email, erpId, walletAddress],
  );

  return <FeatureFlagContext.Provider value={hypertuneRoot}>{children}</FeatureFlagContext.Provider>;
};

export function useFeatureFlags() {
  const hypertuneRoot = useContext(FeatureFlagContext);
  return hypertuneRoot;
}
