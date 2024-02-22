import { NeokingdomToken__factory } from "@contracts/typechain";
import { Interface } from "@ethersproject/abi";
import { formatEther } from "ethers/lib/utils";
import showdown from "showdown";

import { useMemo } from "react";

import { Alert, AlertTitle, Box, Button, CircularProgress, Typography } from "@mui/material";

import { RESOLUTION_STATES, getEnhancedResolutionMapper } from "@lib/resolutions/common";
import { getPdfSigner } from "@lib/utils";

import Section from "@components/Section";
import User from "@components/User";
import VotingWidget from "@components/VotingWidget";
import ExecutionPayload from "@components/resolutions/ExecutionPayload";
import Header from "@components/resolutions/Header";
import LegalInfo from "@components/resolutions/LegalInfo";
import MainInfo from "@components/resolutions/MainInfo";
import VotingBreakdown from "@components/resolutions/VotingBreakdown";
import VotingUsers from "@components/resolutions/VotingUsers";

import useGetResolution from "@hooks/useGetResolution";
import useTimestamp from "@hooks/useTimestamp";
import useUser from "@hooks/useUser";

const converter = new showdown.Converter();
converter.setFlavor("github");

ResolutionView.fullWidth = true;
ResolutionView.checkMismatch = true;
ResolutionView.requireLogin = true;

export default function ResolutionView() {
  const { currentTimestamp } = useTimestamp();
  const { user } = useUser();

  const { resolution: resolutionEntity, isLoading } = useGetResolution();

  const notFound = !resolutionEntity;

  const resolution = useMemo(() => {
    if (resolutionEntity) {
      return getEnhancedResolutionMapper(+currentTimestamp)(resolutionEntity);
    }
    return null;
  }, [resolutionEntity, currentTimestamp]);

  const executionPayload = useMemo(() => {
    if ((resolution?.executionData || []).length > 0) {
      const contractInterface = new Interface(NeokingdomToken__factory.abi);
      return (resolution?.executionData || [])?.map((data) => {
        const {
          args: [address, tokens],
        } = contractInterface.parseTransaction({ data });
        return {
          address,
          tokens: formatEther(tokens),
        };
      });
    }
    return [];
  }, [resolution]);

  if (isLoading) {
    return (
      <Section>
        <CircularProgress />
      </Section>
    );
  }

  if (notFound || !resolution) {
    return (
      <Section>
        <Alert severity="warning">Resolution not found</Alert>
      </Section>
    );
  }

  return (
    <Box>
      <Header resolution={resolution} executionPayload={executionPayload} />
      <Section>
        <LegalInfo resolution={resolution} />
      </Section>
      <Section inverse>
        <MainInfo resolution={resolution} />
      </Section>
      <Section pageBreak>
        <>
          <Typography variant="h5">Content of the resolution:</Typography>
          <Box
            sx={{
              p: { xs: 2, md: 4 },
              pl: { xs: 4, md: 6 },
              mt: 4,
              bgcolor: "background.paper",
              borderLeft: "1px solid",
              borderLeftColor: "primary.light",
              "& a": { color: "primary.main", textDecoration: "none" },
            }}
            dangerouslySetInnerHTML={{ __html: converter.makeHtml(resolution.content) }}
          />
        </>
      </Section>
      {[RESOLUTION_STATES.NOTICE, RESOLUTION_STATES.PRE_DRAFT, RESOLUTION_STATES.VOTING].includes(resolution.state) && (
        <Section inverse>
          <>
            <Typography variant="h5">Voting conditions:</Typography>
            <span>
              <b>{resolution.resolutionType.quorum}% of votes</b> are needed to approve the motion
            </span>
            {!/^0x0+$/.test(resolution.addressedContributor) && (
              <Alert sx={{ mt: 4 }} severity="info">
                <AlertTitle>This contributor is excluded from voting</AlertTitle>
                <User address={resolution.addressedContributor} sx={{ pl: 1, mt: 1 }} />
              </Alert>
            )}
          </>
        </Section>
      )}
      {[RESOLUTION_STATES.VOTING, RESOLUTION_STATES.ENDED].includes(resolution.state) && (
        <>
          <Section inverse pageBreak>
            <VotingBreakdown resolution={resolution} />
          </Section>
          <Section>
            <>
              <Typography variant="h5" sx={{ mb: 2 }}>
                List of shareholders and their positions:
              </Typography>
              <VotingUsers voters={resolution.voters} addressedContributor={resolution.addressedContributor} />
            </>
          </Section>
        </>
      )}
      {(executionPayload || []).length > 0 && resolution.state !== RESOLUTION_STATES.REJECTED && (
        <Section noPrint>
          <ExecutionPayload resolution={resolution} executionPayload={executionPayload} />
        </Section>
      )}
      {RESOLUTION_STATES.VOTING === resolution.state && (
        <Section inverse>
          <Box sx={{ maxWidth: 600, margin: "0 auto" }}>
            <VotingWidget resolution={resolution} />
          </Box>
        </Section>
      )}
      {[RESOLUTION_STATES.REJECTED, RESOLUTION_STATES.ENDED].includes(resolution.state) && user?.isLoggedIn && (
        <Section sx={{ textAlign: "center" }}>
          <Button href={`/api/pdf/resolutions/${resolution.id}`} target="_blank" variant="outlined" size="large">
            Generate and download resolution PDF
          </Button>
        </Section>
      )}
      <Section>
        <>
          <Typography variant="body2">/signed digitally/</Typography>
          <Typography variant="body2">--------------------------------------</Typography>
          <Typography variant="body2">{getPdfSigner(resolution)}</Typography>
          <Typography variant="body2">Member of management board</Typography>
        </>
      </Section>
    </Box>
  );
}
