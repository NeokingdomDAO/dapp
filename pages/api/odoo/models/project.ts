import { makeExecutableSchema } from "@graphql-tools/schema";
import { getClient } from "../../../../lib/odoo/client";
import { parseProject } from "../../../../lib/odoo/parsers/project";

const typeDefinitions = `#graphql
  type Project {
    id: ID!
    name: String!
  }

  type Query {
    projects: [Project]
  }
`;

const resolvers = {
  Query: {
    projects: async () => {
      const username = process.env.ODOO_USERNAME!;
      const password = process.env.ODOO_PASSWORD!;

      const session = await getClient(
        process.env.ODOO_ENDPOINT!,
        process.env.ODOO_DB_NAME!,
        username,
        password
      );

      const data = await session.search("project.project");
      return data.map(parseProject);
    },
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});
