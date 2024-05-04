import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import "./drizzle/envConfig";
import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export const getResolutions = async () => {
  return db.query.ResolutionsTable.findMany();
};

export const getResolution = async (hash: string) => {
  return db.query.ResolutionsTable.findFirst({
    where: (resolutions, { eq }) => eq(resolutions.hash, hash),
  });
};

type NewResolution = typeof schema.ResolutionsTable.$inferInsert;

export const addResolution = async (data: Omit<NewResolution, "id" | "createdAt">) => {
  await db.insert(schema.ResolutionsTable).values(data);
};
