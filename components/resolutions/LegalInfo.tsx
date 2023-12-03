import { format } from "date-fns";

import { Divider, Link, Paper, Stack, Typography } from "@mui/material";

import { RESOLUTION_STATES, getDateFromUnixTimestamp } from "@lib/resolutions/common";
import { getPdfSigner } from "@lib/utils";

import { ResolutionEntityEnhanced } from "../../types";

export default function LegalInfo({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  return (
    <>
      {![RESOLUTION_STATES.REJECTED, RESOLUTION_STATES.PRE_DRAFT].includes(resolution.state) && (
        <>
          <Typography variant="h6">
            {resolution.state !== RESOLUTION_STATES.ENDED ? (
              <span>DRAFT RESOLUTION OF THE SHAREHOLDERS (without calling a meeting of shareholders)</span>
            ) : (
              <span>MINUTES AND RESOLUTION OF THE SHAREHOLDERS (without calling a meeting of shareholders)</span>
            )}
          </Typography>
          <Divider sx={{ pt: 2, mb: 2 }} />
        </>
      )}
      <Stack
        direction={{ xs: "column", md: "row-reverse" }}
        spacing={{ xs: 1, md: 4 }}
        alignItems={{ md: "center" }}
        justifyContent={{ md: "space-between" }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2">
            <b>Business name:</b> {process.env.NEXT_PUBLIC_PROJECT_KEY} DAO OÜ
          </Typography>
          <Typography variant="body2">
            <b>Registry code:</b> {process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? "16638166" : "16374990"}
          </Typography>
          <Typography variant="body2">
            <b>Registered office</b>: Sõle 14, Tallinn, 10611 , Estonia
          </Typography>
        </Paper>
        {[RESOLUTION_STATES.REJECTED, RESOLUTION_STATES.PRE_DRAFT].includes(resolution.state) && (
          <Typography variant="h6">
            <span>
              DRAFT RESOLUTION OF THE SHAREHOLDERS <br /> (without calling a meeting of shareholders)
            </span>
          </Typography>
        )}
        {![RESOLUTION_STATES.REJECTED, RESOLUTION_STATES.PRE_DRAFT].includes(resolution.state) && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2">
              <b>Time of determining the voting rights and active PoAs:</b>{" "}
              {format(getDateFromUnixTimestamp(resolution.approveTimestamp), "dd LLL yyyy, H:mm:ss")}
            </Typography>
            <Typography variant="body2">
              <b>Notification period for voting:</b> From{" "}
              {format(getDateFromUnixTimestamp(resolution.approveTimestamp), "dd LLL yyyy, H:mm:ss")} to{" "}
              {resolution.resolutionTypeInfo.noticePeriodEndsAt}
            </Typography>
            <Typography variant="body2">
              <b>Voting period:</b> From {resolution.resolutionTypeInfo.noticePeriodEndsAt} to{" "}
              {resolution.resolutionTypeInfo.votingEndsAt}
            </Typography>
            <Typography variant="body2">
              <b>Place of voting:</b> <Link href={window.location.href}>{window.location.href}</Link>
            </Typography>
            <Typography variant="body2">
              <b>Recording secretary:</b> {getPdfSigner(resolution)}
            </Typography>
          </Paper>
        )}
      </Stack>
    </>
  );
}
