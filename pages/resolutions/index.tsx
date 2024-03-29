import Link from "next/link";
import { useAccount } from "wagmi";

import { useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  NativeSelect,
  Stack,
  Switch,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import { getEnhancedResolutions } from "@lib/resolutions/common";
import { RESOLUTION_STATES } from "@lib/resolutions/common";
import { isSameAddress } from "@lib/utils";

import ResolutionCard from "@components/ResolutionCard";
import Section from "@components/Section";

import useGetResolutions from "@hooks/useGetResolutions";
import useResolutionsAcl from "@hooks/useResolutionsAcl";
import useTimestamp from "@hooks/useTimestamp";
import useUser from "@hooks/useUser";

import UsersAutocomplete from "../../components/UsersAutocomplete";
import useOdooUsers from "../../hooks/useOdooUsers";
import { RESOLUTION_TYPES_TEXTS } from "../../i18n/resolution";

interface ChevronProps extends React.ComponentProps<typeof ExpandMoreIcon> {
  expand: boolean;
}

const Chevron = styled(({ expand, ...other }: ChevronProps) => <ExpandMoreIcon {...other} />)(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

Resolutions.title = "Resolutions";
Resolutions.checkMismatch = true;
Resolutions.fullWidth = true;

const FormGrid = styled(Grid)(() => ({
  display: "flex",
}));

export default function Resolutions() {
  const theme = useTheme();
  const { isConnected, address } = useAccount();
  const { acl, isLoading: isLoadingAcl } = useResolutionsAcl();
  const [isFilterSectionExpanded, setIsFilterSectionExpanded] = useState(false);
  const [includeRejected, setIncludeRejected] = useState(false);
  const [excludeNonMonthlyReward, setExcludeNonMonthlyReward] = useState(false);
  const [filteredResolutionType, setFilteredResolutionType] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const { currentTimestamp } = useTimestamp();
  const { user } = useUser();
  const { resolutions, isLoading, error } = useGetResolutions();

  const { getOdooUser } = useOdooUsers();
  const selectedUser = authorFilter ? getOdooUser(authorFilter) : undefined;

  const enhancedResolutions = useMemo(() => {
    if ((isLoading || isLoadingAcl) && resolutions.length === 0) {
      return [];
    }
    return getEnhancedResolutions(resolutions, +currentTimestamp, acl);
  }, [resolutions, currentTimestamp, acl, isLoading, isLoadingAcl]);

  const resolutionTypes = useMemo(() => {
    return Array.from(new Set(enhancedResolutions.map((r) => r.resolutionType.name)));
  }, [enhancedResolutions]);

  const availableAuthors = useMemo(() => {
    return [...new Set(enhancedResolutions.map((r) => r.createBy))];
  }, [enhancedResolutions]);

  const filteredResolutions = useMemo(() => {
    let filteredResolutions = includeRejected
      ? enhancedResolutions
      : enhancedResolutions.filter((resolution) => resolution.state !== RESOLUTION_STATES.REJECTED);

    filteredResolutions = excludeNonMonthlyReward
      ? filteredResolutions.filter((r) => r.metadata.isMonthlyRewards === true)
      : filteredResolutions;

    filteredResolutions = textFilter
      ? filteredResolutions.filter((r) => r.title.indexOf(textFilter) >= 0)
      : filteredResolutions;

    filteredResolutions = filteredResolutionType
      ? filteredResolutions.filter((r) => r.resolutionType.name === filteredResolutionType)
      : filteredResolutions;

    filteredResolutions = authorFilter
      ? filteredResolutions.filter((r) => r.createBy === authorFilter)
      : filteredResolutions;
    return filteredResolutions;
  }, [enhancedResolutions, excludeNonMonthlyReward, filteredResolutionType, includeRejected, textFilter, authorFilter]);

  const [activeResolutions, inactiveResolutions] = useMemo(() => {
    const active = filteredResolutions.filter((resolution) => {
      const votingUser = address
        ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
        : null;
      return resolution.state === RESOLUTION_STATES.VOTING && !votingUser && user?.isLoggedIn;
    });
    const inactive = filteredResolutions.filter((resolution) => {
      const votingUser = address
        ? resolution.votingStatus.votersHaveVoted.find((voter) => isSameAddress(voter.address, address))
        : null;
      return resolution.state !== RESOLUTION_STATES.VOTING || !!votingUser || !user?.isLoggedIn;
    });
    return [active, inactive];
  }, [filteredResolutions, address, user?.isLoggedIn]);

  const hasRejected =
    enhancedResolutions.filter((resolution) => resolution.state === RESOLUTION_STATES.REJECTED).length > 0;

  if (error) {
    return null;
  }

  return (
    <>
      <Section sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isConnected && acl.isContributor && (
            <Stack direction="row" spacing={2}>
              <Button component={Link} href="/resolutions/new" variant="outlined">
                Create new Resolution
              </Button>
              <Button component={Link} href="/resolutions/new?template=monthlyRewards" variant="outlined">
                Monthly Rewards
              </Button>
            </Stack>
          )}
        </Box>
      </Section>
      {user?.isLoggedIn && (
        <Section inverse sx={{ pb: 0 }}>
          <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button
                endIcon={<Chevron expand={isFilterSectionExpanded} />}
                onClick={() => setIsFilterSectionExpanded((e) => !e)}
                aria-expanded={isFilterSectionExpanded}
                aria-label="show filters"
              >
                Filters
              </Button>
            </Box>
            {!isFilterSectionExpanded && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  overflow: "scroll",
                }}
              >
                <List component={Stack} direction="row" dense>
                  {textFilter && (
                    <ListItem>
                      <Chip label={`Text: ${textFilter}`} onDelete={() => setTextFilter("")} />
                    </ListItem>
                  )}
                  {selectedUser && (
                    <ListItem>
                      <Chip label={`Author: ${selectedUser.display_name}`} onDelete={() => setAuthorFilter("")} />
                    </ListItem>
                  )}
                  {filteredResolutionType && (
                    <ListItem>
                      <Chip
                        label={`Type: ${
                          RESOLUTION_TYPES_TEXTS[filteredResolutionType]?.title || filteredResolutionType
                        }`}
                        onDelete={() => setFilteredResolutionType("")}
                      />
                    </ListItem>
                  )}
                  {excludeNonMonthlyReward && (
                    <ListItem>
                      <Chip label={`Only monthly reward`} onDelete={() => setExcludeNonMonthlyReward(false)} />
                    </ListItem>
                  )}
                  {includeRejected && (
                    <ListItem>
                      <Chip label={`Include rejected`} onDelete={() => setIncludeRejected(false)} />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
            <Collapse
              in={isFilterSectionExpanded}
              timeout={0}
              unmountOnExit
              sx={{
                pt: 2,
                pb: 4,
                px: 4,
                mt: 1,
                bgcolor: theme.palette.mode === "dark" ? "rgba(33, 33, 33, 0.9)" : "rgba(250, 250, 250, 1)",
              }}
            >
              <FormGrid container spacing={6}>
                <FormGrid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Search resolution"
                    variant="standard"
                    value={textFilter}
                    onChange={(e) => setTextFilter(e.target.value)}
                  />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                  <UsersAutocomplete
                    fullWidth
                    filterList={availableAuthors}
                    selectedAddress={authorFilter}
                    onChange={setAuthorFilter}
                    label="Author"
                  />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="resolution-type-input">
                      Resolution type
                    </InputLabel>
                    <NativeSelect
                      inputProps={{
                        name: "resolution-type",
                        id: "resolution-type-input",
                      }}
                      value={filteredResolutionType}
                      onChange={(e) => setFilteredResolutionType(e.target.value)}
                    >
                      <option value={""}></option>
                      {resolutionTypes.map((t) => (
                        <option value={t} key={t}>
                          {RESOLUTION_TYPES_TEXTS[t]?.title || t}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </FormGrid>

                {hasRejected && (
                  <FormGrid item xs={12} md={3}>
                    <FormControlLabel
                      control={<Switch checked={includeRejected} onChange={() => setIncludeRejected((old) => !old)} />}
                      label="Include rejected"
                    />
                  </FormGrid>
                )}

                <FormGrid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={excludeNonMonthlyReward}
                        onChange={() => setExcludeNonMonthlyReward((old) => !old)}
                      />
                    }
                    label="Only monthly rewards"
                  />
                </FormGrid>
              </FormGrid>
            </Collapse>
          </>
        </Section>
      )}
      {activeResolutions?.length > 0 && (
        <Section inverse>
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Resolutions you need to vote
            </Typography>
            <Grid container spacing={3}>
              {activeResolutions.map((resolution) => (
                <Grid item xs={12} md={6} lg={4} key={resolution.id}>
                  <ResolutionCard resolution={resolution} />
                </Grid>
              ))}
            </Grid>
          </>
        </Section>
      )}
      <Section inverse={activeResolutions?.length === 0}>
        <>
          {activeResolutions?.length > 0 && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              Other resolutions
            </Typography>
          )}
          {(isLoading || isLoadingAcl) && resolutions?.length === 0 && <CircularProgress />}
          <Grid container spacing={3}>
            {inactiveResolutions.map((resolution) => (
              <Grid item xs={12} md={6} lg={4} key={resolution.id}>
                <ResolutionCard resolution={resolution} />
              </Grid>
            ))}
          </Grid>
        </>
      </Section>
    </>
  );
}
