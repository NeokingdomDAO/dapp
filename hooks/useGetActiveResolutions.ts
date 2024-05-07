import { ResolutionEntity } from "types";

import { useMemo } from "react";

import { RESOLUTION_STATES, getEnhancedResolutions } from "@lib/resolutions/common";

import useGetResolutions from "./useGetResolutions";
import useResolutionsAcl from "./useResolutionsAcl";
import useTimestamp from "./useTimestamp";

export default function useGetActiveResolutions() {
  const { resolutions, isLoading } = useGetResolutions();
  const { currentTimestamp } = useTimestamp();
  const { acl } = useResolutionsAcl();

  const [votingResolutions, noticeResolutions] = useMemo(() => {
    if (resolutions && acl) {
      const allResolutions = getEnhancedResolutions(resolutions as ResolutionEntity[], +currentTimestamp, acl);

      const resolutionsToVote = allResolutions.filter((res) => res.state === RESOLUTION_STATES.VOTING);
      const resolutionsNotice = allResolutions.filter((res) => res.state === RESOLUTION_STATES.NOTICE);

      return [resolutionsToVote, resolutionsNotice];
    }

    return [[], []];
  }, [resolutions]);

  return {
    votingResolutions,
    noticeResolutions,
    isLoading,
    activeResolutionsWarning: !isLoading && (votingResolutions.length > 0 || noticeResolutions.length > 0),
  };
}
