import React, { useEffect, useMemo } from "react";

import { initializeHypertune } from "./generated";

type UseFeatureFlagsProps = {
  erpId?: string;
  walletAddress?: string;
  name?: string;
  email?: string;
};

const hypertune = initializeHypertune(
  {},
  {
    token: process.env.NEXT_PUBLIC_HYPERTUNE_TOKEN,
  },
);

export default function useFeatureFlags({ erpId, walletAddress, email }: UseFeatureFlagsProps) {
  // Trigger a re-render when flags are updated
  const [, setCommitHash] = React.useState<string | null>(hypertune.getStateHash());
  useEffect(() => {
    hypertune.addUpdateListener(setCommitHash);
    return () => {
      hypertune.removeUpdateListener(setCommitHash);
    };
  }, []);

  // Return the Hypertune root node initialized with the current user
  return useMemo(
    () =>
      hypertune.root({
        context: {
          environment: process.env.NEXT_PUBLIC_ENV === "production" ? "PRODUCTION" : "STAGING",
          user: { erpId: erpId || "", walletAddress: walletAddress || "", email: email || "" },
        },
      }),
    [email, erpId, walletAddress],
  );
}
