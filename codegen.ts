import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.neokingdom.org/subgraphs/name/NeokingdomDAO/vigodarzere",
  documents: "lib/graphql/queries/subgraph/**/*.tsx",
  generates: {
    "gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "gql/graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
  hooks: { afterAllFileWrite: ["git add ./gql/**; npx lint-staged --allow-empty"] },
};

export default config;
