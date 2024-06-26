import { GetLegacyResolutionsQuery } from "@graphql/subgraph/generated/graphql";

export const legacyResolutionsMock: GetLegacyResolutionsQuery = {
  resolutions: [
    {
      id: "100",
      isNegative: false,
      ipfsDataURI: "ipfs",
      resolutionType: {
        id: "8",
        name: "30sNotice3mVoting",
        quorum: "66",
        noticePeriod: "30",
        votingPeriod: "180",
        canBeNegative: false,
      },
      yesVotesTotal: "0",
      createTimestamp: "1707852970",
      updateTimestamp: null,
      approveTimestamp: null,
      rejectTimestamp: "1707854760",
      executionTimestamp: null,
      createBy: "0x0000000000000000000000000000000000000001",
      updateBy: null,
      approveBy: null,
      rejectBy: "0x0000000000000000000000000000000000000002",
      hasQuorum: null,
      executionTo: [],
      executionData: [],
      voters: [],
    },
    {
      id: "101",
      ipfsDataURI: "ipfs",
      isNegative: false,
      resolutionType: {
        id: "6",
        name: "routine",
        quorum: "51",
        noticePeriod: "259200",
        votingPeriod: "172800",
        canBeNegative: true,
      },
      yesVotesTotal: "0",
      createTimestamp: "1707505249",
      updateTimestamp: null,
      approveTimestamp: null,
      rejectTimestamp: null,
      executionTimestamp: null,
      createBy: "0x0000000000000000000000000000000000000003",
      updateBy: null,
      approveBy: null,
      rejectBy: null,
      hasQuorum: null,
      executionTo: [],
      executionData: [],
      voters: [],
    },
  ],
};
