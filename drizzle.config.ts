import { defineConfig } from "drizzle-kit";

import { localDbUrl } from "./drizzle/db";
import "./drizzle/envConfig";

const isLocal = process.env.POSTGRES_LOCAL === "true";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: isLocal ? localDbUrl : process.env.POSTGRES_URL!,
    ssl: true,
  },
});
