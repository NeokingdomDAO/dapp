import useSWR from "swr";
import { useAccount } from "wagmi";

import { useMemo } from "react";

import { Grid, Typography } from "@mui/material";

import { fetcher } from "@graphql/client";
import { getResolutionsQuery } from "@graphql/queries/get-resolutions.query";

import { RESOLUTION_STATES, getEnhancedResolutions } from "@lib/resolutions/common";

import ResolutionCard from "@components/ResolutionCard";
import Section from "@components/Section";
import Header from "@components/dashboard/Header";
import Tasks from "@components/dashboard/Tasks";
import Tokens from "@components/dashboard/Tokens";

import useGetResolutions from "@hooks/useGetResolutions";
import useResolutionsAcl from "@hooks/useResolutionsAcl";
import useTimestamp from "@hooks/useTimestamp";

import ResolutionsStats from "../components/dashboard/ResolutionsStats";
import { ResolutionEntityEnhanced } from "../types";

Home.renderOnServer = false;
Home.requireLogin = true;
Home.fullWidth = true;

const REFRESH_EVERY_MS = 5000;

const emptyStats = {
  withQuorum: 0,
  withoutQuorum: 0,
  rejected: 0,
  withQuorumTot: 0,
  withoutQuorumTot: 0,
  rejectedTot: 0,
};

export default function Home() {
  const { resolutions, isLoading } = useGetResolutions();

  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const { currentTimestamp } = useTimestamp();
  const { isConnected } = useAccount();

  const [enhancedResolutions, enhancedResolutionsToVote, stats]: [
    ResolutionEntityEnhanced[],
    ResolutionEntityEnhanced[],
    typeof emptyStats,
  ] = useMemo(() => {
    if (isLoading || isLoadingAcl) {
      return [[], [], emptyStats];
    }

    const allResolutions = getEnhancedResolutions(resolutions, +currentTimestamp, acl);

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

    return [allResolutions, resolutionsToVote, statsValues];
  }, [resolutions, currentTimestamp, acl, isLoading, isLoadingAcl]);

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
        <Header />
      </Section>
      {enhancedResolutionsToVote?.length > 0 && (
        <Section inverse>
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Resolutions to vote
            </Typography>
            <Grid container spacing={3}>
              {enhancedResolutionsToVote.map((resolution) => (
                <Grid item xs={12} md={6} lg={4} key={resolution.id}>
                  <ResolutionCard resolution={resolution} />
                </Grid>
              ))}
            </Grid>
          </>
        </Section>
      )}
      <Section inverse={enhancedResolutionsToVote?.length === 0}>
        <Tasks />
      </Section>
      <Section inverse={enhancedResolutionsToVote?.length > 0}>
        <ResolutionsStats stats={stats} isLoading={isLoading} totalResolutions={enhancedResolutions.length} />
      </Section>
      {isConnected && (
        <Section inverse={enhancedResolutionsToVote?.length === 0}>
          <Tokens />
        </Section>
      )}
    </>
  );
}
