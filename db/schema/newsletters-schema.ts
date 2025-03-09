import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const statusEnum = pgEnum("status", ["draft", "sent"])
export const templateEnum = pgEnum("template", ["classic", "modern", "minimal"])

export const newslettersTable = pgTable("newsletters", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: statusEnum("status").notNull().default("draft"),
  templateStyle: templateEnum("template_style").notNull().default("classic"),
  recipients: text("recipients").array(),
  citations: text("citations").array(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => {
      return new Date();
    })
})

export type InsertNewsletter = typeof newslettersTable.$inferInsert
export type SelectNewsletter = typeof newslettersTable.$inferSelect 