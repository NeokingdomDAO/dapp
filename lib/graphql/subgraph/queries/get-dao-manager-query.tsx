import { graphql } from "../generated";

export const getDaoManagerQuery = graphql(`
  query GetDaoManager {
    daoManager(id: "0") {
      ...daoManagerFragment
    }
  }
`);
