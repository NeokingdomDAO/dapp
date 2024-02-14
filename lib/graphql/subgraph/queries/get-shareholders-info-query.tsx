import { graphql } from "../generated";

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
