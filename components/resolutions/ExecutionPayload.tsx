import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

import { TOKEN_SYMBOL } from "@lib/utils";

import User from "@components/User";

import { MonthlyRewardsUserData, ResolutionEntityEnhanced } from "../../types";

export default function ExecutionPayload({
  resolution,
  executionPayload,
}: {
  resolution: ResolutionEntityEnhanced;
  executionPayload: MonthlyRewardsUserData[];
}) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ p: 4, pb: 2, pt: 2 }}
      >
        <Typography>Execution payload</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 4, pt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          {resolution.executionTimestamp ? (
            <span>
              {" "}
              As this resolution has been correctly executed <b>{resolution.executedAt}</b>, these tokens have been
              minted for the following contributors
            </span>
          ) : (
            <span>
              This payload will be used to automatically mint the tokens for the contributors, once the resolution will
              get executed
            </span>
          )}
        </Alert>
        {executionPayload
          .sort((a, b) => (a.tokens < b.tokens ? -1 : 1))
          .map((userData) => (
            <Box key={userData.address}>
              <Typography variant="body2">
                <b>
                  {!Number.isNaN(Number(userData.tokens)) ? Number(userData.tokens).toFixed(2) : userData.tokens}{" "}
                  {TOKEN_SYMBOL}
                </b>{" "}
                to
              </Typography>
              <User address={userData.address} />
              <Divider sx={{ mb: 1, pt: 1 }} />
            </Box>
          ))}
      </AccordionDetails>
    </Accordion>
  );
}
