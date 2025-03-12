import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const emailListsTable = pgTable("email_lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  emails: text("emails").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertEmailList = typeof emailListsTable.$inferInsert
export type SelectEmailList = typeof emailListsTable.$inferSelect 