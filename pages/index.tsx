import { useAccount } from "wagmi";

import { useMemo } from "react";

import { Typography } from "@mui/material";

import { RESOLUTION_STATES, getEnhancedResolutions, getVotingPercentage } from "@lib/resolutions/common";

import Section from "@components/Section";
import Header from "@components/dashboard/Header";
import InvestorsReport from "@components/dashboard/InvestorsReport";
import Tasks from "@components/dashboard/Tasks";
import Tokens from "@components/dashboard/Tokens";

import useGetResolutions from "@hooks/useGetResolutions";
import useResolutionsAcl from "@hooks/useResolutionsAcl";
import useTimestamp from "@hooks/useTimestamp";
import useUser from "@hooks/useUser";

import ResolutionsStats from "../components/dashboard/ResolutionsStats";
import { ResolutionEntity, ResolutionEntityEnhanced } from "../types";

Home.renderOnServer = false;
Home.requireLogin = true;
Home.fullWidth = true;
Home.checkMismatch = true;

const emptyStats = {
  withQuorum: 0,
  withoutQuorum: 0,
  rejected: 0,
  withQuorumTot: 0,
  withoutQuorumTot: 0,
  rejectedTot: 0,
};

export default function Home() {
  const { resolutions, isLoading, error } = useGetResolutions();

  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const { currentTimestamp } = useTimestamp();
  const { isConnected, address } = useAccount();
  const { user: odooUser } = useUser();

  const [enhancedResolutions, enhancedResolutionsToVote, stats, votingPercentageInTheYear]: [
    ResolutionEntityEnhanced[],
    ResolutionEntityEnhanced[],
    typeof emptyStats,
    number | null,
  ] = useMemo(() => {
    if (isLoading || isLoadingAcl || error) {
      return [[], [], emptyStats, null];
    }

    const allResolutions = getEnhancedResolutions(resolutions as ResolutionEntity[], +currentTimestamp, acl);
    const votingPercentageInTheYear = getVotingPercentage(allResolutions, address || odooUser?.ethereum_address);

    const inProgress = allResolutions.filter(
      (res) => ![RESOLUTION_STATES.ENDED, RESOLUTION_STATES.REJECTED].includes(res.state),
    );
    const resolutionsToVote = allResolutions.filter((res) => res.state === RESOLUTION_STATES.VOTING);
    const withQuorum = allResolutions.filter((res) => res.state === RESOLUTION_STATES.ENDED && res.hasQuorum);
    const withoutQuorum = allResolutions.filter((res) => res.state === RESOLUTION_STATES.ENDED && !res.hasQuorum);
    const rejected = allResolutions.filter((res) => res.state === RESOLUTION_STATES.REJECTED);
    const typesTotals = allResolutions.reduce((totals, res) => {
      const name = res.isNegative ? `${res.resolutionType.name}Veto` : res.resolutionType.name;
      totals[name] = (totals[name] || 0) + 1;
      return totals;
    }, {} as any);

    const statsValues =
      allResolutions.length === 0
        ? emptyStats
        : {
            withQuorum: (100 * withQuorum.length) / allResolutions.length,
            withoutQuorum: (100 * withoutQuorum.length) / allResolutions.length,
            rejected: (100 * rejected.length) / allResolutions.length,
            withQuorumTot: withQuorum.length,
            withoutQuorumTot: withoutQuorum.length,
            rejectedTot: rejected.length,
            inProgress: (100 * inProgress.length) / allResolutions.length,
            inProgressTot: inProgress.length,
            typesTotals,
          };

    return [allResolutions, resolutionsToVote, statsValues, votingPercentageInTheYear];
  }, [resolutions, currentTimestamp, acl, isLoading, isLoadingAcl, error]);

  return (
    <>
      <Section
        sx={{ pt: 0 }}
        containerSx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Header votingPercentageInTheYear={votingPercentageInTheYear} />
      </Section>
      <Section inverse={enhancedResolutionsToVote?.length === 0}>
        <Tasks />
      </Section>
      {!error && (
        <>
          <Section inverse={enhancedResolutionsToVote?.length > 0}>
            <ResolutionsStats
              stats={stats}
              isLoading={isLoading && resolutions?.length === 0 && !error}
              totalResolutions={enhancedResolutions.length}
            />
          </Section>
          {isConnected && (
            <Section inverse={enhancedResolutionsToVote?.length === 0}>
              <Tokens />
            </Section>
          )}
          <Section inverse={isConnected && enhancedResolutionsToVote?.length > 0}>
            <>
              <Typography variant="h4" sx={{ mb: 4 }}>
                Investors transparency report
              </Typography>
              <InvestorsReport />
            </>
          </Section>
        </>
      )}
    </>
  );
}
