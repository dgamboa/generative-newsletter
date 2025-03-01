"use server"

import { db } from "@/db/db"
import { InsertNewsletter, newslettersTable, SelectNewsletter } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export const createNewsletter = async (data: InsertNewsletter) => {
  try {
    const [newNewsletter] = await db.insert(newslettersTable).values(data).returning()
    return newNewsletter
  } catch (error) {
    console.error("Error creating newsletter:", error)
    throw new Error("Failed to create newsletter")
  }
}

export const getNewslettersByUserId = async (userId: string) => {
  try {
    return db.query.newsletters.findMany({
      where: eq(newslettersTable.userId, userId),
      orderBy: [desc(newslettersTable.createdAt)]
    })
  } catch (error) {
    console.error("Error getting newsletters:", error)
    throw new Error("Failed to get newsletters")
  }
}

export const getNewsletterById = async (id: string) => {
  try {
    return db.query.newsletters.findFirst({
      where: eq(newslettersTable.id, id)
    })
  } catch (error) {
    console.error("Error getting newsletter:", error)
    throw new Error("Failed to get newsletter")
  }
}

export const updateNewsletter = async (id: string, data: Partial<InsertNewsletter>) => {
  try {
    const [updatedNewsletter] = await db
      .update(newslettersTable)
      .set(data)
      .where(eq(newslettersTable.id, id))
      .returning()
    return updatedNewsletter
  } catch (error) {
    console.error("Error updating newsletter:", error)
    throw new Error("Failed to update newsletter")
  }
}

export const deleteNewsletter = async (id: string) => {
  try {
    const [deletedNewsletter] = await db
      .delete(newslettersTable)
      .where(eq(newslettersTable.id, id))
      .returning()
    return deletedNewsletter
  } catch (error) {
    console.error("Error deleting newsletter:", error)
    throw new Error("Failed to delete newsletter")
  }
} 