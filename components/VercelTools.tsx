import { FlagValuesType } from "@vercel/flags";
import { FlagValues } from "@vercel/flags/react";
import { VercelToolbar } from "@vercel/toolbar/next";

import { useContext } from "react";

import { FeatureFlagContext } from "@lib/feature-flags/useFeatureFlags";

export const getValuesWithoutInternal = (values: FlagValuesType): FlagValuesType => {
  const filteredFlagValues = Object.fromEntries(
    Object.entries(values).filter(([flagKey]) => !flagKey.startsWith("__")),
  );
  return filteredFlagValues;
};

const VercelTools = () => {
  const hypernodeRoot = useContext(FeatureFlagContext);
  const isDeveloper = hypernodeRoot.isDeveloper().get(false);
  return (
    <>
      {isDeveloper && <VercelToolbar />}
      <FlagValues values={getValuesWithoutInternal(hypernodeRoot.get())} />
    </>
  );
};

export default VercelTools;
