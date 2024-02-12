import { graphql } from "gql";

export const getDaoManagerQuery = graphql(`
  query GetDaoManager {
    daoManager(id: "0") {
      ...daoManagerFragment
    }
  }
`);
