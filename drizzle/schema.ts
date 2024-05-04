import { boolean, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const ResolutionsTable = pgTable(
  "resolutions",
  {
    id: serial("id").primaryKey(),
    hash: varchar("hash", { length: 64 }).notNull().unique(),
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
      uniqueIdx: uniqueIndex("unique_idx").on(resolutions.hash),
    };
  },
);
