import { useEffect, useRef } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Grid, Typography } from "@mui/material";

import { getPreviousMonth } from "@lib/resolutions/common";

import useBlockchainTransactionStore from "@store/blockchainTransactionStore";

import useResolutionTypes from "@hooks/useResolutionTypes";

import { RESOLUTION_TYPES_TEXTS } from "../i18n/resolution";

interface FormProps {
  isMonthlyRewards?: boolean;
  title: string;
  content: string;
  typeId: string;
  onUpdateTitle: (evt: any) => void;
  onUpdateType: (evt: any) => void;
  onUpdateContent: (content: string) => void;
}

export default function ResolutionForm({
  isMonthlyRewards = false,
  title,
  content,
  typeId,
  onUpdateTitle,
  onUpdateType,
  onUpdateContent,
}: FormProps) {
  const { types, isLoading: isLoadingTypes } = useResolutionTypes();
  const editorRef = useRef(null);

  useEffect(() => {
    const easyMDE = new window.EasyMDE({
      element: editorRef?.current,
      spellChecker: false,
      minHeight: "350px",
      maxHeight: "350px",
      status: false,
      ...(isMonthlyRewards && { toolbar: false }),
    });

    easyMDE.value(content || "");

    easyMDE.codemirror.on("change", () => {
      onUpdateContent(easyMDE.value());
    });

    if (isMonthlyRewards) {
      easyMDE.codemirror.setOption("readOnly", true);
      easyMDE.togglePreview();
    }

    return () => {
      easyMDE.cleanup();
      easyMDE.toTextArea();
    };
  }, [isMonthlyRewards]); // eslint-disable-line

  return (
    <div>
      {isMonthlyRewards && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning">
            This resolution is for the monthly tokens allocation and therefore it can&apos;t be modified. Please, read
            the text carefully and make sure the resolution for the token allocation of <b>{getPreviousMonth()}</b>{" "}
            hasn&apos;t already been created
          </Alert>
        </Box>
      )}
      <TextField
        sx={{ mt: 2, mb: 2, width: { xs: "100%", md: "50%" } }}
        hiddenLabel
        variant="filled"
        placeholder="Resolution title"
        value={title}
        onChange={onUpdateTitle}
        disabled={isMonthlyRewards}
      />
      <textarea ref={editorRef} />
      <Grid container sx={{ mb: 4, mt: 4 }}>
        <Grid item xs={12} lg={6}>
          <FormControl>
            <FormLabel id="radio-buttons-group-label">Resolution Type</FormLabel>
            {isLoadingTypes ? (
              <CircularProgress />
            ) : (
              <RadioGroup
                value={typeId}
                aria-labelledby="radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={onUpdateType}
              >
                {types.map((resolutionType) => (
                  <FormControlLabel
                    value={resolutionType.id}
                    key={resolutionType.id}
                    control={<Radio disabled={isMonthlyRewards} />}
                    label={
                      <>
                        <Typography variant="h4">
                          {RESOLUTION_TYPES_TEXTS[resolutionType.name]?.title || resolutionType.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          dangerouslySetInnerHTML={{
                            __html:
                              RESOLUTION_TYPES_TEXTS[resolutionType.name]?.description ||
                              "** Testing purposes resolution **",
                          }}
                        />
                      </>
                    }
                  />
                ))}
              </RadioGroup>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}
