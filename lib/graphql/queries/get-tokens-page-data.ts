import { gql } from "graphql-request";

export const getTokensPageData = gql`
  query GetTokensPageData($userId: String!) {
    daoUser(id: $userId) {
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
`;
