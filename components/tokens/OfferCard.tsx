import { format } from "date-fns";
import { Offer } from "types";

import { Alert, Box, Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";

import { getDateFromUnixTimestamp } from "@lib/resolutions/common";

import User from "@components/User";

import { bigIntToNum, isExpired } from "@hooks/useUserBalanceAndOffers";

export default function OfferCard({ offer, onMatchClicked }: { offer: Offer; onMatchClicked: (offer: Offer) => void }) {
  const expired = isExpired(offer);
  const expirationDate = format(getDateFromUnixTimestamp(offer.expirationTimestamp), "dd LLL yyyy HH:mm");
  const amount =
    offer.matches.length > 0
      ? bigIntToNum(offer.amount) + offer.matches.reduce((sum, match) => sum + bigIntToNum(match.amount), 0)
      : bigIntToNum(offer.amount);
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Typography variant="body1" component="h4" gutterBottom>
          Created on {format(getDateFromUnixTimestamp(offer.createTimestamp), "dd LLL yyyy HH:mm")} by
        </Typography>
        <User address={offer.from} sx={{ mb: 2 }} shortAddress />
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Amount: {amount}
          </Typography>
          {expired && offer.matches.length === 0 && (
            <Alert severity="info">Offer expired on {expirationDate} and has not been matched</Alert>
          )}
          {!expired && <Alert severity="info">Expires {expirationDate}</Alert>}
        </Box>
        {offer.matches.length > 0 && (
          <>
            <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
              Offer matches
            </Typography>
            <Box>
              {offer.matches.map((match) => (
                <Stack key={match.id} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <User isInline shortAddress key={match.id} address={match.matchedFrom} sx={{ mb: 1 }} />
                    <Typography variant="body2">
                      {format(getDateFromUnixTimestamp(match.createTimestamp), "dd LLL yyyy HH:mm")}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <b>{bigIntToNum(match.amount)}</b>
                  </Typography>
                </Stack>
              ))}
            </Box>
          </>
        )}
      </CardContent>
      {!expired && (
        <CardActions
          sx={{
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          {amount === 0 ? (
            <Alert sx={{ p: 0, pl: 1, pr: 1 }}>Offer fully matched</Alert>
          ) : (
            <Button size="small" variant="contained" onClick={() => onMatchClicked(offer)}>
              Match
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}
