import Link from "next/link";

import * as React from "react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { Chip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { ResolutionEntityEnhanced } from "../types";

export default function ResolutionCard({ resolution }: { resolution: ResolutionEntityEnhanced }) {
  return (
    <Card variant="outlined">
      <CardHeader
        action={<Chip label={resolution.state} />}
        title={resolution.title}
        titleTypographyProps={{
          variant: "h6",
          lineHeight: "1.5rem",
        }}
        subheaderTypographyProps={{
          variant: "caption",
        }}
        subheader={`Created: ${resolution.createdAt}`}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This resolution is ...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Typography variant="caption">{resolution.resolutionType.name}</Typography>
        <IconButton
          aria-label="share"
          sx={{ marginLeft: "auto" }}
          href={`/resolutions/${resolution.id}/edit`}
          LinkComponent={Link}
        >
          <VisibilityIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
