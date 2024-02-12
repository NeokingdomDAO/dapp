import { graphql } from "gql";

export const daoManagerFragment = graphql(`
  fragment daoManagerFragment on DaoManager {
    id
    managingBoardAddresses
    contributorsAddresses
    investorsAddresses
    shareholdersAddresses
    totalVotingPower
  }
`);
