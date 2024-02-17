import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  documents: "lib/graphql/subgraph/queries/**/*.tsx",
  generates: {
    "lib/graphql/subgraph/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
    },
    "lib/graphql/subgraph/generated/graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
  hooks: { afterAllFileWrite: ["git add ./lib/graphql/subgraph/generated/**; npx lint-staged --allow-empty"] },
};

export default config;
