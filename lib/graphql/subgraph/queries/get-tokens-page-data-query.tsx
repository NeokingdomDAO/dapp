import { graphql } from "../generated";

export const getTokensPageData = graphql(`
  query GetTokensPageData($userId: ID!) {
    daoUser(id: $userId) {
      address
      id
      governanceBalance
      governanceOfferedTempBalance
      governanceVestingBalance
      governanceVaultedBalance
      governanceWithdrawableTempBalance
      votingPower
      shareholderRegistryBalance
      neokigdomTokenBalance
      activeOffers {
        id
        amount
        expiredOnTransfer
        expirationTimestamp
      }
    }
    offers(orderBy: createTimestamp, orderDirection: desc) {
      id
      from
      amount
      expirationTimestamp
      expiredOnTransfer
      createTimestamp
      matches {
        id
        matchedFrom
        amount
        createTimestamp
      }
    }
  }
`);
