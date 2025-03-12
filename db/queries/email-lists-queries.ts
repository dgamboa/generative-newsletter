"use server"

import { db } from "@/db/db"
import { emailListsTable } from "@/db/schema"
import { InsertEmailList, SelectEmailList } from "@/db/schema/email-lists-schema"
import { eq } from "drizzle-orm"

export const createEmailList = async (data: InsertEmailList) => {
  try {
    const [newEmailList] = await db.insert(emailListsTable).values(data).returning()
    return newEmailList
  } catch (error) {
    console.error("Error creating email list:", error)
    throw new Error("Failed to create email list")
  }
}

export const getEmailListsByUserId = async (userId: string) => {
  try {
    return db.query.emailLists.findMany({
      where: eq(emailListsTable.userId, userId)
    })
  } catch (error) {
    console.error("Error getting email lists:", error)
    throw new Error("Failed to get email lists")
  }
}

export const getEmailListById = async (id: string) => {
  try {
    return db.query.emailLists.findFirst({
      where: eq(emailListsTable.id, id)
    })
  } catch (error) {
    console.error("Error getting email list:", error)
    throw new Error("Failed to get email list")
  }
}

export const updateEmailList = async (id: string, data: Partial<InsertEmailList>) => {
  try {
    const [updatedEmailList] = await db
      .update(emailListsTable)
      .set(data)
      .where(eq(emailListsTable.id, id))
      .returning()
    return updatedEmailList
  } catch (error) {
    console.error("Error updating email list:", error)
    throw new Error("Failed to update email list")
  }
}

export const deleteEmailList = async (id: string) => {
  try {
    const [deletedEmailList] = await db
      .delete(emailListsTable)
      .where(eq(emailListsTable.id, id))
      .returning()
    return deletedEmailList
  } catch (error) {
    console.error("Error deleting email list:", error)
    throw new Error("Failed to delete email list")
  }
} 