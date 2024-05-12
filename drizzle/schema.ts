import { boolean, index, pgTable, serial, text, timestamp, unique, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const ResolutionsTable = pgTable(
  "resolutions",
  {
    id: serial("id").primaryKey(),
    hash: varchar("hash", { length: 66 }).notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isRewards: boolean("isRewards").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    project: varchar("project")
      .notNull()
      .default(process.env.NEXT_PUBLIC_PROJECT_KEY || "neokingdom"),
  },
  (resolutions) => {
    return {
      unq: unique().on(resolutions.hash, resolutions.project),
      hashProjectIdx: uniqueIndex("hash_project_ids").on(resolutions.hash, resolutions.project),
      projectIdx: index().on(resolutions.project),
    };
  },
);
