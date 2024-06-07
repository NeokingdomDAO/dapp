import { sql } from "@vercel/postgres";
import { and, eq } from "drizzle-orm";
import { drizzle as LocalDrizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as VercelDrizzle, type VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import NodeCache from "node-cache";
import postgres from "postgres";

import "./envConfig";
import * as schema from "./schema";

export const localDbUrl = "postgresql://admin:root@localhost:5432/neok";

let db: VercelPgDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
if (process.env.POSTGRES_LOCAL === "true") {
  const migrationClient = postgres(localDbUrl);
  db = LocalDrizzle(migrationClient, { schema });
} else {
  db = VercelDrizzle(sql, { schema });
}

const ALL_RESOLUTIONS_CACHE_KEY = "ALL_RESOLUTIONS_CACHE_KEY";
export const DEFAULT_COLUMNS = ["title", "hash", "isRewards"] as Array<
  keyof typeof schema.ResolutionsTable.$inferSelect
>;

const resolutionsCache = new NodeCache({ checkperiod: 120 });

const getDynamicGetResolutionsCacheKey = (columns: Array<keyof typeof schema.ResolutionsTable.$inferSelect>) =>
  `${ALL_RESOLUTIONS_CACHE_KEY}_${columns.join("_")}`;

export const getResolutions = async (columns?: Array<keyof typeof schema.ResolutionsTable.$inferSelect>) => {
  if (!columns || columns.length === 0) {
    const cachedResolutions = resolutionsCache.get(ALL_RESOLUTIONS_CACHE_KEY);
    if (cachedResolutions) {
      console.log("cache hit all resolutions", ALL_RESOLUTIONS_CACHE_KEY);
      return cachedResolutions;
    }

    console.log("cache miss all resolutions", ALL_RESOLUTIONS_CACHE_KEY);

    const allResolutions = await db.query.ResolutionsTable.findMany({
      where: (resolutions) => eq(resolutions.project, process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom"),
    });
    resolutionsCache.set(ALL_RESOLUTIONS_CACHE_KEY, allResolutions);

    return allResolutions;
  }

  const dynamicCacheKey = getDynamicGetResolutionsCacheKey(columns);

  if (resolutionsCache.get(dynamicCacheKey)) {
    console.log("cache hit all resolutions", dynamicCacheKey);
    return resolutionsCache.get(dynamicCacheKey);
  }

  console.log("cache miss all resolutions", ALL_RESOLUTIONS_CACHE_KEY);

  const allResolutions = await db.query.ResolutionsTable.findMany({
    columns: {
      hash: !!columns?.includes("hash"),
      title: !!columns?.includes("title"),
      content: !!columns?.includes("content"),
      isRewards: !!columns?.includes("isRewards"),
    },
    where: (resolutions) => eq(resolutions.project, process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom"),
  });

  resolutionsCache.set(dynamicCacheKey, allResolutions);

  return allResolutions;
};

export const getResolution = async (hash: string) => {
  const cacheKey = `${hash}_${process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom"}`;
  if (resolutionsCache.get(cacheKey)) {
    console.log("cache hit resolution", cacheKey);
    return resolutionsCache.get(cacheKey) as typeof schema.ResolutionsTable.$inferSelect;
  }

  console.log("cache miss resolution", cacheKey);

  const [resolution] = await db
    .select()
    .from(schema.ResolutionsTable)
    .where(
      and(
        eq(schema.ResolutionsTable.hash, hash),
        eq(schema.ResolutionsTable.project, process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom"),
      ),
    );
  resolutionsCache.set(cacheKey, resolution);

  return resolution;
};

type NewResolution = typeof schema.ResolutionsTable.$inferInsert;

export const addResolution = async (data: Omit<NewResolution, "id" | "createdAt">) => {
  await db.insert(schema.ResolutionsTable).values({
    ...data,
    project: process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom",
  });

  resolutionsCache.del(ALL_RESOLUTIONS_CACHE_KEY);
  resolutionsCache.del(getDynamicGetResolutionsCacheKey(DEFAULT_COLUMNS));
};
