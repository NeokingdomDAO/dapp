import { graphql } from "../generated";

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
