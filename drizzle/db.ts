import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import "./envConfig";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const getResolutions = async (columns?: Array<keyof typeof schema.ResolutionsTable.$inferSelect>) => {
  if (!columns) return db.query.ResolutionsTable.findMany();

  return db.query.ResolutionsTable.findMany({
    columns: {
      hash: !!columns?.includes("hash"),
      title: !!columns?.includes("title"),
      content: !!columns?.includes("content"),
      isRewards: !!columns?.includes("isRewards"),
    },
  });
};

export const getResolution = async (hash: string) => {
  return db.query.ResolutionsTable.findFirst({
    where: (resolutions, { eq }) => eq(resolutions.hash, hash),
  });
};

type NewResolution = typeof schema.ResolutionsTable.$inferInsert;

export const addResolution = async (data: Omit<NewResolution, "id" | "createdAt">) => {
  await db.insert(schema.ResolutionsTable).values({
    ...data,
    project: process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom",
  });
};
