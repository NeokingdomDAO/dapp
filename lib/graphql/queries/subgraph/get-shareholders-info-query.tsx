import { graphql } from "gql";

export const getShareholdersInfo = graphql(`
  query GetShareholdersInfo {
    daoManager(id: "0") {
      ...daoManagerFragment
    }

    daoUsers {
      address
      governanceBalance
      governanceOfferedTempBalance
      governanceVestingBalance
      governanceVaultedBalance
      governanceWithdrawableTempBalance
      votingPower
      shareholderRegistryBalance
      neokigdomTokenBalance
    }
  }
`);
